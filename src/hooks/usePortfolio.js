import { useState, useEffect, useCallback } from 'react';
import { portfolioData as defaultData } from '../data/portfolioData';
import { fetchLivePortfolioData, saveLivePortfolioData, resetLivePortfolioData } from '../lib/supabaseClient';

function safeMerge(defaults, overrides) {
  if (!overrides || typeof overrides !== 'object') return defaults;
  return {
    hero: {
      ...defaults.hero,
      ...(overrides.hero || {})
    },
    ideologies: {
      ...defaults.ideologies,
      ...(overrides.ideologies || {}),
      tags: Array.isArray(overrides.ideologies?.tags) && overrides.ideologies.tags.length > 0 
        ? overrides.ideologies.tags 
        : defaults.ideologies.tags
    },
    olympiads: Array.isArray(overrides.olympiads) && overrides.olympiads.length > 0 
      ? overrides.olympiads 
      : defaults.olympiads,
    milestones: Array.isArray(overrides.milestones) && overrides.milestones.length > 0 
      ? overrides.milestones 
      : defaults.milestones,
    expertise: Array.isArray(overrides.expertise) && overrides.expertise.length > 0 
      ? overrides.expertise 
      : defaults.expertise,
    socials: Array.isArray(overrides.socials) && overrides.socials.length > 0 
      ? overrides.socials 
      : defaults.socials,
    closeFriends: Array.isArray(overrides.closeFriends) && overrides.closeFriends.length > 0 
      ? overrides.closeFriends 
      : defaults.closeFriends,
    artworksAndQuotes: Array.isArray(overrides.artworksAndQuotes) && overrides.artworksAndQuotes.length > 0 
      ? overrides.artworksAndQuotes 
      : defaults.artworksAndQuotes,
    botKnowledge: defaults.botKnowledge
  };
}

export function usePortfolio() {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem('adityahere_live_portfolio_data_v2');
      if (cached) {
        return safeMerge(defaultData, JSON.parse(cached));
      }
    } catch (e) {}
    return defaultData;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('adityahere_admin_unlocked') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Initial fetch from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    fetchLivePortfolioData()
      .then((liveData) => {
        if (isMounted && liveData) {
          setData(safeMerge(defaultData, liveData));
        }
      })
      .catch((e) => {
        console.warn('Portfolio data fetch fallback to defaults', e);
        if (isMounted) setData(defaultData);
      });

    const handleDataUpdate = (e) => {
      if (e?.detail) {
        setData(safeMerge(defaultData, e.detail));
      }
    };

    const handleAdminAuthChange = () => {
      try {
        setIsAdmin(localStorage.getItem('adityahere_admin_unlocked') === 'true');
      } catch (e) {}
    };

    window.addEventListener('portfolioDataUpdated', handleDataUpdate);
    window.addEventListener('adminAuthChanged', handleAdminAuthChange);
    window.addEventListener('storage', handleAdminAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('portfolioDataUpdated', handleDataUpdate);
      window.removeEventListener('adminAuthChanged', handleAdminAuthChange);
      window.removeEventListener('storage', handleAdminAuthChange);
    };
  }, []);

  const updateEntirePortfolio = useCallback(async (newData) => {
    setIsSaving(true);
    const sanitized = safeMerge(defaultData, newData);
    setData(sanitized);
    const result = await saveLivePortfolioData(sanitized);
    setIsSaving(false);
    setSaveStatus(result.mode === 'supabase_synced' ? '✅ Synced to Server Database' : '💾 Saved to Persistent Storage');
    setTimeout(() => setSaveStatus(''), 4000);
    return result;
  }, []);

  const updateSection = useCallback(async (sectionKey, newSectionValue) => {
    setData((prev) => {
      const updated = safeMerge(defaultData, {
        ...prev,
        [sectionKey]: newSectionValue
      });
      saveLivePortfolioData(updated);
      return updated;
    });
    setSaveStatus(`Saved ${sectionKey} to server!`);
    setTimeout(() => setSaveStatus(''), 3000);
  }, []);

  const updateHero = useCallback((hero) => updateSection('hero', hero), [updateSection]);
  const updateOlympiads = useCallback((olympiads) => updateSection('olympiads', olympiads), [updateSection]);
  const updateMilestones = useCallback((milestones) => updateSection('milestones', milestones), [updateSection]);
  const updateIdeologies = useCallback((ideologies) => updateSection('ideologies', ideologies), [updateSection]);
  const updateExpertise = useCallback((expertise) => updateSection('expertise', expertise), [updateSection]);
  const updateQuotes = useCallback((artworksAndQuotes) => updateSection('artworksAndQuotes', artworksAndQuotes), [updateSection]);
  const updateSocials = useCallback((socials) => updateSection('socials', socials), [updateSection]);
  const updateFriends = useCallback((closeFriends) => updateSection('closeFriends', closeFriends), [updateSection]);

  const unlockAdmin = useCallback((code) => {
    if (code === 'ALPHA1845' || code?.toLowerCase() === 'alpha1845') {
      setIsAdmin(true);
      try {
        localStorage.setItem('adityahere_admin_unlocked', 'true');
      } catch (e) {}
      window.dispatchEvent(new Event('adminAuthChanged'));
      return true;
    }
    return false;
  }, []);

  const lockAdmin = useCallback(() => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('adityahere_admin_unlocked');
    } catch (e) {}
    window.dispatchEvent(new Event('adminAuthChanged'));
  }, []);

  const resetDefaults = useCallback(() => {
    resetLivePortfolioData();
    setData(defaultData);
    setSaveStatus('Restored baseline portfolio values.');
    setTimeout(() => setSaveStatus(''), 3000);
  }, []);

  return {
    data,
    isAdmin,
    isSaving,
    saveStatus,
    updateEntirePortfolio,
    updateSection,
    updateHero,
    updateOlympiads,
    updateMilestones,
    updateIdeologies,
    updateExpertise,
    updateQuotes,
    updateSocials,
    updateFriends,
    unlockAdmin,
    lockAdmin,
    resetDefaults
  };
}
