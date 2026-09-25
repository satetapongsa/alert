import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 text-xs text-amber-300 flex items-center justify-between gap-2 z-[999] relative backdrop-blur-md">
      <div className="flex items-center gap-1.5 truncate max-w-[90vw]">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
        <span className="font-medium text-amber-200">ข้อควรระวัง:</span>
        <span className="text-amber-300/90 truncate">
          ข้อมูลจากชุมชนอาจคลาดเคลื่อน กรุณาตรวจสอบสถานการณ์จากแหล่งทางการเมื่อจำเป็น
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 flex-shrink-0">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>ระบบตรวจสอบโดยชุมชน</span>
      </div>
    </div>
  );
};
