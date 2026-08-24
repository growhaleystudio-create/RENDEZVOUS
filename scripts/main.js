/**
 * RENDEZVOUS BARBERSHOP — Core Interactive & GSAP Animation Engine
 * Toronto's Premier Luxury Grooming Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenisScroll();
  initCustomCursor();
  initHeaderScroll();
  initGsapAnimations();
  initMagneticButtons();
  initLiveStatusBadges();
  initLocationExplorer();
  initLookbookCuts();
  initServiceFilters();
  initGiftCardCustomizer();
  initBookingModal();
  initArticleModal();
  initFaqAccordion();
  initFullscreenMenu();
  initSoundToggle();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLLING + SCROLLTRIGGER INTEGRATION
   ========================================================================== */
let lenis;
function initLenisScroll() {
  if (typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.9,
        smoothTouch: false,
        touchMultiplier: 1.8,
      });

      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', () => {
          ScrollTrigger.update();
        });
      }

      if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn('Lenis scroll initialized with native fallback:', e);
    }
  }
}

/* ==========================================================================
   2. CUSTOM MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  const cursorText = document.querySelector('.custom-cursor-text');

  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let followerX = mouseX, followerY = mouseY;
  let cursorVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;

    if (!cursorVisible) {
      cursorVisible = true;
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    }
  });

  window.addEventListener('mouseleave', () => {
    cursorVisible = false;
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  function attachCursorHover() {
    const hoverElements = document.querySelectorAll(
      'a, button, .service-card, .barber-card, .location-card, .location-flagship-card, .paper-card, .lookbook-item, .map-pin-card, .filter-pill, .loc-tab-btn'
    );
    hoverElements.forEach((el) => {
      if (el.dataset.cursorAttached) return;
      el.dataset.cursorAttached = 'true';

      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.style.borderColor = 'rgba(255, 94, 30, 0.9)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.35)';

        const customText = el.getAttribute('data-cursor');
        if (customText && cursorText) {
          cursorText.textContent = customText;
        } else if (cursorText) {
          cursorText.textContent = '';
        }

        if (window.soundManager) window.soundManager.playHover();
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.style.borderColor = 'rgba(255, 94, 30, 0.5)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        if (cursorText) cursorText.textContent = '';
      });
    });
  }

  attachCursorHover();
  window.attachCursorHover = attachCursorHover;
}

/* ==========================================================================
   3. HEADER SCROLL STATE & CURTAIN FOOTER REVEAL CONTROLLER
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function updateHeader() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    // 1. Hidden on top hero (first 140px)
    // 2. Visible after scrolling past 140px
    // 3. Hidden at the very bottom inside curtain footer
    const pastHero = scrollY > 140;
    const inFooter = (scrollY + winHeight) >= (docHeight - 320);

    if (pastHero && !inFooter) {
      header.classList.add('scrolled');
      header.classList.remove('header-hidden');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('header-hidden');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  if (typeof lenis !== 'undefined' && lenis) {
    lenis.on('scroll', updateHeader);
  }
  updateHeader();
}

/* ==========================================================================
   4. PROGRESSIVE GSAP & SCROLLTRIGGER REVEALS (SAFE FALLBACK)
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Reveal Timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });
  heroTl
    .fromTo('.hero-top-tag', { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.1 })
    .fromTo('.hero-brand-statement', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.4')
    .fromTo('.hero-orange-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.6')
    .fromTo('.hero-orange-actions > *', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.6 }, '-=0.4')
    .fromTo('.hero-orange-trust', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
    .fromTo('.hero-bottom-showcase-peek', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, '-=0.5');

  if (typeof ScrollTrigger !== 'undefined') {
    // Parallax on Hero Showcase Card
    gsap.to('.showcase-peek-card img', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-orange-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });


    // Section Headers
    document.querySelectorAll('.section-header-reveal').forEach((header) => {
      gsap.fromTo(
        header.children,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Staggers
    const animateGrid = (trigger, items, y = 30) => {
      if (document.querySelector(trigger)) {
        gsap.fromTo(
          items,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    };

    animateGrid('.features-list', '.feature-card', 20);
    animateGrid('.services-grid', '.service-card', 30);
    animateGrid('.locations-showcase-wrap', '.location-card, .location-flagship-card', 25);
    animateGrid('.team-grid', '.barber-card', 30);
    animateGrid('.lookbook-grid', '.lookbook-item', 25);
    animateGrid('.paper-grid', '.paper-card', 25);
  }
}

/* ==========================================================================
   5. MAGNETIC BUTTON EFFECT
   ========================================================================== */
