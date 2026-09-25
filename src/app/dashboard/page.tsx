'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { SafetyBanner } from '@/components/SafetyBanner';
import {
  BarChart3,
  Activity,
  Droplets,
  Car,
  AlertTriangle,
  Train,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { INCIDENT_CONFIG, SEVERITY_CONFIG } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs">กำลังประมวลผลข้อมูลสถิติภาพรวม...</p>
      </div>
    );
  }

  const { byType, bySeverity } = stats;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <SafetyBanner />

      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* Header Hero */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                ศูนย์ข้อมูลและสถิติภาพรวมสถานการณ์ (Live Analytics)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              วิเคราะห์ความถี่เหตุการณ์ ระดับความรุนแรง และการมีส่วนร่วมของภาคประชาชนในกรุงเทพฯ
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 self-start sm:self-auto"
          >
            <MapPin className="w-4 h-4" />
            <span>เปิดดูบนแผนที่</span>
          </Link>
        </div>

        {/* Top Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">เหตุการณ์ Active ทั้งหมด</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
              {stats.activeCount}
            </p>
            <span className="text-[11px] text-slate-500">รายงานที่กำลังเกิดขึ้น</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">จุดน้ำท่วมขัง</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1">
              {byType.FLOOD || 0}
            </p>
            <span className="text-[11px] text-slate-500">ผิวจราจร & ซอย</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">การจราจรติดขัด</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
              {byType.TRAFFIC || 0}
            </p>
            <span className="text-[11px] text-slate-500">สายหลักกรุงเทพฯ</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">อุบัติเหตุบนท้องถนน</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-red-400 mt-1">
              {byType.ACCIDENT || 0}
            </p>
            <span className="text-[11px] text-slate-500">กีดขวางช่องทาง</span>
          </div>
        </div>

        {/* Charts & Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Breakdown */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>สัดส่วนเหตุการณ์ตามประเภท (Incident by Category)</span>
            </h3>

            <div className="space-y-2.5 pt-2">
              {Object.entries(byType).map(([key, count]: any) => {
                const cfg = INCIDENT_CONFIG[key as keyof typeof INCIDENT_CONFIG] || {
                  label: key,
                  icon: '📍',
                  markerHex: '#38bdf8',
                };
                const pct = stats.totalIncidents > 0 ? Math.round((count / stats.totalIncidents) * 100) : 0;

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </span>
                      <span className="font-mono text-slate-400 font-semibold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: cfg.markerHex }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>ระดับความรุนแรงของสถานการณ์ (Severity Breakdown)</span>
            </h3>

            <div className="space-y-2.5 pt-2">
              {Object.entries(bySeverity).map(([sevKey, count]: any) => {
                const sc = SEVERITY_CONFIG[sevKey as keyof typeof SEVERITY_CONFIG] || {
                  label: sevKey,
                  color: 'text-slate-300',
                  border: '',
                  bg: '',
                };
                const pct = stats.totalIncidents > 0 ? Math.round((count / stats.totalIncidents) * 100) : 0;

                return (
                  <div key={sevKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${sc.color}`}>
                        ระดับ {sc.label}
                      </span>
                      <span className="font-mono text-slate-400 font-semibold">
                        {count} จุด ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          sevKey === 'CRITICAL'
                            ? 'bg-red-500'
                            : sevKey === 'HIGH'
                            ? 'bg-orange-500'
                            : sevKey === 'MEDIUM'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-[11px] text-slate-400">
              💡 <strong>ข้อสังเกต:</strong> เหตุการณ์ระดับวิกฤตส่วนใหญ่เกิดจากอุบัติเหตุเฉี่ยวชนบนทางด่วนและน้ำท่วมขังระดับมิดฟุตบาทช่วงฝนตกหนัก
            </div>
          </div>
        </div>

        {/* Hotspot Areas in Bangkok */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>พื้นที่รายงานหนาแน่น (Current Incident Hotspots)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-xs text-cyan-400">เขตจตุจักร & ลาดพร้าว</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                ถนนรัชดาภิเษก, วิภาวดีรังสิต, ห้าแยกลาดพร้าว (น้ำท่วม & รถติดสะสม)
              </p>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-xs text-amber-400">เขตวัฒนา & สุขุมวิท</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                อโศกมนตรี, สุขุมวิท 71, รถไฟฟ้า BTS สุขุมวิท (ขบวนรถล่าช้า & ซอยน้ำขัง)
              </p>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-xs text-rose-400">เขตห้วยขวาง & พระราม 9</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                ถนนพระราม 9 แยก อสมท., ฟอร์จูนทาวน์ (อุบัติเหตุกีดขวางทาง)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
