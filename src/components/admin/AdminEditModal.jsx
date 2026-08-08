import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Edit, CheckCircle, RefreshCw, Layers, Award, Calendar, Zap, MessageSquare, Quote, Globe } from 'lucide-react';
import { usePortfolio } from '../../hooks/usePortfolio';

export default function AdminEditModal({ isOpen, onClose, initialTab = 'hero' }) {
  const { data, updateEntirePortfolio, isSaving, saveStatus, resetDefaults } = usePortfolio();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(data || {})));
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen && data) {
      setFormData(JSON.parse(JSON.stringify(data)));
      setActiveTab(initialTab);
    }
  }, [isOpen, data, initialTab]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e?.preventDefault();
    const res = await updateEntirePortfolio(formData);
    setStatusMessage('✅ Changes successfully saved to server & database!');
    setTimeout(() => {
      setStatusMessage('');
      onClose();
    }, 1200);
  };

  // Helper updaters with safe object creation
  const updateHeroField = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...(prev?.hero || {}), [field]: val }
    }));
  };

  const updateIdeologyField = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      ideologies: { ...(prev?.ideologies || {}), [field]: val }
    }));
  };

  const updateOlympiadItem = (idx, field, val) => {
    setFormData((prev) => {
      const copy = [...(prev?.olympiads || [])];
      if (copy[idx]) {
        copy[idx] = { ...copy[idx], [field]: val };
      }
      return { ...prev, olympiads: copy };
    });
  };

  const updateMilestoneItem = (idx, field, val) => {
    setFormData((prev) => {
      const copy = [...(prev?.milestones || [])];
      if (copy[idx]) {
        copy[idx] = { ...copy[idx], [field]: val };
      }
      return { ...prev, milestones: copy };
    });
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...(prev?.milestones || []),
        {
          year: '2026',
          title: 'New Milestone Title',
          location: 'Patna / Allen',
          description: 'Detailed description of this achievement or event.',
          icon: 'Award',
          highlight: false
        }
      ]
    }));
  };

  const deleteMilestone = (idx) => {
    setFormData((prev) => ({
      ...prev,
      milestones: (prev?.milestones || []).filter((_, i) => i !== idx)
    }));
  };

  const updateExpertiseItem = (idx, field, val) => {
    setFormData((prev) => {
      const copy = [...(prev?.expertise || [])];
      if (copy[idx]) {
        copy[idx] = { ...copy[idx], [field]: val };
      }
      return { ...prev, expertise: copy };
    });
  };

  const updateQuoteItem = (idx, field, val) => {
    setFormData((prev) => {
      const copy = [...(prev?.artworksAndQuotes || [])];
      if (copy[idx]) {
        copy[idx] = { ...copy[idx], [field]: val };
      }
      return { ...prev, artworksAndQuotes: copy };
    });
  };

  const addQuote = () => {
    setFormData((prev) => ({
      ...prev,
      artworksAndQuotes: [
        ...(prev?.artworksAndQuotes || []),
        {
          type: 'quote',
          title: 'First Principles Note',
          content: 'Enter personal quote or rule here.',
          author: 'Aditya',
          category: 'Philosophy'
        }
      ]
    }));
  };

  const deleteQuote = (idx) => {
    setFormData((prev) => ({
      ...prev,
      artworksAndQuotes: (prev?.artworksAndQuotes || []).filter((_, i) => i !== idx)
    }));
  };

  const tabs = [
    { id: 'hero', label: 'HERO & BIO', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'olympiads', label: 'OLYMPIADS', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'timeline', label: 'TIMELINE', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'ideologies', label: 'IDEOLOGY', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'expertise', label: 'SKILLS & DOMAINS', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'quotes', label: 'QUOTES & ART', icon: <Quote className="w-3.5 h-3.5" /> },
    { id: 'socials', label: 'SOCIALS', icon: <Globe className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] bg-[#080808] border-3 border-[#39FF14] shadow-[12px_12px_0px_0px_#39FF14] flex flex-col overflow-hidden text-white"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-black border-b-2 border-white">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-[#39FF14] text-black font-black text-xs">
              ALPHA1845
            </div>
            <h2 className="text-sm font-black tracking-tight text-white uppercase flex items-center gap-1.5">
              <span>LIVE SERVER CMS & CONTENT EDITOR</span>
              <span className="text-[10px] text-[#00E5FF] font-bold">[SYNCED]</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-black border border-white text-white hover:bg-neutral-800 cursor-pointer shadow-[2px_2px_0px_0px_#ffffff]"
            title="Close Editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b-2 border-neutral-800 bg-[#000000] p-2 gap-1.5 shrink-0 scrollbar-thin">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 text-xs font-bold font-mono flex items-center gap-1.5 border whitespace-nowrap cursor-pointer transition-all ${
                activeTab === t.id
                  ? 'bg-[#39FF14] text-black border-white shadow-[3px_3px_0px_0px_#ffffff]'
                  : 'bg-[#111111] text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs bg-[#050505]">
          {/* TAB 1: HERO & BIO */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-800 pb-2 flex items-center justify-between">
                <span className="text-[#39FF14] font-bold text-xs">HOMEPAGE HERO & BIO SETTINGS</span>
                <span className="text-[10px] text-neutral-400">Updates Homepage bento grid immediately</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Hero Subtitle / Role</label>
                  <input
                    type="text"
                    value={formData?.hero?.subtitle || ''}
                    onChange={(e) => updateHeroField('subtitle', e.target.value)}
                    className="w-full bg-black border-2 border-white p-2.5 text-white focus:border-[#39FF14] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Highlight Badge</label>
                  <input
                    type="text"
                    value={formData?.hero?.highlightBadge || ''}
                    onChange={(e) => updateHeroField('highlightBadge', e.target.value)}
                    className="w-full bg-black border-2 border-white p-2.5 text-white focus:border-[#39FF14] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Current Status / Batch</label>
                  <input
                    type="text"
                    value={formData?.hero?.currentStatus || ''}
                    onChange={(e) => updateHeroField('currentStatus', e.target.value)}
                    className="w-full bg-black border-2 border-white p-2.5 text-white focus:border-[#39FF14] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Branch / Location</label>
                  <input
                    type="text"
                    value={formData?.hero?.branch || ''}
                    onChange={(e) => updateHeroField('branch', e.target.value)}
                    className="w-full bg-black border-2 border-white p-2.5 text-white focus:border-[#39FF14] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Full Bio Description (Terminal & Home)</label>
                <textarea
                  rows={4}
                  value={formData?.hero?.bio || ''}
                  onChange={(e) => updateHeroField('bio', e.target.value)}
                  className="w-full bg-black border-2 border-white p-2.5 text-white focus:border-[#39FF14] outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 2: OLYMPIADS */}
          {activeTab === 'olympiads' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-800 pb-2">
                <span className="text-[#00E5FF] font-bold text-xs">OLYMPIADS & COMPETITIVE CREDENTIALS</span>
              </div>

              {(formData?.olympiads || []).map((olymp, idx) => (
                <div key={idx} className="p-3 bg-black border-2 border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#39FF14] flex items-center gap-1.5">
                      <span>{olymp?.icon || '🏆'}</span> {olymp?.exam} — {olymp?.name}
                    </span>
                    <input
                      type="text"
                      value={olymp?.count || ''}
                      onChange={(e) => updateOlympiadItem(idx, 'count', e.target.value)}
                      className="bg-neutral-900 border border-white px-2 py-1 text-[11px] font-bold text-[#00E5FF] text-right"
                      placeholder="e.g. 2x Qualified"
                    />
                  </div>

                  <input
                    type="text"
                    value={olymp?.description || ''}
                    onChange={(e) => updateOlympiadItem(idx, 'description', e.target.value)}
                    className="w-full bg-black border border-neutral-700 p-2 text-white text-xs"
                    placeholder="Olympiad summary description"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-[#39FF14] font-bold text-xs">TIMELINE MILESTONES & ACHIEVEMENTS</span>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="bg-[#39FF14] text-black font-bold px-2 py-1 text-[10px] flex items-center gap-1 border border-white cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> ADD MILESTONE
                </button>
              </div>

              {(formData?.milestones || []).map((m, idx) => (
                <div key={idx} className="p-3 bg-black border-2 border-neutral-800 space-y-2.5 relative">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={m?.year || ''}
                      onChange={(e) => updateMilestoneItem(idx, 'year', e.target.value)}
                      className="w-28 bg-neutral-900 border border-neutral-700 p-1.5 text-xs font-bold text-[#39FF14]"
                      placeholder="Year"
                    />
                    <input
                      type="text"
                      value={m?.title || ''}
                      onChange={(e) => updateMilestoneItem(idx, 'title', e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-700 p-1.5 text-xs font-bold text-white"
                      placeholder="Milestone Title"
                    />
                    <button
                      type="button"
                      onClick={() => deleteMilestone(idx)}
                      className="p-1.5 bg-red-900/40 text-red-400 border border-red-700 hover:bg-red-900 cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={m?.location || ''}
                      onChange={(e) => updateMilestoneItem(idx, 'location', e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 p-1.5 text-[11px] text-neutral-300"
                      placeholder="Location / Institution"
                    />
                    <input
                      type="text"
                      value={m?.achievement || ''}
                      onChange={(e) => updateMilestoneItem(idx, 'achievement', e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 p-1.5 text-[11px] text-[#00E5FF]"
                      placeholder="Achievement highlight (optional)"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={m?.description || ''}
                    onChange={(e) => updateMilestoneItem(idx, 'description', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2 text-[11px] text-neutral-300"
                    placeholder="Milestone description..."
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: IDEOLOGY */}
          {activeTab === 'ideologies' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-800 pb-2">
                <span className="text-[#FF007F] font-bold text-xs">CORE WORLDVIEW, MOTTO & VALUES</span>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Personal Motto</label>
                <input
                  type="text"
                  value={formData?.ideologies?.quote || ''}
                  onChange={(e) => updateIdeologyField('quote', e.target.value)}
                  className="w-full bg-black border-2 border-white p-2.5 text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Quote Context / Rationale</label>
                <textarea
                  rows={2}
                  value={formData?.ideologies?.quoteContext || ''}
                  onChange={(e) => updateIdeologyField('quoteContext', e.target.value)}
                  className="w-full bg-black border-2 border-white p-2.5 text-white"
                />
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-neutral-400">Core Ideology Tags:</span>
                {(formData?.ideologies?.tags || []).map((tag, idx) => (
                  <div key={idx} className="p-3 bg-black border border-neutral-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#39FF14]">{tag?.label || 'Value'}</span>
                      <input
                        type="text"
                        value={tag?.color || ''}
                        onChange={(e) => {
                          const copy = [...(formData?.ideologies?.tags || [])];
                          copy[idx] = { ...copy[idx], color: e.target.value };
                          setFormData({ ...formData, ideologies: { ...formData.ideologies, tags: copy } });
                        }}
                        className="w-24 bg-neutral-900 border border-neutral-700 px-2 py-0.5 text-[10px] text-right font-mono"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={tag?.description || ''}
                      onChange={(e) => {
                        const copy = [...(formData?.ideologies?.tags || [])];
                        copy[idx] = { ...copy[idx], description: e.target.value };
                        setFormData({ ...formData, ideologies: { ...formData.ideologies, tags: copy } });
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-[11px] text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SKILLS & EXPERTISE */}
          {activeTab === 'expertise' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-800 pb-2">
                <span className="text-[#39FF14] font-bold text-xs">DOMAINS, SKILLS & PASSIONS</span>
              </div>

              {(formData?.expertise || []).map((exp, idx) => (
                <div key={idx} className="p-3 bg-black border-2 border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{exp?.emoji || '⚡'}</span>
                      <input
                        type="text"
                        value={exp?.title || ''}
                        onChange={(e) => updateExpertiseItem(idx, 'title', e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 p-1.5 text-xs font-bold text-white"
                      />
                    </div>
                    <input
                      type="text"
                      value={exp?.category || ''}
                      onChange={(e) => updateExpertiseItem(idx, 'category', e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 p-1.5 text-[11px] text-[#00E5FF] text-right"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={exp?.description || ''}
                    onChange={(e) => updateExpertiseItem(idx, 'description', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2 text-[11px] text-white"
                  />

                  <input
                    type="text"
                    value={exp?.stats || ''}
                    onChange={(e) => updateExpertiseItem(idx, 'stats', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-1.5 text-[10px] text-[#39FF14]"
                    placeholder="Metrics / Key Focus"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: QUOTES & ART */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-[#FFE600] font-bold text-xs">FIRST PRINCIPLES QUOTES & CODE ART</span>
                <button
                  type="button"
                  onClick={addQuote}
                  className="bg-[#FFE600] text-black font-bold px-2 py-1 text-[10px] flex items-center gap-1 border border-white cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> ADD QUOTE
                </button>
              </div>

              {(formData?.artworksAndQuotes || []).map((q, idx) => (
                <div key={idx} className="p-3 bg-black border-2 border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={q?.title || ''}
                      onChange={(e) => updateQuoteItem(idx, 'title', e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 p-1.5 text-xs font-bold text-white flex-1"
                    />
                    <input
                      type="text"
                      value={q?.category || ''}
                      onChange={(e) => updateQuoteItem(idx, 'category', e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 p-1.5 text-[11px] text-[#FFE600]"
                    />
                    <button
                      type="button"
                      onClick={() => deleteQuote(idx)}
                      className="p-1.5 bg-red-900/40 text-red-400 border border-red-700 hover:bg-red-900 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={q?.content || q?.code || ''}
                    onChange={(e) => updateQuoteItem(idx, q?.type === 'code' ? 'code' : 'content', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2 text-[11px] text-white font-mono"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: SOCIALS */}
          {activeTab === 'socials' && (
            <div className="space-y-4">
              <div className="border-b border-neutral-800 pb-2">
                <span className="text-[#00E5FF] font-bold text-xs">SOCIAL MEDIA HANDLES & URLS</span>
              </div>

              {(formData?.socials || []).map((soc, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-black border border-neutral-800 items-center">
                  <span className="font-bold text-white text-xs">{soc?.name || 'Platform'}</span>
                  <input
                    type="text"
                    value={soc?.handle || ''}
                    onChange={(e) => {
                      const copy = [...(formData?.socials || [])];
                      copy[idx] = { ...copy[idx], handle: e.target.value };
                      setFormData({ ...formData, socials: copy });
                    }}
                    className="bg-neutral-900 border border-neutral-700 p-1.5 text-xs text-[#39FF14]"
                    placeholder="Handle"
                  />
                  <input
                    type="text"
                    value={soc?.url || ''}
                    onChange={(e) => {
                      const copy = [...(formData?.socials || [])];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setFormData({ ...formData, socials: copy });
                    }}
                    className="bg-neutral-900 border border-neutral-700 p-1.5 text-xs text-neutral-300"
                    placeholder="URL"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-black border-t-2 border-white shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetDefaults}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold px-3 py-2 text-xs border border-neutral-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> RESTORE DEFAULTS
            </button>
            {statusMessage && (
              <span className="text-[#39FF14] text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {statusMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-4 py-2 text-xs border border-neutral-700 cursor-pointer"
            >
              CANCEL
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#39FF14] hover:bg-[#4bff2b] text-black font-black px-6 py-2 text-xs border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'SAVING TO SERVER...' : 'SAVE ALL CHANGES TO SERVER'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
