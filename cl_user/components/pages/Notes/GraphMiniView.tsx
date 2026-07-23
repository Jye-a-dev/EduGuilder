"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { apiClient } from "@/libs/apiClient";

interface LinkedNote {
  id: string;
  title: string;
}

interface GraphMiniViewProps {
  activeNoteId: string;
  activeNoteTitle: string;
  onSelectNote: (id: string) => void;
}

export default function GraphMiniView({
  activeNoteId,
  activeNoteTitle,
  onSelectNote,
}: GraphMiniViewProps) {
  const { token } = useAuthContext();
  const [links, setLinks] = useState<LinkedNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLinks = useCallback(async () => {
    if (!token || !activeNoteId) return;
    setIsLoading(true);
    try {
      const data = await apiClient.get<LinkedNote[]>(`/notes/${activeNoteId}/links`, { token });
      setLinks(data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách liên kết:", err);
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeNoteId, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLinks();
  }, [fetchLinks]);

  // Coordinates calculation for circular graph layout
  const centerX = 110;
  const centerY = 110;
  const radius = 60;

  const getCoordinates = (index: number, total: number) => {
    if (total === 0) return { x: centerX, y: centerY };
    const angle = (index * 2 * Math.PI) / total;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  return (
    <aside className="w-56 bg-brand-sidebar/10 border-l border-border-custom flex flex-col shrink-0 p-4 space-y-4">
      <div>
        <span className="block text-[10px] font-bold text-text-sub uppercase font-mono tracking-wider">Đồ thị liên kết</span>
        <span className="block text-[9px] text-text-sub font-light mt-0.5">Liên kết trong phạm vi ghi chú hiện tại.</span>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-[10px] text-text-sub font-mono animate-pulse">
          Đang xây dựng đồ thị...
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-55 h-55 bg-brand-card/30 rounded-2xl border border-border-custom flex items-center justify-center relative overflow-hidden shadow-inner">
            <svg width="220" height="220" className="select-none">
              {/* Define glows */}
              <defs>
                <filter id="glow-primary" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Edge Lines */}
              {links.map((node, idx) => {
                const coords = getCoordinates(idx, links.length);
                return (
                  <line
                    key={node.id}
                    x1={centerX}
                    y1={centerY}
                    x2={coords.x}
                    y2={coords.y}
                    stroke="var(--border-custom)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-pulse"
                  />
                );
              })}

              {/* Linked Note Nodes */}
              {links.map((node, idx) => {
                const coords = getCoordinates(idx, links.length);
                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group/node"
                    onClick={() => onSelectNote(node.id)}
                  >
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="7"
                      fill="#3b82f6"
                      stroke="#1d4ed8"
                      strokeWidth="1.5"
                      className="transition-transform duration-300 hover:scale-125"
                    />
                    <text
                      x={coords.x}
                      y={coords.y + 16}
                      textAnchor="middle"
                      fill="var(--body-muted)"
                      fontSize="8"
                      fontWeight="bold"
                      className="font-mono pointer-events-none fill-text-sub group-hover/node:fill-text-main"
                    >
                      {node.title.length > 8 ? `${node.title.slice(0, 7)}...` : node.title}
                    </text>
                  </g>
                );
              })}

              {/* Central Active Note Node */}
              <g className="cursor-pointer">
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="9"
                  fill="#f97316"
                  stroke="#ea580c"
                  strokeWidth="2"
                  filter="url(#glow-primary)"
                />
                <text
                  x={centerX}
                  y={centerY + 18}
                  textAnchor="middle"
                  fill="#f97316"
                  fontSize="8"
                  fontWeight="black"
                  className="font-mono pointer-events-none"
                >
                  {activeNoteTitle.length > 10 ? `${activeNoteTitle.slice(0, 9)}...` : activeNoteTitle}
                </text>
              </g>
            </svg>
          </div>

          {links.length === 0 && (
            <span className="text-[9px] text-text-sub font-mono text-center mt-3 leading-relaxed">
              Nhập liên kết dạng <span className="text-brand-secondary font-bold">[[Tên ghi chú]]</span> để liên kết các bài học.
            </span>
          )}
        </div>
      )}
    </aside>
  );
}
