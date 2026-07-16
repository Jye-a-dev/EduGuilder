"use client";

import { useMemo } from "react";
import type { University, UniversityReview, StudentVerification } from "../types";

interface DashboardTabProps {
  pendingVerificationsCount: number;
  pendingReviewsCount: number;
  universitiesCount: number;
  universities?: University[];
  reviews?: UniversityReview[];
  verifications?: StudentVerification[];
  setActiveTab: (tab: "dashboard" | "verifications" | "reviews" | "universities" | "audit") => void;
}

export default function DashboardTab({
  pendingVerificationsCount,
  pendingReviewsCount,
  universitiesCount,
  universities = [],
  reviews = [],
  setActiveTab,
}: DashboardTabProps) {
  // 1. Calculate region stats
  const regionStats = useMemo(() => {
    let bac = 0;
    let trung = 0;
    let nam = 0;
    let khac = 0;
    universities.forEach((u) => {
      if (u.region === "Miền Bắc") bac++;
      else if (u.region === "Miền Trung") trung++;
      else if (u.region === "Miền Nam") nam++;
      else khac++;
    });
    return [
      { name: "Miền Bắc", count: bac, color: "#3b82f6" },
      { name: "Miền Trung", count: trung, color: "#f59e0b" },
      { name: "Miền Nam", count: nam, color: "#10b981" },
      { name: "Chưa phân loại", count: khac, color: "#6b7280" },
    ];
  }, [universities]);

  const maxRegionCount = useMemo(() => {
    const max = Math.max(...regionStats.map((r) => r.count));
    return max > 0 ? max : 10;
  }, [regionStats]);

  // 2. Calculate review approval stats
  const reviewStats = useMemo(() => {
    const approved = reviews.filter((r) => r.is_approved).length;
    const pending = reviews.filter((r) => !r.is_approved).length;
    const total = reviews.length;
    return { approved, pending, total };
  }, [reviews]);

  // Donut values calculations
  const donutSegments = useMemo(() => {
    const total = reviewStats.total;
    if (total === 0) {
      return [
        { percentage: 100, color: "#374151", name: "Không có dữ liệu", count: 0 }
      ];
    }
    const approvedPct = (reviewStats.approved / total) * 100;
    const pendingPct = (reviewStats.pending / total) * 100;

    return [
      { percentage: approvedPct, color: "#06b6d4", name: "Đã duyệt", count: reviewStats.approved },
      { percentage: pendingPct, color: "#f59e0b", name: "Chờ duyệt", count: reviewStats.pending },
    ];
  }, [reviewStats]);

  // Donut SVG helper parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16

  let accumulatedPercentage = 0;

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => setActiveTab("verifications")}
          className="p-6 rounded-2xl bg-cyber-card/60 border border-gray-800/80 flex items-center justify-between hover:border-cyber-cyan/50 cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
              Yêu cầu xác thực thẻ
            </span>
            <span className="text-3xl font-black font-mono text-white mt-1 block">
              {pendingVerificationsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan text-xl">
            <i className="fa-solid fa-user-check"></i>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("reviews")}
          className="p-6 rounded-2xl bg-cyber-card/60 border border-gray-800/80 flex items-center justify-between hover:border-cyber-warning/50 cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
              Bài viết Review chờ duyệt
            </span>
            <span className="text-3xl font-black font-mono text-white mt-1 block">
              {pendingReviewsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyber-warning/10 border border-cyber-warning/30 flex items-center justify-center text-cyber-warning text-xl">
            <i className="fa-solid fa-comment-medical"></i>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("universities")}
          className="p-6 rounded-2xl bg-cyber-card/60 border border-gray-800/80 flex items-center justify-between hover:border-cyber-primary/50 cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
              Tổng số trường Đại Học
            </span>
            <span className="text-3xl font-black font-mono text-white mt-1 block">
              {universitiesCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyber-primary/10 border border-cyber-primary/30 flex items-center justify-center text-cyber-primary text-xl">
            <i className="fa-solid fa-school"></i>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("audit")}
          className="p-6 rounded-2xl bg-cyber-card/60 border border-gray-800/80 flex items-center justify-between hover:border-cyber-success/50 cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
              Bảo mật logs máy chủ
            </span>
            <span className="text-[10px] font-mono text-cyber-success mt-1 block uppercase tracking-wider font-bold">
              <i className="fa-solid fa-circle-check animate-pulse mr-1"></i> secure tracking
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyber-success/10 border border-cyber-success/30 flex items-center justify-center text-cyber-success text-xl">
            <i className="fa-solid fa-receipt"></i>
          </div>
        </div>
      </div>

      {/* Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Distribution Bar Chart */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-cyber-card/40 relative">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono flex items-center gap-2">
            <i className="fa-solid fa-chart-simple text-cyber-cyan" /> Phân bố đại học theo khu vực
          </h3>
          <div className="space-y-4">
            {regionStats.map((r) => {
              const pct = (r.count / maxRegionCount) * 100;
              return (
                <div key={r.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400 font-bold">{r.name}</span>
                    <span className="text-white font-black">{r.count} trường</span>
                  </div>
                  <div className="w-full h-3 bg-gray-900/60 border border-gray-800/80 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${pct > 0 ? pct : 2}%`,
                        backgroundColor: r.color,
                        boxShadow: `0 0 8px ${r.color}66`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Approval Ratio Donut Chart */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-cyber-card/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-cyber-cyan" /> Trạng thái duyệt bài Review
            </h3>
            <div className="space-y-3">
              {donutSegments.map((seg) => (
                <div key={seg.name} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-gray-400">{seg.name}</span>
                  </div>
                  <span className="text-white font-bold">{seg.count} ({seg.percentage.toFixed(1)}%)</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-900 flex justify-between text-xs font-mono text-gray-500">
                <span>Tổng số bài review:</span>
                <span className="text-white font-black">{reviewStats.total}</span>
              </div>
            </div>
          </div>

          {/* SVG Donut Visual */}
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg width="100%" height="100%" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#1f2937"
                strokeWidth="10"
              />
              {donutSegments.map((seg, idx) => {
                const strokeDashoffset = circumference - (seg.percentage / 100) * circumference;
                const strokeDasharray = `${circumference} ${circumference}`;
                const rotationOffset = (accumulatedPercentage / 100) * circumference;
                accumulatedPercentage += seg.percentage;

                return (
                  <circle
                    key={idx}
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transformOrigin: "60px 60px",
                      transform: `rotate(${(rotationOffset / circumference) * 360}deg)`,
                      transition: "stroke-dashoffset 1s ease-out",
                    }}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black font-mono text-white">{reviewStats.total}</span>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="p-6 rounded-2xl border border-gray-850 bg-cyber-card/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-primary/10 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-sm font-bold text-white mb-2">Trung tâm bảo mật thiết bị đầu cuối</h3>
        <p className="text-xs text-gray-400 font-light leading-relaxed max-w-3xl">
          Chào mừng Operator đến với Command Dashboard. Sử dụng thanh menu bên trái để điều khiển tài nguyên, duyệt các đối tác sinh viên và kiểm duyệt nhận xét. Tất cả hành vi của bạn sẽ tự động ghi dấu vết trong phần Nhật ký sự kiện máy chủ.
        </p>
      </div>
    </div>
  );
}
