import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminalLogic } from './terminal/useTerminalLogic';
import TerminalHeader from './terminal/TerminalHeader';
import TerminalHistory from './terminal/TerminalHistory';
import TerminalInput from './terminal/TerminalInput';
import AdminVaultPanel from './terminal/AdminVaultPanel';
import QuickCommandChips from './terminal/QuickCommandChips';
import { cardHoverEffect } from '../animations/variants';

export default function TerminalAgentCard({ playClickSound }) {
  const {
    input,
    setInput,
    isAdminUnlocked,
    isLiveEditActive,
    toggleLiveEdit,
    isApiLoading,
    history,
    setHistory,
    terminalEndRef,
    feedKey,
    setFeedKey,
    feedVal,
    setFeedVal,
    feedSuccess,
    handleAddFedKnowledge,
    handleCommand,
    isApiConnected
  } = useTerminalLogic(playClickSound);

  return (
    <motion.div
      {...cardHoverEffect}
      className={`brutal-card p-6 md:p-8 relative overflow-hidden bg-[#000000] border-3 ${
        isAdminUnlocked ? 'border-[#39FF14] shadow-[6px_6px_0px_0px_#39FF14]' : 'border-white shadow-[6px_6px_0px_0px_#39FF14]'
      }`}
    >
      {/* 1. Header Bar */}
      <TerminalHeader
        isAdminUnlocked={isAdminUnlocked}
        isApiConnected={isApiConnected}
        onClear={() => setHistory([])}
        playClickSound={playClickSound}
      />

      {/* 2. Admin Knowledge & Live In-Place Edit Panel */}
      <AnimatePresence>
        {isAdminUnlocked && (
          <AdminVaultPanel
            isAdminUnlocked={isAdminUnlocked}
            isLiveEditActive={isLiveEditActive}
            toggleLiveEdit={toggleLiveEdit}
            feedKey={feedKey}
            setFeedKey={setFeedKey}
            feedVal={feedVal}
            setFeedVal={setFeedVal}
            feedSuccess={feedSuccess}
            onAddFact={handleAddFedKnowledge}
          />
        )}
      </AnimatePresence>

      {/* 3. Terminal Output Screen with Virtualized/Copy Hover History */}
      <TerminalHistory history={history} terminalEndRef={terminalEndRef} isApiLoading={isApiLoading} />

      {/* 4. Terminal Interactive Input Form */}
      <TerminalInput
        input={input}
        setInput={setInput}
        onSubmit={handleCommand}
        isAdminUnlocked={isAdminUnlocked}
        isApiLoading={isApiLoading}
      />
    </motion.div>
  );
}
