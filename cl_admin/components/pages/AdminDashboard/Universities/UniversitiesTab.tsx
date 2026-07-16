"use client";

import { useState, useMemo } from "react";
import type { University } from "../types";

type VerifiedFilter = "all" | "verified" | "unverified";
type RegionFilter = "all" | "Miền Bắc" | "Miền Trung" | "Miền Nam";

const REGION_COLOR: Record<string, string> = {
  "Miền Bắc":  "bg-blue-500/10 border-blue-500/30 text-blue-400",
  "Miền Trung": "bg-amber-500/10 border-amber-500/30 text-amber-400",
  "Miền Nam":  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
};

interface UniversitiesTabProps {
  universities: University[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  handleToggleUniversityVerification: (id: string, currentStatus: boolean) => void;
  openEditUniversity: (u: University) => void;
  handleDeleteUniversity: (id: string) => void;
  setActiveModal: (modal: "create-university" | null) => void;
}

export default function UniversitiesTab({
  universities,
  isLoading = false,
  error = null,
  onRetry,
  handleToggleUniversityVerification,
  openEditUniversity,
  handleDeleteUniversity,
  setActiveModal,
}: UniversitiesTabProps) {
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      const matchesSearch =
        search === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.code.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase());
      const matchesVerified =
        verifiedFilter === "all" ||
        (verifiedFilter === "verified" ? u.is_verified : !u.is_verified);
      const matchesRegion =
        regionFilter === "all" || u.region === regionFilter;
      return matchesSearch && matchesVerified && matchesRegion;
    });
  }, [universities, search, verifiedFilter, regionFilter]);

  const counts = useMemo(
    () => ({
      all: universities.length,
      verified: universities.filter((u) => u.is_verified).length,
      unverified: universities.filter((u) => !u.is_verified).length,
    }),
    [universities]
  );

  const regionCounts = useMemo(
    () => ({
      "Miền Bắc": universities.filter((u) => u.region === "Miền Bắc").length,
      "Miền Trung": universities.filter((u) => u.region === "Miền Trung").length,
      "Miền Nam": universities.filter((u) => u.region === "Miền Nam").length,
    }),
    [universities]
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên trường, mã code hoặc ID..."
            className="w-full bg-cyber-card/60 border border-gray-800 rounded-lg pl-8 pr-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-primary/60 transition-colors"
          />
        </div>

        <button
          onClick={() => setActiveModal("create-university")}
          className="px-4 py-2 rounded-lg bg-linear-to-r from-cyber-primary to-cyber-cyan text-xs font-bold text-white shadow hover:opacity-90 active:scale-95 transition-all shrink-0"
        >
          <i className="fa-solid fa-plus mr-1.5" /> Thêm Mới
        </button>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {/* Verified Filter */}
        <div className="flex items-center gap-1.5">
          {(["all", "verified", "unverified"] as const).map((s) => {
            const label: Record<typeof s, string> = {
              all: "Tất cả",
              verified: "Đã xác thực",
              unverified: "Chưa xác thực",
            };
            const active = verifiedFilter === s;
            const colorMap: Record<typeof s, string> = {
              all: "border-gray-600 text-gray-300 bg-gray-800/50",
              verified: "border-cyber-success/40 text-cyber-success bg-cyber-success/10",
              unverified: "border-cyber-alert/40 text-cyber-alert bg-cyber-alert/10",
            };
            return (
              <button
                key={s}
                onClick={() => setVerifiedFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                  active
                    ? colorMap[s]
                    : "border-gray-800 text-gray-600 bg-transparent hover:border-gray-700 hover:text-gray-400"
                }`}
              >
                {label[s]} <span className="opacity-60">({counts[s]})</span>
              </button>
            );
          })}
        </div>

        <div className="w-px bg-gray-800 self-stretch mx-1" />

        {/* Region Filter */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRegionFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
              regionFilter === "all"
                ? "border-gray-600 text-gray-300 bg-gray-800/50"
                : "border-gray-800 text-gray-600 bg-transparent hover:border-gray-700 hover:text-gray-400"
            }`}
          >
            Tất cả khu vực
          </button>
          {(["Miền Bắc", "Miền Trung", "Miền Nam"] as const).map((r) => {
            const active = regionFilter === r;
            const cls: Record<string, string> = {
              "Miền Bắc": "border-blue-500/40 text-blue-400 bg-blue-500/10",
              "Miền Trung": "border-amber-500/40 text-amber-400 bg-amber-500/10",
              "Miền Nam": "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
            };
            return (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                  active
                    ? cls[r]
                    : "border-gray-800 text-gray-600 bg-transparent hover:border-gray-700 hover:text-gray-400"
                }`}
              >
                {r} <span className="opacity-60">({regionCounts[r]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-900 bg-cyber-card/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-900 bg-cyber-card/80 font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="p-4">University ID</th>
              <th className="p-4">Mã Code</th>
              <th className="p-4">Tên Trường</th>
              <th className="p-4">Khu Vực</th>
              <th className="p-4">Học phí</th>
              <th className="p-4">Xác thực</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/50 text-xs">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="p-4">
                      <div className="h-3 bg-gray-800 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-10 text-center">
                  <div className="inline-flex flex-col items-center gap-3">
                    <i className="fa-solid fa-triangle-exclamation text-cyber-alert text-2xl" />
                    <p className="text-cyber-alert font-mono text-xs">{error}</p>
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="px-4 py-1.5 rounded-lg border border-cyber-primary/40 text-cyber-cyan text-xs font-bold hover:bg-cyber-primary/10 transition-all"
                      >
                        <i className="fa-solid fa-rotate-right mr-1.5" /> Thử lại
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 font-mono">
                  {search || verifiedFilter !== "all" || regionFilter !== "all"
                    ? "Không có kết quả phù hợp với bộ lọc."
                    : "Không tìm thấy dữ liệu trường đại học nào."}
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="p-4 font-mono text-[10px] text-gray-455 select-all">{u.id}</td>
                  <td className="p-4 font-mono font-bold text-cyber-cyan">{u.code}</td>
                  <td className="p-4 text-gray-200 font-bold">{u.name}</td>
                  <td className="p-4">
                    {u.region ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${REGION_COLOR[u.region] ?? "bg-gray-800/50 border-gray-700 text-gray-400"}`}>
                        {u.region}
                      </span>
                    ) : (
                      <span className="text-gray-600 font-mono">—</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400 font-mono">{u.tuition_fees || "-"}</td>
                  <td className="p-4">
                    <span
                      onClick={() => handleToggleUniversityVerification(u.id, u.is_verified)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border cursor-pointer select-none transition-all ${
                        u.is_verified
                          ? "bg-cyber-success/10 border-cyber-success/30 text-cyber-success hover:bg-cyber-success/25"
                          : "bg-cyber-alert/10 border-cyber-alert/30 text-cyber-alert hover:bg-cyber-alert/25"
                      }`}
                    >
                      {u.is_verified ? "VERIFIED" : "UNVERIFIED"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditUniversity(u)}
                      className="text-gray-500 hover:text-white transition-all p-1"
                      title="Sửa thông tin"
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button
                      onClick={() => handleDeleteUniversity(u.id)}
                      className="text-gray-500 hover:text-cyber-alert transition-all p-1"
                      title="Xóa trường"
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-[10px] text-gray-600 font-mono text-right">
          Hiển thị {filtered.length} / {universities.length} kết quả
        </p>
      )}
    </div>
  );
}