function initMagneticButtons() {
  if (window.innerWidth <= 1024) return;
  const magnets = document.querySelectorAll('.btn-magnetic');

  magnets.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   6. DYNAMIC LIVE OPEN/CLOSED TORONTO SHOP STATUS (BAHASA INDONESIA)
   ========================================================================== */
function initLiveStatusBadges() {
  const shopSchedules = {
    queen: { monSat: [9, 20], sun: [10, 18] },
    scarborough: { monSat: [9, 20], sun: [10, 18] },
    yonge: { monSat: [8, 19.5], sun: [10, 17.5] },
    king: { monSat: [9.5, 20], sun: [10, 18] },
    mutual: { monSat: [9, 19.5], sun: [10, 17] },
  };

  function getTorontoNow() {
    const now = new Date();
    const torontoString = now.toLocaleString('en-US', { timeZone: 'America/Toronto' });
    return new Date(torontoString);
  }

  function updateBadges() {
    const torontoDate = getTorontoNow();
    const day = torontoDate.getDay();
    const hours = torontoDate.getHours() + torontoDate.getMinutes() / 60;

    document.querySelectorAll('[data-shop-schedule]').forEach((el) => {
      const shopKey = el.getAttribute('data-shop-schedule');
      const schedule = shopSchedules[shopKey] || { monSat: [9, 20], sun: [10, 18] };
      const [openHour, closeHour] = day === 0 ? schedule.sun : schedule.monSat;

      const isOpen = hours >= openHour && hours < closeHour;
      const formattedClose = formatHour(closeHour);
      const formattedOpen = formatHour(openHour);

      if (isOpen) {
        el.innerHTML = `<span class="live-dot open"></span> BUKA SEKARANG • Tutup ${formattedClose}`;
        el.className = 'live-status-pill open';
      } else {
        el.innerHTML = `<span class="live-dot closed"></span> TUTUP • Buka ${formattedOpen}`;
        el.className = 'live-status-pill closed';
      }
    });
  }

  function formatHour(h) {
    const intHour = Math.floor(h);
    const mins = Math.round((h - intHour) * 60);
    const hourStr = intHour < 10 ? `0${intHour}` : `${intHour}`;
    const minStr = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hourStr}:${minStr}`;
  }

  updateBadges();
  setInterval(updateBadges, 60000);
}

/* ==========================================================================
   7. TORONTO NEIGHBORHOOD EXPLORER & MAP / SHOWCASE VIEW TOGGLE
   ========================================================================== */
function initLocationExplorer() {
  const filterTabs = document.querySelectorAll('.loc-tab-btn');
  const locationCards = document.querySelectorAll('.location-card, .location-flagship-card');
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
  const showcaseView = document.getElementById('locationsShowcaseView');
  const mapView = document.getElementById('locationsMapView');

  // Filter Tabs
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      locationCards.forEach((card) => {
        const district = card.getAttribute('data-district');
        if (filter === 'all' || district === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });

      if (window.soundManager) window.soundManager.playClick();
    });
  });

  // View Switcher (Showcase vs Map)
  viewToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      viewToggleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.getAttribute('data-view');
      if (view === 'map') {
        if (showcaseView) showcaseView.style.display = 'none';
        if (mapView) mapView.style.display = 'block';
      } else {
        if (showcaseView) showcaseView.style.display = 'block';
        if (mapView) mapView.style.display = 'none';
      }

      if (window.soundManager) window.soundManager.playClick();
    });
  });

  // Map Pins Click Interaction
  document.querySelectorAll('.map-pin').forEach((pin) => {
    pin.addEventListener('click', () => {
      document.querySelectorAll('.map-pin').forEach((p) => p.classList.remove('active'));
      document.querySelectorAll('.map-shop-preview-card').forEach((c) => c.classList.remove('active'));

      pin.classList.add('active');
      const targetCardId = pin.getAttribute('data-target-card');
      const targetCard = document.getElementById(targetCardId);
      if (targetCard) {
        targetCard.classList.add('active');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (window.soundManager) window.soundManager.playClick();
    });
  });
}

/* ==========================================================================
   8. LOOKBOOK "BOOK THIS STYLE" & GALLERY
   ========================================================================== */
function initLookbookCuts() {
  document.querySelectorAll('.book-style-direct-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const styleName = btn.getAttribute('data-style');
      const styleService = btn.getAttribute('data-service') || 'The RendezVous Signature Cut';
      const stylePrice = btn.getAttribute('data-price') || '48';

      openBookingModalWithService(styleService, stylePrice, styleName);
      if (window.soundManager) window.soundManager.playClick();
    });
  });
}

function openBookingModalWithService(serviceName, price, styleNote = '') {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  bookingState.service = serviceName;
  bookingState.servicePrice = parseInt(price, 10);
  bookingState.styleNote = styleNote;

  document.querySelectorAll('.service-option-card').forEach((card) => {
    if (card.getAttribute('data-value') === serviceName) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setBookingStep(1);
}

/* ==========================================================================
   9. SERVICES MENU FILTERING
   ========================================================================== */
function initServiceFilters() {
  const filterPills = document.querySelectorAll('.services-filter-bar .filter-pill');
  const serviceCards = document.querySelectorAll('.service-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      serviceCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });

      if (window.soundManager) window.soundManager.playClick();
    });
  });
}

/* ==========================================================================
   10. INTERACTIVE GIFT CARD CUSTOMIZER & VIP PASS GENERATOR
   ========================================================================== */
function initGiftCardCustomizer() {
  const amountBtns = document.querySelectorAll('.gc-amount-btn');
  const customAmountInput = document.getElementById('gcCustomAmount');
  const recipientInput = document.getElementById('gcRecipientInput');
  const messageInput = document.getElementById('gcMessageInput');
  const previewAmount = document.getElementById('gcPreviewAmount');
  const previewRecipient = document.getElementById('gcPreviewRecipient');
  const previewMessage = document.getElementById('gcPreviewMessage');
  const gcIssueBtn = document.getElementById('gcIssueBtn');
  const gcSuccessNotice = document.getElementById('gcSuccessNotice');

  if (!previewAmount || !previewRecipient) return;

  amountBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      const val = btn.getAttribute('data-amount');
      previewAmount.textContent = `$${val} CAD`;
      if (customAmountInput) customAmountInput.value = '';
      if (window.soundManager) window.soundManager.playClick();
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        amountBtns.forEach((b) => b.classList.remove('selected'));
        previewAmount.textContent = `$${val} CAD`;
      }
    });
  }

  if (recipientInput) {
    recipientInput.addEventListener('input', (e) => {
      previewRecipient.textContent = e.target.value.trim() ? `UNTUK: ${e.target.value.toUpperCase()}` : 'UNTUK: TAMU TERHORMAT';
    });
  }

  if (messageInput && previewMessage) {
    messageInput.addEventListener('input', (e) => {
      previewMessage.textContent = e.target.value.trim() ? `“${e.target.value}”` : '“Nikmati pengalaman perawatan mewah berkelas di RendezVous Barbershop Toronto.”';
    });
  }

  if (gcIssueBtn) {
    gcIssueBtn.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playSuccess();
      if (gcSuccessNotice) {
        gcSuccessNotice.style.display = 'block';
        gcSuccessNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
}

/* ==========================================================================
   11. MULTI-STEP APPOINTMENT BOOKING ENGINE (BAHASA INDONESIA)
   ========================================================================== */
let currentBookingStep = 1;
const bookingState = {
  location: 'Queen St West (Downtown Core)',
  barber: 'Siapa Saja yang Tersedia (Paling Cepat)',
  service: 'The RendezVous Signature Cut',
  servicePrice: 48,
  addons: [],
  date: '',
  time: '11:30',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  styleNote: '',
};

function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const closeBtn = document.getElementById('closeBookingModal');
  const nextBtn = document.getElementById('bookingNextBtn');
  const prevBtn = document.getElementById('bookingPrevBtn');
  const confirmBtn = document.getElementById('bookingConfirmBtn');

  if (!modal) return;

  // Open Handlers
  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const loc = btn.getAttribute('data-location');
      const barber = btn.getAttribute('data-barber');
      const service = btn.getAttribute('data-service');
      const price = btn.getAttribute('data-price');

      if (loc) bookingState.location = loc;
      if (barber) bookingState.barber = barber;
      if (service) bookingState.service = service;
      if (price) bookingState.servicePrice = parseInt(price, 10);

      prefillModalOptions();

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setBookingStep(1);

      if (window.soundManager) window.soundManager.playClick();
    });
  });

  // Close Handlers
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Option selections in Step 1, 2, 3
  document.querySelectorAll('.location-option-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.location-option-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.location = card.getAttribute('data-value');
      if (window.soundManager) window.soundManager.playClick();
    });
  });

  document.querySelectorAll('.barber-option-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.barber-option-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.barber = card.getAttribute('data-value');
      if (window.soundManager) window.soundManager.playClick();
    });
  });

  document.querySelectorAll('.service-option-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.service-option-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.service = card.getAttribute('data-value');
      bookingState.servicePrice = parseInt(card.getAttribute('data-price') || '48', 10);
      if (window.soundManager) window.soundManager.playClick();
    });
  });

  // Addons
  document.querySelectorAll('.addon-checkbox').forEach((cb) => {
    cb.addEventListener('change', () => {
      bookingState.addons = [];
      document.querySelectorAll('.addon-checkbox:checked').forEach((checked) => {
        bookingState.addons.push({
          name: checked.getAttribute('data-addon'),
          price: parseInt(checked.getAttribute('data-price') || '15', 10),
        });
      });
      if (window.soundManager) window.soundManager.playClick();
    });
  });

  // Step 4: Time Slot Selection
  document.querySelectorAll('.time-slot-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-slot-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingState.time = btn.textContent.trim();
      if (window.soundManager) window.soundManager.playClick();
    });
  });

  // Date input initialization
  const dateInput = document.getElementById('bookingDateInput');
  if (dateInput) {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    dateInput.min = formattedToday;
    dateInput.value = formattedToday;
    bookingState.date = formattedToday;

    dateInput.addEventListener('change', (e) => {
      bookingState.date = e.target.value;
    });
  }

  // Next / Prev / Confirm Navigation
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentBookingStep === 4) {
        const nameInput = document.getElementById('clientNameInput');
        const phoneInput = document.getElementById('clientPhoneInput');
        const emailInput = document.getElementById('clientEmailInput');

        bookingState.clientName = nameInput ? nameInput.value.trim() || 'Tamu Terhormat' : 'Tamu Terhormat';
        bookingState.clientPhone = phoneInput ? phoneInput.value.trim() || '+62 812-3456-7890' : '+62 812-3456-7890';
        bookingState.clientEmail = emailInput ? emailInput.value.trim() || 'guest@rendezvous.ca' : 'guest@rendezvous.ca';

        renderBookingSummary();
      }

      if (currentBookingStep < 5) {
        setBookingStep(currentBookingStep + 1);
        if (window.soundManager) window.soundManager.playClick();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentBookingStep > 1) {
        setBookingStep(currentBookingStep - 1);
        if (window.soundManager) window.soundManager.playClick();
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      handleBookingConfirmation();
    });
  }
}

function prefillModalOptions() {
  document.querySelectorAll('.location-option-card').forEach((c) => {
    if (c.getAttribute('data-value') === bookingState.location) c.classList.add('selected');
    else c.classList.remove('selected');
  });

  document.querySelectorAll('.barber-option-card').forEach((c) => {
    if (c.getAttribute('data-value') === bookingState.barber) c.classList.add('selected');
    else c.classList.remove('selected');
  });

  document.querySelectorAll('.service-option-card').forEach((c) => {
    if (c.getAttribute('data-value') === bookingState.service) c.classList.add('selected');
    else c.classList.remove('selected');
  });
}

function setBookingStep(stepNum) {
  currentBookingStep = stepNum;
  document.querySelectorAll('.booking-step').forEach((step, idx) => {
    if (idx + 1 === stepNum) step.classList.add('active');
    else step.classList.remove('active');
  });

  const stepLabel = document.getElementById('modalStepLabel');
  if (stepLabel) stepLabel.textContent = `LANGKAH ${stepNum} DARI 5`;

  const prevBtn = document.getElementById('bookingPrevBtn');
  const nextBtn = document.getElementById('bookingNextBtn');
  const confirmBtn = document.getElementById('bookingConfirmBtn');

  if (prevBtn) prevBtn.style.display = stepNum > 1 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = stepNum < 5 ? 'inline-flex' : 'none';
  if (confirmBtn) confirmBtn.style.display = stepNum === 5 ? 'inline-flex' : 'none';
}

function renderBookingSummary() {
  const summaryContainer = document.getElementById('bookingSummaryContainer');
  if (!summaryContainer) return;

  const addonTotal = bookingState.addons.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = bookingState.servicePrice + addonTotal;

  summaryContainer.innerHTML = `
    <div class="booking-receipt-card">
      <div class="receipt-header">
        <div>
          <span class="receipt-brand">RENDEZVOUS BARBERS</span>
          <h3 class="receipt-service">${bookingState.service}</h3>
        </div>
        <div class="receipt-total">$${grandTotal} CAD</div>
      </div>

      <div class="receipt-divider"></div>

      <div class="receipt-details-grid">
        <div class="receipt-item">
          <span class="receipt-label">CABANG TORONTO</span>
          <span class="receipt-val"><i class="fa-solid fa-location-dot text-orange"></i> ${bookingState.location}</span>
        </div>
        <div class="receipt-item">
          <span class="receipt-label">MASTER BARBER</span>
          <span class="receipt-val"><i class="fa-solid fa-user-tie text-orange"></i> ${bookingState.barber}</span>
        </div>
        <div class="receipt-item">
          <span class="receipt-label">TANGGAL & WAKTU</span>
          <span class="receipt-val"><i class="fa-regular fa-clock text-orange"></i> ${bookingState.date || 'Hari Ini'}, ${bookingState.time}</span>
        </div>
        <div class="receipt-item">
          <span class="receipt-label">ATAS NAMA</span>
          <span class="receipt-val">${bookingState.clientName} (${bookingState.clientPhone})</span>
        </div>
      </div>

      ${
        bookingState.addons.length > 0
          ? `
        <div class="receipt-addons-box">
          <span class="receipt-label">OPSI PERAWATAN TAMBAHAN:</span>
          <ul>
            ${bookingState.addons.map((a) => `<li>+ ${a.name} ($${a.price})</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }
    </div>
  `;
}

function handleBookingConfirmation() {
  const summaryContainer = document.getElementById('bookingSummaryContainer');
  const prevBtn = document.getElementById('bookingPrevBtn');
  const confirmBtn = document.getElementById('bookingConfirmBtn');

  if (window.soundManager) window.soundManager.playSuccess();

  const refNumber = `RDV-${Math.floor(100000 + Math.random() * 900000)}`;

  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="confirmation-success-card">
        <div class="success-icon-wrap">
          <i class="fa-solid fa-check"></i>
        </div>
        <h3 class="font-serif text-cream" style="font-size: 1.85rem; margin-bottom: 0.5rem;">Reservasi Berhasil Dikonfirmasi!</h3>
        <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
          Kursi Anda telah berhasil dipesan. Detail jadwal dan tiket kalender digital telah dibuat.
        </p>

        <div class="booking-pass-box">
          <div class="pass-ref">KODE RESERVASI: <strong>${refNumber}</strong></div>
          <div class="pass-info-row">
            <span><strong>Cabang:</strong> ${bookingState.location}</span>
            <span><strong>Barber:</strong> ${bookingState.barber}</span>
            <span><strong>Waktu:</strong> ${bookingState.date || 'Hari Ini'} pukul ${bookingState.time}</span>
          </div>
          <div style="font-size: 0.8rem; color: #E5A93C; margin-top: 0.75rem;">
            ☕ Termasuk sajian espresso Italia gratis, cuci rambut hangat & protokol higienis steril.
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.75rem; flex-wrap: wrap;">
          <button class="btn-primary" id="downloadIcsBtn" style="padding: 0.75rem 1.4rem; font-size: 0.85rem;">
            <i class="fa-regular fa-calendar-plus"></i> SIMPAN KE KALENDER (.ICS)
          </button>
          <button class="btn-secondary" onclick="document.getElementById('bookingModal').classList.remove('open'); document.body.style.overflow = '';" style="padding: 0.75rem 1.4rem; font-size: 0.85rem;">
            SELESAI
          </button>
        </div>
      </div>
    `;

    const icsBtn = document.getElementById('downloadIcsBtn');
    if (icsBtn) {
      icsBtn.addEventListener('click', () => {
        downloadCalendarIcs(refNumber);
      });
    }
  }

  if (prevBtn) prevBtn.style.display = 'none';
  if (confirmBtn) confirmBtn.style.display = 'none';
}

