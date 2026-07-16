-- ============================================================================
-- EDUPATH ENTERPRISE SYSTEM - PRODUCTION DATABASE SCHEMA (POSTGRESQL)
-- VERSION: 2.1 (CLEAN PRODUCTION-READY, MULTI-TENANT, NO-AI ENGINE)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. TẠO CÁC ENUM VÀ KIỂU DỮ LIỆU ĐỊNH DANH (TỐI ƯU HƠN VARCHAR)
-- ----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('admin', 'uni', 'student');
CREATE TYPE export_format AS ENUM ('pdf', 'word', 'excel', 'ppt');
CREATE TYPE export_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE oauth_provider AS ENUM ('google', 'facebook', 'github', 'apple');
CREATE TYPE verify_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE slide_layout AS ENUM ('title', 'content', 'split_column', 'thank_you');


-- ----------------------------------------------------------------------------
-- 1. HÀM TRIGGER TỰ ĐỘNG CẬP NHẬT UPDATED_AT (KHẮC PHỤC LỖI KHÔNG ĐỒNG BỘ)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ----------------------------------------------------------------------------
-- 2. TẦNG KHÔNG GIAN ĐẠI HỌC (UNIVERSITY & ADMISSIONS LOGIC)
-- ----------------------------------------------------------------------------
CREATE TABLE "universities" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "region" VARCHAR(50),                           -- Khu vực địa lý: 'Miền Bắc', 'Miền Trung', 'Miền Nam'
    "logo_storage_key" VARCHAR(512),               -- Thay vì lưu full URL CDN, lưu Key để linh hoạt
    "tuition_fees" VARCHAR(100),
    "is_verified" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP,                         -- Khắc phục thiếu Soft Delete
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration: Thêm cột region cho bảng universities (chạy nếu bảng đã tồn tại)
-- ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "region" VARCHAR(50);

-- Tách thông tin điểm chuẩn từ JSONB sang bảng riêng để hỗ trợ bài toán Query (Ví dụ: WHERE score > 27)
CREATE TABLE "university_admissions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "university_id" UUID NOT NULL REFERENCES "universities"("id") ON DELETE CASCADE,
    "year" INTEGER NOT NULL,
    "major_code" VARCHAR(50) NOT NULL,
    "major_name" VARCHAR(255) NOT NULL,
    "quota" INTEGER DEFAULT 0,
    "benchmark_score" NUMERIC(4,2) NOT NULL,
    "group_code" VARCHAR(50) NOT NULL,              -- Khối xét tuyển (A00, A01, D01...)
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "unique_admission_record" UNIQUE ("university_id", "year", "major_code", "group_code")
);


-- ----------------------------------------------------------------------------
-- 3. TẦNG AUTHENTICATION & USER MANAGEMENT LAYER
-- ----------------------------------------------------------------------------
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255),                   -- Nullable nếu chỉ dùng mạng xã hội
    "full_name" VARCHAR(255) NOT NULL,
    "role" user_role NOT NULL DEFAULT 'student',
    "university_id" UUID REFERENCES "universities"("id") ON DELETE SET NULL,
    "current_grade" INTEGER CHECK (current_grade >= 1 AND current_grade <= 12),
    "eco_points" INTEGER DEFAULT 0,
    "deleted_at" TIMESTAMP,                         -- Soft Delete
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tách tài khoản mạng xã hội ra bảng riêng (Hỗ trợ mở rộng Apple, GitHub, Facebook...)
CREATE TABLE "oauth_accounts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "provider" oauth_provider NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,       -- ID duy nhất từ bên thứ 3 trả về
    "meta_data" JSONB DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "unique_oauth_provider" UNIQUE ("provider", "provider_user_id")
);

-- Tách token đặt lại mật khẩu ra bảng riêng nhằm Audit log và Rate limit
CREATE TABLE "password_reset_tokens" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "used_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quản lý Session lưu Refresh Token dạng Hash trên DB (Chặn tấn công chiếm quyền)
CREATE TABLE "user_sessions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "refresh_token_hash" VARCHAR(255) NOT NULL,
    "user_agent" TEXT,
    "ip_address" VARCHAR(45),
    "is_revoked" BOOLEAN DEFAULT false,
    "expires_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------------------------------------------
