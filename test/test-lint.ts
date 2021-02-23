import * as github from '../src/github';
import {SinonStub, stub} from 'sinon';
import {getConventionalCommitTypes, lintPullRequest} from '../src/lint';
import {deepStrictEqual} from 'assert';

describe('getConvetionalCommitTypes tests', () => {
  it('should return types', () => {
    const types = getConventionalCommitTypes();

    deepStrictEqual(
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
      types
    );
  });
});

describe('lintPullRequest tests', () => {
  let createPrCommentStub: SinonStub;
  let deletePrCommentStub: SinonStub;

  before(() => {
    createPrCommentStub = stub(github, 'createPrComment');
    deletePrCommentStub = stub(github, 'deletePrComment');
  });

  after(() => {
    createPrCommentStub.restore();
    deletePrCommentStub.restore();
  });

  const tests = [
    {args: 'feat: test', expected: true},
    {args: 'feat(test): test', expected: true},
    {args: 'feats: test', expected: false},
    {args: '(feat): test', expected: false},
    {args: 'test', expected: false},
  ];

  tests.forEach(({args, expected}) => {
    it(`should pass or fail linting ['${args}', '${expected}']`, async () => {
      deepStrictEqual(await lintPullRequest(args), expected);
    });
  });
});
