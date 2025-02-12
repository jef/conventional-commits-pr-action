import {
  buildMessage,
  createPrComment,
  deletePrComment,
  getPullRequest,
} from './github';
import * as conventionalCommitTypes from 'conventional-commit-types';
import {getInput, info} from '@actions/core';
import {context} from '@actions/github';

const types = Object.keys(conventionalCommitTypes.types);

export function isBotIgnored() {
  const botsIgnore = getInput('bots_ignore').split(',');
  return botsIgnore.includes(context.actor);
}

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
    return new RegExp(`^${type}(\\(.+\\))?!?:.+$`);
  });

  return matches.some(regex => regex.test(title));
}

export async function lint() {
  if (isBotIgnored()) {
    info('Bot is ignored. Skipping linting.');
    return;
  }

  const pr = await getPullRequest();
  const isPrTitleOk = await lintPullRequest(pr.title);

  if (isPrTitleOk) {
    await deletePrComment();
  } else {
    if (getInput('comment') === 'true') {
      await createPrComment();
    }

    throw new Error(`pr linting failed.\n\n${buildMessage()}`);
  }
}
