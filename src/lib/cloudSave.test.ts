import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState } from "@/data/defaults";
import { createSupabaseCloudSaveAdapter, GUEST_SAVE_KEY, parseCloudSaveEnvelope, userSaveKey } from "@/lib/cloudSave";

describe("cloud save cache isolation", () => {
  it("uses separate keys for guests and each signed-in user", () => {
    expect(GUEST_SAVE_KEY).toBe("lifeQuestMap:v0.1");
    expect(userSaveKey("user-a")).not.toBe(GUEST_SAVE_KEY);
    expect(userSaveKey("user-a")).not.toBe(userSaveKey("user-b"));
  });

  it("rejects envelopes belonging to another user and invalid JSON", () => {
    const envelope = JSON.stringify({ userId: "user-a", state: createInitialLifeQuestState(), cloudRevision: 2, lastSyncedAt: null, dirty: true });
    expect(parseCloudSaveEnvelope(envelope, "user-b")).toBeNull();
    expect(parseCloudSaveEnvelope("{bad json", "user-a")).toBeNull();
  });
});

describe("Supabase cloud adapter", () => {
  it("uses the expected revision for optimistic updates", async () => {
    const calls: unknown[][] = [];
    const query = { update: (value: unknown) => { calls.push(["update", value]); return query; }, eq: (field: string, value: unknown) => { calls.push(["eq", field, value]); return query; }, select: () => Promise.resolve({ data: [{ user_id: "user-a", save_data: createInitialLifeQuestState(), schema_version: 10, revision: 3, updated_at: "2026-07-23T00:00:00.000Z" }], error: null }) };
    const client = { from: () => query } as never;
    await createSupabaseCloudSaveAdapter(client).update("user-a", createInitialLifeQuestState(), 2);
    expect(calls).toContainEqual(["eq", "revision", 2]);
  });

  it("treats an empty optimistic update result as a conflict", async () => {
    const query = { update: () => query, eq: () => query, select: () => Promise.resolve({ data: [], error: null }) };
    const client = { from: () => query } as never;
    await expect(createSupabaseCloudSaveAdapter(client).update("user-a", createInitialLifeQuestState(), 1)).rejects.toThrow("revision conflict");
  });
});

describe("user_saves migration", () => {
  it("enables RLS with own-row authenticated policies and no delete grant", () => {
    const sql = readFileSync("supabase/migrations/20260723_create_user_saves.sql", "utf8");
    expect(sql).toMatch(/enable row level security/i);
    expect(sql).toMatch(/to authenticated/);
    expect(sql).toMatch(/auth\.uid\(\)\) = user_id/);
    expect(sql).not.toMatch(/grant[^;]*delete[^;]*authenticated/i);
    expect(sql).not.toMatch(/grant[^;]*(insert|update)[^;]*anon/i);
  });

  it("limits the JSONB payload size in the follow-up migration", () => {
    const sql = readFileSync("supabase/migrations/20260724_limit_user_save_size.sql", "utf8");
    expect(sql).toMatch(/octet_length\(save_data::text\)\s*<=\s*1048576/i);
    expect(sql).toMatch(/drop constraint if exists/i);
  });
});
