'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Home, LogOut, FileText, Calculator, PieChart, Users, Briefcase } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { label: 'ダッシュボード', href: '/', icon: Home },
    { label: '稼働管理', href: '/work-log', icon: FileText },
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-700">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-xs text-center'}`}>
            A-Career
          </h1>
          <p className={`text-xs text-gray-400 ${sidebarOpen ? '' : 'hidden'}`}>
            Business OS
          </p>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          {navItems.map((item, idx) => {
            const IconComponent = item.icon;
            const SubIconComponent = item.submenu?.[0]?.icon;
            return (
            <div key={idx}>
              {item.submenu ? (
                <details className="group">
                  <summary className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 text-sm">
                    {SubIconComponent && (
                      <SubIconComponent size={20} className="flex-shrink-0" />
                    )}
                    {sidebarOpen && item.label}
                  </summary>
                  <div className="pl-8 mt-2 space-y-1">
                    {item.submenu.map((sub, sidx) => (
                      <Link
                        key={sidx}
                        href={sub.href}
                        className="block text-xs px-3 py-2 rounded hover:bg-gray-800 text-gray-300"
                      >
                        {sidebarOpen && sub.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 text-sm text-gray-300 hover:text-white transition"
                >
                  {IconComponent && <IconComponent size={20} className="flex-shrink-0" />}
                  {sidebarOpen && item.label}
                </Link>
              )}
            </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>

            <div className="text-sm text-gray-600">
              <span>最終更新: {new Date().toLocaleString('ja-JP')}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-3 text-xs text-gray-500">
          <p>A-Career Business OS v1.0 | Powered by Google Sheets + GAS + Next.js</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
