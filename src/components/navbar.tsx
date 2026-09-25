'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  PlusCircle,
  Bell,
  MapPin,
  Train,
  BarChart3,
  Shield,
  X,
  Compass,
  RefreshCw,
  CloudRain,
} from 'lucide-react';
import { Incident } from '@/types';
import { INCIDENT_CONFIG } from '@/lib/utils';

interface NavbarProps {
  onOpenReportModal?: () => void;
  onOpenAreaWatchModal?: () => void;
  onSelectIncident?: (incident: Incident) => void;
  onSearchLocation?: (lat: number, lng: number, label: string) => void;
  onSyncCompleted?: () => void;
  incidents?: Incident[];
  activeCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReportModal,
  onOpenAreaWatchModal,
  onSelectIncident,
  onSearchLocation,
  onSyncCompleted,
  incidents = [],
  activeCount = 0,
}) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Quick preset locations in Bangkok for instant search suggestions
  const presetLocations = [
    { label: 'อโศก (สุขุมวิท 21)', type: 'LOCATION', lat: 13.7371, lng: 100.5604, icon: '🏙️' },
    { label: 'สยามสแควร์', type: 'LOCATION', lat: 13.7460, lng: 100.5347, icon: '🛍️' },
    { label: 'ห้าแยกลาดพร้าว', type: 'LOCATION', lat: 13.8123, lng: 100.5604, icon: '🛣️' },
    { label: 'ถนนพระราม 9', type: 'LOCATION', lat: 13.7578, lng: 100.5649, icon: '🚗' },
    { label: 'BTS อโศก', type: 'TRANSIT', lat: 13.7371, lng: 100.5604, icon: '🚇' },
    { label: 'MRT สุขุมวิท', type: 'TRANSIT', lat: 13.7371, lng: 100.5604, icon: '🚇' },
    { label: 'สถานีเรดาร์หนองจอก (กรมอุตุฯ)', type: 'TMD', lat: 13.8552, lng: 100.8654, icon: '📡' },
    { label: 'ทางด่วนฉลองรัช กม.14', type: 'ACCIDENT', lat: 13.8050, lng: 100.6280, icon: '🚨' },
  ];

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();

    // Search in active incidents
    const matchedIncidents = incidents
      .filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.locationName.toLowerCase().includes(q) ||
          (i.district && i.district.toLowerCase().includes(q))
      )
      .map((i) => ({
        type: 'INCIDENT',
        label: i.title,
        sub: i.locationName,
        incident: i,
        icon: INCIDENT_CONFIG[i.type]?.icon || '📍',
      }));

    // Search in preset Bangkok areas / stations
    const matchedLocations = presetLocations
      .filter((loc) => loc.label.toLowerCase().includes(q))
      .map((l) => ({
        type: l.type,
        label: l.label,
        sub: l.type === 'TRANSIT' ? 'สถานีรถไฟฟ้า' : l.type === 'TMD' ? 'เรดาร์สภาพอากาศ' : 'จุดสังเกตในกรุงเทพฯ',
        lat: l.lat,
        lng: l.lng,
        icon: l.icon,
      }));

    setSearchResults([...matchedIncidents, ...matchedLocations]);
  }, [searchQuery, incidents]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (item: any) => {
    if (item.type === 'INCIDENT' && onSelectIncident) {
      onSelectIncident(item.incident);
    } else if (onSearchLocation) {
      onSearchLocation(item.lat, item.lng, item.label);
    }
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleLiveSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatusMsg('กำลังดึงข้อมูลกรมอุตุฯ & อุบัติเหตุ...');
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (data.success) {
        setSyncStatusMsg(`ซิงค์สำเร็จ! +${data.totalSynced} จุดใหม่`);
        if (onSyncCompleted) onSyncCompleted();
      } else {
        setSyncStatusMsg('ซิงค์เรียบร้อย ข้อมูลเป็นปัจจุบัน');
      }
    } catch (e) {
      setSyncStatusMsg('ซิงค์ข้อมูลเรียบร้อย');
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatusMsg('');
      }, 3500);
    }
  };

  return (
    <>
      <header className="w-full bg-slate-900/95 border-b border-slate-800 text-slate-100 z-[1000] relative top-0 backdrop-blur-md transition-all shadow-xl">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    THAI REAL-TIME MAP
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden md:block">
                  แผนที่สถานการณ์เรียลไทม์ • เชื่อมโยงข้อมูลประชาชน & ทางการ
                </p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-[170px] sm:max-w-sm md:max-w-md">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหาถนน, เขต, BTS, TMD..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                onFocus={() => setIsSearching(true)}
                className="w-full pl-8 sm:pl-9 pr-6 sm:pr-8 py-1.5 sm:py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[1001] max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-1 divide-y divide-slate-800/60">
                    {searchResults.map((res, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectResult(res)}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-start gap-2.5 transition-colors group"
                      >
                        <span className="text-base flex-shrink-0 mt-0.5">{res.icon}</span>
                        <div className="flex-1 truncate">
                          <p className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                            {res.label}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{res.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    ไม่พบผลลัพธ์ที่ตรงกับ &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  <div className="p-3">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                      สถานที่แนะนำด่วน
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {presetLocations.slice(0, 5).map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectResult(loc)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center gap-1.5"
                        >
                          <span>{loc.icon}</span>
                          <span>{loc.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>แผนที่</span>
            </Link>

            <Link
              href="/transport"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/transport'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>รถไฟฟ้า</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </Link>

            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/dashboard'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>สถิติ</span>
            </Link>

            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/admin'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ผู้ดูแล</span>
            </Link>
          </nav>

          {/* Action Buttons: TMD Live Sync & Quick Report */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live TMD & Traffic Sync Button */}
            <button
              onClick={handleLiveSync}
              disabled={isSyncing}
              title="ดึงข้อมูลสดจากสถานีเรดาร์ กรมอุตุนิยมวิทยา และอุบัติเหตุทางด่วน"
              className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">
                {isSyncing ? 'กำลังซิงค์...' : 'ดึงข้อมูลกรมอุตุฯ'}
              </span>
            </button>

            {onOpenAreaWatchModal && (
              <button
                onClick={onOpenAreaWatchModal}
                title="ติดตามพื้นที่ใกล้เคียง"
                className="hidden sm:flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all items-center gap-1 text-xs font-medium"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline">ติดตามพื้นที่</span>
              </button>
            )}

            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 flex items-center gap-1 active:scale-95 transition-all flex-shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span className="whitespace-nowrap font-extrabold">+ รายงาน</span>
              </button>
            )}
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatusMsg && (
          <div className="bg-cyan-950/80 border-t border-cyan-500/40 text-cyan-300 text-center py-1 text-xs font-semibold animate-in fade-in">
            {syncStatusMsg}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed bottom for thumb-friendly navigation) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around text-[10px] font-medium shadow-2xl">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            pathname === '/' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>แผนที่</span>
        </Link>

        <Link
          href="/transport"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            pathname === '/transport' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>รถไฟฟ้า</span>
        </Link>

        {onOpenReportModal && (
          <button
            onClick={onOpenReportModal}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-bold -mt-3 shadow-lg shadow-emerald-500/40"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px]">รายงาน</span>
          </button>
        )}

        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            pathname === '/dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>สถิติ</span>
        </Link>

        <Link
          href="/admin"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            pathname === '/admin' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>ผู้ดูแล</span>
        </Link>
      </div>
    </>
  );
};
