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
      <div className="flex items-center justify-between text-xs font-black text-[#39FF14]">
        <span className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 animate-bounce text-[#39FF14]" /> LIVE WEBSITE TEXT EDITING IS ACTIVE! (CLICK ANY TEXT TO EDIT)
        </span>
        <button
          onClick={() => toggleLiveEdit(!isLiveEditActive)}
          className="bg-[#39FF14] text-black px-2 py-0.5 font-bold uppercase text-[10px] border border-white cursor-pointer"
        >
          {isLiveEditActive ? 'DISABLE IN-PLACE EDITING' : 'ENABLE IN-PLACE EDITING'}
        </button>
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
