import { describe, expect, it } from "vitest";
import { formatStatus } from "../src/index.js";

describe("bootstrap CLI status", () => {
  it("defaults to the current directory", () => {
    expect(formatStatus()).toBe("Shipcheck v0.1\n\nTarget: .\nStatus: ready");
  });

  it("prints the first target verbatim and ignores additional arguments", () => {
    expect(formatStatus(["./my project", "ignored"])).toBe(
      "Shipcheck v0.1\n\nTarget: ./my project\nStatus: ready",
    );
  });
});
