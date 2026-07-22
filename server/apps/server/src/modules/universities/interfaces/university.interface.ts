export interface University {
  id: string;
  code: string;
  name: string;
  region?: string | null;
  logo_storage_key?: string | null;
  tuition_fees?: string | null;
  website_url?: string | null;
  type?: string | null;
  is_verified: boolean;
  deleted_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
