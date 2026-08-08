import { createClient } from '@supabase/supabase-js';
import { portfolioData } from '../data/portfolioData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ----------------------------------------------------
// 1. Unified Persistent Portfolio Data Engine
// ----------------------------------------------------
const LIVE_PORTFOLIO_STORAGE_KEY = 'adityahere_live_portfolio_data_v2';
const PORTFOLIO_DOC_ID = 'adityahere_main_v1';

export async function fetchLivePortfolioData() {
  // 1. Try fetching from Supabase database
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_data')
        .select('*')
        .eq('id', PORTFOLIO_DOC_ID)
        .single();

      if (!error && data && data.payload) {
        // Cache to local storage for instant offline / fallback rendering
        localStorage.setItem(LIVE_PORTFOLIO_STORAGE_KEY, JSON.stringify(data.payload));
        return data.payload;
      }
    } catch (e) {
      console.warn('Supabase portfolio fetch failed, checking local storage', e);
    }
  }

  // 2. Fallback to LocalStorage
  try {
    const cached = localStorage.getItem(LIVE_PORTFOLIO_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...portfolioData, ...parsed };
    }
  } catch (e) {
    console.warn('Error reading from localStorage', e);
  }

  // 3. Fallback to default portfolioData
  return portfolioData;
}

export async function saveLivePortfolioData(updatedData) {
  if (!updatedData) return { success: false };

  // 1. Persist immediately to localStorage
  try {
    localStorage.setItem(LIVE_PORTFOLIO_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (e) {
    console.error('LocalStorage save error', e);
  }

  // 2. Dispatch cross-component event so all open tabs and views update instantly
  window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));

  // 3. Persist to Supabase backend table
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_data')
        .upsert([
          {
            id: PORTFOLIO_DOC_ID,
            payload: updatedData,
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.warn('Supabase portfolio upsert warning:', error.message);
        return { success: true, mode: 'local_cached', warning: error.message };
      }
      return { success: true, mode: 'supabase_synced' };
    } catch (e) {
      console.warn('Supabase save exception:', e);
      return { success: true, mode: 'local_fallback' };
    }
  }

  return { success: true, mode: 'local_stored' };
}

export function resetLivePortfolioData() {
  try {
    localStorage.removeItem(LIVE_PORTFOLIO_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: portfolioData }));
    return true;
  } catch (e) {
    return false;
  }
}

// ----------------------------------------------------
// 2. Visitor Feedback Comments System
// ----------------------------------------------------
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

export async function deleteVisitorComment(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete error', e);
    }
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
      const { error } = await supabase.from('comments').update(updatedFields).eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase update comment error', e);
    }
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

// ----------------------------------------------------
// 3. Private Direct Messages (ALPHA1845 Admin Access)
// ----------------------------------------------------
const PRIVATE_MSG_STORAGE_KEY = 'adityahere_private_dms_v1';

