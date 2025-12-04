// Cookie Banner Logic for PersalOne
// CSP-friendly: no inline handlers, vanilla JS

(function() {
  'use strict';

  const CONSENT_KEY = 'persalone_cookie_consent';
  const CONSENT_VALUE = 'accepted';
  const CONSENT_DURATION_DAYS = 365; // 12 months

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

  function hasConsent() {
    // Check localStorage first
    if (localStorage.getItem(CONSENT_KEY) === CONSENT_VALUE) {
      return true;
    }
    // Check cookie as fallback
    if (getCookie(CONSENT_KEY) === CONSENT_VALUE) {
      return true;
    }
    return false;
  }

  function saveConsent() {
    // Save to both localStorage and cookie
    try {
      localStorage.setItem(CONSENT_KEY, CONSENT_VALUE);
    } catch (e) {
      // localStorage might be disabled
      console.warn('Could not save to localStorage:', e);
    }
    setCookie(CONSENT_KEY, CONSENT_VALUE, CONSENT_DURATION_DAYS);
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

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (!banner) {
      return; // Banner not present on this page
    }

    // Check if user already gave consent
    if (hasConsent()) {
      hideBanner(banner);
      return;
    }

    // Show banner if no consent
    showBanner(banner);

    // Add click listener to accept button
    if (acceptButton) {
      acceptButton.addEventListener('click', function() {
        saveConsent();
        hideBanner(banner);
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
})();
