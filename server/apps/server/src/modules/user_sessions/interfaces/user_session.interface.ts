export interface UserSession {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  user_agent?: string | null;
  ip_address?: string | null;
  is_revoked: boolean;
  expires_at: Date;
  created_at: Date;
}
