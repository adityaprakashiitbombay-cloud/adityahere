import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [selectedVisitor, setSelectedVisitor] = useState(null);
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
      setSelectedVisitor(null);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const q = search.toLowerCase();
    const locsStr = Array.isArray(s.locationsHistory) ? s.locationsHistory.join(' ').toLowerCase() : '';
    const actsStr = Array.isArray(s.activities) ? s.activities.join(' ').toLowerCase() : '';
    return (
      (s.deviceId || '').toLowerCase().includes(q) ||
      (s.ip || '').toLowerCase().includes(q) ||
      (s.location || '').toLowerCase().includes(q) ||
      locsStr.includes(q) ||
      actsStr.includes(q) ||
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
              <Globe className="w-3.5 h-3.5" /> 🌐 VISITORS TABLE ({sessions.length} PROFILES)
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

      {/* 100-Visitor Full-Screen Telemetry Directory Modal */}
      {showVisitorModal && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-mono"
          >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-[#050505] border-3 border-[#00E5FF] w-full max-w-5xl max-h-[88vh] flex flex-col shadow-[8px_8px_0px_0px_#00E5FF] overflow-hidden relative z-[999999]"
              >
              {/* Header Bar */}
              <div className="bg-[#111111] border-b-2 border-[#00E5FF] p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#00E5FF] animate-pulse" />
                  <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                    🌐 VISITOR DATA DIRECTORY & PROFILE MANAGER ({sessions.length} DEVICELOGS)
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

              {/* Search & Summary Stats Bar */}
              <div className="p-3 bg-black border-b border-neutral-800 space-y-2">
                {/* HUD Summary Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-[#111111] border border-neutral-800 p-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#00E5FF]" />
                    <div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase">Devices</div>
                      <div className="text-sm font-black text-white">{sessions.length} TRACKED</div>
                    </div>
                  </div>
                  <div className="bg-[#111111] border border-neutral-800 p-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#39FF14]" />
                    <div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase">Total Visits</div>
                      <div className="text-sm font-black text-[#39FF14]">
                        {sessions.reduce((acc, curr) => acc + (curr.visitCount || 1), 0)} SESSIONS
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111111] border border-neutral-800 p-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FFE600]" />
                    <div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase">Cumul. Dwell</div>
                      <div className="text-sm font-black text-[#FFE600]">
                        {formatDuration(sessions.reduce((acc, curr) => acc + (curr.totalDwellSeconds || curr.duration_seconds || 1), 0))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111111] border border-neutral-800 p-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#FF0055]" />
                    <div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase">Filtered</div>
                      <div className="text-sm font-black text-[#FF0055]">{filteredSessions.length} MATCHES</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Search className="w-4 h-4 text-[#00E5FF]" />
                  <input
                    type="text"
                    placeholder="Filter by Device ID, IP, location history, ISP or activity logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#050505] border border-neutral-700 p-2 text-xs text-white w-full focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Master Visitor Directory List */}
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

                        const locHistory = Array.isArray(s.locationsHistory) && s.locationsHistory.length > 0
                          ? s.locationsHistory
                          : [s.location];

                        return (
                          <div
                            key={s.id || idx}
                            className="bg-black border border-neutral-800 p-3.5 hover:border-[#00E5FF] transition-colors space-y-3 font-mono"
                          >
                            {/* Card Top Header & Main Info */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-[#00E5FF] text-black font-black px-2 py-0.5 text-xs">
                                  {devCode}
                                </span>
                                <span className="bg-[#39FF14] text-black font-black px-2 py-0.5 text-xs">
                                  📊 {visits} VISITS
                                </span>
                                <span className="font-bold text-white text-xs">IP: {s.ip}</span>
                                <span className="text-[#39FF14] font-bold text-xs">
                                  📍 {s.location}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedVisitor(s)}
                                className="bg-[#39FF14] text-black px-3 py-1 text-xs font-black uppercase border border-white shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer hover:scale-105 transition-transform flex items-center gap-1"
                              >
                                🔍 VIEW FULL VISITOR PROFILE & LOGS
                              </button>
                            </div>

                            {/* Summary Metadata Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-300">
                              <div className="bg-[#080808] border border-neutral-900 p-2">
                                <span className="text-neutral-500 font-bold block text-[10px]">DEVICE / BROWSER:</span>
                                <span className="text-white font-bold">{s.device}</span>
                              </div>
                              <div className="bg-[#080808] border border-neutral-900 p-2">
                                <span className="text-neutral-500 font-bold block text-[10px]">NETWORK ISP:</span>
                                <span className="text-white font-bold">{s.isp || 'Telecom Carrier'}</span>
                              </div>
                              <div className="bg-[#080808] border border-neutral-900 p-2">
                                <span className="text-neutral-500 font-bold block text-[10px]">TIME FRAME:</span>
                                <span className="text-[#39FF14] font-bold text-[11px]">{firstSeen} → {lastActive}</span>
                              </div>
                            </div>

                            {/* Recent Activity Snapshot */}
                            <div className="bg-[#060606] border border-neutral-900 p-2 text-xs space-y-1">
                              <div className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-wider flex items-center justify-between">
                                <span>⚡ RECENT INTERACTION LOGS ({Array.isArray(s.activities) ? s.activities.length : 0}):</span>
                                <span className="text-neutral-500">CUMULATIVE DWELL: {dwellStr}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 max-h-20 overflow-y-auto">
                                {Array.isArray(s.activities) && s.activities.length > 0 ? (
                                  s.activities.slice(-5).map((act, actIdx) => (
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
        </AnimatePresence>,
        document.body
      )}

    {/* Dedicated Single Visitor Profile Inspector Modal */}
    {typeof document !== 'undefined' && selectedVisitor && createPortal(
      <div className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-mono">
        <div className="bg-[#050505] border-3 border-[#39FF14] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#39FF14] overflow-hidden relative">
          {/* Inspector Header */}
          <div className="bg-[#111111] border-b-2 border-[#39FF14] p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#39FF14] text-black font-black px-2 py-0.5 text-xs">
                {selectedVisitor.deviceId || 'DEV-PROFILE'}
              </span>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                INSPECT VISITOR DEVICE PROFILE & ACTIVITY TIMELINE
              </h2>
            </div>

            <button
              onClick={() => setSelectedVisitor(null)}
              className="bg-red-500 text-black border border-white p-1 font-bold cursor-pointer hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Inspector Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Overview HUD Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#111111] border border-neutral-800 p-3 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">TOTAL VISITS</span>
                <span className="text-base font-black text-[#39FF14]">{selectedVisitor.visitCount || 1} SESSIONS</span>
              </div>
              <div className="bg-[#111111] border border-neutral-800 p-3 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">CUMULATIVE DWELL</span>
                <span className="text-base font-black text-[#FFE600]">{formatDuration(selectedVisitor.totalDwellSeconds || selectedVisitor.duration_seconds || 1)}</span>
              </div>
              <div className="bg-[#111111] border border-neutral-800 p-3 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">TOTAL ACTIONS</span>
                <span className="text-base font-black text-[#00E5FF]">{selectedVisitor.totalActionsCount || (Array.isArray(selectedVisitor.activities) ? selectedVisitor.activities.length : 1)} LOGS</span>
              </div>
              <div className="bg-[#111111] border border-neutral-800 p-3 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">PRIMARY IP</span>
                <span className="text-base font-black text-white">{selectedVisitor.ip}</span>
              </div>
            </div>

            {/* Hardware & Network Carrier Specs */}
            <div className="bg-[#090909] border border-neutral-800 p-3.5 space-y-2 text-xs">
              <h3 className="text-[#00E5FF] font-black uppercase text-xs border-b border-neutral-800 pb-1.5">
                📱 HARDWARE, DEVICE & NETWORK SPECIFICATIONS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-neutral-500 font-bold block text-[10px]">OPERATING SYSTEM / BROWSER:</span>
                  <span className="text-white font-bold">{selectedVisitor.device}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-bold block text-[10px]">INTERNET SERVICE PROVIDER (ISP):</span>
                  <span className="text-white font-bold">{selectedVisitor.isp || 'Telecom Carrier'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-bold block text-[10px]">FIRST VISIT DATE & TIME:</span>
                  <span className="text-neutral-300 font-bold">{selectedVisitor.firstSeen ? new Date(selectedVisitor.firstSeen).toLocaleString() : 'First Visit Recorded'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-bold block text-[10px]">LAST ACTIVE DATE & TIME:</span>
                  <span className="text-[#39FF14] font-bold">{selectedVisitor.lastSeen ? new Date(selectedVisitor.lastSeen).toLocaleString() : 'Just now'}</span>
                </div>
              </div>
            </div>

            {/* All Visited Locations */}
            <div className="bg-[#090909] border border-neutral-800 p-3.5 space-y-2 text-xs">
              <h3 className="text-[#FFE600] font-black uppercase text-xs border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                <span>🌍 ALL RECORDED VISITED LOCATIONS ({Array.isArray(selectedVisitor.locationsHistory) ? selectedVisitor.locationsHistory.length : 1})</span>
              </h3>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {Array.isArray(selectedVisitor.locationsHistory) && selectedVisitor.locationsHistory.length > 0 ? (
                  selectedVisitor.locationsHistory.map((loc, lIdx) => (
                    <span key={lIdx} className="bg-[#111111] border border-[#39FF14] text-[#39FF14] px-2.5 py-1 font-bold text-xs">
                      📍 {loc}
                    </span>
                  ))
                ) : (
                  <span className="bg-[#111111] border border-[#39FF14] text-[#39FF14] px-2.5 py-1 font-bold text-xs">
                    📍 {selectedVisitor.location}
                  </span>
                )}
              </div>
            </div>

            {/* Complete Chronological Activity Log Timeline */}
            <div className="bg-[#090909] border border-neutral-800 p-3.5 space-y-2 text-xs">
              <h3 className="text-[#39FF14] font-black uppercase text-xs border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                <span>📜 COMPLETE ACTIVITY LOG TIMELINE WITH DATE & TIMESTAMP ({Array.isArray(selectedVisitor.activities) ? selectedVisitor.activities.length : 0} ITEMS)</span>
              </h3>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pt-1">
                {Array.isArray(selectedVisitor.activities) && selectedVisitor.activities.length > 0 ? (
                  selectedVisitor.activities.map((act, aIdx) => (
                    <div key={aIdx} className="bg-[#111111] border border-neutral-800 p-2 text-xs text-neutral-200 font-mono flex items-center gap-2">
                      <span className="text-[#00E5FF] font-bold">#{aIdx + 1}</span>
                      <span>{act}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-500 italic text-xs py-4 text-center">No interaction logs recorded for this device.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}

