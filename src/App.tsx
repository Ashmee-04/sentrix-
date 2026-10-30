/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Role, UserProfile, EmergencyCategory } from './types';
import { StorageService } from './services/storage';
import { SupportedLanguage } from './i18n/translations';

// Common Components
import { Header } from './components/common/Header';
import { DemoBanner } from './components/common/DemoBanner';
import { Navigation } from './components/common/Navigation';
import { LockScreenModal } from './components/common/LockScreenModal';
import { QuickExitModal } from './components/common/QuickExitModal';
import { FloatingSosButton } from './components/common/FloatingSosButton';

// Citizen Views
import { HomeView } from './components/citizen/HomeView';
import { EmergencySosModal } from './components/citizen/EmergencySosModal';
import { LocationShareView } from './components/citizen/LocationShareView';
import { TransportSafetyView } from './components/citizen/TransportSafetyView';
import { CivicReportsView } from './components/citizen/CivicReportsView';
import { MyReportsView } from './components/citizen/MyReportsView';
import { WomensSafetyView } from './components/citizen/WomensSafetyView';
import { KnowYourLawsView } from './components/citizen/KnowYourLawsView';
import { GovtDirectoryView } from './components/citizen/GovtDirectoryView';
import { HazardMapView } from './components/citizen/HazardMapView';
import { NotificationsView } from './components/citizen/NotificationsView';
import { ProfileView } from './components/citizen/ProfileView';

// Responder / Admin Operations Dashboard
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [role, setRole] = useState<Role>('citizen');
  const [citizenTab, setCitizenTab] = useState<string>('home');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [user, setUser] = useState<UserProfile>(StorageService.getUserProfile());

  // Modal states
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosCategory, setSosCategory] = useState<EmergencyCategory>('road_accident');
  const [isLockScreenOpen, setIsLockScreenOpen] = useState(false);
  const [isQuickExitOpen, setIsQuickExitOpen] = useState(false);

  // Notifications badge
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = () => {
    const notifs = StorageService.getNotifications();
    setUnreadCount(notifs.filter((n) => !n.isRead).length);
  };

  useEffect(() => {
    refreshUnread();
    const interval = setInterval(refreshUnread, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenSos = (cat?: EmergencyCategory) => {
    if (cat) setSosCategory(cat);
    else setSosCategory('road_accident');
    setIsSosModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#34434A] flex flex-col font-sans selection:bg-[#DCE8DF] selection:text-[#2F5952]">
      {/* Simulation & Demo Mode Banner */}
      <DemoBanner onDataReset={refreshUnread} />

      {/* Main Responsive Header */}
      <Header
        currentRole={role}
        onRoleChange={(newRole) => setRole(newRole)}
        language={language}
        onLanguageChange={(newLang) => setLanguage(newLang)}
        unreadCount={unreadCount}
        onOpenNotifications={() => {
          setRole('citizen');
          setCitizenTab('notifications');
        }}
        onOpenLockScreenModal={() => setIsLockScreenOpen(true)}
        onTriggerQuickExit={() => setIsQuickExitOpen(true)}
        onOpenProfile={() => {
          setRole('citizen');
          setCitizenTab('profile');
        }}
        onTriggerSos={() => handleOpenSos()}
      />

      {/* Navigation (Only shown for Citizen portal) */}
      {role === 'citizen' && (
        <Navigation
          currentTab={citizenTab}
          onSelectTab={(tabId) => setCitizenTab(tabId)}
          language={language}
          unreadCount={unreadCount}
          onTriggerSos={() => handleOpenSos()}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {role === 'responder' ? (
          <AdminDashboard />
        ) : (
          <>
            {citizenTab === 'home' && (
              <HomeView
                user={user}
                onOpenSosModal={handleOpenSos}
                onNavigateTab={(tab) => setCitizenTab(tab)}
                onOpenLockScreen={() => setIsLockScreenOpen(true)}
              />
            )}

            {citizenTab === 'hazard_map' && <HazardMapView />}

            {citizenTab === 'transport_safety' && (
              <TransportSafetyView
                user={user}
                onReportSubmitted={() => {
                  refreshUnread();
                  setCitizenTab('my_reports');
                }}
              />
            )}

            {citizenTab === 'civic_reports' && (
              <CivicReportsView
                user={user}
                onReportSubmitted={() => {
                  refreshUnread();
                  setCitizenTab('my_reports');
                }}
              />
            )}

            {citizenTab === 'location_share' && <LocationShareView user={user} />}

            {citizenTab === 'womens_safety' && (
              <WomensSafetyView
                onTriggerQuickExit={() => setIsQuickExitOpen(true)}
                onOpenSosModal={handleOpenSos}
              />
            )}

            {citizenTab === 'know_laws' && <KnowYourLawsView />}

            {citizenTab === 'govt_directory' && <GovtDirectoryView />}

            {citizenTab === 'my_reports' && <MyReportsView />}

            {citizenTab === 'notifications' && (
              <NotificationsView
                onSelectReportTarget={(reportId) => {
                  setCitizenTab('my_reports');
                }}
              />
            )}

            {citizenTab === 'profile' && (
              <ProfileView
                user={user}
                onUpdateUser={(updated) => setUser(updated)}
                onRoleSwitch={(newRole) => setRole(newRole)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating SOS Trigger in citizen view */}
      {role === 'citizen' && citizenTab !== 'home' && (
        <FloatingSosButton onTriggerSos={() => handleOpenSos()} />
      )}

      {/* Emergency SOS Modal Workflow */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        user={user}
        initialCategory={sosCategory}
        onSosDispatched={() => {
          refreshUnread();
        }}
      />

      {/* Lock-screen Mode Simulation Modal */}
      <LockScreenModal
        isOpen={isLockScreenOpen}
        onClose={() => setIsLockScreenOpen(false)}
        user={user}
        onTriggerSos={() => handleOpenSos()}
      />

      {/* Quick Exit Neutral Decoy Screen */}
      <QuickExitModal
        isOpen={isQuickExitOpen}
        onReturn={() => setIsQuickExitOpen(false)}
      />
    </div>
  );
}
