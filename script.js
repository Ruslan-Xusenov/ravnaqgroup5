document.addEventListener('DOMContentLoaded', () => {

  const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwAXwgwRO8gJfTm75X7Gr3N56vC6fW66o1n6RJmOHAlPIiykF1POz2e5A4JroSbthw0bA/exec';
  const TIMER_STORAGE_KEY = 'saodat_landing5_timer_timestamp';
  const INITIAL_DURATION_SECONDS = 119;

  const dynamicHeadline = document.getElementById('dynamic-headline');
  const liveTimer = document.getElementById('live-timer');
  const stickyTimerClock = document.getElementById('sticky-timer-clock');
  const stickyBar = document.getElementById('sticky-bar');
  const btnTop = document.getElementById('btn-register-top');
  const btnBottom = document.getElementById('btn-register-bottom');
  const stickyRegisterBtn = document.getElementById('sticky-register-btn');
  const dynamicBenefitsList = document.getElementById('dynamic-benefits-list');

  const registerModal = document.getElementById('register-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalStepPhone = document.getElementById('modal-step-phone');
  const modalStepFinal = document.getElementById('modal-step-final');
  const leadForm = document.getElementById('lead-form');
  const phoneWrapper = document.getElementById('phone-wrapper');
  const userPhone = document.getElementById('user-phone');
  const submitLeadBtn = document.getElementById('submit-lead-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const tgSubscribeBtn = document.getElementById('tg-subscribe-btn');

  const HOOK_ITEMS = [
    {
      id: 1,
      raw: "Uy xarid qiling hamda qo'shimchasiga damas avtomobili yutib olish imkoniyatini qo'lga kiriting!",
      html: "Uy Xarid Qiling Hamda Qo'shimchasiga<br><span class=\"text-accent-red\">Damas Avtomobili Yutib Olish</span><br>Imkoniyatini Qo'lga Kiriting!",
      btnText: "BEPUL QATNASHISH",
      stickyBtnText: "QATNASHISH",
      benefit: "UY XARID QILING VA QO'SHIMCHASIGA DAMAS AVTOMOBILI YUTIB OLISH IMKONIYATINI QO'LGA KIRITING!"
    },
    {
      id: 2,
      raw: "Chegirmadagi 100 ta xonadondan birining egasi bo'ling!",
      html: "Katta Aksiya:<br><span class=\"text-accent-red\">Chegirmadagi 100 Ta Xonadondan</span><br>Birining Egasi Bo'ling!",
      btnText: "AKSIYA KANALIGA QO'SHILISH",
      stickyBtnText: "QO'SHILISH",
      benefit: "CHEGIRMADAGI 100 TA XONADONDAN BIRINING EGASI BO'LING!"
    },
    {
      id: 3,
      raw: "Kuniga 100 ming so'mdan to'lab Saodat shahridan xonadon xarid qiling!",
      html: "Kuniga 100 Ming So'mdan To'lab<br><span class=\"text-accent-red\">Saodat Shahridan Xonadon</span><br>Xarid Qiling!",
      btnText: "TELEGRAM KANALGA O'TISH",
      stickyBtnText: "KANALGA O'TISH",
      benefit: "KUNIGA 100 MING SO'MDAN TO'LAB SAODAT SHAHRIDAN XONADON XARID QILING!"
    },
    {
      id: 4,
      raw: "Boshlang'ich to'lovsiz 60 oyga foiz va penyalarsiz katta aksiyadagi uylarni olish imkoniyati.",
      html: "Boshlang'ich To'lovsiz 60 Oyga<br>Foiz Va Penyalarsiz Katta<br><span class=\"text-accent-red\">Aksiyadagi Uylarni Olish<br>Imkoniyati.</span>",
      btnText: "TAQDIMOTDA QATNASHISH",
      stickyBtnText: "QATNASHISH",
      benefit: "BOSHLANG'ICH TO'LOVSIZ 60 OYGA FOIZ VA PENYALARSIZ KATTA AKSIYA!"
    },
    {
      id: 5,
      raw: "Taqdimot ishtirokchilari orasida 2 xonalik uy o'ynaladi;",
      html: "Katta Taqdimot:<br>Taqdimot Ishtirokchilari Orasida<br><span class=\"text-accent-red\">2 Xonalik Uy O'ynaladi!</span>",
      btnText: "BEPUL QATNASHISH",
      stickyBtnText: "QATNASHISH",
      benefit: "TAQDIMOT ISHTIROKCHILARI ORASIDA 2 XONALIK UY O'YNALADI!"
    },
    {
      id: 6,
      raw: "Katta aksiya: 60 oy davomida hech qanday foiz va penyalarsiz xonadon xarid qiling!",
      html: "Katta Aksiya: 60 Oy Davomida<br><span class=\"text-accent-red\">Hech Qanday Foiz Va Penyalarsiz</span><br>Xonadon Xarid Qiling!",
      btnText: "TELEGRAM KANALGA O'TISH",
      stickyBtnText: "KANALGA O'TISH",
      benefit: "KATTA AKSIYA: 60 OY DAVOMIDA HECH QANDAY FOIZ VA PENYALARSIZ!"
    },
    {
      id: 7,
      raw: "Xonadon xarid qilib Umra safariga yo'llanmani ham qoʻlga kriting",
      html: "Xonadon Xarid Qilib<br><span class=\"text-accent-red\">Umra Safariga Yo'llanmani</span><br>Ham Qo'lga Kiriting!",
      btnText: "BEPUL QATNASHISH",
      stickyBtnText: "QATNASHISH",
      benefit: "XONADON XARID QILIB UMRA SAFARIGA YO'LLANMANI HAM QO'LGA KIRITING!"
    },
    {
      id: 8,
      raw: "Aksiyaga faqat 100 ta xonadon qo'yilgan",
      html: "Shoshiling!<br><span class=\"text-accent-red\">Aksiyaga Faqat 100 Ta</span><br>Xonadon Qo'yilgan!",
      btnText: "AKSIYA KANALIGA QO'SHILISH",
      stickyBtnText: "QO'SHILISH",
      benefit: "AKSIYAGA FAQAT 100 TA XONADON QO'YILGAN!"
    },
    {
      id: 9,
      raw: "Katta aksiya va chegirmada xonadon xarid qilish uchun onlayn taqdimotda qatnashing!",
      html: "Katta Aksiya Va Chegirmada<br>Xonadon Xarid Qilish Uchun<br><span class=\"text-accent-red\">Onlayn Taqdimotda Qatnashing!</span>",
      btnText: "TAQDIMOTDA QATNASHISH",
      stickyBtnText: "QATNASHISH",
      benefit: "KATTA AKSIYA VA CHEGIRMADA ONLAYN TAQDIMOTDA QATNASHING!"
    },
    {
      id: 10,
      raw: "Asaka shahri markazidan boshlang'ich to'lovsiz xonadon xarid qiling!",
      html: "Asaka Shahri Markazidan<br><span class=\"text-accent-red\">Boshlang'ich To'lovsiz</span><br>Xonadon Xarid Qiling!",
      btnText: "TELEGRAM KANALGA O'TISH",
      stickyBtnText: "KANALGA O'TISH",
      benefit: "ASAKA SHAHRI MARKAZIDAN BOSHLANG'ICH TO'LOVSIZ XONADON XARID QILING!"
    }
  ];

  const initialHeadlineIndex = window.__INITIAL_HEADLINE_INDEX__;
  const hasInitialHeadline = Number.isInteger(initialHeadlineIndex)
    && initialHeadlineIndex >= 0
    && initialHeadlineIndex < HOOK_ITEMS.length;
  let currentActiveIndex = hasInitialHeadline
    ? initialHeadlineIndex
    : Math.floor(Math.random() * HOOK_ITEMS.length);
  
  function renderContent(index) {
    currentActiveIndex = index;
    const currentItem = HOOK_ITEMS[currentActiveIndex];

    if (dynamicHeadline && dynamicHeadline.innerHTML !== currentItem.html) {
      dynamicHeadline.innerHTML = currentItem.html;
    }

    const btnLabels = document.querySelectorAll('.dynamic-btn-label');
    btnLabels.forEach(el => {
      el.textContent = currentItem.btnText;
    });

    const stickyLabels = document.querySelectorAll('.dynamic-sticky-label');
    stickyLabels.forEach(el => {
      el.textContent = currentItem.stickyBtnText || currentItem.btnText;
    });

    if (dynamicBenefitsList) {
      const otherBenefits = HOOK_ITEMS.filter((_, i) => i !== currentActiveIndex);
      const shuffled = [...otherBenefits].sort(() => 0.5 - Math.random()).slice(0, 2);
      const displayBenefits = [currentItem, ...shuffled];

      dynamicBenefitsList.innerHTML = displayBenefits.map(item => `
        <li class="benefit-item">
          <img src="assets/perf/benefit-check-52.e0e9b9695a.webp" class="benefit-check-icon" alt="" width="26" height="26" aria-hidden="true" decoding="async">
          <span class="benefit-text">${item.benefit}</span>
        </li>
      `).join('');
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const vParam = urlParams.get('v');
  if (!hasInitialHeadline && vParam && parseInt(vParam, 10) >= 1 && parseInt(vParam, 10) <= HOOK_ITEMS.length) {
    currentActiveIndex = parseInt(vParam, 10) - 1;
  }
  renderContent(currentActiveIndex);

  let audioCtx = null;
  function playClickHaptic() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  function getTimerTarget() {
    const now = Date.now();
    let stored = null;
    try {
      stored = sessionStorage.getItem(TIMER_STORAGE_KEY);
    } catch (e) {}

    let parsed = stored ? parseInt(stored, 10) : null;
    if (!parsed || parsed <= now) {
      parsed = now + (INITIAL_DURATION_SECONDS * 1000);
      try {
        sessionStorage.setItem(TIMER_STORAGE_KEY, parsed.toString());
      } catch (e) {}
    }
    return parsed;
  }

  const targetTimestamp = getTimerTarget();
  let timerInterval = null;

  function updateTimer() {
    const now = Date.now();
    let remainingMs = targetTimestamp - now;

    if (remainingMs <= 0) {
      if (liveTimer) {
        liveTimer.textContent = '00:00';
        liveTimer.classList.add('expired');
      }
      if (stickyTimerClock) {
        stickyTimerClock.textContent = '00:00';
      }
      if (timerInterval) clearInterval(timerInterval);
      return;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => n.toString().padStart(2, '0');
    const formatted = `${pad(minutes)}:${pad(seconds)}`;

    if (liveTimer) {
      liveTimer.textContent = formatted;
    }
    if (stickyTimerClock) {
      stickyTimerClock.textContent = formatted;
    }
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);

  // =========================================================================
  // RIPPLE EFFECT
  // =========================================================================
  function createRipple(e, btn) {
    playClickHaptic();
    const rippleContainer = btn.querySelector('.btn-ripple-container');
    if (!rippleContainer) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + rect.height / 2);
    
    ripple.style.left = `${clientX - rect.left - size / 2}px`;
    ripple.style.top = `${clientY - rect.top - size / 2}px`;

    rippleContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  // =========================================================================
  // MODAL MANAGEMENT
  // =========================================================================
  let lastActiveElement = null;

  function openModal() {
    if (!registerModal) return;
    lastActiveElement = document.activeElement;
    registerModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      if (userPhone) {
        userPhone.focus();
        userPhone.setAttribute('aria-invalid', 'false');
      }
    }, 200);
  }

  function closeModal() {
    if (!registerModal) return;
    registerModal.classList.remove('is-open');
    document.body.style.overflow = '';

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  registerModal.addEventListener('keydown', (e) => {
    if (!registerModal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = registerModal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // =========================================================================
  // META CONVERSIONS API (CAPI) & PIXEL DEDUPLICATION CONFIGURATION
  // =========================================================================
  const META_CAPI_CONFIG = {
    accessToken: 'EAAO3yXZBmGFQBS35mUjnwTCiA1eaZBT6oe3cYRY3IKJm9ZBUhjyMjJxmj2rBXJEIjTikzO4pVKDocjBSkgK2TYZAIHWpA9AzTE2yUfnvYxriXjh6xZAh1yS5GO8pZB1itJ8EVzqwPVrGGnjyUtzxBpiDkgNcJ4rTpNpzlToMCiZAjkTfAAm6xmxZC2xI1vYGJgZDZD',
    pixelIds: ['1112672677915962'],
    apiVersion: 'v21.0'
  };

  // Helper to get or initialize _fbp cookie (Facebook Browser ID)
  function getOrSetFbp() {
    const match = document.cookie.match(/_fbp=([^;]+)/);
    if (match && match[1]) return match[1];
    let stored = localStorage.getItem('_fbp');
    if (!stored) {
      stored = `fb.1.${Date.now()}.${Math.floor(Math.random() * 8999999999 + 1000000000)}`;
      try { localStorage.setItem('_fbp', stored); } catch (e) {}
    }
    try {
      document.cookie = `_fbp=${stored};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    } catch (e) {}
    return stored;
  }

  // Helper to get or initialize _fbc cookie (Facebook Click ID from ?fbclid=)
  function getOrSetFbc() {
    const match = document.cookie.match(/_fbc=([^;]+)/);
    if (match && match[1]) return match[1];
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      const fbcVal = `fb.1.${Date.now()}.${fbclid}`;
      try {
        document.cookie = `_fbc=${fbcVal};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Lax`;
        localStorage.setItem('_fbc', fbcVal);
      } catch (e) {}
      return fbcVal;
    }
    return localStorage.getItem('_fbc') || null;
  }

  // Asynchronously cache client IP in background (deferred)
  let cachedClientIp = null;
  (function initClientIp() {
    try {
      cachedClientIp = sessionStorage.getItem('saodat_client_ip');
      if (!cachedClientIp) {
        const doFetch = () => {
          fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(d => {
              if (d && d.ip) {
                cachedClientIp = d.ip;
                sessionStorage.setItem('saodat_client_ip', d.ip);
              }
            })
            .catch(() => {});
        };
        const scheduleFetch = () => {
          if (window.requestIdleCallback) {
            window.requestIdleCallback(doFetch, { timeout: 5000 });
          } else {
            setTimeout(doFetch, 3000);
          }
        };
        if (document.readyState === 'complete') {
          scheduleFetch();
        } else {
          window.addEventListener('load', scheduleFetch, { once: true });
        }
      }
    } catch (e) {}
  })();

  // SHA-256 Hashing helper for CAPI normalization
  async function hashSha256(str) {
    if (!str) return null;
    const clean = str.toString().trim().toLowerCase();
    try {
      const enc = new TextEncoder().encode(clean);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return null;
    }
  }

  // Unified Server-Side Meta Conversions API Dispatcher
  async function sendMetaCapiEvent(eventName, customData = {}, hashedUserData = {}, customEventId = null) {
    const eventId = customEventId || `evt_${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fbp = getOrSetFbp();
    const fbc = getOrSetFbc();

    const userData = {
      client_user_agent: navigator.userAgent,
      fbp: fbp
    };

    if (fbc) userData.fbc = fbc;
    if (cachedClientIp) userData.client_ip_address = cachedClientIp;
    if (hashedUserData.phone) userData.ph = [hashedUserData.phone];
    if (hashedUserData.email) userData.em = [hashedUserData.email];

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: window.location.href,
          action_source: 'website',
          user_data: userData,
          custom_data: {
            currency: 'USD',
            value: 0.0,
            ...customData
          }
        }
      ]
    };

    // Send to all configured Meta Pixels
    META_CAPI_CONFIG.pixelIds.forEach(pixelId => {
      const endpoint = `https://graph.facebook.com/${META_CAPI_CONFIG.apiVersion}/${pixelId}/events?access_token=${encodeURIComponent(META_CAPI_CONFIG.accessToken)}`;

      try {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
          mode: 'cors'
        })
        .then(r => r.json())
        .then(res => {
          console.log(`[Meta CAPI Success] Pixel: ${pixelId} | Event: ${eventName}`, res);
        })
        .catch(err => {
          console.warn(`[Meta CAPI Error] Pixel: ${pixelId} | Event: ${eventName}`, err);
        });
      } catch (err) {
        console.warn(`[Meta CAPI Exception]`, err);
      }
    });

    return eventId;
  }

  const TARGET_TELEGRAM_LINK = 'https://t.me/+Z5B8LCas30gwOTJi';

  // Master handler for all CTA buttons (Top, Bottom, Sticky)
  function onCtaClick(e, btn, buttonPosition) {
    createRipple(e, btn);
    playClickHaptic();

    const currentItem = HOOK_ITEMS[currentActiveIndex];
    const buttonLabel = btn.querySelector('.dynamic-btn-label, .dynamic-sticky-label')?.textContent?.trim() || currentItem?.btnText || 'TAQDIMOTDA QATNASHISH';
    const eventId = `lead_click_${buttonPosition}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 1. Client-Side Meta Pixel (with Event Deduplication ID)
    if (typeof fbq === 'function') {
      try {
        fbq('track', 'Lead', {
          content_name: buttonLabel,
          content_category: 'CTA Button Click',
          button_position: buttonPosition,
          headline_variant: currentItem?.raw || '',
          currency: 'USD',
          value: 0.0
        }, { eventID: eventId });

        fbq('track', 'Contact', {
          content_name: buttonLabel,
          button_position: buttonPosition
        }, { eventID: `${eventId}_contact` });
      } catch (err) {
        console.warn('Pixel tracking error:', err);
      }
    }

    // 2. Server-Side Meta Conversions API (CAPI)
    sendMetaCapiEvent('Lead', {
      content_name: buttonLabel,
      content_category: 'CTA Button Click',
      button_position: buttonPosition,
      headline_variant: currentItem?.raw || '',
      target_url: TARGET_TELEGRAM_LINK
    }, {}, eventId);

    sendMetaCapiEvent('Contact', {
      content_name: buttonLabel,
      button_position: buttonPosition,
      target_url: TARGET_TELEGRAM_LINK
    }, {}, `${eventId}_contact`);
  }

  if (btnTop) {
    btnTop.addEventListener('click', (e) => {
      onCtaClick(e, btnTop, 'top_button');
    });
  }

  if (btnBottom) {
    btnBottom.addEventListener('click', (e) => {
      onCtaClick(e, btnBottom, 'bottom_button');
    });
  }

  if (stickyRegisterBtn) {
    stickyRegisterBtn.addEventListener('click', (e) => {
      onCtaClick(e, stickyRegisterBtn, 'sticky_bottom_bar');
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // =========================================================================
  // PHONE INPUT FORMATTING
  // =========================================================================
  if (userPhone) {
    userPhone.addEventListener('input', () => {
      if (phoneWrapper) phoneWrapper.classList.remove('has-error');
      userPhone.setAttribute('aria-invalid', 'false');
      
      let val = userPhone.value.replace(/\D/g, '');

      if (val.startsWith('998') && val.length > 9) {
        val = val.substring(3);
      } else if (val.startsWith('998') && val.length <= 3) {
        val = '';
      }

      val = val.substring(0, 9);

      let formatted = '';
      if (val.length > 0) formatted += val.substring(0, 2);
      if (val.length > 2) formatted += ' ' + val.substring(2, 5);
      if (val.length > 5) formatted += ' ' + val.substring(5, 7);
      if (val.length > 7) formatted += ' ' + val.substring(7, 9);

      userPhone.value = formatted;
    });

    userPhone.addEventListener('keypress', (e) => {
      if (!/\d/.test(e.key) && e.key !== 'Enter') {
        e.preventDefault();
      }
    });
  }

  // =========================================================================
  // LEAD SUBMISSION (Google Sheets + FB Pixel + LocalStorage)
  // =========================================================================
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let digits = userPhone ? userPhone.value.replace(/\D/g, '') : '';
      if (digits.startsWith('998') && digits.length > 9) {
        digits = digits.substring(3);
      }

      if (digits.length < 9) {
        if (phoneWrapper) {
          phoneWrapper.classList.remove('has-error');
          void phoneWrapper.offsetWidth;
          phoneWrapper.classList.add('has-error');
        }
        if (userPhone) {
          userPhone.setAttribute('aria-invalid', 'true');
          userPhone.focus();
        }
        return;
      }

      const fullPhone = `+998 ${userPhone.value}`;
      const nowFormatted = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
      const currentItem = HOOK_ITEMS[currentActiveIndex];
      const variantSource = `Landing 4 Ravnaq (Var #${currentItem.id}: ${currentItem.raw.substring(0, 45)}...)`;

      if (submitLeadBtn) {
        submitLeadBtn.disabled = true;
        submitLeadBtn.classList.add('is-loading');
        if (submitBtnText) submitBtnText.textContent = 'YUBORILMOQDA...';
      }

      const payload = {
        phone: `'${fullPhone}`,
        digits: `998${digits}`,
        date: nowFormatted,
        timestamp: new Date().toISOString(),
        source: variantSource,
        headlineId: currentItem.id,
        headlineText: currentItem.raw
      };

      // Hidden Form Submit
      try {
        const gsForm = document.getElementById('google-sheet-hidden-form');
        const gsPhone = document.getElementById('gs-hidden-phone');
        const gsDigits = document.getElementById('gs-hidden-digits');
        const gsDate = document.getElementById('gs-hidden-date');
        const gsSource = document.getElementById('gs-hidden-source');

        if (gsPhone) gsPhone.value = `'${fullPhone}`;
        if (gsDigits) gsDigits.value = `998${digits}`;
        if (gsDate) gsDate.value = nowFormatted;
        if (gsSource) gsSource.value = variantSource;

        if (gsForm) gsForm.submit();
      } catch (err) {
        console.warn('Hidden form submit notice:', err);
      }

      // Webhook fallback
      if (GOOGLE_SHEETS_WEBHOOK_URL) {
        try {
          fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          }).catch((err) => console.warn('Fetch fallback err:', err));
        } catch (e) {}
      }

      // Local storage backup
      try {
        const storedLeads = JSON.parse(localStorage.getItem('saodat_leads') || '[]');
        storedLeads.push(payload);
        localStorage.setItem('saodat_leads', JSON.stringify(storedLeads));
      } catch (e) {}

      // Meta Pixel & CAPI tracking for Phone submission
      const modalEventId = `lead_form_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      if (typeof fbq === 'function') {
        try {
          fbq('track', 'Lead', {
            content_name: currentItem.raw,
            content_category: 'Phone Lead Submission',
            phone_provided: true,
            currency: 'USD',
            value: 0.0
          }, { eventID: modalEventId });
        } catch (e) {}
      }

      hashSha256('998' + digits).then(hashedPhone => {
        sendMetaCapiEvent('Lead', {
          content_name: currentItem.raw,
          content_category: 'Phone Lead Submission',
          source: 'Modal Form'
        }, { phone: hashedPhone }, modalEventId);
      });

      // Transition to Step 2
      setTimeout(() => {
        if (submitLeadBtn) {
          submitLeadBtn.disabled = false;
          submitLeadBtn.classList.remove('is-loading');
          if (submitBtnText) submitBtnText.textContent = 'DAVOM ETISH';
        }

        if (modalStepPhone) modalStepPhone.style.display = 'none';
        if (modalStepFinal) modalStepFinal.style.display = 'block';

        function launchConfetti() {
          if (typeof window.confetti === 'function') {
            window.confetti({
              particleCount: 65,
              spread: 75,
              origin: { y: 0.62 },
              colors: ['#FF1E27', '#00E676', '#229ED9', '#FFD166', '#FFFFFF']
            });
          }
        }
        if (typeof window.confetti === 'function') {
          launchConfetti();
        } else {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
          s.onload = launchConfetti;
          document.body.appendChild(s);
        }
      }, 450);
    });
  }

  if (tgSubscribeBtn) {
    tgSubscribeBtn.addEventListener('click', () => {
      playClickHaptic();
      const subEventId = `purchase_tg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      if (typeof fbq === 'function') {
        try {
          fbq('track', 'Purchase', { value: 0.00, currency: 'USD' }, { eventID: subEventId });
          fbq('track', 'Contact', {}, { eventID: `${subEventId}_contact` });
        } catch (e) {}
      }
      sendMetaCapiEvent('Purchase', { value: 0.00, currency: 'USD' }, {}, subEventId);
      sendMetaCapiEvent('Contact', { channel: 'Telegram' }, {}, `${subEventId}_contact`);
    });
  }

  // =========================================================================
  // STICKY BOTTOM BAR OBSERVER
  // =========================================================================
  if (btnTop && stickyBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          stickyBar.classList.add('is-visible');
        } else {
          stickyBar.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(btnTop);
  }

});
