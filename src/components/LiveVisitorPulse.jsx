import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Users, MapPin, Activity, ShieldCheck } from 'lucide-react';
import { fetchVisitorStats, recordRealVisitorSession, subscribeToRealtimePresence } from '../lib/supabaseClient';

export default function LiveVisitorPulse() {
  const [stats, setStats] = useState({ totalViews: 1285, onlinePeers: 1 });
  const [realSession, setRealSession] = useState(null);

  useEffect(() => {
    fetchVisitorStats().then(setStats);
    recordRealVisitorSession().then((session) => {
      if (session) setRealSession(session);
    });

    const unsubscribe = subscribeToRealtimePresence((liveCount) => {
      setStats((prev) => ({ ...prev, onlinePeers: liveCount }));
    });

    return () => unsubscribe();
  }, []);


  const activityFeeds = [
    realSession ? `📍 YOUR REAL GEOLOCATION: ${realSession.location}` : '📍 FETCHING REAL IP GEOLOCATION...',
    realSession ? `🌐 REAL VISITOR IP: ${realSession.ip} (${realSession.device})` : '🌐 LOGGING REAL SESSION TELEMETRY...',
    realSession ? `⚡ NETWORK ISP: ${realSession.isp}` : '⚡ VERIFYING WEBSOCKET PRESENCE...'
  ];

  const [feedIdx, setFeedIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIdx((prev) => (prev + 1) % activityFeeds.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [realSession]);



  return (
    <div className="bg-black border-2 border-white px-3 py-2 font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#39FF14]">
      {/* Active Online Peer Counter */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-2.5 h-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14] shadow-[0_0_6px_#39FF14]" />
        </div>
        <span className="text-white font-bold uppercase text-[11px] flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-[#39FF14]" />
          <span>{stats.onlinePeers} PEERS ONLINE</span>
        </span>
      </div>

      {/* Rotating Live Activity Telemetry */}
      <div className="flex items-center gap-2 overflow-hidden text-[10px] sm:text-[11px] text-neutral-300">
        <Activity className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={feedIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-neutral-300 truncate max-w-[220px] sm:max-w-[320px]"
          >
            {activityFeeds[feedIdx]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Total Impressions Badge */}
      <div className="bg-[#111111] border border-neutral-700 px-2 py-0.5 text-[10px] text-neutral-300 font-bold flex items-center gap-1">
        <Eye className="w-3 h-3 text-[#FFE600]" />
        <span>{stats.totalViews} VIEWS</span>
      </div>
    </div>
  );
}
