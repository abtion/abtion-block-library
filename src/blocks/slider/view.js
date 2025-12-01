/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

store('abtion-block-library', {
  callbacks: {
    setup() {
      const { ref } = getElement();
      const ctx = getContext();

      // Guard: if ref isn't an element, don't run
      if (!ref || ref.nodeType !== 1) return;

      // Guard: if Swiper didn't load for some reason
      if (typeof Swiper === 'undefined') {
        console.warn('Swiper is not available on window');
        return;
      }

      // Prevent double init
      if (ref.swiper) {
        ref.swiper.destroy(true, true);
      }

      const {
        slidesPerViewDesktop = 2.5,
        slidesPerViewMobile = 1.5,
        behavior = 'normal',
        speed = 6000,
        pauseOnHover = true,
      } = ctx;

      const baseOptions = {
        wrapperClass: 'wp-block-abtion-block-library-slider-slides',
        slideClass: 'wp-block-abtion-block-library-slider-slide',
        slidesPerView: slidesPerViewDesktop,
        loop: true,
      };

      let options;

      if (behavior === 'marquee') {
        const wrapper = ref.querySelector(
          '.wp-block-abtion-block-library-slider-slides'
        );
        if (!wrapper) return;

        // Remove old duplicates if re-init happens
        wrapper.querySelectorAll('.is-duplicate').forEach(n => n.remove());

        const originals = Array.from(wrapper.children);
        if (originals.length === 0) return;

        /**
         * Duplicate slides until their total width is comfortably > container width.
         * We aim for 2x container so the loop "never runs out".
         */
        const targetWidth = ref.clientWidth * 2;

        // Helper to get current width of all slides
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
        options = {
          ...baseOptions,
          slidesPerView: 'auto',
          speed,
          watchOverflow: false, // <-- important: don't auto-disable
          allowTouchMove: false,
          freeMode: {
            enabled: true,
            momentum: false,
          },
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: pauseOnHover,
          },
        };
      } else {
        const prevEl =
          ref.querySelector(':scope .swiper-button-prev') ||
          ref.querySelector('.swiper-button-prev');

        const nextEl =
          ref.querySelector(':scope .swiper-button-next') ||
          ref.querySelector('.swiper-button-next');

        const scrollbarEl =
          ref.querySelector(':scope .swiper-scrollbar') ||
          ref.querySelector('.swiper-scrollbar');

        options = {
          ...baseOptions,
          slidesPerGroup: 1,
          watchOverflow: false,
          scrollbar: scrollbarEl
            ? {
                el: scrollbarEl,
                draggable: false,
              }
            : false,

          navigation:
            prevEl && nextEl
              ? {
                  prevEl,
                  nextEl,
                }
              : false,
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
      }

      new Swiper(ref, options);
    },
  },
});