-- 4. TẦNG HỌC TẬP & MINH CHỨNG (STUDENT VERIFICATION LAYER)
-- ----------------------------------------------------------------------------
CREATE TABLE "student_grades" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "semester" VARCHAR(50) NOT NULL,
    "subject_name" VARCHAR(100) NOT NULL,
    "score" NUMERIC(4,2) CHECK (score >= 0 AND score <= 10),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "unique_student_semester_subject" UNIQUE ("student_id", "semester", "subject_name")
);

-- Quản lý xác thực thẻ sinh viên viết Review (Lưu lịch sử thay vì ghi đè url)
CREATE TABLE "student_verifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "card_image_key" VARCHAR(512) NOT NULL,
    "status" verify_status DEFAULT 'pending',
    "reject_reason" TEXT,
    "verified_by" UUID REFERENCES "users"("id") ON DELETE SET NULL, -- Admin duyệt
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------------------------------------------
-- 5. TẦNG ĐỒ THỊ TRI THỨC OBSIDIAN & FILE MANAGER
-- ----------------------------------------------------------------------------
CREATE TABLE "notes" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,                        -- Chứa văn bản Markdown thô
    "tsv_content" tsvector,                         -- Hỗ trợ Full Text Search tối ưu bằng Postgres
    "deleted_at" TIMESTAMP,                         -- Soft Delete cho tài liệu cá nhân
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quản lý đồ thị liên kết [[Internal Link]]
CREATE TABLE "note_links" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "source_note_id" UUID NOT NULL REFERENCES "notes"("id") ON DELETE CASCADE,
    "target_note_id" UUID NOT NULL REFERENCES "notes"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "unique_note_edge" UNIQUE ("source_note_id", "target_note_id"),
    CONSTRAINT "no_self_loop" CHECK ("source_note_id" <> "target_note_id")
);

CREATE TABLE "tags" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "note_tags" (
    "note_id" UUID NOT NULL REFERENCES "notes"("id") ON DELETE CASCADE,
    "tag_id" UUID NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
    PRIMARY KEY ("note_id", "tag_id")
);

-- Quản lý File Explorer Sidebar đệ quy
CREATE TABLE "file_nodes" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "is_folder" BOOLEAN DEFAULT false,
    "parent_id" UUID REFERENCES "file_nodes"("id") ON DELETE CASCADE,
    "note_id" UUID REFERENCES "notes"("id") ON DELETE SET NULL,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------------------------------------------
-- 6. TẦNG PHÂN RÃ RENDERING ENGINE & KHO FILE XUẤT BẢN
-- ----------------------------------------------------------------------------
CREATE TABLE "document_exports" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "source_note_id" UUID REFERENCES "notes"("id") ON DELETE SET NULL,
    "format" export_format NOT NULL,
    "storage_key" VARCHAR(512) NOT NULL,            -- Chuyển từ file_url thành storage_key chuẩn hóa
    "file_size_bytes" BIGINT,
    "status" export_status DEFAULT 'completed',
    "render_settings" JSONB DEFAULT '{"theme": "light", "page_size": "A4"}'::jsonb,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "note_tables" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "note_id" UUID NOT NULL REFERENCES "notes"("id") ON DELETE CASCADE,
    "table_index" INTEGER DEFAULT 0,
    "headers" JSONB NOT NULL,
    "rows" JSONB NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "note_slides" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "note_id" UUID NOT NULL REFERENCES "notes"("id") ON DELETE CASCADE,
    "slide_index" INTEGER NOT NULL,
    "slide_type" slide_layout DEFAULT 'content',
    "title" VARCHAR(255),
    "bullet_points" JSONB DEFAULT '[]'::jsonb,
    "background_color" VARCHAR(20) DEFAULT '#ffffff',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------------------------------------------
