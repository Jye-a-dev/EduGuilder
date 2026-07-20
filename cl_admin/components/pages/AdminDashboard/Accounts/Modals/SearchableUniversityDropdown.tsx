"use client";

import { useState } from "react";
import type { University } from "../../types";

interface SearchableUniversityDropdownProps {
  universities: University[];
  selectedUniversityId: string;
  onChange: (id: string) => void;
}

export function SearchableUniversityDropdown({
  universities,
  selectedUniversityId,
  onChange,
}: SearchableUniversityDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedUni = universities.find((u) => u.id === selectedUniversityId);

  const filtered = universities.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dropdownOptions = [...filtered];
  
  if (selectedUniversityId && !dropdownOptions.some((o) => o.id === selectedUniversityId)) {
    if (selectedUni) {
      dropdownOptions.unshift(selectedUni);
    } else {
      dropdownOptions.unshift({
        id: selectedUniversityId,
        name: "Đang tải thông tin trường...",
        code: "",
        is_verified: false,
        created_at: "",
      });
    }
  }

  const displayValue = isOpen 
    ? searchTerm 
    : (selectedUni 
        ? `${selectedUni.name} (${selectedUni.code})` 
        : (selectedUniversityId || "")
      );

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Tìm tên trường, mã code hoặc UUID..."
          value={displayValue}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm("");
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
        />
        {selectedUniversityId && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setSearchTerm("");
              setIsOpen(false);
            }}
            className="text-xs text-cyber-alert hover:underline font-mono px-2 shrink-0"
          >
            Xóa
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-800 bg-cyber-card p-1 shadow-xl space-y-0.5">
          {dropdownOptions.length === 0 ? (
            <div className="py-2.5 px-3 text-center text-xs text-gray-600 font-mono">
              Không tìm thấy trường nào.
            </div>
          ) : (
            dropdownOptions.map((u) => (
              <div
                key={u.id}
                onClick={() => {
                  onChange(u.id);
                  setIsOpen(false);
                }}
                className={`
                  cursor-pointer py-1.5 px-3 rounded-md text-xs font-mono transition-colors text-left
                  ${selectedUniversityId === u.id 
                    ? "bg-cyber-primary/20 text-cyber-cyan" 
                    : "text-gray-300 hover:bg-gray-800"
                  }
                `}
              >
                <div className="font-bold text-gray-200">{u.name}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Mã code: {u.code}</div>
                <div className="text-[9px] text-gray-600 truncate">{u.id}</div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Click outside backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