const initialPrivateMsgs = [
  {
    id: 'pm_init_1',
    name: 'Saurabh (Allen Peer)',
    contactInfo: 'Telegram @saurabh_allen',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
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
// 4. AI Chatbot Conversation Vault (ALPHA1845 Access)
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

// ----------------------------------------------------
// 5. Real-Time Visitor & Peer Reactions Engine
// ----------------------------------------------------
const REACTION_STORAGE_KEY = 'adityahere_reaction_counts_v1';
const VISITOR_STATS_KEY = 'adityahere_visitor_stats_v1';

const defaultReactions = {
  rocket: 0,
  brain: 0,
  trophy: 0,
  fire: 0
};

export async function fetchReactionCounts() {
  try {
    const stored = localStorage.getItem(REACTION_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(REACTION_STORAGE_KEY, JSON.stringify(defaultReactions));
    return defaultReactions;
  } catch (e) {
    return defaultReactions;
  }
}

export async function incrementReactionCount(type) {
  try {
    const existing = await fetchReactionCounts();
    const updated = {
      ...existing,
      [type]: (existing[type] || 0) + 1
    };
    localStorage.setItem(REACTION_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('reactionCountsUpdated', { detail: updated }));
    return updated;
  } catch (e) {
    return defaultReactions;
  }
}

export async function fetchVisitorStats() {
  let totalViews = 0;
  let activeSessions = 1;

  // Fetch total count from Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { count } = await supabase.from('visitor_sessions').select('*', { count: 'exact', head: true });
      if (count !== null && count !== undefined) totalViews = count;

      // Active in last 15 minutes
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { count: activeCount } = await supabase.from('visitor_sessions').select('ip', { count: 'exact', head: true }).gte('timestamp', fifteenMinsAgo);
      if (activeCount !== null && activeCount !== undefined) activeSessions = Math.max(1, activeCount);
    } catch (e) {}
  }

  try {
    const storedLogs = localStorage.getItem(REAL_VISITOR_LOGS_KEY);
    const sessionList = storedLogs ? JSON.parse(storedLogs) : [];
    const localTotal = sessionList.length;

    const stored = localStorage.getItem(VISITOR_STATS_KEY);
    let stats = stored ? JSON.parse(stored) : { totalViews: 0, onlinePeers: 1 };
    stats.totalViews = Math.max(localTotal, totalViews, stats.totalViews + 1);
    stats.onlinePeers = activeSessions;
    localStorage.setItem(VISITOR_STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (e) {
    return { totalViews, onlinePeers: activeSessions };
  }
}

export function subscribeToRealtimePresence(onCountChange) {
  if (isSupabaseConfigured && supabase) {
    try {
      const channel = supabase.channel('online-visitors', {
        config: { presence: { key: 'user_' + Math.random().toString(36).substr(2, 9) } }
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const liveCount = Math.max(1, Object.keys(state).length);
          if (onCountChange) onCountChange(liveCount);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString() });
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime presence subscription warn:', e);
    }
  }

  // Local fallback
  return () => {};
}

// ----------------------------------------------------
// 6. 100% Real Live Visitor Geolocation & Device Telemetry Engine
// ----------------------------------------------------

const REAL_VISITOR_LOGS_KEY = 'adityahere_real_visitor_logs_v1';
const VISITOR_DEVICE_ID_KEY = 'adityahere_visitor_device_id_v1';
let currentActiveSessionId = null;

export function getOrCreateVisitorDeviceId() {
  try {
    let devId = localStorage.getItem(VISITOR_DEVICE_ID_KEY);
    if (!devId) {
      const randHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
      devId = `DEV-${randHex}`;
      localStorage.setItem(VISITOR_DEVICE_ID_KEY, devId);
    }
    return devId;
  } catch (e) {
    return 'DEV-LOCAL1';
  }
}

export async function reverseGeocodeCoords(latitude, longitude) {
  // 1. Primary: OpenStreetMap Nominatim High-Resolution (zoom=18 for exact street, landmark & colony)
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`;
    const res = await fetch(nomUrl, { headers: { 'User-Agent': 'AdityaProfile/2.0' } });
    if (res.ok) {
      const data = await res.json();
      const a = data.address || {};
      const landmark = a.amenity || a.building || a.shop || a.suburb || a.neighbourhood || a.road || a.city_district || a.subdistrict || '';
      const city = a.city || a.town || a.village || a.county || '';
      const state = a.state || a.country || '';
      const parts = Array.from(new Set([landmark, city, state].filter(Boolean)));
      if (parts.length > 0) {
        return `${parts.join(', ')} (🎯 GPS Exact)`;
      }
    }
  } catch (e) {}

  // 2. Fallback: BigDataCloud Reverse Geocoding
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const adminList = data.localityInfo?.administrative || [];
      const adminNames = adminList.map(a => a.name).filter(n => n && !n.includes('India'));
      const locality = data.locality || data.localityInfo?.informative?.[0]?.name || '';
      const city = data.city || data.principalSubdivision || '';
      const parts = Array.from(new Set([locality, ...adminNames, city, data.countryName].filter(Boolean)));
      if (parts.length > 0) {
        return `${parts.join(', ')} (🎯 GPS Exact)`;
      }
    }
  } catch (e) {}

  return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}° (🎯 GPS Coords)`;
}

export function requestExactGPSLocation() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const exactAddress = await reverseGeocodeCoords(latitude, longitude);
        if (exactAddress) {
          resolve({
            latitude,
            longitude,
            locationString: exactAddress
          });
        } else {
          resolve({
            latitude,
            longitude,
            locationString: `GPS ${latitude.toFixed(2)}°, ${longitude.toFixed(2)}° (🎯 GPS Exact)`
          });
        }
      },
      (err) => {
        console.warn('GPS position request skipped/denied:', err?.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  });
}

export async function fetchRealVisitorLocation() {
  const token = import.meta.env.VITE_IPINFO_TOKEN || 'cbeda1c63da1c3';

  // Primary: IPInfo API with token
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${token}`, { timeout: 4000 });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        const locName = `${data.city || 'Live'}, ${data.region || ''}, ${data.country || 'IN'} (${data.org || 'ISP'})`;
        return {
          ip: data.ip,
          city: data.city || 'Local',
          region: data.region || '',
          country: data.country || 'Online',
          org: data.org || 'ISP Network',
          postal: data.postal || '',
          ipInfoLocation: `📡 IPInfo Net: ${data.city || ''}, ${data.region || ''}, ${data.country || ''} (${data.org || 'ISP'})`,
          location: `📡 IPInfo Net: ${locName}`,
          device: getDeviceType()
        };
      }
    }
  } catch (e) {
    console.warn('IPInfo API lookup error, using fallback:', e);
  }

  // Fallback 1: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/', { timeout: 4000 });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        const locName = data.city && data.country_name ? `${data.city}${data.region ? ', ' + data.region : ''}, ${data.country_name}` : 'Live Session';
        return {
          ip: data.ip,
          city: data.city || 'Local',
          region: data.region || '',
          country: data.country_name || 'Online',
          org: data.org || 'ISP Network',
          ipInfoLocation: `📡 IP Net: ${locName}`,
          location: locName + ' (📡 ISP Node)',
          device: getDeviceType()
        };
      }
    }
  } catch (e) {}

  return {
    ip: '127.0.0.1',
    city: 'Local Session',
    region: '',
    country: 'Client Host',
    org: 'Localhost',
    ipInfoLocation: '📡 IP Net: Localhost',
    location: 'Localhost Session',
    device: getDeviceType()
  };
}

function getDeviceType() {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'Android Mobile';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS Device';
  if (/Mac/i.test(ua)) return 'MacOS';
  if (/Windows/i.test(ua)) return 'Windows Desktop';
  return 'Desktop Web';
}

export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m`;
}

export async function upgradeSessionWithGPSLocation() {
  try {
    const gps = await requestExactGPSLocation();
    if (!gps || !gps.locationString) return null;

    const deviceId = getOrCreateVisitorDeviceId();
    const storedLogs = localStorage.getItem(REAL_VISITOR_LOGS_KEY);
    if (!storedLogs) return null;

    const profiles = JSON.parse(storedLogs);
    const updated = profiles.map(p => {
      if (p.deviceId === deviceId || p.id === currentActiveSessionId) {
        const dualLoc = `${p.ipInfoLocation || p.location} | ${gps.locationString}`;
        return {
          ...p,
          gpsLocation: gps.locationString,
          location: dualLoc,
          isGpsExact: true,
          activities: Array.isArray(p.activities)
            ? [...p.activities, `🎯 GPS Resolved: ${gps.locationString}`].slice(-100)
            : [`🎯 GPS Resolved: ${gps.locationString}`]
        };
      }
      return p;
    });

    localStorage.setItem(REAL_VISITOR_LOGS_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('visitor_sessions').update({
          location: gps.locationString
        }).eq('deviceId', deviceId);
      } catch (e) {}
    }

    return gps.locationString;
  } catch (e) {
    return null;
  }
}