function downloadCalendarIcs(refCode) {
  const eventTitle = `Reservasi RendezVous Barbershop: ${bookingState.service}`;
  const eventLocation = `${bookingState.location}, Toronto ON`;
  const eventDescription = `Jadwal Potong Rambut di RendezVous Barbershop bersama ${bookingState.barber}. Kode Ref: ${refCode}. Termasuk cuci rambut & kopi espresso gratis.`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RendezVous Barbershop Toronto//ID',
    'BEGIN:VEVENT',
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${eventDescription}`,
    `LOCATION:${eventLocation}`,
    `DTSTART:${(bookingState.date || new Date().toISOString().split('T')[0]).replace(/-/g, '')}T150000Z`,
    `DTEND:${(bookingState.date || new Date().toISOString().split('T')[0]).replace(/-/g, '')}T160000Z`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `reservasi-rendezvous-${refCode}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==========================================================================
   12. RDV PAPER EDITORIAL ARTICLE READER (BAHASA INDONESIA)
   ========================================================================== */
const rdvArticles = {
  fadeVsTaper: {
    tag: 'GAYA & TEKNIK • 4 MENIT BACA',
    title: 'Skin Fade vs. Taper: Mana Potongan yang Paling Cocok untuk Bentuk Wajah Anda?',
    content: `
      <p>Salah satu pertanyaan yang paling sering diajukan kepada master barber kami di Queen St dan Kawasan Finansial adalah perbedaan antara <strong>Skin Fade</strong> dan <strong>Taper Fade</strong>.</p>
      <h4 style="color:#FF5E1E; margin: 1.5rem 0 0.5rem; font-family: var(--font-serif);">Perbedaan Mendasar</h4>
      <p>Sebuah <strong>Skin Fade</strong> memudarkan rambut hingga ke kulit kepala di seluruh garis tepi kepala—sisi samping dan belakang—menciptakan siluet kontras tinggi, tegas, dan sangat modern. Sangat ideal untuk bentuk wajah tegas, textured crop, dan gaya maskulin atletis.</p>
      <p>Sebaliknya, <strong>Taper Fade</strong> hanya memudarkan area pelipis (cambang) dan bagian bawah tengkuk leher, sementara ketebalan alami rambut di sekitar telinga tetap dipertahankan. Ini adalah pilihan favorit para profesional dan eksekutif bisnis yang menginginkan ketajaman presisi tanpa harus mencukur habis seluruh bagian samping rambut.</p>
      <h4 style="color:#FF5E1E; margin: 1.5rem 0 0.5rem; font-family: var(--font-serif);">Perawatan & Daya Tahan Potongan</h4>
      <p>Skin fade berada dalam kondisi paling tajam pada hari ke-1 hingga ke-10, dan membutuhkan perapian setiap 2 hingga 3 minggu. Sementara itu, taper fade tumbuh lebih natural dan dapat bertahan 3 hingga 4 minggu sebelum perlu dipotong kembali.</p>
    `,
  },
  scalpTreatment: {
    tag: 'KESEHATAN RAMBUT • 3 MENIT BACA',
    title: 'Terapi Kulit Kepala Mendalam: Kunci Menjaga Folikel Rambut Tetap Kuat',
    content: `
      <p>Perubahan cuaca perkotaan dan polusi sehari-hari memberikan beban berat pada kesehatan kulit kepala. Sampo biasa di rumah seringkali menyisakan sisa produk wax/pomade, sel kulit mati, dan penumpukan minyak sebum di folikel rambut.</p>
      <h4 style="color:#FF5E1E; margin: 1.5rem 0 0.5rem; font-family: var(--font-serif);">Ritual Detoks 3-Fase RDV</h4>
      <p>Layanan detoks kulit kepala Tea Tree & Peppermint kami menggabungkan scrub mikro eksfoliasi organik dengan uap hangat bertekanan untuk membuka pori-pori kulit kepala, diikuti pijatan titik saraf yang merangsang sirkulasi darah ke akar rambut.</p>
      <p>Pelanggan merasakan kulit kepala yang segar, bebas gatal dan ketombe, serta tekstur rambut yang terasa jauh lebih bervolume dan kuat seketika setelah satu sesi perawatan.</p>
    `,
  },
  corporateBeard: {
    tag: 'PERAWATAN JENGGOT • 5 MENIT BACA',
    title: 'Panduan Merawat Jenggot Profesional untuk Pria Eksekutif',
    content: `
      <p>Jenggot yang terawat dapat memancarkan wibawa dan karisma di ruang rapat eksekutif. Kuncinya bukan pada panjangnya rambut, melainkan pada <strong>arsitektur geometris yang tajam dan bersih</strong>.</p>
      <h4 style="color:#FF5E1E; margin: 1.5rem 0 0.5rem; font-family: var(--font-serif);">Aturan 2 Jari Garis Leher</h4>
      <p>Kesalahan paling umum pria adalah mencukur garis leher terlalu tinggi mendekati dagu. Di RendezVous, master barber kami membentuk lengkungan dasar jenggot tepat dua jari di atas jakun untuk menciptakan bayangan rahang yang tegas dan proporsional.</p>
      <h4 style="color:#FF5E1E; margin: 1.5rem 0 0.5rem; font-family: var(--font-serif);">Rutinitas Hidrasi Harian</h4>
      <p>Gunakan minyak jenggot sandalwood hangat setiap pagi setelah mandi saat pori-pori kulit masih terbuka, lalu rapikan arah tumbuhnya dengan sisir bulu babi (*boar bristle brush*) berkualitas.</p>
    `,
  },
};

function initArticleModal() {
  const modal = document.getElementById('articleModal');
  const closeBtn = document.getElementById('closeArticleModal');
  const titleEl = document.getElementById('articleModalTitle');
  const metaEl = document.getElementById('articleModalMeta');
  const bodyEl = document.getElementById('articleModalBody');

  if (!modal) return;

  document.querySelectorAll('.open-article-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const articleKey = btn.getAttribute('data-article');
      const data = rdvArticles[articleKey];
      if (data && titleEl && bodyEl && metaEl) {
        metaEl.innerHTML = data.tag;
        titleEl.textContent = data.title;
        bodyEl.innerHTML = data.content;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (window.soundManager) window.soundManager.playClick();
      }
    });
  });

  const close = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}

