import {createPrComment, deletePrComment, getPullRequest} from './github';
import * as conventionalCommitTypes from 'conventional-commit-types';
import {getInput} from '@actions/core';

const types = Object.keys(conventionalCommitTypes.types);

export function getConventionalCommitTypes(): string {
  return types
    .map(type => {
      return `- **${type}**: ${
        conventionalCommitTypes.types[type].description as string
      }`;
    })
    .join('\n');
}

export async function lintPullRequest(title: string) {
  const matches = types.map(type => {
    return new RegExp(`^${type}(\\(.*\\))?!?:.*$`);
  });

  if (!matches.some(regex => regex.test(title))) {
    if (getInput('comment') === 'true') {
      await createPrComment();
    }

    return false;
  }

  await deletePrComment();
  return true;
}

export async function lint() {
  const pr = await getPullRequest();
  if (!(await lintPullRequest(pr.title))) {
    throw new Error('pr linting failed. see pull request comment.');
  }
}
