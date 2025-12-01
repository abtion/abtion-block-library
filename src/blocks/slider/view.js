/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Helpers
 */
const q = (root, selector) =>
  root.querySelector(`:scope ${selector}`) || root.querySelector(selector);

const cleanupExistingSwiper = ref => {
  if (ref.swiper) {
    ref.swiper.destroy(true, true);
  }
};

const ensureSwiperAvailable = () => {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper is not available on window');
    return false;
  }
  return true;
};

/**
 * Behavior option builders
 */
const buildMarqueeOptions = (ref, baseOptions, ctx) => {
  const { speed = 6000, pauseOnHover = true } = ctx;

  const wrapper = q(ref, '.wp-block-abtion-block-library-slider-slides');
  if (!wrapper) return null;

  // Remove old duplicates if re-init happens
  wrapper.querySelectorAll('.is-duplicate').forEach(n => n.remove());

  const originals = Array.from(wrapper.children);
  if (originals.length === 0) return null;

  // Duplicate slides until track >= 2x container width
  const targetWidth = ref.clientWidth * 2;
  const getTrackWidth = () => wrapper.scrollWidth;

  let safety = 0;
  while (getTrackWidth() < targetWidth && safety < 10) {
    originals.forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.classList.add('is-duplicate');
      clone.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(clone);
    });
    safety++;
  }

  return {
    ...baseOptions,
    slidesPerView: 'auto',
    speed,
    watchOverflow: false,
    allowTouchMove: false,
    freeMode: { enabled: true, momentum: false },
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: pauseOnHover,
    },
  };
};

const buildNormalOptions = (ref, baseOptions, ctx) => {
  const { slidesPerViewDesktop = 2.5, slidesPerViewMobile = 1.5 } = ctx;

  const prevEl = q(ref, '.swiper-button-prev');
  const nextEl = q(ref, '.swiper-button-next');
  const scrollbarEl = q(ref, '.swiper-scrollbar');

  return {
    ...baseOptions,
    slidesPerGroup: 1,
    watchOverflow: false,

    scrollbar: scrollbarEl ? { el: scrollbarEl, draggable: false } : false,

    navigation: prevEl && nextEl ? { prevEl, nextEl } : false,

    breakpoints: {
      0: {
        slidesPerView: slidesPerViewMobile,
        slidesPerGroup: 1,
      },
      782: {
        slidesPerView: slidesPerViewDesktop,
        slidesPerGroup: 1,
      },
    },
  };
};

const buildVerticalOptions = (ref, baseOptions, ctx) => {
  const { slidesPerViewDesktop = 1.25, slidesPerViewMobile = 1.25 } = ctx;

  const prevEl = q(ref, '.swiper-button-prev');
  const nextEl = q(ref, '.swiper-button-next');
  const scrollbarEl = q(ref, '.swiper-scrollbar');

  return {
    ...baseOptions,
    direction: 'vertical',
    slidesPerView: slidesPerViewDesktop,
    slidesPerGroup: 1,
    watchOverflow: false,
    spaceBetween: 32,

    centeredSlides: false,
    centeredSlidesBounds: true,
    initialSlide: 0,

    mousewheel: {
      forceToAxis: true,
      sensitivity: 0.5,
      thresholdDelta: 20,
      thresholdTime: 200,
      releaseOnEdges: true,
    },

    scrollbar: scrollbarEl ? { el: scrollbarEl, draggable: true } : false,

    navigation: prevEl && nextEl ? { prevEl, nextEl } : false,

    breakpoints: {
      0: { slidesPerView: slidesPerViewMobile },
      782: { slidesPerView: slidesPerViewDesktop },
    },
  };
};

const BEHAVIORS = {
  marquee: buildMarqueeOptions,
  normal: buildNormalOptions,
  vertical: buildVerticalOptions,
};

store('abtion-block-library', {
  callbacks: {
    setup() {
      const { ref } = getElement();
      const ctx = getContext();

      if (!ref || ref.nodeType !== 1) return;
      if (!ensureSwiperAvailable()) return;

      cleanupExistingSwiper(ref);

      const { behavior = 'normal', slidesPerViewDesktop = 2.5 } = ctx;

      const baseOptions = {
        wrapperClass: 'wp-block-abtion-block-library-slider-slides',
        slideClass: 'wp-block-abtion-block-library-slider-slide',
        slidesPerView: slidesPerViewDesktop,
        loop: true,
      };

      const builder = BEHAVIORS[behavior] || BEHAVIORS.normal;
      const options = builder(ref, baseOptions, ctx);
      if (!options) return;

      new Swiper(ref, options);
    },
  },
});
