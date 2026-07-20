"use client";

import { useState } from "react";
import type { Account } from "../../types";

interface SearchableStudentDropdownProps {
  students: Account[];
  selectedStudentId: string;
  onChange: (id: string) => void;
}

export function SearchableStudentDropdown({
  students,
  selectedStudentId,
  onChange,
}: SearchableStudentDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Filter students based on search term
  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Build the list of options, ensuring the currently selected ID is always selectable
  const dropdownOptions = [...filtered];
  
  if (selectedStudentId && !dropdownOptions.some((o) => o.id === selectedStudentId)) {
    if (selectedStudent) {
      dropdownOptions.unshift(selectedStudent);
    } else {
      // Virtual entry for the currently selected UUID if not found in list (e.g. still loading)
      dropdownOptions.unshift({
        id: selectedStudentId,
        full_name: "Đang tải dữ liệu tài khoản...",
        email: selectedStudentId,
        role: "student",
        eco_points: 0,
        created_at: "",
        updated_at: "",
      });
    }
  }

  // Support direct UUID pasting/typing as a custom option
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchTerm.trim());
  if (isUuid && !dropdownOptions.some((o) => o.id === searchTerm.trim())) {
    dropdownOptions.push({
      id: searchTerm.trim(),
      full_name: "Mã UUID tự nhập",
      email: searchTerm.trim(),
      role: "student",
      eco_points: 0,
      created_at: "",
      updated_at: "",
    });
  }

  const getRoleLabel = (role: string) => {
    if (role === "student") return "Học sinh";
    if (role === "uni") return "Trường học";
    return "Admin";
  };

  const displayValue = isOpen 
    ? searchTerm 
    : (selectedStudent 
        ? `${selectedStudent.full_name} (${selectedStudent.email}) [${getRoleLabel(selectedStudent.role)}]` 
        : (selectedStudentId || "")
      );

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Tìm tên, email hoặc mã UUID..."
          value={displayValue}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm("");
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
        />
        {selectedStudentId && (
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
              Không tìm thấy tài khoản khả dụng.
            </div>
          ) : (
            dropdownOptions.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  onChange(s.id);
                  setIsOpen(false);
                }}
                className={`
                  cursor-pointer py-1.5 px-3 rounded-md text-xs font-mono transition-colors text-left
                  ${selectedStudentId === s.id 
                    ? "bg-cyber-primary/20 text-cyber-cyan" 
                    : "text-gray-300 hover:bg-gray-800"
                  }
                `}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{s.full_name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-gray-800 text-gray-400 border border-gray-700 font-sans shrink-0">
                    {getRoleLabel(s.role)}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.email}</div>
                <div className="text-[9px] text-gray-600 truncate">{s.id}</div>
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