-- 7. TẦNG ĐÁNH GIÁ TRƯỜNG HỌC & THÔNG BÁO HỆ THỐNG
-- ----------------------------------------------------------------------------
CREATE TABLE "university_reviews" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "university_id" UUID NOT NULL REFERENCES "universities"("id") ON DELETE CASCADE,
    "reviewer_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "rating_stars" INTEGER CHECK (rating_stars >= 1 AND rating_stars <= 5),
    "comment" TEXT NOT NULL,
    "official_reply" TEXT,
    "is_approved" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP,                         -- Khắc phục thiếu Soft Delete
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quản lý Thông báo đa kênh (Review approved, Export complete, System alert)
CREATE TABLE "notifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN DEFAULT false,
    "link_to" VARCHAR(255),                         -- Điều hướng route khi click vào thông báo
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------------------------------------------
-- 8. TẦNG GIÁM SÁT HỆ THỐNG (AUDIT SYSTEM LOGS)
-- ----------------------------------------------------------------------------
CREATE TABLE "audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "action" VARCHAR(100) NOT NULL,                 -- 'CREATE_NOTE', 'DELETE_REVIEW', 'LOGIN_OAUTH'
    "entity_name" VARCHAR(100) NOT NULL,            -- 'notes', 'university_reviews'
    "entity_id" UUID,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "meta_payload" JSONB DEFAULT '{}'::jsonb,        -- Lưu lại chi tiết thay đổi cũ/mới nếu cần
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------------------------------------------
-- 9. TẠO TOÀN BỘ TRIGGERS VÀ CHỈ MỤC (INDEXES COMPOSITE / FULL TEXT SEARCH)
-- ----------------------------------------------------------------------------

-- Gắn trigger set_timestamp tự động cho tất cả các bảng cần đồng bộ updated_at
CREATE TRIGGER set_timestamp_universities BEFORE UPDATE ON "universities" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_student_verifications BEFORE UPDATE ON "student_verifications" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_notes BEFORE UPDATE ON "notes" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_file_nodes BEFORE UPDATE ON "file_nodes" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_university_reviews BEFORE UPDATE ON "university_reviews" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Trigger tự động đồng bộ hóa trường Văn bản sang tsvector phục vụ Full Text Search
CREATE OR REPLACE FUNCTION notes_tsvector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.tsv_content := to_tsvector('simple', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON "notes" FOR EACH ROW EXECUTE PROCEDURE notes_tsvector_trigger();

-- TẠO CHỈ MỤC TỐI ƯU TRUY VẤN SẢN PHẨM LỚN (PRODUCTION INDEXES)
CREATE INDEX "idx_users_google" ON "oauth_accounts" ("provider_user_id");
CREATE INDEX "idx_sessions_token" ON "user_sessions" ("refresh_token_hash");
CREATE INDEX "idx_notes_student" ON "notes" ("student_id") WHERE deleted_at IS NULL;
CREATE INDEX "idx_note_links_source" ON "note_links" ("source_note_id");
CREATE INDEX "idx_note_links_target" ON "note_links" ("target_note_id");
CREATE INDEX "idx_note_tags_tag" ON "note_tags" ("tag_id");
CREATE INDEX "idx_file_nodes_tree" ON "file_nodes" ("student_id", "parent_id");
CREATE INDEX "idx_reviews_uni_approved" ON "university_reviews" ("university_id") WHERE is_approved = true AND deleted_at IS NULL;
CREATE INDEX "idx_admissions_query" ON "university_admissions" ("year", "benchmark_score");

-- Chỉ mục GIN phục vụ tìm kiếm từ khóa Full Text Search
CREATE INDEX "idx_notes_fts" ON "notes" USING gin("tsv_content");

-- Tạo chỉ mục Composite cho bài toán quét học bạ học sinh nhanh chóng
CREATE INDEX "idx_grades_composite" ON "student_grades" ("student_id", "semester");