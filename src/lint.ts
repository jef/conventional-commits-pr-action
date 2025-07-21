import {
  buildMessage,
  createPrComment,
  deletePrComment,
  getPullRequest,
} from "./github.js";
import { getInput, info } from "@actions/core";
import { context } from "@actions/github";
import { types } from "./conventional-commit-types.js";

export function isBotIgnored() {
  const botsIgnore = getInput("bots_ignore").split(",");
  return botsIgnore.includes(context.actor);
}

export function getConventionalCommitTypes(): string {
  return Object.keys(types)
    .map((type) => {
      return `- **${type}**: ${types[type as keyof typeof types].description as string}`;
    })
    .join("\n");
}

export async function isConventionalCommitTitleValid(
  title: string,
): Promise<boolean> {
  const subjectPatternInput = getInput("subject_pattern");
  const subjectPattern = subjectPatternInput
    ? new RegExp(subjectPatternInput)
    : null;

  const typeRegexes = Object.keys(types).map(
    (type) => new RegExp(`^${type}(\\(.+\\))?!?:\\s?.+$`),
  );

  const hasValidType = typeRegexes.some((regex) => regex.test(title));
  if (!hasValidType) return false;

  if (subjectPattern) {
    const subjectMatch = title.match(/^.+?:\s*(.+)$/);
    if (!subjectMatch || !subjectMatch[1]) return false;

    const subject = subjectMatch[1];
    return subjectPattern.test(subject);
  }

  return true;
}

export async function lint() {
  if (isBotIgnored()) {
    info("Bot is ignored. Skipping linting.");
    return;
  }

  const pr = await getPullRequest();
  const isPrTitleOk = await isConventionalCommitTitleValid(pr.title);

  if (isPrTitleOk) {
    await deletePrComment();
  } else {
    if (getInput("comment") === "true") {
      await createPrComment();
    }

    throw new Error(`pr linting failed.\n\n${buildMessage()}`);
  }
}
