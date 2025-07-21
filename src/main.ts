import { lint } from "./lint.js";
import { setFailed } from "@actions/core";

/**
 * Entrypoint for action.
 */
export async function entrypoint() {
  try {
    await lint();
  } catch (error: unknown) {
    setFailed(error as Error);
  }
}

void entrypoint();
