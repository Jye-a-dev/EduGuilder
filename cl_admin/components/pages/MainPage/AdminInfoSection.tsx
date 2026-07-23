export default function AdminInfoSection() {
  return (
    <div className="max-w-xl space-y-8 text-left">
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 border border-cyber-primary/30 bg-cyber-primary/10 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-cyber-cyan rounded-md">
          <i className="fa-solid fa-lock text-xs" /> SECURE MANAGEMENT ENDPOINT
        </span>
        <h1 className="font-mono text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
          Trung Tâm <br />
          <span className="bg-linear-to-r from-cyber-primary via-cyber-cyan to-white bg-clip-text text-transparent">
            Điều Hành Hệ Thống
          </span>
        </h1>
        <p className="font-light leading-relaxed text-gray-400">
          Cổng bảo mật tối cao dành riêng cho Đội ngũ Vận hành & Phát triển EduPath. Thực hiện giám sát toàn quyền
          dữ liệu, phê duyệt thực thể, kiểm duyệt nội dung và theo dõi nhật ký máy chủ.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
          Nhiệm vụ quản trị cốt lõi
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex gap-3 rounded-xl border border-gray-900 bg-cyber-card/40 p-4 items-start">
            <i className="fa-solid fa-id-card mt-1 text-sm text-cyber-cyan" />
            <div>
              <h4 className="text-sm font-bold text-gray-200">Xác thực Học Sinh</h4>
              <p className="mt-0.5 text-xs text-gray-500">Phê duyệt thẻ học sinh viết bài đánh giá trường học.</p>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-gray-900 bg-cyber-card/40 p-4 items-start">
            <i className="fa-solid fa-comment-slash mt-1 text-sm text-cyber-alert" />
            <div>
              <h4 className="text-sm font-bold text-gray-200">Kiểm duyệt Đánh giá</h4>
              <p className="mt-0.5 text-xs text-gray-500">Sàng lọc và xử lý tin rác, độc hại từ học sinh.</p>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-gray-900 bg-cyber-card/40 p-4 items-start">
            <i className="fa-solid fa-building-shield mt-1 text-sm text-cyber-primary" />
            <div>
              <h4 className="text-sm font-bold text-gray-200">Verify Universities</h4>
              <p className="mt-0.5 text-xs text-gray-500">Xác minh đối tác, cấp quyền quản lý điểm chuẩn.</p>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-gray-900 bg-cyber-card/40 p-4 items-start">
            <i className="fa-solid fa-user-secret mt-1 text-sm text-cyber-warning" />
            <div>
              <h4 className="text-sm font-bold text-gray-200">Audit Logs & Session</h4>
              <p className="mt-0.5 text-xs text-gray-500">Truy vết hành vi phá hoại và thu hồi phiên đăng nhập.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
