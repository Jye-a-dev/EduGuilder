"use client";

import { useState, useMemo } from "react";
import type { University } from "../types";

type VerifiedFilter = "all" | "verified" | "unverified";
type RegionFilter = "all" | "Miền Bắc" | "Miền Trung" | "Miền Nam";


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
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${active
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
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${regionFilter === "all"
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
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${active
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
              <th className="p-4">Loại hình</th>
              <th className="p-4">Khu Vực</th>
              <th className="p-4">Học phí</th>
              <th className="p-4">Website</th>
              <th className="p-4">Xác thực</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/50 text-xs">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 9 }).map((__, j) => (
                    <td key={j} className="p-4">
                      <div className="h-3 bg-gray-800 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={9} className="p-10 text-center">
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
                <td colSpan={9} className="p-8 text-center text-gray-500 font-mono">
                  {search || verifiedFilter !== "all" || regionFilter !== "all"
                    ? "Không có kết quả phù hợp với bộ lọc."
                    : "Không tìm thấy dữ liệu trường đại học nào."}
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-800/30 transition-colors border-b border-gray-900/60 last:border-0">
                  <td className="p-4 font-mono text-[10px] text-gray-500 select-all max-w-30 truncate" title={u.id}>
                    {u.id}
                  </td>
                  <td className="p-4 font-mono font-bold text-cyber-cyan whitespace-nowrap">
                    <span className="bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/20">
                      {u.code}
                    </span>
                  </td>
                  <td className="p-4 text-gray-100 font-semibold text-xs">{u.name}</td>
                  <td className="p-4 whitespace-nowrap">
                    {u.type ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap ${u.type === "công lập"
                          ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                          : u.type === "tư thục"
                            ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                            : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                          }`}
                      >
                        {u.type}
                      </span>
                    ) : (
                      <span className="text-gray-600 font-mono">—</span>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {u.region ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap ${u.region === "Miền Bắc"
                          ? "bg-sky-500/15 border-sky-500/30 text-sky-300"
                          : u.region === "Miền Trung"
                            ? "bg-orange-500/15 border-orange-500/30 text-orange-300"
                            : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          }`}
                      >
                        {u.region}
                      </span>
                    ) : (
                      <span className="text-gray-600 font-mono">—</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-300 font-mono text-[11px] whitespace-nowrap">{u.tuition_fees || "—"}</td>
                  <td className="p-4 whitespace-nowrap">
                    {u.website_url ? (
                      <a
                        href={u.website_url.startsWith("http") ? u.website_url : `https://${u.website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-cyan hover:bg-cyber-primary/20 text-[11px] font-mono transition-all"
                      >
                        <span>Trang chủ</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                      </a>
                    ) : (
                      <span className="text-gray-600 font-mono">—</span>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggleUniversityVerification(u.id, u.is_verified)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase border cursor-pointer select-none transition-all ${u.is_verified
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                        : "bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25"
                        }`}
                    >
                      <i className={`fa-solid ${u.is_verified ? "fa-circle-check" : "fa-circle-xmark"} text-[9px]`} />
                      {u.is_verified ? "VERIFIED" : "UNVERIFIED"}
                    </button>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-1">
                    <button
                      onClick={() => openEditUniversity(u)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
                      title="Sửa thông tin"
                    >
                      <i className="fa-solid fa-pen text-xs" />
                    </button>
                    <button
                      onClick={() => handleDeleteUniversity(u.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-cyber-alert hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="Xóa trường"
                    >
                      <i className="fa-solid fa-trash-can text-xs" />
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
