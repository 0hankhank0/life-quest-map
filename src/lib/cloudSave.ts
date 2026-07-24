import type { SupabaseClient } from "@supabase/supabase-js";
import { migrateLifeQuestState } from "@/lib/stateMigration";
import type { LifeQuestState } from "@/types";

export const GUEST_SAVE_KEY = "lifeQuestMap:v0.1";
export const userSaveKey = (userId: string) => `lifeQuestMap:user:${userId}:v1`;
export const conflictBackupKey = (userId: string, timestamp = new Date().toISOString()) => `lifeQuestMap:conflictBackup:${userId}:${timestamp}`;

export interface CloudSaveEnvelope {
  userId: string;
  state: LifeQuestState;
  cloudRevision: number | null;
  lastSyncedAt: string | null;
  dirty: boolean;
}

export interface CloudSaveRow {
  userId: string;
  state: LifeQuestState;
  schemaVersion: number;
  revision: number;
  updatedAt: string;
}

export type CloudSaveErrorKind = "unavailable" | "offline" | "permission" | "unknown";
export class CloudSaveError extends Error {
  constructor(public readonly kind: CloudSaveErrorKind, message: string) { super(message); }
}
export class CloudSaveConflictError extends Error { constructor() { super("Cloud save revision conflict."); } }

type SaveRowDb = { user_id: string; save_data: unknown; schema_version: number; revision: number; updated_at: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readState(value: unknown): LifeQuestState | null {
  return isRecord(value) ? migrateLifeQuestState(value) : null;
}

export function parseCloudSaveEnvelope(raw: string | null, expectedUserId: string): CloudSaveEnvelope | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.userId !== expectedUserId || typeof value.cloudRevision !== "number" && value.cloudRevision !== null || typeof value.lastSyncedAt !== "string" && value.lastSyncedAt !== null || typeof value.dirty !== "boolean") return null;
    const state = readState(value.state);
    return state ? { userId: expectedUserId, state, cloudRevision: value.cloudRevision, lastSyncedAt: value.lastSyncedAt, dirty: value.dirty } : null;
  } catch { return null; }
}

/** Explicitly imports a legacy bare LifeQuestState; callers must ask the user first. */
export function legacyStateToEnvelope(raw: string | null, userId: string): CloudSaveEnvelope | null {
  if (!raw) return null;
  try {
    const state = readState(JSON.parse(raw));
    return state ? { userId, state, cloudRevision: null, lastSyncedAt: null, dirty: true } : null;
  } catch { return null; }
}

function mapRow(row: SaveRowDb): CloudSaveRow {
  const state = readState(row.save_data);
  if (!state) throw new CloudSaveError("unknown", "Cloud save data is invalid.");
  return { userId: row.user_id, state, schemaVersion: row.schema_version, revision: row.revision, updatedAt: row.updated_at };
}

function classify(error: { code?: string; message?: string } | null): CloudSaveError {
  const code = error?.code ?? "";
  if (code === "PGRST205" || code === "42P01") return new CloudSaveError("unavailable", "雲端存檔尚未啟用。");
  if (code === "42501" || code === "PGRST301") return new CloudSaveError("permission", "沒有雲端存檔權限，請確認登入與 RLS 設定。");
  if (/network|fetch|offline/i.test(error?.message ?? "")) return new CloudSaveError("offline", "目前無法連線到雲端存檔。");
  return new CloudSaveError("unknown", error?.message ?? "雲端存檔失敗。");
}

export interface CloudSaveAdapter {
  read(userId: string): Promise<CloudSaveRow | null>;
  create(userId: string, state: LifeQuestState): Promise<CloudSaveRow>;
  update(userId: string, state: LifeQuestState, expectedRevision: number): Promise<CloudSaveRow>;
}

export function createSupabaseCloudSaveAdapter(client: SupabaseClient): CloudSaveAdapter {
  return {
    async read(userId) {
      const { data, error } = await client.from("user_saves").select("user_id, save_data, schema_version, revision, updated_at").eq("user_id", userId).maybeSingle();
      if (error) throw classify(error);
      return data ? mapRow(data as SaveRowDb) : null;
    },
    async create(userId, state) {
      const { data, error } = await client.from("user_saves").insert({ user_id: userId, save_data: state, schema_version: state.schemaVersion }).select("user_id, save_data, schema_version, revision, updated_at").single();
      if (error) throw classify(error);
      return mapRow(data as SaveRowDb);
    },
    async update(userId, state, expectedRevision) {
      const { data, error } = await client.from("user_saves").update({ save_data: state, schema_version: state.schemaVersion }).eq("user_id", userId).eq("revision", expectedRevision).select("user_id, save_data, schema_version, revision, updated_at");
      if (error) throw classify(error);
      if (!data || data.length !== 1) throw new CloudSaveConflictError();
      return mapRow(data[0] as SaveRowDb);
    }
  };
}
