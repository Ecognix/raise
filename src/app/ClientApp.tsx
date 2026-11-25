'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#070D18] text-slate-300 text-sm">
      Loading RAISE Command Centre...
    </div>
  ),
});

export default function ClientApp() {
  return <App />;
}
