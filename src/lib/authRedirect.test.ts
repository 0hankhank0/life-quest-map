import { describe, expect, it } from "vitest";
import { safeAuthNextPath } from "@/lib/authRedirect";

describe("safeAuthNextPath", () => {
  it("accepts internal paths, query strings, and hashes", () => {
    expect(safeAuthNextPath("/")).toBe("/");
    expect(safeAuthNextPath("/profile")).toBe("/profile");
    expect(safeAuthNextPath("/quests?filter=today#list")).toBe("/quests?filter=today#list");
  });

  it("rejects external, empty, and non-string values", () => {
    expect(safeAuthNextPath("https://evil.example")).toBe("/");
    expect(safeAuthNextPath("//evil.example")).toBe("/");
    expect(safeAuthNextPath("")).toBe("/");
    expect(safeAuthNextPath(null)).toBe("/");
    expect(safeAuthNextPath({ path: "/profile" })).toBe("/");
  });
});
