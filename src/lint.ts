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

export async function lintPullRequest(title: string) {
  const subjectPatternInput = getInput("subject_pattern");
  const subjectPattern = subjectPatternInput
    ? new RegExp(subjectPatternInput)
    : null;

  const matches = Object.keys(types).map((type) => {
    return new RegExp(`^${type}(\\(.+\\))?!?:.+$`);
  });

  const matchedType = matches.find((regex) => regex.test(title));
  if (!matchedType) return false;

  if (subjectPattern) {
    const match = title.match(/^.+?:\s*(.+)$/);
    if (!match || !match[1]) return false;

    const subject = match[1];
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
  const isPrTitleOk = await lintPullRequest(pr.title);

  if (isPrTitleOk) {
    await deletePrComment();
  } else {
    if (getInput("comment") === "true") {
      await createPrComment();
    }

    throw new Error(`pr linting failed.\n\n${buildMessage()}`);
  }
}
