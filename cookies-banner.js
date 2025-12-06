// Cookie Banner Logic for PersalOne (Enhanced)
// CSP-friendly: no inline handlers, vanilla JS
// Supports categories: essential (always on) and analytics (optional)

(function() {
  'use strict';

  const CONSENT_KEY = 'persalone_cookie_consent';
  const CONSENT_VERSION = 'v1';
  const CONSENT_DURATION_DAYS = 365;

  // Cookie categories
  const CATEGORIES = {
    essential: {
      name: 'Esenciales',
      description: 'Necesarias para que el sitio funcione correctamente',
      required: true
    },
    analytics: {
      name: 'Métricas y analítica',
      description: 'Nos ayudan a entender cómo se usa el sitio para mejorarlo',
      required: false
    }
  };

  // Global consent state
  let consentState = {
    version: CONSENT_VERSION,
    timestamp: null,
    categories: {
      essential: true,
      analytics: false
    }
  };

  /**
   * Public API: Get current consent state for a specific category
   * Usage: window.PersalOneCookies.hasConsent('analytics')
   */
  function hasConsentFor(category) {
    loadConsentState();
    return consentState.categories[category] === true;
  }

  /**
   * Public API: Get all consent preferences
   */
  function getConsentState() {
    loadConsentState();
    return { ...consentState };
  }

  /**
   * Public API: Check if user has made a choice
   */
  function hasUserConsented() {
    return localStorage.getItem(CONSENT_KEY) !== null;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  function loadConsentState() {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate version
        if (parsed.version === CONSENT_VERSION) {
          consentState = parsed;
          return true;
        }
      }
    } catch (e) {
      console.warn('Could not load consent state:', e);
    }
    return false;
  }

  function saveConsentState() {
    consentState.timestamp = new Date().toISOString();
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consentState));
      // Also save to cookie as backup
      setCookie(CONSENT_KEY, btoa(JSON.stringify(consentState)), CONSENT_DURATION_DAYS);
    } catch (e) {
      console.warn('Could not save consent state:', e);
    }

    // Trigger custom event for other scripts to listen
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { ...consentState }
    }));

    // Load analytics if consent given
    if (consentState.categories.analytics) {
      loadAnalytics();
    }
  }

  function loadAnalytics() {
    // Placeholder: This is where you would load your analytics script
    // Only called if user has consented to analytics
    console.log('Analytics consent granted - ready to load tracking scripts');
    // Example:
    // var script = document.createElement('script');
    // script.src = 'your-analytics.js';
    // document.head.appendChild(script);
  }

  function hideBanner(banner) {
    if (banner) {
      banner.style.display = 'none';
      banner.setAttribute('aria-hidden', 'true');
    }
  }

  function showBanner(banner) {
    if (banner) {
      banner.style.display = 'block';
      banner.removeAttribute('aria-hidden');
    }
  }

  function hideSettings(settings) {
    if (settings) {
      settings.style.display = 'none';
      settings.setAttribute('aria-hidden', 'true');
    }
  }

  function showSettings(settings) {
    if (settings) {
      settings.style.display = 'block';
      settings.removeAttribute('aria-hidden');
    }
  }

  function acceptAll() {
    consentState.categories.essential = true;
    consentState.categories.analytics = true;
    saveConsentState();
  }

  function rejectNonEssential() {
    consentState.categories.essential = true;
    consentState.categories.analytics = false;
    saveConsentState();
  }

  function saveCustomPreferences() {
    // Read checkbox states
    const analyticsCheckbox = document.getElementById('cookie-analytics');
    if (analyticsCheckbox) {
      consentState.categories.analytics = analyticsCheckbox.checked;
    }
    consentState.categories.essential = true; // Always true
    saveConsentState();
  }

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const settingsPanel = document.getElementById('cookie-settings');

    if (!banner) {
      return; // Banner not present on this page
    }

    // Check if user already gave consent
    if (loadConsentState()) {
      hideBanner(banner);
      if (settingsPanel) hideSettings(settingsPanel);

      // Load analytics if previously consented
      if (consentState.categories.analytics) {
        loadAnalytics();
      }
      return;
    }

    // Show banner if no consent
    showBanner(banner);

    // Button event listeners
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const rejectBtn = document.getElementById('cookie-reject');
    const configureBtn = document.getElementById('cookie-configure');
    const savePrefsBtn = document.getElementById('cookie-save-prefs');
    const backBtn = document.getElementById('cookie-back');

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', function() {
        acceptAll();
        hideBanner(banner);
        if (settingsPanel) hideSettings(settingsPanel);
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        rejectNonEssential();
        hideBanner(banner);
        if (settingsPanel) hideSettings(settingsPanel);
      });
    }

    if (configureBtn && settingsPanel) {
      configureBtn.addEventListener('click', function() {
        hideBanner(banner);
        showSettings(settingsPanel);

        // Set checkbox states to current consent
        const analyticsCheckbox = document.getElementById('cookie-analytics');
        if (analyticsCheckbox) {
          analyticsCheckbox.checked = consentState.categories.analytics;
        }
      });
    }

    if (savePrefsBtn && settingsPanel) {
      savePrefsBtn.addEventListener('click', function() {
        saveCustomPreferences();
        hideSettings(settingsPanel);
      });
    }

    if (backBtn && settingsPanel) {
      backBtn.addEventListener('click', function() {
        hideSettings(settingsPanel);
        showBanner(banner);
      });
    }
  }

  // Expose public API
  window.PersalOneCookies = {
    hasConsent: hasConsentFor,
    getState: getConsentState,
    hasUserConsented: hasUserConsented
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
})();
