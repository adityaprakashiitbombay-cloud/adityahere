import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import { fetchPrivateMessages, fetchAiChatLogs, saveAiChatConversation, clearAllAiChatLogs } from '../../lib/supabaseClient';

const FED_KNOWLEDGE_STORAGE_KEY = 'adityahere_fed_ai_knowledge_v1';
const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY || import.meta.env.VITE_AI_API_KEY || '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';

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
HOW TO ANSWER:
========================================
- Always generate live, articulate, and intelligent answers.
- Understand English, Hinglish, and Hindi queries naturally.
- Tone: Sharp, high-IQ, tech-savvy, confident, authentic (not robotic or canned).
- Length: Concise and impactful (2-5 sentences for simple questions, detailed for math/physics/code).`;

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
                temperature: 0.65,
                max_tokens: 400
              })
            });

            if (resp.ok) {
              const data = await resp.json();
              const text = data.choices?.[0]?.message?.content;
              if (text && text.trim()) return text.trim();
            }
          } catch (e) {
            console.warn(`Fetch attempt error for ${modelCandidate}:`, e);
          }
        }
      }

      return synthesizeDynamicResponse(userPrompt);
    } catch (err) {
      console.warn("AI Engine execution error:", err);
      return synthesizeDynamicResponse(userPrompt);
    }
  };

  const synthesizeDynamicResponse = (prompt) => {
    const p = prompt.toLowerCase();
    if (p.includes('kya haal') || p.includes('kaise') || p.includes('bhai') || p.includes('hey') || p.includes('hello') || p.includes('hi')) {
      return `Sab badhiya bhai! 🚀 I am adityahere's live AI agent. Ask me anything about my IIT JEE 2028 preparation @ Allen Patna, Olympiads (IOQM 2x, RMO 1x, NSEP 1x), 95.4% in 10th, or Physics!`;
    }
    if (p.includes('mark') || p.includes('score') || p.includes('10th') || p.includes('percent')) {
      return `Aditya scored 95.4% overall in Class 10th CBSE with a perfect 100/100 score in Information Technology (IT)! 💯`;
    }
    if (p.includes('ioqm') || p.includes('rmo') || p.includes('nsep') || p.includes('olympiad')) {
      return `🏆 Official Olympiad Record:\n• IOQM (Indian Olympiad Qualifier in Mathematics): 2x Qualified\n• RMO (Regional Mathematical Olympiad): 1x Qualified (National Stage 2)\n• NSEP (National Standard Examination in Physics): 1x Qualified (National Stage 1)`;
    }
    if (p.includes('allen') || p.includes('jee') || p.includes('iit') || p.includes('patna')) {
      return `Targeting Top AIR in JEE Advanced 2028 from Allen Patna (Ashiyana Digha Branch). Deep in physics problem-solving mode with Pathfinder & Irodov. ⚛️`;
    }
    if (p.includes('samarthya') || p.includes('pioneer') || p.includes('mentor') || p.includes('neha') || p.includes('ajit')) {
      return `Mentored during middle school at Samarthya Classes & Pioneer Academy Lalganj by Neha Mam (English) and Ajit Sir (Maths). Early schooling at St. Michaels Lalganj.`;
    }
    if (p.includes('friend') || p.includes('abhay') || p.includes('prashant') || p.includes('ayush') || p.includes('sahil')) {
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
      toggleLiveEdit(true);
      if (playClickSound) playClickSound();
      return '[SYSTEM OVERRIDE] Edit mode & Admin Vault unlocked! Welcome back, Aditya. Type "messages" to read private direct messages, or "chats" to review AI transcripts.';
    }

    if (qLower === 'lock') {
      setIsAdminUnlocked(false);
      localStorage.removeItem('adityahere_admin_unlocked');
      window.dispatchEvent(new Event('adminAuthChanged'));
      toggleLiveEdit(false);
      return '🔒 Admin Matrix & Live Editing locked. Returned to guest mode.';
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

    if (qLower === 'help') {
      return `AVAILABLE SYSTEM COMMANDS:
-------------------------
• ALPHA1845: Unlock Admin Matrix & Live In-Place Editing
• messages : View private direct messages (Admin)
• chats    : View visitor AI chat transcripts (Admin)
• fed      : View custom fed facts in AI memory
• clear    : Clear console screen
• Ask ANY question (Marks, JEE, Olympiads, Physics, AI, Mentors) to execute live through the AI API!`;
    }

    const apiResult = await callNvidiaNemotronAPI(rawQuery);
    return apiResult || "🤖 System active. Please enter your query.";
  };

  const handleCommand = async (cmdText) => {
    const textToExecute = cmdText || input;
    if (!textToExecute.trim()) return;

    if (playClickSound) playClickSound();
    setIsApiLoading(true);

    const output = await processLogicalQuery(textToExecute);
    setIsApiLoading(false);

    if (output === null) return;

    saveAiChatConversation({
      userPrompt: textToExecute,
      aiResponse: output,
      source: 'Terminal CLI'
    });

    setHistory((prev) => [
      ...prev,
      { type: 'user', text: textToExecute },
      { type: 'agent', text: output }
    ]);

    setInput('');
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
