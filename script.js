/**
 * ОСТРОВСКИЙ. КУПЕЧЕСКАЯ РОССИЯ: ЕДИНСТВО ТРАДИЦИЙ
 * Interactive Museum Web-Guide Engine
 * Designed for Awwwards-level craft & performance
 */

// Disable browser automatic scroll restoration so page always opens/reloads from the very top (Hero)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Reset scroll to top and clear any hash that would scroll the page down on reload
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }
  window.scrollTo(0, 0);

  // =========================================================================
  // 0. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const burgerBtn = document.getElementById('burger-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.add('is-open');
    if (burgerBtn) {
      burgerBtn.classList.add('is-active');
      burgerBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
    if (burgerBtn) {
      burgerBtn.classList.remove('is-active');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  };

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = drawer && drawer.classList.contains('is-open');
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // =========================================================================
  // 1. CUSTOM EDITORIAL CURSOR (Desktop only)
  // =========================================================================
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .almanac-editorial-card, .almanac-card, .patron-card, .term-card, .team-member-item, .hero-art-showcase, .book-page'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // =========================================================================
  // 2. SCROLL REVEAL (Awwwards cubic-bezier motion)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
      el.style.setProperty('--reveal-idx', index % 4);
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // =========================================================================
  // 3. SMOOTH SUBTLE PARALLAX ON SCROLL
  // =========================================================================
  const heroArtImg = document.getElementById('hero-art-img');
  const fairImg = document.querySelector('.fair-img');
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.pageYOffset;
    if (heroArtImg && scrollY < window.innerHeight * 1.3) {
      const heroOffset = scrollY * 0.1;
      heroArtImg.style.transform = `scale(1.02) translateY(${heroOffset.toFixed(1)}px)`;
    }
    if (fairImg) {
      const fairRect = fairImg.getBoundingClientRect();
      if (fairRect.top < window.innerHeight && fairRect.bottom > 0) {
        const fairOffset = (fairRect.top - window.innerHeight / 2) * -0.06;
        fairImg.style.transform = `scale(1.03) translateY(${fairOffset.toFixed(1)}px)`;
      }
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // =========================================================================
  // 4. PARALLAX & 3D TILT FOR EDITORIAL CARDS
  // =========================================================================
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach((el) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      el.style.transition = 'transform 0.5s ease-out';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease-out';
    });
  });

  // =========================================================================
  // 5. INTERACTIVE 3D BOOK-ALMANAC (KILLER FEATURE: rotateY Page Flipping)
  // =========================================================================
  const spreads = document.querySelectorAll('.book-spread');
  const spreadTabs = document.querySelectorAll('.spread-tab');
  const btnPrev = document.getElementById('book-btn-prev');
  const btnNext = document.getElementById('book-btn-next');
  const btnSidePrev = document.getElementById('book-side-prev');
  const btnSideNext = document.getElementById('book-side-next');
  const spreadCounter = document.getElementById('spread-counter');
  const spreadEpochTag = document.getElementById('spread-epoch-tag');
  const openBookContainer = document.getElementById('open-book');
  const bookFlipperLeaf = document.getElementById('book-flipper-leaf');
  const flipperFaceFront = document.getElementById('flipper-face-front');
  const flipperFaceBack = document.getElementById('flipper-face-back');
  const flipperShade = document.getElementById('flipper-shade');

  const epochLabels = [
    'Эпоха: 1859 год // Пьеса «Гроза» — Тёмное царство Калинова',
    'Эпоха: 1859 год // Пьеса «Гроза» — Дикой и Кабаниха',
    'Эпоха: 1878 год // Пьеса «Бесприданница» — Новые дельцы',
    'Эпоха: 1878 год // Пьеса «Бесприданница» — Человек как товар'
  ];

  let currentSpreadIndex = 0;
  const totalSpreads = spreads.length;
  let isFlipping = false;

  const updateUI = (newIndex) => {
    currentSpreadIndex = newIndex;

    // Update spread visibility
    spreads.forEach((spread, idx) => {
      spread.classList.toggle('active', idx === currentSpreadIndex);
      spread.classList.remove('under-target');
    });

    // Update navigation tabs
    spreadTabs.forEach((tab, idx) => {
      const isActive = idx === currentSpreadIndex;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update status indicators
    if (spreadCounter) {
      spreadCounter.textContent = `Разворот ${currentSpreadIndex + 1} из ${totalSpreads}`;
    }
    if (spreadEpochTag) {
      spreadEpochTag.textContent = epochLabels[currentSpreadIndex];
    }

    // Update navigation buttons
    if (btnPrev) btnPrev.disabled = currentSpreadIndex === 0;
    if (btnNext) btnNext.disabled = currentSpreadIndex === totalSpreads - 1;
    if (btnSidePrev) {
      btnSidePrev.disabled = currentSpreadIndex === 0;
      btnSidePrev.style.opacity = '';
    }
    if (btnSideNext) {
      btnSideNext.disabled = currentSpreadIndex === totalSpreads - 1;
      btnSideNext.style.opacity = '';
    }
  };

  const flipPage = (targetIndex, direction) => {
    if (isFlipping) return;
    if (targetIndex < 0 || targetIndex >= totalSpreads || targetIndex === currentSpreadIndex) return;

    const isMobile = window.innerWidth <= 768;

    // Mobile fallback or missing flipper elements
    if (isMobile || !bookFlipperLeaf || !flipperFaceFront || !flipperFaceBack) {
      updateUI(targetIndex);
      const bookEl = document.getElementById('section-book');
      if (bookEl && window.innerWidth <= 768) {
        const bookRect = bookEl.getBoundingClientRect();
        if (bookRect.top < -50 || bookRect.top > 250) {
          const targetY = window.pageYOffset + bookRect.top - 60;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
      return;
    }

    isFlipping = true;
    const currentSpread = spreads[currentSpreadIndex];
    const targetSpread = spreads[targetIndex];

    const currentRightPage = currentSpread.querySelector('.page-right');
    const currentLeftPage = currentSpread.querySelector('.page-left');
    const targetRightPage = targetSpread.querySelector('.page-right');
    const targetLeftPage = targetSpread.querySelector('.page-left');

    if (direction === 'next') {
      // Turning forward: right leaf flips over spine to the left (rotateY: 0deg -> -180deg)
      flipperFaceFront.className = 'flipper-face flipper-face-front page-right';
      flipperFaceBack.className = 'flipper-face flipper-face-back page-left';
      flipperFaceFront.innerHTML = currentRightPage ? currentRightPage.innerHTML : '';
      flipperFaceBack.innerHTML = targetLeftPage ? targetLeftPage.innerHTML : '';

      // Prepare visibility so target right page is revealed under the lifting leaf,
      // and target left page stays hidden until the leaf finishes landing
      if (currentRightPage) currentRightPage.style.visibility = 'hidden';
      if (targetLeftPage) targetLeftPage.style.visibility = 'hidden';

      bookFlipperLeaf.className = 'book-flipper-leaf active flip-forward';
      bookFlipperLeaf.style.transform = 'rotateY(0deg)';
      if (flipperShade) flipperShade.style.opacity = '0';

      // Keep target spread visible underneath
      targetSpread.classList.add('under-target');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bookFlipperLeaf.style.transform = 'rotateY(-180deg)';
          if (flipperShade) flipperShade.style.opacity = '0.35';

          setTimeout(() => {
            if (flipperShade) flipperShade.style.opacity = '0';
          }, 360);

          setTimeout(() => {
            updateUI(targetIndex);
            if (currentRightPage) currentRightPage.style.visibility = '';
            if (targetLeftPage) targetLeftPage.style.visibility = '';
            bookFlipperLeaf.className = 'book-flipper-leaf';
            bookFlipperLeaf.style.transform = '';
            isFlipping = false;
          }, 730);
        });
      });

    } else {
      // Turning backward: left leaf flips over spine to the right (rotateY: 0deg -> 180deg)
      flipperFaceFront.className = 'flipper-face flipper-face-front page-left';
      flipperFaceBack.className = 'flipper-face flipper-face-back page-right';
      flipperFaceFront.innerHTML = currentLeftPage ? currentLeftPage.innerHTML : '';
      flipperFaceBack.innerHTML = targetRightPage ? targetRightPage.innerHTML : '';

      // Prepare visibility so target left page is revealed under the lifting leaf,
      // and target right page stays hidden until the leaf finishes landing
      if (currentLeftPage) currentLeftPage.style.visibility = 'hidden';
      if (targetRightPage) targetRightPage.style.visibility = 'hidden';

      bookFlipperLeaf.className = 'book-flipper-leaf active flip-backward';
      bookFlipperLeaf.style.transform = 'rotateY(0deg)';
      if (flipperShade) flipperShade.style.opacity = '0';

      targetSpread.classList.add('under-target');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bookFlipperLeaf.style.transform = 'rotateY(180deg)';
          if (flipperShade) flipperShade.style.opacity = '0.35';

          setTimeout(() => {
            if (flipperShade) flipperShade.style.opacity = '0';
          }, 360);

          setTimeout(() => {
            updateUI(targetIndex);
            if (currentLeftPage) currentLeftPage.style.visibility = '';
            if (targetRightPage) targetRightPage.style.visibility = '';
            bookFlipperLeaf.className = 'book-flipper-leaf';
            bookFlipperLeaf.style.transform = '';
            isFlipping = false;
          }, 730);
        });
      });
    }
  };

  const turnNext = () => {
    if (currentSpreadIndex < totalSpreads - 1) {
      flipPage(currentSpreadIndex + 1, 'next');
    }
  };

  const turnPrev = () => {
    if (currentSpreadIndex > 0) {
      flipPage(currentSpreadIndex - 1, 'prev');
    }
  };

  // Button Listeners
  if (btnPrev) btnPrev.addEventListener('click', turnPrev);
  if (btnNext) btnNext.addEventListener('click', turnNext);
  if (btnSidePrev) btnSidePrev.addEventListener('click', turnPrev);
  if (btnSideNext) btnSideNext.addEventListener('click', turnNext);

  // Tab Listeners
  spreadTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetIndex = parseInt(tab.getAttribute('data-spread'), 10);
      if (targetIndex !== currentSpreadIndex) {
        const direction = targetIndex > currentSpreadIndex ? 'next' : 'prev';
        flipPage(targetIndex, direction);
      }
    });
  });

  // Direct Page Clicking (Requirement: "листать развороты книги кликом по страницам")
  if (openBookContainer) {
    openBookContainer.addEventListener('click', (e) => {
      // On mobile (<= 768px), pages are stacked vertically for comfortable reading.
      // Clicks on pages should not trigger page turns when user is scrolling or reading.
      if (window.innerWidth <= 768) return;

      if (e.target.closest('button, a, input, select')) return;

      const pageEl = e.target.closest('.book-page');
      if (!pageEl) return;

      const side = pageEl.getAttribute('data-page-side');
      if (side === 'right') {
        turnNext();
      } else if (side === 'left') {
        turnPrev();
      }
    });

    // Touch Swipe on mobile/tablets with clientX
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    openBookContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    openBookContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          turnNext();
        } else {
          turnPrev();
        }
      }
    }, { passive: true });
  }

  // Keyboard navigation when user is in the book area
  window.addEventListener('keydown', (e) => {
    const bookSection = document.getElementById('section-book');
    if (!bookSection) return;
    const rect = bookSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInView) {
      if (e.key === 'ArrowRight') {
        turnNext();
      } else if (e.key === 'ArrowLeft') {
        turnPrev();
      }
    }
  });

  // Initialize Book
  updateUI(0);

  // =========================================================================
  // 5b. INTERACTIVE TOPOGRAPHY DOSSIER (Section II: Карта Москвы Островского)
  // =========================================================================
  const topographyData = {
    ordynka: {
      stamp: 'АРХИВЪ // ОРИЕНТИРЪ № 01',
      heading: 'Малая Ордынка: Родовой дом и мир тишины',
      meta: 'Адрес: Малая Ордынка, 9 • Дом причта церкви Покрова Богородицы',
      text: 'Здесь 31 марта 1823 года в семье судейского чиновника родился Александр Островский. За глухими деревянными заборами Ордынки колыхались вишневые сады, звенели колокола десятков замоскворецких храмов, а вечерами слышался неторопливый лай цепных собак. Именно здесь будущий классик впитал уникальный замоскворецкий диалект, певучую речь приказчиков и степенную поступь хозяев жизни.',
      quote: '«Замоскворечье не любит торопиться. Тут каждый дом — отдельное княжество со своими заборами и засовами».',
      source: '— А. Н. Островский, «Записки замоскворецкого жителя»',
      fact: 'Отец драматурга Николай Федорович служил стряпчим в Московском коммерческом суде — все тяжбы и банкротства купечества проходили на глазах юного Александра.'
    },
    gostiny: {
      stamp: 'АРХИВЪ // ОРИЕНТИРЪ № 02',
      heading: 'Старый Гостиный Двор: Биржа купеческого слова',
      meta: 'Адрес: Ильинка, 4 • Сердце всероссийской оптовой торговли',
      text: 'Крупнейший торговый хаб империи. Здесь под сводами гигантских арок заключались оптовые сделки на сотни тысяч рублей без участия нотариусов и гербовой бумаги. Купцы разных гильдий били по рукам — и это рукопожатие связывало тверже любого государственного контракта. Нарушить слово в Гостином дворе означало немедленное сословное изгнание.',
      quote: '«Слово купеческое крепче железа и вернее нотариуса: по рукам ударили — считай, товар уже в пути».',
      source: '— Московские биржевые ведомости, 1860-е',
      fact: 'Именно здесь разворачивается действие комедии «Свои люди — сочтёмся!», где Большов решается на фиктивное банкротство, чтобы обмануть кредиторов.'
    },
    traktir: {
      stamp: 'АРХИВЪ // ОРИЕНТИРЪ № 03',
      heading: 'Трактир «Колокол»: Дипломатия кипящего самовара',
      meta: 'Адрес: Пятницкая улица • Негласный купеческий клуб Замоскворечья',
      text: 'В этом трактире купеческий день начинался задолго до полудня. Десятки пузатых медных самоваров непрерывно гудели на столах. Белые холщовые полотенца на шеях купцов намокали от пота по мере того, как спор о ценах на сукно или хлеб переходил от утреннего чая к вечернему сговору. Отказ от шестой чашки чая хозяин расценивал как личную обиду и срыв контракта.',
      quote: '«Чай пили ведрами, пот утирали холстом, а пока самовар не сопреет — главного согласия не дадут».',
      source: '— В. А. Гиляровский, «Москва и москвичи»',
      fact: 'В пьесах Островского трактир — это не кабак, а деловой кабинет и дипломатическая площадка русского купечества.'
    },
    tretyakovka: {
      stamp: 'АРХИВЪ // ОРИЕНТИРЪ № 04',
      heading: 'Лаврушинский переулок: Рождение галереи Третьякова',
      meta: 'Адрес: Лаврушинский пер., 10 • Усадьба Павла Михайловича Третьякова',
      text: 'Тихий замоскворецкий переулок стал колыбелью национального русского искусства. Скромный купец-льнянщик Павел Третьяков с 1856 года начал собирать коллекцию картин русских художников, часто покупая работы прямо из мастерских передвижников (Перова, Крамского, Репина, Саврасова). В 1892 году он безвозмездно передал галерею Москве, положив начало соборному культурному единству нации.',
      quote: '«Для меня, истинно и пламенно любящего живопись, не может быть лучшего желания, как положить начало общественному хранилищу изящных искусств».',
      source: '— П. М. Третьяков, Завещательное письмо 1860 г.',
      fact: 'Третьяков лично заказывал портрет А. Н. Островского художнику В. Г. Перову — этот канонический портрет и сегодня украшает залы галереи.'
    },
    maly: {
      stamp: 'АРХИВЪ // ОРИЕНТИРЪ № 05',
      heading: 'Театральная площадь: «Дом Островского»',
      meta: 'Адрес: Театральный проезд, 1 • Императорский Малый театр',
      text: 'Малый театр неразрывно связан с именем Островского: здесь были поставлены все его 47 оригинальных пьес. Для артистов труппы — Прова Садовского, Марии Ермоловой, Александра Ленского — драматургия Островского стала школой подлинной жизненной правды и психологического реализма. Островский сам режиссировал премьеры, отрабатывая с актерами каждую интонацию живой народной речи.',
      quote: '«Шекспир создал английскую драму, Мольер — французскую комедию, а Островский создал русский национальный театр».',
      source: '— И. А. Гончаров, поздравительное письмо',
      fact: 'В 1929 году перед главным фасадом Малого театра был установлен памятник Островскому работы скульптора Н. Андреева.'
    }
  };

  const landmarkButtons = document.querySelectorAll('.landmark-card');
  const dossierStamp = document.getElementById('dossier-stamp');
  const dossierHeading = document.getElementById('dossier-heading');
  const dossierMeta = document.getElementById('dossier-meta');
  const dossierText = document.getElementById('dossier-text');
  const dossierQuote = document.getElementById('dossier-quote');
  const dossierSource = document.getElementById('dossier-source');
  const dossierFactText = document.getElementById('dossier-fact-text');
  const dossierContainer = document.getElementById('topography-dossier');

  if (landmarkButtons.length > 0 && dossierContainer) {
    landmarkButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-landmark');
        const data = topographyData[key];
        if (!data) return;

        landmarkButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        dossierContainer.classList.add('is-transitioning');
        setTimeout(() => {
          if (dossierStamp) dossierStamp.textContent = data.stamp;
          if (dossierHeading) dossierHeading.textContent = data.heading;
          if (dossierMeta) dossierMeta.textContent = data.meta;
          if (dossierText) dossierText.textContent = data.text;
          if (dossierQuote) dossierQuote.textContent = `«${data.quote.replace(/^[«"]|[»"]$/g, '')}»`;
          if (dossierSource) dossierSource.textContent = data.source;
          if (dossierFactText) dossierFactText.textContent = data.fact;

          dossierContainer.classList.remove('is-transitioning');
        }, 180);
      });
    });
  }

  // =========================================================================
  // 6. INTERACTIVE GLOSSARY MODAL (Замоскворецкий Лексикон)
  // =========================================================================
  const glossaryData = {
    samodur: {
      number: '§ 01 // ТЕРМИНОЛОГИЯ ОСТРОВСКОГО',
      title: 'Самодур',
      fullText: 'Термин, навсегда вошедший в русский язык благодаря драматургии Островского и статьям критика Добролюбова («Темное царство»). Означает главу патриархального рода или богатого купца, который признает единственным законом собственную прихоть и дурь. Самодурство не знает логики: оно существует ради утверждения абсолютной власти над бесправными домочадцами и приказчиками.',
      quote: '«Ведь я знаю, что не надо бы ругаться, а ругаюсь! У меня уж сердце такое: как осержусь, так сам себя не помню... Потому — кто же мне запретит?» — Савел Прокофьич Дикой («Гроза»)'
    },
    slovo: {
      number: '§ 02 // ГИЛЬДЕЙСКИЙ КОДЕКС',
      title: 'Слово купеческое',
      fullText: 'Неписаный кодекс сословной чести русского купечества. В XIX веке огромные партии ситца, пушнины, зерна или пароходные грузы сбывались без единой гербовой печати: два купца били по рукам при свидетелях в трактире у самовара. Тот, кто однажды нарушал данное слово, навсегда изгонялся из купеческого общества — ему объявлялся всеобщий бойкот («банкротство совести»).',
      quote: '«Купеческое слово — гранит. Вексель можно оспорить в палате суда, а слово, данное пред образами и чаем, обжалованию не подлежит» — Замоскворецкая хроника'
    },
    chay: {
      number: '§ 03 // БЫТОВОЙ РИТУАЛ',
      title: 'Чай с полотенцем («до седьмого пота»)',
      fullText: 'Главный ритуал и деловой инструмент купеческого Замоскворечья. Трактирное чаепитие из пузатых самоваров продолжалось 4–5 часов кряду. Купцы выпивали до 15–20 чашек, держа блюдце на пяти широко расставленных пальцах и зажав в зубах кусочек твердого сахара («вприкуску»). Перекинутое через плечо белое холщовое полотенце служило для утирания пота: считалось, что именно в этот момент наступает полное очищение и ясность ума для заключения миллионных сделок.',
      quote: '«Пока самовар не сопреет да рубаха на спине не взмокнет — настоящая купеческая дума не начнется» — Б. Кустодиев, заметки к полотнам'
    },
    lastochka: {
      number: '§ 04 // СИМВОЛ НОВОГО ВРЕМЕНИ',
      title: 'Пароход «Ласточка»',
      fullText: 'Быстроходный колесный пароход Сергея Сергеевича Паратова в драме «Бесприданница». Яркий символ наступающей капиталистической эры, где технический прогресс сочетается с безжалостным размахом и культом роскоши. Для Паратова пароход — это не просто средство передвижения, а демонстрация сословного триумфа и товар, который он без колебаний продает за максимальную выгоду.',
      quote: '«У меня, Мокий Парменыч, ничего заветного нет; найду выгоду, так всё продам, что угодно. А «Ласточку» мою за Волгой знают: летит, как птица!» — Паратов («Бесприданница»)'
    },
    domostroy: {
      number: '§ 05 // ЗАКОН И ОБРЯД',
      title: 'Тяжба и Радéние',
      fullText: 'Две стороны купеческого благочестия. С одной стороны — истовая обрядовая набожность, пожертвования на храмы и золочение куполов («радение»); с другой — многолетние ожесточенные судебные споры («тяжбы») с родными братьями и компаньонами из-за каждой копейки наследства. Островский гениально показал лицемерие тех, кто клал тысячи земных поклонов, одновременно разоряя сирот.',
      quote: '«Ханжа, сударь! Нищих оделяет, а домашних заела совсем!» — Кулигин о Кабанихе («Гроза»)'
    },
    orel: {
      number: '§ 06 // КУЛЬМИНАЦИЯ ЦИНИЗМА',
      title: 'Орёл или Решка',
      fullText: 'Сцена в финале «Бесприданницы», в которой богатые купцы Кнуров и Вожеватов бросают золотую монету («орлянку»), чтобы решить, кому из них достанется Лариса Огудалова для поездки на выставку в Париж. Это высшая точка моральной деградации сословия: живой, страдающий человек окончательно приравнивается к лоту на биржевых торгах.',
      quote: '«Орёл! — Ваше счастье, Мокий Парменыч... Стыдно мне? Нисколько не стыдно. Я купец, честно уступил по жребию» — Вожеватов («Бесприданница»)'
    },
    bespridannica: {
      number: '§ 07 // СОЦИАЛЬНЫЙ СТАТУС',
      title: 'Бесприданница',
      fullText: 'Девушка из обедневшей дворянской или чиновничьей семьи, лишенная приданого. В жестких рыночных реалиях пореформенной России бесприданница оказывалась в абсолютно беззащитном положении: брак по любви для нее был недостижим, а богатые дельцы относились к ней как к редкому антикварному лоту на открытом аукционе.',
      quote: '«У всякого свой вкус: один любит арбуз, другой свиной хрящик. А на Ларису Дмитриевну в Бряхимове все купцы, как на диковинку, заглядываются» — Кнуров («Бесприданница»)'
    },
    veksel: {
      number: '§ 08 // ФИНАНСОВЫЙ ИНСТРУМЕНТ',
      title: 'Вексель и Кабала',
      fullText: 'Долговое обязательство строгой юридической формы, пришедшее на смену устному купеческому слову во второй половине XIX века. Векселя позволяли новым промышленным хищникам скупать дворянские усадьбы за бесценок и держать в пожизненной кабале мелких ремесленников, служащих и разорившихся компаньонов.',
      quote: '«Векселями меня не испугаешь, я сам ими кого хочешь в гроб загоню! Вынь деньги да положь, а нет денег — ищи поручителя» — Сцена из купеческой тяжбы'
    },
    bankrotstvo: {
      number: '§ 09 // КУПЕЧЕСКИЙ ПЕРЕДЕЛ',
      title: '«Свои люди — сочтёмся» (Долговая яма)',
      fullText: 'Сюжет бессмертной первой комедии Островского, открывшей миру тайную жизнь Замоскворечья. Богатый купец Самсон Силыч Большов замышляет ложное (фиктивное) банкротство, чтобы не платить кредиторам, и переписывает все лавки и дома на приказчика Подхалюзина. Однако приказчик оказывается хитрее хозяина: женится на его дочери и хладнокровно отправляет тестя в тюремную «долговую яму» («Яму») за отказ выплатить грошовый откуп. Пьеса была запрещена Николаем I за «оскорбление купеческого сословия».',
      quote: '«Свои люди — сочтёмся! Зачем же чужим-то деньги отдавать? Коли мы меж собой согласны, так нам и закон не писан!» — Подхалюзин («Свои люди — сочтёмся»)'
    }
  };

  const termModal = document.getElementById('term-modal');
  const termModalContent = document.getElementById('term-modal-content');
  const termModalClose = document.getElementById('term-modal-close');
  const termButtons = document.querySelectorAll('.term-card');

  const openTermModal = (termKey) => {
    const data = glossaryData[termKey];
    if (!data || !termModal || !termModalContent) return;

    termModalContent.innerHTML = `
      <div class="modal-term-num">${data.number}</div>
      <h3 class="modal-term-title" id="modal-term-title">${data.title}</h3>
      <p class="modal-term-full">${data.fullText}</p>
      <blockquote class="modal-term-quote">${data.quote}</blockquote>
    `;

    termModal.classList.add('active');
    termModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeTermModal = () => {
    if (!termModal) return;
    termModal.classList.remove('active');
    termModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  termButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const termKey = btn.getAttribute('data-term');
      openTermModal(termKey);
    });
  });

  if (termModalClose) {
    termModalClose.addEventListener('click', closeTermModal);
  }

  if (termModal) {
    termModal.addEventListener('click', (e) => {
      if (e.target === termModal) closeTermModal();
    });
  }

  // =========================================================================
  // 7. ARTWORK LIGHTBOX INSPECTION MODAL (Экспонат № 01)
  // =========================================================================
  const artModal = document.getElementById('art-inspect-modal');
  const btnInspectHero = document.getElementById('btn-inspect-hero');
  const btnCloseInspect = document.getElementById('btn-close-inspect');

  const openArtModal = () => {
    if (!artModal) return;
    artModal.classList.add('active');
    artModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeArtModal = () => {
    if (!artModal) return;
    artModal.classList.remove('active');
    artModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (btnInspectHero) btnInspectHero.addEventListener('click', openArtModal);
  if (btnCloseInspect) btnCloseInspect.addEventListener('click', closeArtModal);
  if (artModal) {
    artModal.addEventListener('click', (e) => {
      if (e.target === artModal) closeArtModal();
    });
  }

  // Global Escape Key to close any active modal or popover
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTermModal();
      closeArtModal();
      closeAllTeamPopovers();
    }
  });

  // =========================================================================
  // 8. INTERACTIVE TEAM POPOVERS (FOOTER)
  // =========================================================================
  const teamItems = document.querySelectorAll('.team-member-item');

  const closeAllTeamPopovers = () => {
    teamItems.forEach((item) => item.classList.remove('active'));
  };

  teamItems.forEach((item) => {
    // Click / Touch Toggle
    item.addEventListener('click', (e) => {
      const isAlreadyActive = item.classList.contains('active');
      closeAllTeamPopovers();
      if (!isAlreadyActive) {
        item.classList.add('active');
      }
      e.stopPropagation();
    });

    // Keyboard Access
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isAlreadyActive = item.classList.contains('active');
        closeAllTeamPopovers();
        if (!isAlreadyActive) item.classList.add('active');
      }
    });
  });

  // Click outside to close team popovers
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.team-member-item')) {
      closeAllTeamPopovers();
    }
  });

  // =========================================================================
  // 9. SMOOTH SCROLL AND ACTIVE NAVIGATION HIGHLIGHTING
  // =========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((sec) => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 120;
      const secId = sec.getAttribute('id');

      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${secId}`) {
            link.style.color = 'var(--color-text-on-dark)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // Hero scroll button
  const heroScrollTrigger = document.getElementById('hero-scroll-trigger');
  if (heroScrollTrigger) {
    heroScrollTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = document.getElementById('section-life');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});
