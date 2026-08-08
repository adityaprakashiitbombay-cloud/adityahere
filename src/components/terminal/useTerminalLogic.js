import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import { fetchPrivateMessages, fetchAiChatLogs, saveAiChatConversation, clearAllAiChatLogs, submitVisitorComment, submitPrivateMessage, fetchRealVisitorSessions, clearRealVisitorSessions, logVisitorActivity, formatDuration } from '../../lib/supabaseClient';
import { applyTheme } from '../ThemeSwitcher';

const FED_KNOWLEDGE_STORAGE_KEY = 'adityahere_fed_ai_knowledge_v1';
const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY || import.meta.env.VITE_AI_API_KEY || '';

const cleanMarkdownText = (str) => {
  if (!str) return '';

  let cleaned = str;

  // 1. Clean LaTeX fractions: \frac{num}{den} -> (num / den)
  cleaned = cleaned.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');

  // 2. Clean LaTeX roots: \sqrt[3]{x} -> ∛(x), \sqrt{x} -> √(x)
  cleaned = cleaned.replace(/\\sqrt\[3\]\{([^{}]+)\}/g, '∛($1)');
  cleaned = cleaned.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');

  // 3. Clean subscripts & superscripts
  cleaned = cleaned.replace(/x_\{n\+1\}/g, 'xₙ₊₁');
  cleaned = cleaned.replace(/x_n\^2/g, 'xₙ²');
  cleaned = cleaned.replace(/_([0-9a-z])/g, '₍$1₎');
  cleaned = cleaned.replace(/\^([0-9a-z])/g, '⁽$1⁾');

  // 4. Remove leftover LaTeX commands & symbols
  cleaned = cleaned.replace(/\\[a-zA-Z]+/g, '');
  cleaned = cleaned.replace(/[\$\{\}]/g, '');

  return cleaned;
};

function isFastLocalCommand(q) {
  if (!q) return false;
  const qLower = q.trim().toLowerCase();
  const fastCmds = [
    'alpha1845', 'help', 'visitors', 'analytics', 'ips',
    'clearvisitors', 'messages', 'private', 'dm', 'chats', 'aichats',
    'logs', 'clearchats', 'clear', 'edit', 'lock', 'nvidia', 'nemotron',
    'fed', 'clearfed', 'theme'
  ];
  if (fastCmds.includes(qLower)) return true;
  if (
    qLower.startsWith('theme ') ||
    qLower.startsWith('feedback ') ||
    qLower.startsWith('dm ') ||
    qLower.startsWith('contact ') ||
    qLower.startsWith('edit ')
  ) {
    return true;
  }
  return false;
}

