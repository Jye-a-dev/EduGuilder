"use client";

import { useState, type FormEvent } from "react";

interface EditUniversityModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  editUniCode: string;
  setEditUniCode: (val: string) => void;
  editUniName: string;
  setEditUniName: (val: string) => void;
  editUniRegion: string;
  setEditUniRegion: (val: string) => void;
  editUniTuition: string;
  setEditUniTuition: (val: string) => void;
  editUniWebsiteUrl: string;
  setEditUniWebsiteUrl: (val: string) => void;
  editUniType: string;
  setEditUniType: (val: string) => void;
  editUniVerified: boolean;
  setEditUniVerified: (val: boolean) => void;
  onSubmit: (e: FormEvent) => void;
}

const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam"];
const UNI_TYPES = ["công lập", "tư thục", "quốc tế"];

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function CustomDropdown({ label, options, value, onChange, placeholder = "Chọn..." }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white hover:border-gray-700 transition-all focus:border-cyber-primary text-left cursor-pointer"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <i
          className={`fa-solid fa-chevron-down text-[10px] text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-cyber-primary" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-1.5 z-40 rounded-lg border border-gray-800 bg-cyber-card/95 backdrop-blur-md p-1 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors cursor-pointer flex items-center justify-between ${
                  value === opt.value
                    ? "bg-cyber-primary/20 text-cyber-cyan font-bold"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <i className="fa-solid fa-check text-[9px]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function EditUniversityModal({
  isOpen,
  closeModal,
  modalFeedback,
  editUniCode,
  setEditUniCode,
  editUniName,
  setEditUniName,
  editUniRegion,
  setEditUniRegion,
  editUniTuition,
  setEditUniTuition,
  editUniWebsiteUrl,
  setEditUniWebsiteUrl,
  editUniType,
  setEditUniType,
  editUniVerified,
  setEditUniVerified,
  onSubmit,
}: EditUniversityModalProps) {
  const regionOptions = [
    { value: "", label: "— Chưa phân loại —" },
    ...REGIONS.map((r) => ({ value: r, label: r })),
  ];
  const typeOptions = [
    { value: "", label: "— Chưa phân loại —" },
    ...UNI_TYPES.map((t) => ({ value: t, label: t })),
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative overflow-visible">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">Sửa Thông Tin Trường</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Mã Code
            </label>
            <input
              type="text"
              required
              value={editUniCode}
              onChange={(e) => setEditUniCode(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Tên trường đại học
            </label>
            <input
              type="text"
              required
              value={editUniName}
              onChange={(e) => setEditUniName(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>

          <CustomDropdown 
            label="Khu vực / Miền"
            options={regionOptions}
            value={editUniRegion}
            onChange={setEditUniRegion}
          />

          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Học phí
            </label>
            <input
              type="text"
              value={editUniTuition}
              onChange={(e) => setEditUniTuition(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Trang web chính thức (Website URL)
            </label>
            <input
              type="url"
              placeholder="e.g. https://www.neu.edu.vn"
              value={editUniWebsiteUrl}
              onChange={(e) => setEditUniWebsiteUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>

          <CustomDropdown 
            label="Loại hình trường"
            options={typeOptions}
            value={editUniType}
            onChange={setEditUniType}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editUniVerified"
              checked={editUniVerified}
              onChange={(e) => setEditUniVerified(e.target.checked)}
              className="h-4 w-4 rounded border-gray-800 bg-cyber-bg text-cyber-primary focus:ring-cyber-primary focus:outline-none"
            />
            <label htmlFor="editUniVerified" className="text-xs text-gray-400 font-mono select-none">
              Xác thực đối tác (Verified)
            </label>
          </div>
          {modalFeedback && <p className="text-[10px] font-mono text-cyber-alert">{modalFeedback}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-bold text-gray-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-linear-to-r from-cyber-primary to-cyber-cyan text-xs font-bold text-white"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
