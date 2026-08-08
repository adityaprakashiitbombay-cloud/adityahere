import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Plus, CheckCircle2, Globe, X, Clock, Activity, Search, RefreshCw, Trash2 } from 'lucide-react';
import { fetchRealVisitorSessions, clearRealVisitorSessions, formatDuration } from '../../lib/supabaseClient';

export default function AdminVaultPanel({
  isAdminUnlocked,
  isLiveEditActive,
  toggleLiveEdit,
  feedKey,
  setFeedKey,
  feedVal,
  setFeedVal,
  feedSuccess,
  onAddFact
}) {
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminUnlocked) return null;

  const handleOpenVisitorModal = async () => {
    setIsLoading(true);
    setShowVisitorModal(true);
    const data = await fetchRealVisitorSessions();
    setSessions(data || []);
    setIsLoading(false);
  };

  const handleClearSessions = async () => {
    if (window.confirm('Clear all 100 recorded visitor logs from database?')) {
      await clearRealVisitorSessions();
      setSessions([]);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.ip || '').toLowerCase().includes(q) ||
      (s.location || '').toLowerCase().includes(q) ||
      (s.device || '').toLowerCase().includes(q) ||
      (s.isp || '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-4 bg-[#000000] border-3 border-[#39FF14] p-4 shadow-[4px_4px_0px_0px_#39FF14] font-mono space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-black text-[#39FF14]">
          <span className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#39FF14]" /> ADMIN OVERRIDE ACTIVE [ALPHA1845]
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenVisitorModal}
              className="bg-[#00E5FF] text-black px-2.5 py-1 font-black uppercase text-xs border border-white shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer active:scale-95 transition-transform flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" /> 🌐 VISITORS TABLE (100 LOGS)
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('openAdminModal', { detail: 'hero' }))}
              className="bg-[#39FF14] text-black px-2.5 py-1 font-black uppercase text-xs border border-white shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer active:scale-95 transition-transform"
            >
              ✏️ EDIT ALL TABS
            </button>
          </div>
        </div>

        <form onSubmit={onAddFact} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-neutral-800">
          <input
            type="text"
            placeholder="Topic / Key (e.g. 'favorite book', 'dream college')"
            value={feedKey}
            onChange={(e) => setFeedKey(e.target.value)}
            className="sm:col-span-4 brutal-input p-2 text-xs font-mono bg-[#000000]"
            required
          />
          <input
            type="text"
            placeholder="Fact / Answer to feed into AI memory..."
            value={feedVal}
            onChange={(e) => setFeedVal(e.target.value)}
            className="sm:col-span-6 brutal-input p-2 text-xs font-mono bg-[#000000]"
            required
          />
          <button
            type="submit"
            className="sm:col-span-2 brutal-btn bg-[#39FF14] text-black font-bold p-2 text-xs flex items-center justify-center gap-1 font-mono cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> FEED FACT
          </button>
        </form>

        {feedSuccess && (
          <div className="mt-2 text-xs text-[#39FF14] font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {feedSuccess}
          </div>
        )}
      </motion.div>

      {/* 100-Visitor Full-Screen Telemetry Modal */}
      <AnimatePresence>
        {showVisitorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 font-mono"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#050505] border-3 border-[#00E5FF] w-full max-w-5xl max-h-[82vh] flex flex-col shadow-[8px_8px_0px_0px_#00E5FF] overflow-hidden"
            >
              {/* Header Bar */}
              <div className="bg-[#111111] border-b-2 border-[#00E5FF] p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#00E5FF] animate-pulse" />
                  <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                    🌐 REAL VISITOR AUDIT TRAIL ({sessions.length}/100 CAPACITY)
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      const d = await fetchRealVisitorSessions();
                      setSessions(d || []);
                      setIsLoading(false);
                    }}
                    className="bg-[#111] text-[#00E5FF] border border-[#00E5FF] px-2.5 py-1 text-xs font-bold flex items-center gap-1 hover:bg-[#00E5FF] hover:text-black cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH
                  </button>

                  <button
                    onClick={handleClearSessions}
                    className="bg-[#111] text-red-400 border border-red-500 px-2.5 py-1 text-xs font-bold flex items-center gap-1 hover:bg-red-500 hover:text-black cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> PURGE LOGS
                  </button>

                  <button
                    onClick={() => setShowVisitorModal(false)}
                    className="bg-red-500 text-black border border-white p-1 font-bold cursor-pointer hover:scale-105"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-3 bg-black border-b border-neutral-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#00E5FF]" />
                <input
                  type="text"
                  placeholder="Filter by IP, location, device or ISP..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-black border border-neutral-700 p-1.5 text-xs text-white w-full focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Scrollable Visitor Sessions Table */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 text-xs font-bold">
                    No matching visitor sessions recorded yet.
                  </div>
                ) : (
                  filteredSessions.map((s, idx) => {
                        const devCode = s.deviceId || `DEV-${s.id?.slice(-6) || 'LOCAL'}`;
                        const visits = s.visitCount || 1;
                        const tasks = s.totalActionsCount || (Array.isArray(s.activities) ? s.activities.length : 1);
                        const dwellStr = formatDuration(s.totalDwellSeconds || s.duration_seconds || 1);
                        const firstSeen = s.firstSeen ? new Date(s.firstSeen).toLocaleString() : new Date(s.timestamp || Date.now()).toLocaleString();
                        const lastActive = s.lastSeen ? new Date(s.lastSeen).toLocaleString() : 'Just now';

                        return (
                          <div
                            key={s.id || idx}
                            className="bg-black border border-neutral-800 p-3 hover:border-[#00E5FF] transition-colors space-y-2 font-mono"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-neutral-800 pb-2">
                              <div className="flex flex-wrap items-center gap-2 max-w-full overflow-hidden">
                                <span className="bg-[#00E5FF] text-black font-black px-2 py-0.5 text-[10px] shrink-0">
                                  {devCode}
                                </span>
                                <span className="bg-[#39FF14] text-black font-black px-1.5 py-0.5 text-[10px] shrink-0">
                                  📊 {visits} VISITS
                                </span>
                                <span className="font-bold text-white text-xs shrink-0">IP: {s.ip}</span>
                                <span className="text-[#39FF14] font-bold text-[11px] max-w-sm sm:max-w-md truncate shrink" title={s.location}>
                                  📍 {s.location}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="bg-[#111] border border-[#FFE600] px-2 py-0.5 text-[#FFE600] font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#FFE600]" /> CUMULATIVE DWELL: {dwellStr}
                                </span>
                                <span className="bg-[#111] border border-[#00E5FF] px-2 py-0.5 text-[#00E5FF] font-bold">
                                  ⚡ {tasks} TASKS
                                </span>
                              </div>
                            </div>

                            {/* Device, Network & Time History Details */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 border-b border-neutral-900 pb-1.5">
                              <div className="flex items-center gap-3">
                                <span>📱 Device: <strong className="text-white">{s.device}</strong></span>
                                <span>⚡ ISP: <strong className="text-white">{s.isp || 'Telecom Net'}</strong></span>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                                <span>🗓️ First Seen: <strong className="text-neutral-300">{firstSeen}</strong></span>
                                <span>🕒 Last Active: <strong className="text-[#39FF14]">{lastActive}</strong></span>
                              </div>
                            </div>

                            {/* Real-time Interaction Activity Trail */}
                            <div className="bg-[#090909] border border-neutral-900 p-2 text-[11px] space-y-1">
                              <div className="text-[10px] text-[#00E5FF] font-bold flex items-center gap-1 uppercase tracking-wider">
                                <Activity className="w-3 h-3 text-[#00E5FF]" /> MULTI-SESSION DEVICE TASK & ACTIVITY TRAIL ({Array.isArray(s.activities) ? s.activities.length : 0} logs):
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 max-h-36 overflow-y-auto">
                                {Array.isArray(s.activities) && s.activities.length > 0 ? (
                                  s.activities.map((act, actIdx) => (
                                    <span
                                      key={actIdx}
                                      className="bg-[#111111] border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 font-mono"
                                    >
                                      {act}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-neutral-500 italic text-[10px]">📍 Active session on page</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

