"use client";

import { useState } from "react";

interface Criterion {
  key: "c1" | "c2" | "c3" | "c4";
  insiderLabel: string;
  outsiderLabel: string;
  insiderDesc: string;
  outsiderDesc: string;
  insiderIcon: string;
  outsiderIcon: string;
}

const DEFAULT_CRITERIA: Criterion[] = [
  {
    key: "c1",
    insiderLabel: "Chất lượng đào tạo",
    outsiderLabel: "Uy tín & Thương hiệu",
    insiderDesc: "Đánh giá về chương trình học, giáo trình, và chất lượng đào tạo thực tế của sinh viên.",
    outsiderDesc: "Đánh giá về danh tiếng, xếp hạng, và thương hiệu của trường trong mắt người bên ngoài.",
    insiderIcon: "fa-graduation-cap",
    outsiderIcon: "fa-trophy",
  },
  {
    key: "c2",
    insiderLabel: "Cơ sở vật chất",
    outsiderLabel: "Học phí & Học bổng",
    insiderDesc: "Trang thiết bị, phòng học, thư viện, ký túc xá, và cơ sở hạ tầng trong khuôn viên trường.",
    outsiderDesc: "Mức học phí so với chất lượng, chính sách hỗ trợ tài chính và học bổng hiện có.",
    insiderIcon: "fa-building",
    outsiderIcon: "fa-wallet",
  },
  {
    key: "c3",
    insiderLabel: "Đội ngũ giảng viên",
    outsiderLabel: "Vị trí & Khuôn viên",
    insiderDesc: "Trình độ, kinh nghiệm, sự nhiệt tình và phương pháp giảng dạy của đội ngũ giáo viên.",
    outsiderDesc: "Vị trí địa lý thuận tiện, cảnh quan, và môi trường tổng thể của khuôn viên trường.",
    insiderIcon: "fa-chalkboard-user",
    outsiderIcon: "fa-location-dot",
  },
  {
    key: "c4",
    insiderLabel: "Đời sống sinh viên",
    outsiderLabel: "Yêu cầu đầu vào",
    insiderDesc: "Hoạt động ngoại khóa, câu lạc bộ, sự kiện, và chất lượng cuộc sống trong khuôn viên trường.",
    outsiderDesc: "Điểm chuẩn, tỉ lệ cạnh tranh, và các yêu cầu để được nhận vào trường.",
    insiderIcon: "fa-people-group",
    outsiderIcon: "fa-file-lines",
  },
];

interface EditState {
  insiderLabel: string;
  outsiderLabel: string;
  insiderDesc: string;
  outsiderDesc: string;
}

export default function CriteriaTab() {
  const [criteria, setCriteria] = useState<Criterion[]>(DEFAULT_CRITERIA);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({
    insiderLabel: "",
    outsiderLabel: "",
    insiderDesc: "",
    outsiderDesc: "",
  });
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const openEdit = (c: Criterion) => {
    setEditingKey(c.key);
    setEditState({
      insiderLabel: c.insiderLabel,
      outsiderLabel: c.outsiderLabel,
      insiderDesc: c.insiderDesc,
      outsiderDesc: c.outsiderDesc,
    });
  };

  const cancelEdit = () => {
    setEditingKey(null);
  };

  const saveEdit = (key: string) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.key === key
          ? {
              ...c,
              insiderLabel: editState.insiderLabel,
              outsiderLabel: editState.outsiderLabel,
              insiderDesc: editState.insiderDesc,
              outsiderDesc: editState.outsiderDesc,
            }
          : c
      )
    );
    setEditingKey(null);
    setSavedFeedback(`Đã cập nhật tiêu chí ${key.toUpperCase()} thành công.`);
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  const resetToDefault = () => {
    if (!window.confirm("Khôi phục toàn bộ tiêu chí về mặc định?")) return;
    setCriteria(DEFAULT_CRITERIA);
    setSavedFeedback("Đã khôi phục về mặc định.");
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Quản lý Tiêu chí Đánh giá
          </h2>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
            Định nghĩa 4 tiêu chí đánh giá cho cả Insider (sinh viên đang học) và Outsider (học sinh bên ngoài).
          </p>
        </div>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 text-[10px] font-mono uppercase transition-all cursor-pointer"
        >
          <i className="fa-solid fa-rotate-left text-[9px]" />
          Khôi phục mặc định
        </button>
      </div>

      {/* Feedback */}
      {savedFeedback && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
          <i className="fa-solid fa-circle-check text-[10px]" />
          {savedFeedback}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Insider — Sinh viên đang học
        </span>
        <span className="flex items-center gap-1.5 text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Outsider — Học sinh bên ngoài
        </span>
      </div>

      {/* Criteria Cards */}
      <div className="space-y-4">
        {criteria.map((c, idx) => (
          <div
            key={c.key}
            className="rounded-xl border border-gray-800 bg-cyber-card/60 overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60 bg-cyber-card/80">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-cyber-primary/15 border border-cyber-primary/25 flex items-center justify-center text-cyber-cyan font-mono font-black text-[10px]">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Tiêu chí {c.key.toUpperCase()}
                </span>
              </div>
              {editingKey !== c.key ? (
                <button
                  onClick={() => openEdit(c)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 text-[10px] font-mono transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-pen text-[9px]" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => saveEdit(c.key)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-[10px] font-mono transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-check text-[9px]" />
                    Lưu
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-800 text-gray-500 hover:text-gray-300 text-[10px] font-mono transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800/50">
              {/* Insider */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    <i className={`fa-solid ${c.insiderIcon} text-[9px]`} />
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    Insider
                  </span>
                </div>

                {editingKey === c.key ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Tên tiêu chí</label>
                      <input
                        type="text"
                        value={editState.insiderLabel}
                        onChange={(e) => setEditState({ ...editState, insiderLabel: e.target.value })}
                        className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-1.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Mô tả</label>
                      <textarea
                        rows={2}
                        value={editState.insiderDesc}
                        onChange={(e) => setEditState({ ...editState, insiderDesc: e.target.value })}
                        className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-1.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white">{c.insiderLabel}</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{c.insiderDesc}</p>
                  </div>
                )}
              </div>

              {/* Outsider */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
                    <i className={`fa-solid ${c.outsiderIcon} text-[9px]`} />
                  </span>
                  <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                    Outsider
                  </span>
                </div>

                {editingKey === c.key ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Tên tiêu chí</label>
                      <input
                        type="text"
                        value={editState.outsiderLabel}
                        onChange={(e) => setEditState({ ...editState, outsiderLabel: e.target.value })}
                        className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-1.5 text-xs text-white focus:border-blue-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Mô tả</label>
                      <textarea
                        rows={2}
                        value={editState.outsiderDesc}
                        onChange={(e) => setEditState({ ...editState, outsiderDesc: e.target.value })}
                        className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-1.5 text-xs text-white focus:border-blue-500/50 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white">{c.outsiderLabel}</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{c.outsiderDesc}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg border border-gray-800 bg-cyber-card/30 text-[10px] font-mono text-gray-500">
        <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
        <span>
          Các tiêu chí này được hiển thị khi người dùng submit đánh giá và khi admin xem/chỉnh sửa bình luận.
          Thay đổi ở đây chỉ ảnh hưởng đến label hiển thị, không xóa dữ liệu đã lưu.
        </span>
      </div>
    </div>
  );
}
