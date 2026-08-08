import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import { fetchPrivateMessages, fetchAiChatLogs, saveAiChatConversation, clearAllAiChatLogs, submitVisitorComment, submitPrivateMessage, fetchRealVisitorSessions, clearRealVisitorSessions } from '../../lib/supabaseClient';
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
  cleaned = cleaned.replace(/x_n/g, 'xₙ');
  cleaned = cleaned.replace(/\^3/g, '³');
  cleaned = cleaned.replace(/\^2/g, '²');

  // 4. Clean LaTeX brackets and operators
  cleaned = cleaned.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
  cleaned = cleaned.replace(/\\left\[/g, '[').replace(/\\right\]/g, ']');
  cleaned = cleaned.replace(/\\times/g, '×').replace(/\\div/g, '÷');

  // 5. Remove standalone LaTeX delimiters $...$ and $$...$$
  cleaned = cleaned.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  cleaned = cleaned.replace(/\$([^$]+)\$/g, '$1');

  // 6. Remove raw backslashes before special characters
  cleaned = cleaned.replace(/\\([\\`*_{}[\]()#+-.!])/g, '$1');

  // 7. Clean Markdown bold / italics / code blocks
  cleaned = cleaned
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1');

  return cleaned.trim();
};

export function useTerminalLogic(playClickSound) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return localStorage.getItem('adityahere_admin_unlocked') === 'true';
  });
  const [isLiveEditActive, setIsLiveEditActive] = useState(false);
  const [fedKnowledgeList, setFedKnowledgeList] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const hasAutoExecutedRef = useRef(false);

  // Admin Feed Form Inputs
  const [feedKey, setFeedKey] = useState('');
  const [feedVal, setFeedVal] = useState('');
  const [feedSuccess, setFeedSuccess] = useState('');

  const [history, setHistory] = useState([
    {
      type: 'system',
      text: `adityahere. AI Agent Shell [Version 5.0 NVIDIA Nemotron Engine]\nAPI Integration: ${NVIDIA_API_KEY ? 'NVIDIA NEMOTRON 3 CONNECTED ⚡' : 'ONLINE'}\nType "help" for commands or ask any question.`
    },
    {
      type: 'agent',
      text: `🤖 System Online. I am the AI Agent for adityahere. Ask me anything about IIT JEE, Class 10th score (95.4%), Olympiads (IOQM/RMO/NSEP), mentors, or physics!`
    }
  ]);

  const terminalEndRef = useRef(null);

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
    if (typeof document !== 'undefined') {
      document.body.contentEditable = nextState ? "true" : "false";
    }
  };

  const handleAddFedKnowledge = (e) => {
    e.preventDefault();
    if (!feedKey.trim() || !feedVal.trim()) return;

    if (playClickSound) playClickSound();
    const updated = [...fedKnowledgeList, { topic: feedKey.trim().toLowerCase(), content: feedVal.trim() }];
    setFedKnowledgeList(updated);
    localStorage.setItem(FED_KNOWLEDGE_STORAGE_KEY, JSON.stringify(updated));

    setFeedKey('');
    setFeedVal('');
    setFeedSuccess(`Fed fact "${feedKey}" successfully memorized into live AI context!`);
    setTimeout(() => setFeedSuccess(''), 4000);
  };

  const handleClearFedKnowledge = () => {
    setFedKnowledgeList([]);
    localStorage.removeItem(FED_KNOWLEDGE_STORAGE_KEY);
  };

  // Live Call to AI Engine (OpenRouter / NVIDIA Nemotron / Gemini API) with Complete Fed Knowledge
  const callNvidiaNemotronAPI = async (userPrompt) => {
    const customMemoryText = fedKnowledgeList.length > 0
      ? `\n\nCUSTOM FED KNOWLEDGE FROM ADMIN VAULT:\n` + fedKnowledgeList.map(f => `- ${f.topic.toUpperCase()}: ${f.content}`).join('\n')
      : '';

    const systemInstruction = `You are the official live AI Assistant and Persona Representative for adityahere. (Aditya).
You must answer questions accurately, intelligently, and dynamically using the following verified facts:

========================================
COMPLETE VERIFIED KNOWLEDGE BASE:
========================================

1. IDENTITY & BIO:
- Name / Handle : adityahere. (Aditya)
- Age           : 15 Years Old (Born May 11, 2011 in Salempur / Lalganj, Bihar)
- Current Target: IIT JEE 2028 Aspirant @ Allen Patna (Ashiyana Digha Branch)
- Bio Quote     : "${portfolioData.hero.bio}"

2. ACADEMIC & OLYMPIAD CREDENTIALS:
- Class 10th Result: 95.4% overall in CBSE with a 100/100 (PERFECT SCORE) in Information Technology (IT).
- IOQM (Indian Olympiad Qualifier in Mathematics): 2x Qualified (National Stage 1).
- RMO (Regional Mathematical Olympiad)          : 1x Qualified (National Stage 2 Advanced Proofs).
- NSEP (National Standard Exam in Physics)      : 1x Qualified (National Stage 1 Physics Olympiad).

3. INSTITUTIONS & MENTORS:
- Samarthya Classes & Pioneer Academy Lalganj: Formative middle school years (Class 4–8).
- Key Mentors: Neha Mam (English & Communication) and Ajit Sir (Mathematics & Problem Solving).
- St. Michaels Lalganj: Early foundational schooling.
- Allen Patna: Enrolled in the prestigious 2-Year Classroom Program at Ashiyana Digha Branch for JEE Advanced 2028.

4. CLOSE HOMIES & BROTHER:
- Abhay: Elder brother, confidant & constant supporter in Hajipur.
- Prashant, Ayush, Sahil: Close school homies from Pioneer Academy Lalganj.

5. CORE WORLDVIEW & PHILOSOPHY:
- Atheist: Empirical scientific reasoning and rational inquiry.
- Feminist: Advocate for equal rights, safety, and gender equality.
- Leftist: Progressive secular values, human welfare, and economic equity.
- Personal Motto: "Inspired by no one." (Motivation comes from first principles, intense curiosity, and physics).

6. TECHNICAL & PASSION DOMAINS:
- Advanced Physics: Classical mechanics, Newton's laws, Irodov & Pathfinder problem solving.
- Pure Mathematics: Number theory, geometry, algebra, combinatorics for Olympiads.
- AI & Engineering: Autonomous agents, LLM integrations, modern neo-brutalist web development.
- Cricket: Fast bowling bio-mechanics, ball trajectory analytics, match strategy.
${customMemoryText}

========================================
CRITICAL FORMATTING & STYLE RULES:
========================================
- NO RAW LATEX SYMBOLS: NEVER output raw LaTeX delimiters like $\sqrt[3]{x}$, \frac{a}{b}, $x$, or $$...$$. Use clean plain text, unicode mathematical symbols (e.g. ∛x, x³, xₙ, ÷, ±, √x, 1/3), or standard terminal math formulas.
- CREATIVITY & WIT: Be exceptionally creative, witty, vivid, articulate, and intellectually engaging! Avoid dry or robotic templates.
- Infuse sharp analogies, creative physics/math insights, inspiring quotes, and authentic personality.
- Tone: High-IQ, cyber-brutalist, enthusiastic, confident, and deeply articulate.
- Length: Crisp yet rich (2-5 punchy sentences for quick queries; articulate, detailed steps for math, physics, coding, or philosophy).`;


    try {
      if (NVIDIA_API_KEY) {
        const isOr = NVIDIA_API_KEY.startsWith('sk-or-');
        const url = isOr
          ? 'https://openrouter.ai/api/v1/chat/completions'
          : 'https://integrate.api.nvidia.com/v1/chat/completions';

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`
        };

        const openRouterModels = isOr
          ? [
              'meta-llama/llama-3.3-70b-instruct:free',
              'google/gemini-2.0-flash-exp:free',
              'mistralai/mistral-7b-instruct:free',
              'openrouter/auto',
              'nvidia/nemotron-4-340b-instruct'
            ]
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
                temperature: 0.88,
                max_tokens: 450
              })
            });

            if (resp.ok) {
              const data = await resp.json();
              const text = data.choices?.[0]?.message?.content;
              if (text && text.trim()) return cleanMarkdownText(text.trim());
            }
          } catch (e) {
            console.warn(`Fetch attempt error for ${modelCandidate}:`, e);
          }
        }
      }

      return cleanMarkdownText(synthesizeDynamicResponse(userPrompt));
    } catch (err) {
      console.warn("AI Engine execution error:", err);
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
    if (p.includes('mark') || p.includes('score') || p.includes('10th') || p.includes('percent')) {
      return `Aditya scored 95.4% overall in Class 10th CBSE with a perfect 100/100 score in Information Technology (IT)! 💯`;
    }
    if (p.includes('allen') || p.includes('jee') || p.includes('patna') || p.includes('iit')) {
      return `Aditya is currently preparing for IIT JEE 2028 at Allen Patna (Ashiyana Digha Branch) with intense problem solving in Physics (Irodov/PathFinder), Chemistry, and Math.`;
    }
    if (p.includes('olympiad') || p.includes('ioqm') || p.includes('rmo') || p.includes('nsep')) {
      return `Aditya is a 2x IOQM (Stage 1 Maths Olympiad) qualifier, 1x RMO (Stage 2 Regional Maths Olympiad) qualifier, and 1x NSEP (National Standard Exam in Physics) qualifier! 🏆`;
    }
    if (p.includes('mentor') || p.includes('teacher') || p.includes('ajit') || p.includes('neha')) {
      return `Aditya's key middle school mentors who guided his academic foundation are Neha Mam (Maths) and Ajit Sir (Science)! 📚`;
    }
    if (p.includes('friend') || p.includes('abhay') || p.includes('homie')) {
      return `Close homies: Abhay (Brother & confidant), Prashant, Ayush, and Sahil. 👥`;
    }
    if (p.includes('ideolog') || p.includes('value') || p.includes('atheist') || p.includes('feminist') || p.includes('leftist')) {
      return `Aditya's worldview: Atheist (empirical rationalism), Feminist (gender equality & social justice), Leftist (secular progressivism). Personal motto: "Inspired by no one." 🧠`;
    }
    return `⚡ [LIVE AGENT]: Aditya is a 15-year-old IIT JEE 2028 aspirant @ Allen Patna with 95.4% in 10th (100% in IT) and IOQM 2x / RMO 1x / NSEP 1x Olympiad credentials. Ask me anything specific!`;
  };

  const processLogicalQuery = async (rawQuery) => {
    const q = rawQuery.trim();
    if (!q) return '';
    const qLower = q.toLowerCase();

    if (q === 'ALPHA1845' || qLower === 'alpha1845' || qLower === 'alpha') {
      setIsAdminUnlocked(true);
      localStorage.setItem('adityahere_admin_unlocked', 'true');
      window.dispatchEvent(new Event('adminAuthChanged'));
      if (playClickSound) playClickSound();
      return `⚡ [ALPHA1845 OVERRIDE UNLOCKED]
--------------------------------------------------
Welcome back, Aditya! Admin Matrix & Server CMS is now ACTIVE.

AVAILABLE ADMIN COMMANDS & SHORTCUTS:
• visitors     : Read real live visitor IPs, geolocation & devices table
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
      return `🌐 REAL LIVE VISITORS TABLE (${sessions.length} recorded sessions):\n----------------------------------------------------\n` +
        sessions.map((s, i) => `${i + 1}. [IP: ${s.ip} | ${s.location}]: Device: "${s.device}" (${new Date(s.timestamp).toLocaleString()})`).join('\n');
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
Status: ${NVIDIA_API_KEY ? '✅ CONNECTED & ONLINE' : '⚠️ READY'}
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
• messages     : View private direct messages (Admin)
• chats        : View visitor AI chat transcripts (Admin)
• fed          : View custom fed facts in AI memory
• clear        : Clear console screen
• Ask ANY question (Marks, JEE, Olympiads, Physics, AI, Mentors) to execute live!`;
    }

    const apiResult = await callNvidiaNemotronAPI(rawQuery);
    return apiResult || "🤖 System active. Please enter your query.";
  };

  const handleCommand = async (cmdText) => {
    const textToExecute = cmdText || input;
    if (!textToExecute.trim()) return;

    if (playClickSound) playClickSound();
    setIsApiLoading(true);

    // Push user prompt and animated 3-dot thinking status immediately into terminal history
    setHistory((prev) => [
      ...prev,
      { type: 'user', text: textToExecute },
      { type: 'thinking', text: 'Synthesizing response from neural knowledge base...' }
    ]);
    setInput('');

    const output = await processLogicalQuery(textToExecute);
    setIsApiLoading(false);

    if (output === null) {
      setHistory((prev) => prev.filter(item => item.type !== 'thinking'));
      return;
    }

    saveAiChatConversation({
      userPrompt: textToExecute,
      aiResponse: output,
      source: 'Terminal CLI'
    });

    // Replace thinking item with final agent response
    setHistory((prev) => {
      const withoutThinking = prev.filter(item => item.type !== 'thinking');
      return [
        ...withoutThinking,
        { type: 'agent', text: output }
      ];
    });
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
