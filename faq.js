// FAQ Accordion Script for PersalOne
// CSP-friendly: no inline handlers, vanilla JS

(function() {
  'use strict';

  function initAccordion() {
    const accordion = document.querySelector('.faq-accordion');
    if (!accordion) return;

    const faqItems = accordion.querySelectorAll('[data-faq]');
    
    faqItems.forEach(function(item) {
      const header = item.querySelector('.faq-header');
      const panel = item.querySelector('.faq-panel');
      
      if (!header || !panel) return;

      header.addEventListener('click', function() {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        
        // Close all other items
        faqItems.forEach(function(otherItem) {
          const otherHeader = otherItem.querySelector('.faq-header');
          const otherPanel = otherItem.querySelector('.faq-panel');
          
          if (otherItem !== item) {
            otherHeader.setAttribute('aria-expanded', 'false');
            otherPanel.setAttribute('hidden', '');
            otherItem.classList.remove('is-open');
          }
        });
        
        // Toggle current item
        if (isExpanded) {
          header.setAttribute('aria-expanded', 'false');
          panel.setAttribute('hidden', '');
          item.classList.remove('is-open');
        } else {
          header.setAttribute('aria-expanded', 'true');
          panel.removeAttribute('hidden');
          item.classList.add('is-open');
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }
})();
