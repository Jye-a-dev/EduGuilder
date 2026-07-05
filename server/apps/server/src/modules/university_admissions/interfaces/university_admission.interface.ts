export interface UniversityAdmission {
  id: string;
  university_id: string;
  year: number;
  major_code: string;
  major_name: string;
  quota: number;
  benchmark_score: number;
  group_code: string;
  created_at: Date;
}
