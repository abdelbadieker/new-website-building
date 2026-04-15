import { SupabaseClient } from '@supabase/supabase-js';

export interface UploadOptions {
  bucket: string;
  path?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  timeoutMs?: number;
}

export interface UploadResult {
  url: string | null;
  error: string | null;
  fileName: string | null;
}

/**
 * Unified utility to upload files to Supabase Storage.
 * Handles filename sanitization, timeouts, and public URL retrieval.
 */
export async function uploadFile(
  supabase: SupabaseClient,
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const {
    bucket,
    path = '',
    maxSizeMB = 100,
    allowedTypes = [],
    timeoutMs = 120000, // 2 minutes default
  } = options;

  // 1. Validation
  if (!file) return { url: null, error: 'No file provided', fileName: null };
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { url: null, error: `File size exceeds ${maxSizeMB}MB limit`, fileName: null };
  }

  if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type))) {
    return { url: null, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`, fileName: null };
  }

  // 2. Prepare Path
  const ext = file.name.split('.').pop();
  const sanitizedName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const uploadPath = path ? `${path.replace(/\/$/, '')}/${sanitizedName}` : sanitizedName;

  try {
    // 3. Upload with Timeout
    const uploadPromise = supabase.storage.from(bucket).upload(uploadPath, file, {
      cacheControl: '3600',
      upsert: false
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Transmission timeout: Connection too slow or file too large.')), timeoutMs)
    );

    const result = await Promise.race([uploadPromise, timeoutPromise]) as any;

    if (result.error) throw result.error;

    // 4. Get Public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadPath);
    
    return {
      url: urlData.publicUrl,
      error: null,
      fileName: sanitizedName
    };
  } catch (err: any) {
    console.error(`[StorageUtil] Upload to ${bucket} failed:`, err);
    return {
      url: null,
      error: err.message || 'The data link was interrupted during transmission',
      fileName: null
    };
  }
}
