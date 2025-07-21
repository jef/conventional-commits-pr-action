// based on https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional

export const types = {
  build: {
    description:
      "Changes that affect the build system or external dependencies",
  },
  chore: { description: "Other changes that don't modify src or test files" },
  ci: { description: "Changes to our CI configuration files and scripts" },
  docs: { description: "Documentation only changes" },
  feat: { description: "A new feature" },
  fix: { description: "A bug fix" },
  perf: { description: "A performance improvement" },
  refactor: {
    description: "A code change that neither fixes a bug nor adds a feature",
  },
  revert: { description: "Reverts a previous commit" },
  style: { description: "Changes that do not affect the meaning of the code" },
  test: { description: "Adding missing tests or correcting existing tests" },
};
