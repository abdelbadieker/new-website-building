import { SupabaseClient } from '@supabase/supabase-js';
import { uploadFile as uploadToSupabase, UploadOptions, UploadResult } from './storage-utils';

/**
 * Provider-agnostic storage facade. Call sites should import from here
 * rather than `storage-utils` directly, so the provider can be swapped
 * (Supabase → Cloudflare R2, Firebase, S3, etc.) without a refactor.
 *
 * Current provider: Supabase Storage. Switch by setting
 * NEXT_PUBLIC_STORAGE_PROVIDER (future hook — only "supabase" wired today).
 */
export type StorageProvider = 'supabase';

export interface StorageClient {
  upload(file: File, options: UploadOptions): Promise<UploadResult>;
}

export function createStorage(supabase: SupabaseClient): StorageClient {
  return {
    async upload(file, options) {
      return uploadToSupabase(supabase, file, options);
    },
  };
}

export type { UploadOptions, UploadResult };
