export type VerifyStatus = "pending" | "approved" | "rejected";

export interface StudentVerification {
  id: string;
  student_id: string;
  card_image_key: string;
  status: VerifyStatus;
  reject_reason?: string | null;
  created_at: string;
}

export interface UniversityReview {
  id: string;
  university_id: string;
  reviewer_id: string;
  rating_stars: number;
  comment: string;
  is_approved: boolean;
  official_reply?: string | null;
  created_at: string;
}

export interface University {
  id: string;
  code: string;
  name: string;
  logo_storage_key?: string | null;
  tuition_fees?: string | null;
  is_verified: boolean;
  created_at: string;
}

export type UserRole = "admin" | "uni" | "student";

export interface Account {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  university_id?: string | null;
  current_grade?: number | null;
  eco_points: number;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_name: string;
  ip_address?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export type ModalType =
  | null
  | "create-verification"
  | "edit-verification"
  | "create-review"
  | "edit-review"
  | "create-university"
  | "edit-university"
  | "create-account"
  | "edit-account";
