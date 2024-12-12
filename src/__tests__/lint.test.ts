import {
  getConventionalCommitTypes,
  lintPullRequest,
  isBotIgnored,
} from '../lint';
import {getInput} from '@actions/core';

jest.mock('@actions/core');

describe('getConvetionalCommitTypes tests', () => {
  test('should return types', () => {
    const types = getConventionalCommitTypes();

    expect(
      '- **feat**: A new feature\n' +
        '- **fix**: A bug fix\n' +
        '- **docs**: Documentation only changes\n' +
        '- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)\n' +
        '- **refactor**: A code change that neither fixes a bug nor adds a feature\n' +
        '- **perf**: A code change that improves performance\n' +
        '- **test**: Adding missing tests or correcting existing tests\n' +
        '- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)\n' +
        '- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)\n' +
        "- **chore**: Other changes that don't modify src or test files\n" +
        '- **revert**: Reverts a previous commit',
    ).toBe(types);
  });
});

describe('lintPullRequest tests', () => {
  const tests = [
    {args: 'feat: test', expected: true},
    {args: 'feat(test): test', expected: true},
    {args: 'feats: test', expected: false},
    {args: '(feat): test', expected: false},
    {args: 'test', expected: false},
  ];

  tests.forEach(({args, expected}) => {
    test(`should pass or fail linting ['${args}', '${expected}']`, async () => {
      expect(await lintPullRequest(args)).toBe(expected);
    });
  });
});

jest.mock('@actions/github', () => ({
  context: {
    actor: 'test-bot',
  },
}));

describe('isBotIgnored tests', () => {
  test('should return true if the bot is in the ignore list', () => {
    (getInput as jest.Mock).mockReturnValue('test-bot,another-bot');
    expect(isBotIgnored()).toBe(true);
  });

  test('should return false if the bot is not in the ignore list', () => {
    (getInput as jest.Mock).mockReturnValue('another-bot');
    expect(isBotIgnored()).toBe(false);
  });
});