export function useTerminalLogic({ playClickSound } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(
    () => localStorage.getItem('adityahere_admin_unlocked') === 'true'
  );
  const [isLiveEditActive, setIsLiveEditActive] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [history, setHistory] = useState([
    {
      type: 'agent',
      text: '🤖 System Online. I am the AI Agent for adityahere. Ask me anything about IIT JEE, Class 10th score (95.4%), Olympiads (IOQM/RMO/NSEP), mentors, or physics!'
    }
  ]);

  const [feedKey, setFeedKey] = useState('');
  const [feedVal, setFeedVal] = useState('');
  const [feedSuccess, setFeedSuccess] = useState('');
  const [fedKnowledgeList, setFedKnowledgeList] = useState([]);

  const terminalEndRef = useRef(null);
  const hasAutoExecutedRef = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FED_KNOWLEDGE_STORAGE_KEY);
      if (stored) {
        setFedKnowledgeList(JSON.parse(stored));
      }
    } catch (e) {}

    const handleExecuteCmd = (e) => {
      if (e.detail) handleCommand(e.detail);
    };

    window.addEventListener('executeAdminCmd', handleExecuteCmd);
    return () => window.removeEventListener('executeAdminCmd', handleExecuteCmd);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isAdminUnlocked, isLiveEditActive, fedKnowledgeList]);

  // Auto-execute query from URL parameters if redirected from Floating AI Bot Modal
  useEffect(() => {
    const qFromUrl = searchParams.get('q');
    if (qFromUrl && !hasAutoExecutedRef.current) {
      hasAutoExecutedRef.current = true;
      setTimeout(() => {
        handleCommand(qFromUrl);
        setSearchParams({});
      }, 350);
    }
  }, [searchParams]);

  const toggleLiveEdit = (enable) => {
    const nextState = enable !== undefined ? enable : !isLiveEditActive;
    setIsLiveEditActive(nextState);
  };

  const handleAddFedKnowledge = (e) => {
    e?.preventDefault();
    if (!feedKey.trim() || !feedVal.trim()) return;

    const newItem = {
      id: Date.now(),
      topic: feedKey.trim(),
      content: feedVal.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = [newItem, ...fedKnowledgeList];
    setFedKnowledgeList(updated);
    localStorage.setItem(FED_KNOWLEDGE_STORAGE_KEY, JSON.stringify(updated));

    setFeedKey('');
    setFeedVal('');
    setFeedSuccess(`Fed fact "${newItem.topic}" into AI memory!`);
    setTimeout(() => setFeedSuccess(''), 3000);
  };

  const handleClearFedKnowledge = () => {
    setFedKnowledgeList([]);
    localStorage.removeItem(FED_KNOWLEDGE_STORAGE_KEY);
  };

  const callNvidiaNemotronAPI = async (userPrompt) => {
    const systemInstruction = `You are the official high-IQ AI Nemotron Agent for Aditya Prakash (adityahere).
Aditya is a 15-year-old IIT JEE 2028 aspirant studying at Allen Career Institute, Patna (Ashiyana Digha Branch).
Key Achievements:
- 95.4% overall in Class 10th CBSE with 100/100 Perfect Score in IT (Information Technology).
- 2x IOQM Qualifier, 1x RMO Qualifier, 1x NSEP Qualifier.
- Middle School Mentors: Neha Mam (Maths) & Ajit Sir (Science).
- Close Homies: Abhay (brother), Prashant, Ayush, Sahil.
- Ideology: Rational Atheist, Secular Leftist, Feminist. Motto: "Inspired by no one."
Answer user queries with extreme intelligence, clarity, and neo-brutalist charm.`;

    try {
      const apiKey = NVIDIA_API_KEY || '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';
      if (apiKey) {
        const isOr = apiKey.startsWith('sk-or-');
        const url = isOr
          ? 'https://openrouter.ai/api/v1/chat/completions'
          : 'https://integrate.api.nvidia.com/v1/chat/completions';

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        };

        const openRouterModels = isOr
          ? ['openrouter/auto', 'nvidia/nemotron-4-340b-instruct']
          : ['nvidia/nemotron-4-340b-instruct'];

        for (const modelCandidate of openRouterModels) {
          try {
            const resp = await fetch(url, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                model: modelCandidate,
                messages: [
                  { role: 'system', content: systemInstruction },
                  { role: 'user', content: userPrompt }
                ],
                max_tokens: 250
              })
            });

            if (resp.ok) {
              const data = await resp.json();
              const msg = data.choices?.[0]?.message;
              const text = msg?.content || msg?.reasoning || msg?.reasoning_details?.[0]?.summary;
              if (text && text.trim()) return cleanMarkdownText(text.trim());
            }
          } catch (e) {}
        }
      }

      return cleanMarkdownText(synthesizeDynamicResponse(userPrompt));
    } catch (err) {
      return cleanMarkdownText(synthesizeDynamicResponse(userPrompt));
    }
  };

  const synthesizeDynamicResponse = (prompt) => {
    const p = prompt.toLowerCase();

    // Check custom fed knowledge first
    if (fedKnowledgeList && fedKnowledgeList.length > 0) {
      const match = fedKnowledgeList.find(f => p.includes(f.topic.toLowerCase()) || f.topic.toLowerCase().includes(p));
      if (match) {
        return `🧠 [FED MEMORY - ${match.topic.toUpperCase()}]: ${match.content}`;
      }
    }

    if (p.includes('kya haal') || p.includes('kaise') || p.includes('bhai') || p.includes('hey') || p.includes('hello') || p.includes('hi')) {
      return `Sab badhiya bhai! 🚀 I am adityahere's live AI agent. Ask me anything about my IIT JEE 2028 preparation @ Allen Patna, Olympiads (IOQM 2x, RMO 1x, NSEP 1x), 95.4% in 10th, or Physics!`;
    }
    if (p.includes('mark') || p.includes('score') || p.includes('10th') || p.includes('percent') || p.includes('board') || p.includes('cbse')) {
      return `Aditya scored 95.4% overall in Class 10th CBSE with a perfect 100/100 score in Information Technology (IT)! 💯`;
    }
    if (p.includes('allen') || p.includes('jee') || p.includes('patna') || p.includes('iit') || p.includes('study') || p.includes('coaching')) {
      return `Aditya is currently preparing for IIT JEE 2028 at Allen Patna (Ashiyana Digha Branch) with intense problem solving in Physics (Irodov/PathFinder), Chemistry, and Math.`;
    }
    if (p.includes('olympiad') || p.includes('ioqm') || p.includes('rmo') || p.includes('nsep') || p.includes('math') || p.includes('physics')) {
      return `Aditya is a 2x IOQM (Stage 1 Maths Olympiad) qualifier, 1x RMO (Stage 2 Regional Maths Olympiad) qualifier, and 1x NSEP (National Standard Exam in Physics) qualifier! 🏆`;
    }
    if (p.includes('mentor') || p.includes('teacher') || p.includes('ajit') || p.includes('neha') || p.includes('guide')) {
      return `Aditya's key middle school mentors who guided his academic foundation are Neha Mam (Maths) and Ajit Sir (Science)! 📚`;
    }
    if (p.includes('friend') || p.includes('abhay') || p.includes('homie') || p.includes('brother')) {
      return `Close homies: Abhay (Brother & confidant), Prashant, Ayush, and Sahil. 👥`;
    }
    if (p.includes('ideolog') || p.includes('value') || p.includes('atheist') || p.includes('feminist') || p.includes('leftist') || p.includes('motto') || p.includes('believe')) {
      return `Aditya's worldview: Atheist (empirical rationalism), Feminist (gender equality & social justice), Leftist (secular progressivism). Personal motto: "Inspired by no one." 🧠`;
    }
    if (p.includes('project') || p.includes('skill') || p.includes('web') || p.includes('tech') || p.includes('code') || p.includes('build')) {
      return `Aditya builds ultra-modern neo-brutalist web systems, hardware-accelerated 60FPS background canvases, AI CLI agents, and real-time IP telemetry applications with React 19, Framer Motion, and Supabase! 💻`;
    }
    return `⚡ [LIVE AGENT]: Aditya is a 15-year-old IIT JEE 2028 aspirant @ Allen Patna with 95.4% in 10th (100% in IT) and IOQM 2x / RMO 1x / NSEP 1x Olympiad credentials. Ask me anything specific!`;
  };

  const processLogicalQuery = async (rawQuery) => {
    const q = rawQuery.trim();
    if (!q) return '';
    const qLower = q.toLowerCase();

    logVisitorActivity(`CLI: ${q.slice(0, 30)}`);

    if (q === 'ALPHA1845' || qLower === 'alpha1845') {
      setIsAdminUnlocked(true);
      localStorage.setItem('adityahere_admin_unlocked', 'true');
      window.dispatchEvent(new Event('adminAuthChanged'));
      if (playClickSound) playClickSound();
      return `⚡ [ALPHA1845 OVERRIDE UNLOCKED]
--------------------------------------------------
Welcome back, Aditya! Admin Matrix & Server CMS is now ACTIVE.

AVAILABLE ADMIN COMMANDS & SHORTCUTS:
• visitors     : Read real live visitor IPs, device codes, dwell time & audit trail
• clearvisitors: Purge real visitor sessions table
• messages     : Read all private visitor direct messages
• chats        : Read all visitor AI chatbot transcripts
• clearchats   : Purge saved AI chatbot logs from database
• edit         : Open Live Server CMS Editor (Bio, Marks, Timeline, Quotes)
• fed          : View custom fed facts in AI memory
• clearfed     : Clear custom fed facts
• theme <name> : Switch site theme live (matrix, cyber, sunset, solar, hyper)
• feedback <m> : Submit public visitor board feedback
• dm <msg>     : Send direct private message to vault
• lock         : Lock Admin mode & return to guest mode
• clear        : Clear terminal screen`;
    }

    if (qLower === 'visitors' || qLower === 'analytics' || qLower === 'ips') {
      if (!isAdminUnlocked && localStorage.getItem('adityahere_admin_unlocked') !== 'true') {
        return '🔒 ACCESS DENIED: Enter ALPHA1845 code first to view real live visitor telemetry table.';
      }
      const sessions = await fetchRealVisitorSessions();
      if (!sessions || sessions.length === 0) {
        return '🌐 REAL VISITORS TABLE: No visitor sessions recorded yet.';
      }
      return `🌐 REAL LIVE VISITORS AUDIT TRAIL TABLE (${sessions.length} Unique Devices Recorded):\n----------------------------------------------------\n` +
        sessions.map((s, i) => {
          const devCode = s.deviceId || `DEV-${s.id?.slice(-6) || 'LOCAL'}`;
          const visits = s.visitCount || 1;
          const acts = Array.isArray(s.activities) && s.activities.length > 0 ? s.activities.slice(-5).join(' ➔ ') : '📍 Active Session';
          const dwell = formatDuration(s.totalDwellSeconds || s.duration_seconds || 1);
          const firstSeenStr = s.firstSeen ? new Date(s.firstSeen).toLocaleString() : new Date(s.timestamp || Date.now()).toLocaleString();
          const lastActiveStr = s.lastSeen ? new Date(s.lastSeen).toLocaleString() : 'Just now';
          const tasks = s.totalActionsCount || (Array.isArray(s.activities) ? s.activities.length : 1);

          return `${i + 1}. [DEVICE CODE: ${devCode} | IP: ${s.ip} | ${s.location}]
   • Visits Count: 📊 ${visits} visit(s) | Total Tasks/Actions: ⚡ ${tasks} tasks
   • Device/Network: ${s.device} (${s.isp || 'ISP Net'})
   • First Seen: 🗓️ ${firstSeenStr} | Last Active: 🕒 ${lastActiveStr}
   • Cumulative Dwell Time: ⏱️ ${dwell}
   • Recent Activity Trail: ${acts}`;
        }).join('\n\n');
    }


    if (qLower === 'clearvisitors') {
      if (!isAdminUnlocked && localStorage.getItem('adityahere_admin_unlocked') !== 'true') {
        return '🔒 ACCESS DENIED: Enter ALPHA1845 code first to clear logs.';
      }
      await clearRealVisitorSessions();
      return '🌐 Cleared all recorded real visitor session logs.';
    }

    if (qLower === 'edit' || qLower.startsWith('edit ')) {
      if (!isAdminUnlocked && localStorage.getItem('adityahere_admin_unlocked') !== 'true') {
        return '🔒 ACCESS DENIED: Enter ALPHA1845 code first to open the Server CMS.';
      }
      window.dispatchEvent(new CustomEvent('openAdminModal', { detail: 'hero' }));
      return '✏️ Opening Server CMS Editor modal...';
    }

    if (qLower === 'lock') {
      setIsAdminUnlocked(false);
      localStorage.removeItem('adityahere_admin_unlocked');
      window.dispatchEvent(new Event('adminAuthChanged'));
      return '🔒 Admin Matrix & Server CMS locked. Returned to guest mode.';
    }

    if (qLower === 'messages' || qLower === 'private' || qLower === 'dm') {
      if (!isAdminUnlocked && localStorage.getItem('adityahere_admin_unlocked') !== 'true') {
        return '🔒 ACCESS DENIED: Enter ALPHA1845 code first to view private direct messages.';
      }
      const msgs = await fetchPrivateMessages();
      if (!msgs || msgs.length === 0) {
        return '📥 PRIVATE VAULT: No private direct messages received yet.';
      }
      return `📥 PRIVATE DIRECT MESSAGES FOR ADITYA (${msgs.length} msgs):\n` +
        msgs.map((m, i) => `${i + 1}. [${m.name} | ${m.contactInfo}]: "${m.message}" (${new Date(m.created_at).toLocaleDateString()})`).join('\n\n');
    }

    if (qLower === 'chats' || qLower === 'aichats' || qLower === 'logs') {
      if (!isAdminUnlocked && localStorage.getItem('adityahere_admin_unlocked') !== 'true') {
        return '🔒 ACCESS DENIED: Enter ALPHA1845 code first to view saved AI chatbot logs.';
      }
      const chatLogs = await fetchAiChatLogs();
      if (!chatLogs || chatLogs.length === 0) {
        return '🤖 AI CHAT VAULT: No visitor conversations recorded yet.';
      }
      return `🤖 SAVED VISITOR AI CHATBOT LOGS (${chatLogs.length} conversations):\n----------------------------------------------------\n` +
        chatLogs.map((c, i) => `${i + 1}. [${new Date(c.timestamp).toLocaleString()} | Source: ${c.source || 'Bot'}]:\n   Q: "${c.userPrompt}"\n   A: "${c.aiResponse}"`).join('\n\n');
    }

    if (qLower === 'clearchats') {
      if (!isAdminUnlocked && localStorage.getItem('adityahere_admin_unlocked') !== 'true') {
        return '🔒 ACCESS DENIED: Enter ALPHA1845 code first to clear logs.';
      }
      await clearAllAiChatLogs();
      return '🤖 Cleared all saved AI chatbot logs from memory.';
    }

    if (qLower === 'clear') {
      setHistory([]);
      return null;
    }

    if (qLower === 'nvidia' || qLower === 'nemotron' || qLower.includes('nemotron 3')) {
      return `⚡ NVIDIA NEMOTRON & AI ENGINE STATUS:
------------------------------------------
Status: ${NVIDIA_API_KEY ? '✅ CONNECTED & ONLINE' : '⚠️ LIVE AGENT ACTIVE'}
Key Configuration: .env / VITE_NVIDIA_API_KEY
All questions are dynamically executed live through the AI Model!`;
    }

    if (qLower === 'fed') {
      if (fedKnowledgeList.length === 0) {
        return '🧠 CUSTOM AI MEMORY: No custom facts fed yet. Use the Admin Vault to add new facts!';
      }
      return `🧠 CUSTOM FED AI MEMORY (${fedKnowledgeList.length} items):\n` +
        fedKnowledgeList.map((f, i) => `${i + 1}. [${f.topic.toUpperCase()}]: ${f.content}`).join('\n');
    }

    if (qLower === 'clearfed') {
      handleClearFedKnowledge();
      return '🧠 Cleared all custom fed AI knowledge.';
    }

    if (qLower === 'theme' || qLower.startsWith('theme ')) {
      const parts = q.split(' ');
      const themeName = parts[1]?.toLowerCase();
      if (!themeName) {
        return `🎨 COLOR THEME MATRIX CLI:
------------------------------------------
Available Theme Presets:
1. theme matrix  (Matrix Neon Green - Default)
2. theme cyber   (Cyberpunk Cyan)
3. theme sunset  (Neon Sunset Pink)
4. theme solar   (Solar Gold Yellow)
5. theme hyper   (Hyper Purple)

Type e.g. "theme cyber" to switch theme across all pages!`;
      }
      const valid = ['matrix', 'cyber', 'sunset', 'solar', 'hyper'];
      if (valid.includes(themeName)) {
        applyTheme(themeName);
        return `🎨 Theme updated to "${themeName.toUpperCase()}"! Color variables applied live.`;
      } else {
        return `⚠️ Unknown theme "${themeName}". Choose from: matrix, cyber, sunset, solar, hyper`;
      }
    }

    if (qLower === 'feedback' || qLower.startsWith('feedback ')) {
      const msg = q.substring(8).trim();
      if (!msg) {
        return `💬 SUBMIT VISITOR FEEDBACK (NO PASSWORD REQUIRED):
--------------------------------------------------
Usage: feedback <your message here>
Example: feedback Loved the 100% IT score & Neo-Brutalist design!

This saves directly into the public Visitor Board database.`;
      }
      await submitVisitorComment({
        name: 'Terminal Visitor',
        role: 'CLI User',
        message: msg,
        stars: 5
      });
      return `✅ PUBLIC FEEDBACK SAVED! Delivered to Visitor Board: "${msg}"`;
    }

    if (qLower === 'dm' || qLower.startsWith('dm ') || qLower === 'contact' || qLower.startsWith('contact ')) {
      const prefixLength = qLower.startsWith('contact') ? 7 : 2;
      const msg = q.substring(prefixLength).trim();
      if (!msg) {
        return `📬 DIRECT PRIVATE MESSAGE TO ADITYA (NO PASSWORD REQUIRED):
------------------------------------------------------------
Usage: dm <your private message>  OR  contact <your message>
Example: dm Hey Aditya! Loved your physics notes, let's connect!

This delivers a private message directly into Aditya's private vault.`;
      }
      await submitPrivateMessage({
        name: 'Terminal Visitor',
        contactInfo: 'Terminal CLI',
        message: msg
      });
      return `📬 PRIVATE MESSAGE DELIVERED! Sent directly to Aditya's private vault: "${msg}"`;
    }

    if (qLower === 'help') {
      return `AVAILABLE SYSTEM COMMANDS:
-------------------------
• theme <name> : Change color theme (matrix, cyber, sunset, solar, hyper)
• feedback <msg>: Submit public visitor board feedback (No password needed)
• dm <msg>      : Send direct private message to Aditya (No password needed)
• ALPHA1845    : Unlock Admin Matrix & Live Server Editor
• visitors     : Read real live visitor IPs, location, dwell time & activity trail table
• clearvisitors: Purge real visitor sessions table
• messages     : View private direct messages (Admin)
• chats        : View visitor AI chat transcripts (Admin)
• fed          : View custom fed facts in AI memory
• clear        : Clear console screen
• Ask ANY question (Marks, JEE, Olympiads, Physics, AI, Mentors) to execute live!`;
    }

    const apiResult = await callNvidiaNemotronAPI(rawQuery);
    return apiResult || synthesizeDynamicResponse(rawQuery);
  };

  const handleCommand = async (cmdText) => {
    const textToExecute = cmdText || input;
    if (!textToExecute.trim()) return;

    if (playClickSound) playClickSound();

    const textTrimmed = textToExecute.trim();
    setInput('');

    const isLocal = isFastLocalCommand(textTrimmed);

    if (isLocal) {
      // Instant execution for local CLI commands & admin passcode override
      const output = await processLogicalQuery(textTrimmed);
      if (output === null) {
        setHistory([]);
        return;
      }
      setHistory((prev) => [
        ...prev,
        { type: 'user', text: textTrimmed },
        { type: 'agent', text: output }
      ]);
      return;
    }

    // For AI model questions, show thinking animation & execute with error-handling fallback
    setIsApiLoading(true);
    setHistory((prev) => [
      ...prev,
      { type: 'user', text: textTrimmed },
      { type: 'thinking', text: 'Synthesizing response from neural knowledge base...' }
    ]);

    try {
      const output = await processLogicalQuery(textTrimmed);

      setHistory((prev) => [
        ...prev.filter(item => item.type !== 'thinking'),
        { type: 'agent', text: output || synthesizeDynamicResponse(textTrimmed) }
      ]);

      try {
        saveAiChatConversation({
          userPrompt: textTrimmed,
          aiResponse: output || '',
          source: 'Terminal CLI'
        });
      } catch (e) {}
    } catch (err) {
      console.error("CLI processing error:", err);
      const fallbackAns = synthesizeDynamicResponse(textTrimmed);
      setHistory((prev) => [
        ...prev.filter(item => item.type !== 'thinking'),
        { type: 'agent', text: fallbackAns }
      ]);
    } finally {
      setIsApiLoading(false);
    }
  };

  return {
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
    isApiConnected: Boolean(NVIDIA_API_KEY)
  };
}
