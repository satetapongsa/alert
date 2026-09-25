'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Incident } from '@/types';
import { formatThaiRelativeTime } from '@/lib/utils';
import { Activity, ChevronDown, ChevronUp, Radio } from 'lucide-react';

interface CurrentEventSummaryProps {
  incidents: Incident[];
  onSelectCategory?: (type: string) => void;
}

export const CurrentEventSummary: React.FC<CurrentEventSummaryProps> = ({
  incidents,
  onSelectCategory,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeIncidents = incidents.filter((i) => i.status === 'ACTIVE');
  const floodCount = activeIncidents.filter((i) => i.type === 'FLOOD').length;
  const trafficCount = activeIncidents.filter((i) => i.type === 'TRAFFIC').length;
  const accidentCount = activeIncidents.filter((i) => i.type === 'ACCIDENT').length;
  const transitCount = activeIncidents.filter((i) => i.type === 'TRANSIT').length;
  const roadClosedCount = activeIncidents.filter((i) => i.type === 'ROAD_CLOSED').length;

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-3 z-30 transition-all text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-100">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>สถานการณ์ตอนนี้ (Live Overview)</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
        >
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-2">
          <div className="flex items-center justify-between font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
            <span>🟢 เหตุการณ์ Active ทั้งหมด</span>
            <span className="font-bold">{activeIncidents.length} จุด</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-slate-300">
            <button
              onClick={() => onSelectCategory && onSelectCategory('FLOOD')}
              className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition-colors"
            >
              <span>💧 น้ำท่วม</span>
              <span className="font-bold text-cyan-400">{floodCount}</span>
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('TRAFFIC')}
              className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition-colors"
            >
              <span>🚗 รถติด</span>
              <span className="font-bold text-amber-400">{trafficCount}</span>
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('ACCIDENT')}
              className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition-colors"
            >
              <span>🚨 อุบัติเหตุ</span>
              <span className="font-bold text-red-400">{accidentCount}</span>
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('TRANSIT')}
              className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition-colors"
            >
              <span>🚇 รถไฟฟ้า</span>
              <span className="font-bold text-purple-400">{transitCount}</span>
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('ROAD_CLOSED')}
              className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition-colors col-span-2"
            >
              <span>🚧 ถนนปิด / กีดขวาง</span>
              <span className="font-bold text-orange-400">{roadClosedCount}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Link
              href="/transport"
              className="py-2 px-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-bold text-center block transition-all hover:scale-[1.01]"
            >
              🚇 สถานะรถไฟฟ้า ➔
            </Link>
            <Link
              href="/dashboard"
              className="py-2 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-center block transition-all hover:scale-[1.01]"
            >
              📊 รวมสถิติภาพรวม ➔
            </Link>
          </div>

          <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              เชื่อมต่อระบบ Real-Time
            </span>
            <span>อัปเดตต่อเนื่อง</span>
          </div>
        </div>
      )}
    </div>
  );
};
