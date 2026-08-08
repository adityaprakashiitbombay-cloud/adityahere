import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Plus, CheckCircle2 } from 'lucide-react';

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
  if (!isAdminUnlocked) return null;

  return (
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
            onClick={() => window.dispatchEvent(new CustomEvent('executeAdminCmd', { detail: 'visitors' }))}
            className="bg-[#00E5FF] text-black px-2.5 py-1 font-black uppercase text-xs border border-white shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer active:scale-95 transition-transform"
          >
            🌐 VISITORS TABLE
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
  );
}
