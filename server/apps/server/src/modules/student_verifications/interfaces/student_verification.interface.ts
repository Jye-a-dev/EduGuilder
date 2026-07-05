export enum VerifyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface StudentVerification {
  id: string;
  student_id: string;
  card_image_key: string;
  status: VerifyStatus;
  reject_reason?: string | null;
  verified_by?: string | null;
  created_at: Date;
  updated_at: Date;
}
