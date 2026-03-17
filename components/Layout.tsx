'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Home, FileText, Calculator, PieChart, LogOut, Users, Briefcase, Smartphone, Wrench, Flame, MoreHorizontal } from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon?: any;
  submenu?: { label: string; href: string; icon?: any }[];
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: 'ダッシュボード', href: '/', icon: Home },
    {
      label: '稼働管理',
      icon: FileText,
      submenu: [
        { label: '全体', href: '/work-log', icon: FileText },
        { label: '携帯販売 週末', href: '/work-log/mobile-weekend', icon: Smartphone },
        { label: '携帯販売 業務委託', href: '/work-log/mobile-outsource', icon: Smartphone },
        { label: 'リフォーム', href: '/work-log/reform', icon: Wrench },
        { label: 'ガス営業', href: '/work-log/gas-sales', icon: Flame },
        { label: 'その他', href: '/work-log/other', icon: MoreHorizontal },
      ],
    },
    { label: '月次サマリー', href: '/monthly', icon: Calculator },
    { label: '請求管理', href: '/billing', icon: PieChart },
    { label: '支払確認', href: '/payment-check', icon: LogOut },
    {
      label: 'マスター管理',
      submenu: [
        { label: '人材', href: '/master/people', icon: Users },
        { label: '案件', href: '/master/projects', icon: Briefcase },
        { label: '取引先', href: '/master/clients', icon: Users },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;
  const isSubmenuActive = (submenu: { href: string }[]) =>
    submenu.some((s) => pathname === s.href || pathname.startsWith(s.href + '/'));

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 overflow-y-auto flex-shrink-0`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-xs text-center'}`}>A-Career</h1>
          <p className={`text-xs text-gray-400 ${sidebarOpen ? '' : 'hidden'}`}>Business OS</p>
        </div>

        <nav className="mt-6 space-y-1 px-2">
          {navItems.map((item, idx) => {
            const IconComponent = item.icon;

            if (item.submenu) {
              const active = isSubmenuActive(item.submenu);
              return (
                <details key={idx} className="group" open={active}>
                  <summary className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded text-sm transition ${active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                    {IconComponent && <IconComponent size={18} className="flex-shrink-0" />}
                    {sidebarOpen && <span className="flex-1">{item.label}</span>}
                  </summary>
                  {sidebarOpen && (
                    <div className="pl-6 mt-1 space-y-0.5 border-l border-gray-700 ml-5">
                      {item.submenu.map((sub, sidx) => {
                        const SubIcon = sub.icon;
                        const subActive = isActive(sub.href);
                        return (
                          <Link key={sidx} href={sub.href} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded transition ${subActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            {SubIcon && <SubIcon size={14} className="flex-shrink-0" />}
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </details>
              );
            }

            return (
              <Link key={idx} href={item.href!} className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition ${isActive(item.href!) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                {IconComponent && <IconComponent size={18} className="flex-shrink-0" />}
                {sidebarOpen && item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded hover:bg-gray-100"><Menu size={24} /></button>
            <div className="text-sm text-gray-600">最終更新: {new Date().toLocaleString('ja-JP')}</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
        <footer className="bg-white border-t border-gray-200 px-6 py-3 text-xs text-gray-500">A-Career Business OS v1.1 | Powered by Google Sheets + GAS + Next.js</footer>
      </div>
    </div>
  );
};

export default Layout;