export async function recordRealVisitorSession() {
  try {
    const geo = await fetchRealVisitorLocation();
    const deviceId = getOrCreateVisitorDeviceId();
    const sessionId = 'vis_' + Date.now();
    currentActiveSessionId = sessionId;

    const nowIso = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialActivity = `📍 Visit Session Started (${timeStr})`;

    const storedLogs = localStorage.getItem(REAL_VISITOR_LOGS_KEY);
    let existingProfiles = storedLogs ? JSON.parse(storedLogs) : [];

    // Match existing device profile by deviceId or IP
    let targetIndex = existingProfiles.findIndex(
      p => p.deviceId === deviceId || (p.ip === geo.ip && geo.ip !== '127.0.0.1')
    );

    let profileRecord;

    if (targetIndex !== -1) {
      // Returning device: Accumulate visit count and append new session start log without deleting previous logs
      const prev = existingProfiles[targetIndex];
      const prevVisits = (prev.visitCount || 1) + 1;
      const prevActivities = Array.isArray(prev.activities) ? prev.activities : [];
      const updatedActivities = [...prevActivities, initialActivity].slice(-100);

      profileRecord = {
        ...prev,
        deviceId,
        ip: geo.ip,
        location: prev.location || geo.location,
        device: geo.device,
        isp: geo.org,
        lastSeen: nowIso,
        visitCount: prevVisits,
        totalDwellSeconds: (prev.totalDwellSeconds || prev.duration_seconds || 1),
        currentSessionSeconds: 1,
        totalActionsCount: (prev.totalActionsCount || prevActivities.length) + 1,
        activities: updatedActivities
      };

      existingProfiles[targetIndex] = profileRecord;
    } else {
      // New device first visit profile
      profileRecord = {
        id: sessionId,
        deviceId,
        ip: geo.ip,
        location: geo.location,
        city: geo.city,
        country: geo.country,
        isp: geo.org,
        device: geo.device,
        firstSeen: nowIso,
        lastSeen: nowIso,
        timestamp: nowIso,
        visitCount: 1,
        totalDwellSeconds: 1,
        currentSessionSeconds: 1,
        totalActionsCount: 1,
        activities: [initialActivity]
      };

      existingProfiles = [profileRecord, ...existingProfiles];
    }

    // Sort profiles by last active time and cap at 100 devices
    existingProfiles.sort((a, b) => new Date(b.lastSeen || b.timestamp) - new Date(a.lastSeen || a.timestamp));
    existingProfiles = existingProfiles.slice(0, 100);
    localStorage.setItem(REAL_VISITOR_LOGS_KEY, JSON.stringify(existingProfiles));

    // Store/upsert in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('visitor_sessions').upsert([profileRecord]);
      } catch (e) {}
    }

    // Trigger high-accuracy GPS upgrade asynchronously in background
    setTimeout(() => {
      upgradeSessionWithGPSLocation();
    }, 1200);

    return profileRecord;
  } catch (e) {
    return null;
  }
}

