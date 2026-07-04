import { OAuthAccount } from '../../oauth_accounts/interfaces/oauth_account.interface';
import { PasswordResetToken } from '../../password_reset_tokens/interfaces/password_reset_token.interface';
import { UserSession } from '../../user_sessions/interfaces/user_session.interface';

export enum UserRole {
  ADMIN = 'admin',
  UNI = 'uni',
  STUDENT = 'student',
}

export interface User {
  id: string;
  email: string;
  password_hash?: string | null;
  full_name: string;
  role: UserRole;
  university_id?: string | null;
  current_grade?: number | null;
  eco_points: number;
  deleted_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  oauth_accounts?: OAuthAccount[];
  password_reset_tokens?: PasswordResetToken[];
  user_sessions?: UserSession[];
}
