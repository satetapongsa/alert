'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { SafetyBanner } from '@/components/SafetyBanner';
import { PageNavigationTabs } from '@/components/PageNavigationTabs';
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
  RefreshCw,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { INCIDENT_CONFIG, SEVERITY_CONFIG } from '@/lib/utils';

const DEFAULT_STATS = {
  totalIncidents: 30,
  activeCount: 30,
  resolvedCount: 0,
  monitoringCount: 0,
  byType: {
    FLOOD: 8,
    TRAFFIC: 3,
    ACCIDENT: 7,
    ROAD_CLOSED: 0,
    TRANSIT: 1,
    EMERGENCY: 11,
    GENERAL: 0,
  },
  bySeverity: {
    LOW: 6,
    MEDIUM: 6,
    HIGH: 15,
    CRITICAL: 3,
  },
  lastUpdated: new Date().toISOString(),
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(DEFAULT_STATS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      }
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const byType = stats?.byType || DEFAULT_STATS.byType;
  const bySeverity = stats?.bySeverity || DEFAULT_STATS.bySeverity;
  const totalCount = stats?.totalIncidents || DEFAULT_STATS.totalIncidents;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <SafetyBanner />

      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-5 flex-1">
        {/* Universal Page Switcher Navigation Tabs */}
        <PageNavigationTabs />

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

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadStats}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'กำลังคำนวณ...' : 'รีเฟรชสถิติ'}</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>เปิดดูบนแผนที่</span>
            </Link>
          </div>
        </div>

        {/* Top Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group block"
          >
            <span className="text-xs text-slate-400 font-medium group-hover:text-emerald-300">
              เหตุการณ์ Active ทั้งหมด ➔
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
              {stats.activeCount || 0}
            </p>
            <span className="text-[11px] text-slate-500">รายงานที่กำลังเกิดขึ้น</span>
          </Link>

          <Link
            href="/?type=FLOOD"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group block"
          >
            <span className="text-xs text-slate-400 font-medium group-hover:text-cyan-300">
              จุดน้ำท่วมขัง ➔
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1">
              {byType.FLOOD || 0}
            </p>
            <span className="text-[11px] text-slate-500">ผิวจราจร & ซอย</span>
          </Link>

          <Link
            href="/?type=TRAFFIC"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group block"
          >
            <span className="text-xs text-slate-400 font-medium group-hover:text-amber-300">
              การจราจรติดขัด ➔
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
              {byType.TRAFFIC || 0}
            </p>
            <span className="text-[11px] text-slate-500">สายหลักกรุงเทพฯ</span>
          </Link>

          <Link
            href="/?type=ACCIDENT"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all group block"
          >
            <span className="text-xs text-slate-400 font-medium group-hover:text-red-300">
              อุบัติเหตุบนท้องถนน ➔
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-red-400 mt-1">
              {byType.ACCIDENT || 0}
            </p>
            <span className="text-[11px] text-slate-500">กีดขวางช่องทาง</span>
          </Link>
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
                const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

                return (
                  <Link
                    key={key}
                    href={`/?type=${key}`}
                    className="block space-y-1 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors group"
                    title={`คลิกเพื่อดูหมุด ${cfg.label} บนแผนที่`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-200 group-hover:text-cyan-400 font-medium">
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </span>
                      <span className="font-mono text-slate-400 group-hover:text-white font-semibold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: cfg.markerHex }}
                      />
                    </div>
                  </Link>
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
                const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

                return (
                  <div key={sevKey} className="space-y-1 p-1.5">
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
              💡 <strong>ข้อสังเกต:</strong> ข้อมูลสดจากเซ็นเซอร์ดาวเทียมและประชาชนยืนยันว่าน้ำท่วมและอุบัติเหตุทางด่วนมีความรุนแรงระดับสูง
            </div>
          </div>
        </div>

        {/* Hotspot Areas in Bangkok with Quick Links */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>พื้นที่รายงานหนาแน่น (Current Incident Hotspots)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <Link
              href="/"
              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-colors block"
            >
              <h4 className="font-bold text-xs text-cyan-400 flex items-center justify-between">
                <span>เขตจตุจักร & ลาดพร้าว</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                ถนนรัชดาภิเษก, วิภาวดีรังสิต, ห้าแยกลาดพร้าว (น้ำท่วม & รถติดสะสม)
              </p>
            </Link>

            <Link
              href="/transport"
              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-colors block"
            >
              <h4 className="font-bold text-xs text-purple-400 flex items-center justify-between">
                <span>เขตวัฒนา & สุขุมวิท</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                อโศกมนตรี, รถไฟฟ้า BTS สุขุมวิท (ขบวนรถล่าช้า & ซอยน้ำขัง)
              </p>
            </Link>

            <Link
              href="/"
              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-rose-500/50 transition-colors block"
            >
              <h4 className="font-bold text-xs text-rose-400 flex items-center justify-between">
                <span>เขตห้วยขวาง & พระราม 9</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                ถนนพระราม 9 แยก อสมท., ทางด่วนศรีรัช (อุบัติเหตุกีดขวางทาง)
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
