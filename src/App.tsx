/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner } from './components/common/DemoBanner';
import { HomePage } from './components/home/HomePage';
import { AuthModal } from './components/auth/AuthModal';
import { ResearcherDashboard } from './components/dashboard/ResearcherDashboard';
import { ProviderDashboard } from './components/dashboard/ProviderDashboard';
import { DeliveryDashboard } from './components/dashboard/DeliveryDashboard';
import { LiveQrScanner } from './components/scanner/LiveQrScanner';

const AppContent: React.FC = () => {
  const { activeView, user, isScannerOpen, scannerRole, scannerAction, closeScanner } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. Interactive Demo Role Selector Banner (Horizontal, Responsive, Visible) */}
      <DemoBanner />

      {/* 2. Main View Router */}
      <main className="flex-1">
        {/* If live scanner is active */}
        {isScannerOpen && scannerRole ? (
          <LiveQrScanner scannerRole={scannerRole} action={scannerAction} onBack={closeScanner} />
        ) : activeView === 'dashboard' && user ? (
          /* Role-Specific Dashboards */
          user.role === 'researcher' ? (
            <ResearcherDashboard />
          ) : user.role === 'provider' ? (
            <ProviderDashboard />
          ) : (
            <DeliveryDashboard />
          )
        ) : (
          /* DEFAULT & FIRST PAGE: Public Homepage */
          <HomePage />
        )}
      </main>

      {/* 3. Global Authentication Modal (Login / Sign Up) */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
