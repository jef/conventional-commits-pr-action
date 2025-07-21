import {
  getConventionalCommitTypes,
  lintPullRequest,
  isBotIgnored,
} from "./lint.js";
import { context } from "@actions/github";
import * as core from "@actions/core";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

describe("getConvetionalCommitTypes tests", () => {
  it("should return types", () => {
    const types = getConventionalCommitTypes();

    expect(
      "- **feat**: A new feature\n" +
        "- **fix**: A bug fix\n" +
        "- **docs**: Documentation only changes\n" +
        "- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)\n" +
        "- **refactor**: A code change that neither fixes a bug nor adds a feature\n" +
        "- **perf**: A code change that improves performance\n" +
        "- **test**: Adding missing tests or correcting existing tests\n" +
        "- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)\n" +
        "- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)\n" +
        "- **chore**: Other changes that don't modify src or test files\n" +
        "- **revert**: Reverts a previous commit",
    ).toBe(types);
  });
});

describe("lintPullRequest tests", () => {
  const tests = [
    { args: "feat: test", expected: true },
    { args: "feat(test): test", expected: true },
    { args: "feats: test", expected: false },
    { args: "(feat): test", expected: false },
    { args: "test", expected: false },
    { args: "feat(): test", expected: false },
    { args: "feat:", expected: false },
    { args: "feat():", expected: false },
    { args: "feat(test):", expected: false },
  ];

  tests.forEach(({ args, expected }) => {
    it(`should pass or fail linting ['${args}', '${expected}']`, async () => {
      expect(await lintPullRequest(args)).toBe(expected);
    });
  });

  describe("subject pattern tests", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should pass if subject matches pattern", async () => {
      vi.spyOn(core, "getInput").mockReturnValue("matching");

      expect(await lintPullRequest(`feat: matching`)).toBe(true);
      expect(await lintPullRequest(`feat(test): matching`)).toBe(true);
    });

    it("should fail if subject does not match pattern", async () => {
      vi.spyOn(core, "getInput").mockReturnValue("not-matching");

      expect(await lintPullRequest(`feat: matching`)).toBe(false);
      expect(await lintPullRequest(`feat(test): matching`)).toBe(false);
    });

    it("should handle empty subject pattern", async () => {
      vi.spyOn(core, "getInput").mockReturnValue("");

      expect(await lintPullRequest("feat: test")).toBe(true);
      expect(await lintPullRequest("feat(test): test")).toBe(true);
    });

    it("should handle complex regex", async () => {
      vi.spyOn(core, "getInput").mockReturnValue(
        "[a-z]{1,5}[0-9]{1,3}[!@#]HELLO",
      );

      expect(await lintPullRequest("feat: ab11@HELLO")).toBe(true);
      expect(await lintPullRequest("feat(test): ddd999!HELLO")).toBe(true);
    });
  });
});

describe("isBotIgnored tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return true if the bot is in the ignore list", () => {
    vi.spyOn(context, "actor", "get").mockReturnValue("test-bot");
    vi.spyOn(core, "getInput").mockReturnValue("test-bot,another-bot");

    expect(isBotIgnored()).toBe(true);
  });

  it("should return false if the bot is not in the ignore list", () => {
    vi.spyOn(context, "actor", "get").mockReturnValue("test-bot");
    vi.spyOn(core, "getInput").mockReturnValue("another-bot");

    expect(isBotIgnored()).toBe(false);
  });
});
