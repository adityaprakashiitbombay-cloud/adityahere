import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Star,
  CheckCircle,
  RefreshCw,
  Lock,
  Unlock,
  Trash2,
  Edit2,
  Sparkles,
  Zap,
  ShieldCheck,
  Heart,
  Flame,
  Radio,
  User,
  Tag
} from 'lucide-react';
import {
  fetchVisitorComments,
  submitVisitorComment,
  deleteVisitorComment,
  updateVisitorComment,
  fetchPrivateMessages,
  submitPrivateMessage,
  deletePrivateMessage,
  fetchAiChatLogs,
  deleteAiChatLog,
  isSupabaseConfigured
} from '../lib/supabaseClient';
import { fireMatrixConfetti } from '../utils/confettiEffects';
import TerminalTextEffect from './TerminalTextEffect';
import Skeleton from './Skeleton';

export default function VisitorFeedbackCard({ playClickSound }) {
  // Main Data States
  const [comments, setComments] = useState([]);
  const [privateMsgs, setPrivateMsgs] = useState([]);
  const [aiChatLogs, setAiChatLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Mode Selection: 'public' (Public Note) | 'private' (Direct Private Msg to Aditya)
  const [msgType, setMsgType] = useState('public');

  // Active View Tab: 'public' | 'privateVault' | 'aiChatVault'
  const [viewTab, setViewTab] = useState('public');

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(5);

  // Unified Admin State (Synced with Terminal ALPHA1845 Login)
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('adityahere_admin_unlocked') === 'true';
  });

  // Editing State for Comments
  const [editingId, setEditingId] = useState(null);
  const [editMsg, setEditMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    const publicData = await fetchVisitorComments();
    setComments(publicData);
    if (isAdmin) {
      const privateData = await fetchPrivateMessages();
      setPrivateMsgs(privateData);
      const chatLogs = await fetchAiChatLogs();
      setAiChatLogs(chatLogs);
    }
    setLoading(false);
  };

  // Sync state with Terminal Auth Login Event
  useEffect(() => {
    const handleAuthChange = () => {
      const unlocked = localStorage.getItem('adityahere_admin_unlocked') === 'true';
      setIsAdmin(unlocked);
      if (!unlocked) setViewTab('public');
    };
    window.addEventListener('adminAuthChanged', handleAuthChange);
    return () => window.removeEventListener('adminAuthChanged', handleAuthChange);
  }, []);

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  const handleAdminLock = () => {
    localStorage.removeItem('adityahere_admin_unlocked');
    window.dispatchEvent(new Event('adminAuthChanged'));
    setIsAdmin(false);
    setViewTab('public');
    if (playClickSound) playClickSound();
  };

  // Quick Tag Click
  const handleQuickTag = (tagText) => {
    if (playClickSound) playClickSound();
    setMessage((prev) => (prev ? `${prev} ${tagText}` : tagText));
  };

  // Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (playClickSound) playClickSound();
    fireMatrixConfetti();
    setSubmitting(true);

    if (msgType === 'private') {
      const res = await submitPrivateMessage({ name, contactInfo, message });
      if (res.success) {
        setSuccessMsg('🔒 Encrypted Private Message delivered directly to Aditya’s Vault!');
        setName('');
        setContactInfo('');
        setMessage('');
        loadData();
      } else {
        setSuccessMsg('Error sending message. Saved locally.');
      }
    } else {
      const res = await submitVisitorComment({ name, role, message, stars });
      if (res.success) {
        setSuccessMsg('⚡ Thank you! Your feedback is now live on the Public Community Wall.');
        setName('');
        setRole('');
        setMessage('');
        setStars(5);
        loadData();
      } else {
        setSuccessMsg('Error posting note. Saved locally.');
      }
    }

    setSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleDeleteComment = async (id) => {
    if (!isAdmin) return;
    if (playClickSound) playClickSound();
    await deleteVisitorComment(id);
    loadData();
  };

  const handleSaveEdit = async (id) => {
    if (!isAdmin || !editMsg.trim()) return;
    if (playClickSound) playClickSound();
    await updateVisitorComment(id, editMsg);
    setEditingId(null);
    setEditMsg('');
    loadData();
  };

  const handleDeletePrivate = async (id) => {
    if (!isAdmin) return;
    if (playClickSound) playClickSound();
    await deletePrivateMessage(id);
    loadData();
  };

  return (
    <div className="space-y-8 font-mono">
      {/* 1. Main Interactive Input Studio Box */}
      <div className="bg-[#050505] border-3 border-white p-5 sm:p-7 md:p-8 relative shadow-[8px_8px_0px_0px_#FFE600]">
        {/* Corner Neon Markers */}
        <span className="absolute top-2 left-2 text-[#FFE600] text-sm font-bold">┌</span>
        <span className="absolute top-2 right-2 text-[#00E5FF] text-sm font-bold">┐</span>
        <span className="absolute bottom-2 left-2 text-[#39FF14] text-sm font-bold">└</span>
        <span className="absolute bottom-2 right-2 text-[#FF007F] text-sm font-bold">┘</span>

        {/* Top Header Row with Mode Toggles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-white pb-4 mb-6">
          <div>
            <div className="text-[11px] font-mono text-[#FFE600] tracking-widest uppercase font-bold flex items-center gap-2 mb-1">
              <Radio className="w-3.5 h-3.5 text-[#39FF14] animate-pulse" />
              <span>// VISITOR BOARD & DIRECT VAULT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              COMMUNITY <span className="text-[#FFE600]">FEEDBACK</span>
            </h2>
          </div>

          {/* Mode Switcher: Public Wall vs Highlighted Direct Private Message */}
          <div className="flex flex-wrap items-center gap-2 bg-black border-2 border-white p-1.5 shadow-[3px_3px_0px_0px_#ffffff]">
            <button
              type="button"
              onClick={() => {
                if (playClickSound) playClickSound();
                setMsgType('public');
              }}
              className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                msgType === 'public'
                  ? 'bg-[#39FF14] text-black shadow-[2px_2px_0px_0px_#ffffff]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              💬 PUBLIC COMMUNITY NOTE
            </button>
            <button
              type="button"
              onClick={() => {
                if (playClickSound) playClickSound();
                setMsgType('private');
              }}
              className={`px-4 py-2 text-xs font-black transition-all flex items-center gap-1.5 border border-white ${
                msgType === 'private'
                  ? 'bg-[#00E5FF] text-black shadow-[4px_4px_0px_0px_#FFE600] animate-pulse'
                  : 'bg-[#050505] text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> 🔒 DIRECT PRIVATE MESSAGE TO ADITYA
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={msgType === 'public' ? 'sm:col-span-2' : ''}>
              <label className="block text-[11px] font-bold text-neutral-300 uppercase mb-1.5">
                Your Name / Handle <span className="text-[#FFE600]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Prashant, Ayush, Fellow Aspirant, Mentor..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border-2 border-white p-2.5 text-xs text-white placeholder-neutral-600 focus:border-[#FFE600] focus:shadow-[4px_4px_0px_0px_#FFE600] outline-none transition-all font-mono"
              />
            </div>

            {msgType === 'private' && (
              <div>
                <label className="block text-[11px] font-bold text-[#00E5FF] uppercase mb-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Email / Contact Info <span className="text-neutral-400 font-normal">(Encrypted for Aditya)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. contact@email.com / +91..."
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full bg-black border-2 border-[#00E5FF] p-2.5 text-xs text-white placeholder-neutral-600 focus:shadow-[4px_4px_0px_0px_#00E5FF] outline-none transition-all font-mono"
                />
              </div>
            )}
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase mb-1.5">
              {msgType === 'public' ? 'Public Feedback Note' : 'Secret Direct Message to Aditya'}{' '}
              <span className="text-[#FFE600]">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder={
                msgType === 'public'
                  ? 'Drop a greeting, review the portfolio UI, or leave an encouraging note for JEE 2028...'
                  : 'Write your private note, suggestion, or query for Aditya. It will be stored securely in the database!'
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black border-2 border-white p-3 text-xs text-white placeholder-neutral-600 focus:border-[#FFE600] focus:shadow-[4px_4px_0px_0px_#FFE600] outline-none transition-all"
            />
          </div>

          {/* Interactive Rating Stars (Public Mode) & Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            {msgType === 'public' ? (
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-neutral-300 uppercase">RATING:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        if (playClickSound) playClickSound();
                        setStars(num);
                      }}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          num <= stars
                            ? 'text-[#FFE600] fill-[#FFE600] drop-shadow-[0_0_6px_#FFE600]'
                            : 'text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#FFE600] font-bold">[{stars}/5 STARS]</span>
              </div>
            ) : (
              <div className="text-xs text-[#00E5FF] font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> End-to-End Database Sync Active
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all ${
                msgType === 'public' ? 'bg-[#39FF14] text-black' : 'bg-[#00E5FF] text-black'
              }`}
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> POSTING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />{' '}
                  {msgType === 'public' ? 'PUBLISH NOTE' : 'SEND DIRECT NOTE'}
                </>
              )}
            </button>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-black border-2 border-[#39FF14] p-3 text-xs text-[#39FF14] font-bold flex items-center gap-2 shadow-[4px_4px_0px_0px_#39FF14]"
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* 2. Wall Section: View Tabs (Public Board vs Aditya's Private Messages) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (playClickSound) playClickSound();
                setViewTab('public');
              }}
              className={`px-4 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                viewTab === 'public'
                  ? 'bg-white text-black border-white shadow-[3px_3px_0px_0px_#39FF14]'
                  : 'bg-black text-neutral-400 border-neutral-800 hover:border-neutral-600'
              }`}
            >
              PUBLIC NOTES ({comments.length})
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    if (playClickSound) playClickSound();
                    setViewTab('privateVault');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase border-2 transition-all flex items-center gap-1.5 ${
                    viewTab === 'privateVault'
                      ? 'bg-[#00E5FF] text-black border-white shadow-[3px_3px_0px_0px_#00E5FF]'
                      : 'bg-black text-[#00E5FF] border-[#00E5FF]/40 hover:border-[#00E5FF]'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" /> DIRECT VAULT ({privateMsgs.length})
                </button>

                <button
                  onClick={() => {
                    if (playClickSound) playClickSound();
                    setViewTab('aiChatVault');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase border-2 transition-all flex items-center gap-1.5 ${
                    viewTab === 'aiChatVault'
                      ? 'bg-[#FFE600] text-black border-white shadow-[3px_3px_0px_0px_#FFE600]'
                      : 'bg-black text-[#FFE600] border-[#FFE600]/40 hover:border-[#FFE600]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> 🤖 AI CHAT LOGS ({aiChatLogs.length})
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
            {isAdmin ? (
              <button
                onClick={handleAdminLock}
                className="text-[#FF007F] hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <Lock className="w-3 h-3" /> LOCK ADMIN
              </button>
            ) : (
              <span className="text-[11px] text-neutral-500">
                🔒 Admin unlocked via Terminal Shell
              </span>
            )}
            <button
              onClick={() => {
                if (playClickSound) playClickSound();
                loadData();
              }}
              className="hover:text-white p-1"
              title="Refresh messages"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#050505] border-2 border-neutral-800 p-4 space-y-3 shadow-[4px_4px_0px_0px_#111]">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 bg-neutral-800" />
                <Skeleton className="h-3 w-16 bg-neutral-800" />
              </div>
              <Skeleton className="h-12 w-full bg-neutral-800" />
              <Skeleton className="h-3 w-24 bg-neutral-800" />
            </div>
            <div className="bg-[#050505] border-2 border-neutral-800 p-4 space-y-3 shadow-[4px_4px_0px_0px_#111]">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 bg-neutral-800" />
                <Skeleton className="h-3 w-16 bg-neutral-800" />
              </div>
              <Skeleton className="h-12 w-full bg-neutral-800" />
              <Skeleton className="h-3 w-24 bg-neutral-800" />
            </div>
          </div>
        ) : viewTab === 'public' ? (
          /* Public Notes Stream */
          comments.length === 0 ? (
            <div className="bg-[#050505] border-2 border-neutral-800 p-8 text-center text-xs text-neutral-500 font-mono space-y-2">
              <MessageSquare className="w-6 h-6 text-neutral-600 mx-auto" />
              <p>No public notes yet. Be the first to drop a message above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comments.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#050505] border-2 border-white p-4 shadow-[4px_4px_0px_0px_#39FF14] relative group hover:border-[#39FF14] transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {item.name || 'Anonymous Visitor'}
                        </span>
                        {item.role && (
                          <span className="text-[9px] bg-black border border-neutral-700 text-[#39FF14] px-1.5 py-0.2 font-mono">
                            {item.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(item.stars || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-[#FFE600] fill-[#FFE600]" />
                      ))}
                    </div>
                  </div>

                  {editingId === item.id ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        value={editMsg}
                        onChange={(e) => setEditMsg(e.target.value)}
                        className="w-full bg-black border border-white p-2 text-xs text-white"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="bg-[#39FF14] text-black px-2 py-0.5 text-[10px] font-bold"
                        >
                          SAVE
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-neutral-800 text-white px-2 py-0.5 text-[10px]"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-200 font-mono leading-relaxed mt-2">
                      "{item.message}"
                    </p>
                  )}

                  {/* Admin Tools */}
                  {isAdmin && (
                    <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditMsg(item.message);
                        }}
                        className="text-neutral-400 hover:text-white p-1 text-[10px] flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> EDIT
                      </button>
                      <button
                        onClick={() => handleDeleteComment(item.id)}
                        className="text-[#FF007F] hover:text-red-400 p-1 text-[10px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> DELETE
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )
        ) : viewTab === 'privateVault' ? (
          /* Aditya's Private Vault Stream */
          <div className="space-y-4">
            <div className="bg-[#050505] border-2 border-[#00E5FF] p-4 shadow-[4px_4px_0px_0px_#00E5FF] text-xs text-[#00E5FF] font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00E5FF] shrink-0" />
              <span>
                PRIVATE VAULT ACTIVE: Only you (Aditya) can view these incoming direct messages.
              </span>
            </div>

            {privateMsgs.length === 0 ? (
              <div className="bg-[#050505] border-2 border-neutral-800 p-8 text-center text-xs text-neutral-500 font-mono space-y-2">
                <Lock className="w-6 h-6 text-neutral-600 mx-auto" />
                <p>No private direct messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {privateMsgs.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#050505] border-2 border-white p-4 shadow-[4px_4px_0px_0px_#00E5FF] relative group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#00E5FF] font-mono">
                            {msg.name || 'Confidential Visitor'}
                          </span>
                          {msg.contactInfo && (
                            <span className="text-[10px] bg-black border border-[#00E5FF]/40 text-neutral-300 px-1.5 py-0.2 font-mono">
                              {msg.contactInfo}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Recent'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeletePrivate(msg.id)}
                        className="text-[#FF007F] hover:text-red-400 p-1 text-[10px] flex items-center gap-1"
                        title="Delete private note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-white font-mono leading-relaxed mt-2 bg-black p-2.5 border border-neutral-800">
                      "{msg.message}"
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* AI Chatbot Conversation Transcripts Stream */
          <div className="space-y-4">
            <div className="bg-[#050505] border-2 border-[#FFE600] p-4 shadow-[4px_4px_0px_0px_#FFE600] text-xs text-[#FFE600] font-mono flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFE600] shrink-0" />
              <span>
                AI CHATBOT TRANSCRIPTS: Full logs of questions visitors asked the AI Chatbot & answers generated.
              </span>
            </div>

            {aiChatLogs.length === 0 ? (
              <div className="bg-[#050505] border-2 border-neutral-800 p-8 text-center text-xs text-neutral-500 font-mono space-y-2">
                <MessageSquare className="w-6 h-6 text-neutral-600 mx-auto" />
                <p>No visitor AI chat logs recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiChatLogs.map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#050505] border-2 border-white p-4 shadow-[4px_4px_0px_0px_#FFE600] relative group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#FFE600] font-mono">
                          {chat.source || 'AI Chatbot'}
                        </span>
                        <span className="text-[10px] bg-black border border-neutral-700 text-neutral-400 px-1.5 py-0.2">
                          {chat.timestamp ? new Date(chat.timestamp).toLocaleString() : 'Recent'}
                        </span>
                      </div>

                      <button
                        onClick={async () => {
                          if (playClickSound) playClickSound();
                          await deleteAiChatLog(chat.id);
                          loadData();
                        }}
                        className="text-[#FF007F] hover:text-red-400 p-1 text-[10px] flex items-center gap-1"
                        title="Delete chat log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="bg-black/80 p-2.5 border-l-2 border-[#00E5FF] text-white">
                        <strong className="text-[#00E5FF] block text-[10px] uppercase mb-0.5">Visitor Query:</strong>
                        "{chat.userPrompt}"
                      </div>
                      <div className="bg-black/80 p-2.5 border-l-2 border-[#39FF14] text-neutral-200">
                        <strong className="text-[#39FF14] block text-[10px] uppercase mb-0.5">AI Response:</strong>
                        {chat.aiResponse}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
