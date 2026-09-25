'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MapPin, Train, BarChart3, Shield } from 'lucide-react';

export const PageNavigationTabs: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    {
      href: '/',
      label: 'แผนที่สด (Live Map)',
      icon: MapPin,
      activeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
    {
      href: '/transport',
      label: 'รถไฟฟ้า (BTS/MRT)',
      icon: Train,
      activeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      href: '/dashboard',
      label: 'สถิติภาพรวม (Analytics)',
      icon: BarChart3,
      activeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      href: '/admin',
      label: 'ผู้ดูแลระบบ (Admin)',
      icon: Shield,
      activeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20',
      iconColor: 'text-rose-400',
    },
  ];

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    // Hard navigate unconditionally to bypass any client-side router locks
    window.location.href = href;
  };

  return (
    <nav className="flex items-center gap-1.5 p-1 bg-slate-900/95 border border-slate-800 rounded-2xl w-fit max-w-full overflow-x-auto shadow-xl backdrop-blur-md flex-shrink-0 z-[600]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <a
            key={tab.href}
            href={tab.href}
            onClick={(e) => handleNavigate(e, tab.href)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border cursor-pointer select-none ${
              isActive
                ? tab.activeColor
                : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? tab.iconColor : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

