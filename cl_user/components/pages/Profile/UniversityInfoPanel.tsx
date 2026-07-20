"use client";

import type { University } from "@/hooks/useUniversities";

interface UniversityInfoPanelProps {
  university: University;
}

export default function UniversityInfoPanel({ university }: UniversityInfoPanelProps) {
  return (
    <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-main uppercase font-mono tracking-wider">Hồ Sơ Trường Đại Học Liên Kết</h3>
          <p className="text-[10px] text-text-sub mt-0.5">Thông tin công khai của trường (chỉ xem — liên hệ admin để chỉnh sửa).</p>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono uppercase border ${
            university.is_verified
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {university.is_verified ? "VERIFIED" : "UNVERIFIED"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-brand-dark/40 border border-border-custom space-y-1">
          <span className="block text-[9px] font-mono text-text-sub uppercase tracking-wider">Tên trường</span>
          <span className="block font-bold text-text-main">{university.name}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-brand-dark/40 border border-border-custom space-y-1">
          <span className="block text-[9px] font-mono text-text-sub uppercase tracking-wider">Mã trường</span>
          <span className="block font-mono font-bold text-brand-primary">{university.code}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-brand-dark/40 border border-border-custom space-y-1">
          <span className="block text-[9px] font-mono text-text-sub uppercase tracking-wider">Vùng miền</span>
          <span className="block font-bold text-text-main">{university.region || "Chưa cập nhật"}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-brand-dark/40 border border-border-custom space-y-1">
          <span className="block text-[9px] font-mono text-text-sub uppercase tracking-wider">Học phí</span>
          <span className="block font-bold text-text-main">{university.tuition_fee || "Chưa cập nhật"}</span>
        </div>
      </div>
    </div>
  );
}
