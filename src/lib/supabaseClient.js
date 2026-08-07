import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fallback Local Storage Storage Manager for Visitor Feedback
const LOCAL_STORAGE_KEY = 'myprofile_visitor_comments_v1';

const initialDefaultComments = [
  {
    id: '1',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    name: 'Abhay',
    role: 'Brother',
    message: 'Insane portfolio design! Neo-brutalism matches your vibe perfectly. All the best for Allen Patna JEE 2028!',
    stars: 5
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    name: 'Prashant',
    role: 'Pioneer Academy Friend',
    message: '100% in IT was iconic! Neha Mam & Ajit Sir would be proud.',
    stars: 5
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    name: 'Visitor Dev',
    role: 'Full Stack Engineer',
    message: 'Love the dark mode aesthetics and the interactive AI terminal! Keep building.',
    stars: 5
  }
];

export async function fetchVisitorComments() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using local storage fallback', e);
    }
  }

  // Fallback to localStorage
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDefaultComments));
      return initialDefaultComments;
    }
  } catch (e) {
    return initialDefaultComments;
  }
}

export async function submitVisitorComment({ name, role, message, stars }) {
  const newComment = {
    name: name || 'Anonymous',
    role: role || 'Visitor',
    message: message || '',
    stars: Number(stars) || 5,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([newComment])
        .select();

      if (!error && data && data.length > 0) {
        return { success: true, data: data[0], mode: 'supabase' };
      }
    } catch (e) {
      console.warn('Supabase insert failed, falling back to local storage', e);
    }
  }

  // LocalStorage Fallback
  try {
    const existing = await fetchVisitorComments();
    const commentWithId = { ...newComment, id: 'local_' + Date.now() };
    const updated = [commentWithId, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, data: commentWithId, mode: 'local' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Admin Operations: Delete & Update Comments
export async function deleteVisitorComment(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('comments').delete().eq('id', id);
    } catch (e) {}
  }
  try {
    const existing = await fetchVisitorComments();
    const filtered = existing.filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateVisitorComment(id, updatedFields) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('comments').update(updatedFields).eq('id', id);
    } catch (e) {}
  }
  try {
    const existing = await fetchVisitorComments();
    const updated = existing.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

// Private Messages Vault Manager (Direct Messages to Aditya)
const PRIVATE_MSG_STORAGE_KEY = 'myprofile_private_messages_v1';

const initialPrivateMsgs = [
  {
    id: 'pm_1',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    name: 'Allen Patna Batchmate',
    contactInfo: 'Telegram @jee2028_aspirant',
    message: 'Hey Aditya! Saw your 100% score in IT and physics notes. Let’s connect at Ashiyana branch for Pathfinder solving!'
  }
];

export async function fetchPrivateMessages() {
  try {
    const cached = localStorage.getItem(PRIVATE_MSG_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    } else {
      localStorage.setItem(PRIVATE_MSG_STORAGE_KEY, JSON.stringify(initialPrivateMsgs));
      return initialPrivateMsgs;
    }
  } catch (e) {
    return initialPrivateMsgs;
  }
}

export async function submitPrivateMessage({ name, contactInfo, message }) {
  const newMsg = {
    id: 'pm_' + Date.now(),
    name: name || 'Anonymous Visitor',
    contactInfo: contactInfo || 'Not Provided',
    message: message || '',
    created_at: new Date().toISOString()
  };

  try {
    const existing = await fetchPrivateMessages();
    const updated = [newMsg, ...existing];
    localStorage.setItem(PRIVATE_MSG_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, data: newMsg };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function deletePrivateMessage(id) {
  try {
    const existing = await fetchPrivateMessages();
    const filtered = existing.filter((m) => m.id !== id);
    localStorage.setItem(PRIVATE_MSG_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

// ----------------------------------------------------
// AI Chatbot Conversation Vault (Accessible via ALPHA1845)
// ----------------------------------------------------
const AI_CHAT_STORAGE_KEY = 'adityahere_ai_chat_vault_v1';

const initialDefaultAiChats = [
  {
    id: 'chat_init_1',
    userPrompt: 'What is your Class 10th score and IT marks?',
    aiResponse: 'Scored 95.4% overall in Class 10th CBSE with a perfect 100/100 score in Information Technology (IT)! 💯',
    model: 'NVIDIA Nemotron 4-340B',
    source: 'Home Widget',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'chat_init_2',
    userPrompt: 'Tell me about IOQM and RMO Olympiads',
    aiResponse: 'Aditya is a 2x IOQM (Indian Olympiad Qualifier in Mathematics) and 1x RMO (Regional Mathematical Olympiad) qualifier, along with 1x NSEP in Physics!',
    model: 'NVIDIA Nemotron 4-340B',
    source: 'Terminal CLI',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export async function fetchAiChatLogs() {
  try {
    const stored = localStorage.getItem(AI_CHAT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(AI_CHAT_STORAGE_KEY, JSON.stringify(initialDefaultAiChats));
    return initialDefaultAiChats;
  } catch (e) {
    return initialDefaultAiChats;
  }
}

export async function saveAiChatConversation({ userPrompt, aiResponse, model = 'NVIDIA Nemotron', source = 'Terminal' }) {
  if (!userPrompt || !aiResponse) return null;
  const newChat = {
    id: 'aichat_' + Date.now(),
    userPrompt: userPrompt.trim(),
    aiResponse: aiResponse.trim(),
    model,
    source,
    timestamp: new Date().toISOString()
  };

  try {
    const existing = await fetchAiChatLogs();
    const updated = [newChat, ...existing];
    localStorage.setItem(AI_CHAT_STORAGE_KEY, JSON.stringify(updated));
    return newChat;
  } catch (e) {
    return null;
  }
}

export async function deleteAiChatLog(id) {
  try {
    const existing = await fetchAiChatLogs();
    const filtered = existing.filter((c) => c.id !== id);
    localStorage.setItem(AI_CHAT_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

export async function clearAllAiChatLogs() {
  try {
    localStorage.setItem(AI_CHAT_STORAGE_KEY, JSON.stringify([]));
    return true;
  } catch (e) {
    return false;
  }
}