export async function updateVisitorDwellTime(seconds) {
  const deviceId = getOrCreateVisitorDeviceId();
  try {
    const stored = localStorage.getItem(REAL_VISITOR_LOGS_KEY);
    if (!stored) return;
    const profiles = JSON.parse(stored);
    const updated = profiles.map(p => {
      if (p.deviceId === deviceId || p.id === currentActiveSessionId) {
        const prevSessionSeconds = p.currentSessionSeconds || 0;
        const delta = Math.max(1, seconds - prevSessionSeconds);
        return {
          ...p,
          currentSessionSeconds: seconds,
          totalDwellSeconds: (p.totalDwellSeconds || p.duration_seconds || 0) + delta,
          lastSeen: new Date().toISOString()
        };
      }
      return p;
    });
    localStorage.setItem(REAL_VISITOR_LOGS_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('visitor_sessions').update({
          duration_seconds: seconds,
          lastSeen: new Date().toISOString()
        }).eq('deviceId', deviceId);
      } catch (e) {}
    }
  } catch (e) {}
}

export async function logVisitorActivity(activityDescription) {
  if (!activityDescription) return;

  const deviceId = getOrCreateVisitorDeviceId();
  try {
    const timeTag = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedAction = `[${timeTag}] ${activityDescription}`;

    const stored = localStorage.getItem(REAL_VISITOR_LOGS_KEY);
    if (stored) {
      const profiles = JSON.parse(stored);
      const updated = profiles.map(p => {
        if (p.deviceId === deviceId || p.id === currentActiveSessionId || p === profiles[0]) {
          const currentActs = Array.isArray(p.activities) ? p.activities : [];
          if (currentActs[currentActs.length - 1] !== formattedAction) {
            return {
              ...p,
              totalActionsCount: (p.totalActionsCount || currentActs.length) + 1,
              lastSeen: new Date().toISOString(),
              activities: [...currentActs, formattedAction].slice(-100)
            };
          }
        }
        return p;
      });
      localStorage.setItem(REAL_VISITOR_LOGS_KEY, JSON.stringify(updated));
    }
  } catch (e) {}
}

export async function fetchRealVisitorSessions() {
  // 1. Try Supabase (Capacity 100)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('lastSeen', { ascending: false })
        .limit(100);
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
  }

  // 2. LocalStorage Fallback
  try {
    const stored = localStorage.getItem(REAL_VISITOR_LOGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}

  return [];
}

export async function clearRealVisitorSessions() {
  try {
    localStorage.setItem(REAL_VISITOR_LOGS_KEY, JSON.stringify([]));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('visitor_sessions').delete().neq('id', '0');
    }
    return true;
  } catch (e) {
    return false;
  }
}




