(() => {
  const root = document.documentElement;
  root.classList.add('gsap-ready');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setupHoverTilt = () => {
    document.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        if (reduceMotion) {
          return;
        }

        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.setProperty('--tilt-x', `${(-y * 3).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 3).toFixed(2)}deg`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  };

  const runGsap = () => {
    if (reduceMotion || !window.gsap) {
      root.classList.add('is-loaded');
      return;
    }

    const { gsap } = window;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    gsap.defaults({
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.announcement span', {
      y: -10,
      stagger: 0.08,
      duration: 0.5,
    });

    gsap.from('.store-header', {
      y: -20,
      duration: 0.7,
      delay: 0.08,
    });

    gsap.from('.hero-content > *', {
      y: 34,
      stagger: 0.12,
      duration: 0.95,
      delay: 0.18,
    });

    gsap.from('.hero-image', {
      scale: 1.08,
      duration: 1.55,
      ease: 'power2.out',
    });

    gsap.from('.checkout-hero > *, .empty-state > *', {
      y: 22,
      stagger: 0.08,
      duration: 0.72,
      delay: 0.08,
    });

    if (window.ScrollTrigger) {
      const revealGroups = [
        '.category-strip a',
        '.editorial-band > div',
        '.feature-grid article',
        '.section-head > *',
        '.product-card',
        '.lookbook-copy',
        '.mini-products a',
        '.store-panel',
      ];

      revealGroups.forEach((selector) => {
        gsap.utils.toArray(selector).forEach((element, index) => {
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
            y: 34,
            duration: 0.75,
            delay: Math.min((index % 4) * 0.05, 0.18),
          });
        });
      });

      gsap.to('.hero-image', {
        scrollTrigger: {
          trigger: '.hero-luxury',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        yPercent: 7,
        scale: 1.04,
        ease: 'none',
      });
    }

    root.classList.add('is-loaded');
  };

  setupHoverTilt();

  if (document.readyState === 'complete') {
    runGsap();
  } else {
    window.addEventListener('load', runGsap, { once: true });
  }
})();
