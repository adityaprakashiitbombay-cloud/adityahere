import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Edit3, Lock, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { usePortfolio } from '../../hooks/usePortfolio';
import AdminEditModal from './AdminEditModal';

export default function AdminFloatingToolbar() {
  const { isAdmin, lockAdmin, resetDefaults, saveStatus } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('hero');

  useEffect(() => {
    const handleOpenModal = (e) => {
      setInitialTab(e?.detail || 'hero');
      setModalOpen(true);
    };

    window.addEventListener('openAdminModal', handleOpenModal);
    return () => window.removeEventListener('openAdminModal', handleOpenModal);
  }, []);

  if (!isAdmin) return null;

  const openEditorForTab = (tab = 'hero') => {
    setInitialTab(tab);
    setModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-4 sm:bottom-6 mb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-[#000000] border-3 border-[#39FF14] p-3 shadow-[6px_6px_0px_0px_#39FF14] font-mono text-xs text-white"
      >
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Admin Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39FF14]" />
            </span>
            <div className="flex items-center gap-1.5 font-black text-[#39FF14]">
              <ShieldCheck className="w-4 h-4 text-[#39FF14]" />
              <span>ADMIN ACTIVE</span>
              <span className="bg-[#39FF14] text-black px-1.5 py-0.2 text-[9px] font-bold uppercase">
                ALPHA1845
              </span>
            </div>
            {saveStatus && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#00E5FF] font-bold">
                <Database className="w-3 h-3" /> {saveStatus}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditorForTab('hero')}
              className="bg-[#39FF14] hover:bg-[#4fff2e] text-black font-black px-3 py-1.5 text-xs flex items-center gap-1.5 border border-white shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer active:scale-95 transition-transform"
              title="Edit all tabs and content"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>EDIT ALL TABS</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Restore original portfolio values?')) {
                  resetDefaults();
                }
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-2 py-1.5 text-[10px] font-bold border border-neutral-700 flex items-center gap-1 cursor-pointer"
              title="Reset portfolio to default baseline"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">RESET</span>
            </button>

            <button
              onClick={lockAdmin}
              className="bg-red-950/80 hover:bg-red-900 text-red-300 font-bold px-2.5 py-1.5 text-[10px] border border-red-700 flex items-center gap-1 cursor-pointer"
              title="Lock Admin Mode & Logout"
            >
              <Lock className="w-3 h-3" />
              <span>LOCK</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Full Server CMS Modal */}
      <AnimatePresence>
        {modalOpen && (
          <AdminEditModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            initialTab={initialTab}
          />
        )}
      </AnimatePresence>
    </>
  );
}
