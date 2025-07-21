import { context, getOctokit } from "@actions/github";
import { getInput, setSecret } from "@actions/core";
import { getConventionalCommitTypes } from "./lint.js";
import { GitHub } from "@actions/github/lib/utils.js";

let octokit: InstanceType<typeof GitHub>;
let once = false;

function getClient(): InstanceType<typeof GitHub> {
  if (once) return octokit;
  let token = getInput("token");
  if (!token) {
    token = process.env["GITHUB_TOKEN"] || "";
  }
  setSecret(token);

  octokit = getOctokit(token);
  once = true;
  return octokit;
}

export async function getPullRequest() {
  const { data: pr } = await getClient().rest.pulls.get({
    owner: context.repo.owner,
    pull_number: context.issue.number,
    repo: context.repo.repo,
  });

  return pr;
}

export function buildMessage(): string {
  const header = "## Pull request title linting :rotating_light:\n\n";
  const preface =
    "In order to merge this pull request, the title of the pull request " +
    "should be prefixed by one of the available types.\n\n";
  const availableTypes = `### Available types:\n\n${getConventionalCommitTypes()}\n\n`;
  const separator = "---\n\n";
  const examples = `<details>
<summary>Examples</summary>

\`\`\`
feat(grpc): add new endpoint
refactor: combine class A and class B
ci: update pull request linter
style: change format of strings
\`\`\`

</details>\n\n`;
  const footer =
    ":tipping_hand_person: For more examples, visit https://www.conventionalcommits.org/en/v1.0.0/#examples.";

  return header + preface + availableTypes + separator + examples + footer;
}

interface CommentExists {
  exists: boolean;
  id: number | null;
}

async function isCommentExists(body: string): Promise<CommentExists> {
  const { data: comments } = await getClient().rest.issues.listComments({
    owner: context.repo.owner,
    issue_number: context.issue.number,
    repo: context.repo.repo,
  });

  for (const comment of comments) {
    if (comment.body === body) {
      return {
        exists: true,
        id: comment.id,
      };
    }
  }

  return {
    exists: false,
    id: null,
  };
}

export async function deletePrComment() {
  const body = buildMessage();
  const { exists, id } = await isCommentExists(body);

  if (exists && id) {
    await getClient().rest.issues.deleteComment({
      owner: context.repo.owner,
      issue_number: context.issue.number,
      repo: context.repo.repo,
      comment_id: id,
    });
  }
}

export async function createPrComment() {
  const body = buildMessage();
  const { exists } = await isCommentExists(body);

  if (!exists) {
    await getClient().rest.issues.createComment({
      owner: context.repo.owner,
      issue_number: context.issue.number,
      repo: context.repo.repo,
      body,
    });
  }
}
