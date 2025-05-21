'use client';
import Link from 'next/link';
import { useState } from 'react';

const sidebarItems = [
  {
    section: 'Groups',
    items: [
      { label: 'Invoice groups', href: '/billing/groups/invoice-groups' },
      { label: 'Payment groups', href: '/billing/groups/payment-groups' },
    ],
  },
  {
    section: 'Review',
    items: [
      { label: 'Work orders', href: '/billing/review/work-orders-old' },
      { label: 'Work orders v2', href: '/billing/review/work-orders' },
      { label: 'Late fees', href: '/billing/review/late-fees' },
      { label: 'Disposal tickets', href: '/billing/review/disposal-tickets' },
    ],
  },
  {
    section: 'Invoices',
    items: [
      { label: 'Create manual invoices', href: '/billing/invoices/create-manual' },
      { label: 'Create recurring invoices', href: '/billing/invoices/create-recurring' },
      { label: 'Invoices', href: '/billing/invoices' },
    ],
  },
  {
    section: 'Payments',
    items: [
      { label: 'Payments', href: '/billing/payments' },
    ],
  },
];

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen">
      <aside
        className={`bg-white border-r p-6 transition-all duration-300 relative flex flex-col ${collapsed ? 'w-8' : 'w-64'}`}
        style={{ minWidth: collapsed ? '2rem' : '16rem' }}
      >
        <div className="mb-8 flex items-center gap-2">
          {!collapsed && <span className="text-lg font-semibold text-gray-500">Billing</span>}
          <span className="ml-auto flex items-center gap-2">
            {!collapsed && (
              <span className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </span>
            )}
            <button
              className="p-1 rounded hover:bg-gray-100 transition"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{ position: collapsed ? 'absolute' : 'static', top: 16, right: 16, zIndex: 10 }}
            >
              {collapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              )}
            </button>
          </span>
        </div>
        {!collapsed && sidebarItems.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">{section.section}</div>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <Link key={item.label} href={item.href} className="px-2 py-1 rounded hover:bg-gray-100 text-gray-700">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
} 