/* ==========================================================================
   13. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((other) => other.classList.remove('active'));
        if (!isActive) item.classList.add('active');
        if (window.soundManager) window.soundManager.playClick();
      });
    }
  });
}

/* ==========================================================================
   14. FULLSCREEN LUXURY EDITORIAL MENU OVERLAY
   ========================================================================== */
function initFullscreenMenu() {
  const burgerBtn = document.getElementById('burgerMenuBtn');
  const menuOverlay = document.getElementById('fullscreenMenu');
  const closeBtn = document.getElementById('fsMenuCloseBtn');
  const closeTriggers = document.querySelectorAll('.fs-close-trigger');
  const navLinks = document.querySelectorAll('.fs-nav-link');

  if (!menuOverlay) return;

  const openMenu = () => {
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();

    // Animate links in cascade if GSAP exists
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        navLinks,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.55, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo(
        '.fs-hub-sidebar',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.25 }
      );
    }

    if (window.soundManager) window.soundManager.playClick();
    if (window.attachCursorHover) window.attachCursorHover();
  };

  const closeMenu = () => {
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start();
    if (window.soundManager) window.soundManager.playClick();
  };

  if (burgerBtn) burgerBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const href = trigger.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          setTimeout(() => {
            if (window.lenis) {
              window.lenis.scrollTo(targetSection);
            } else {
              targetSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      }
      closeMenu();
    });
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('open')) {
      closeMenu();
    }
  });
}

