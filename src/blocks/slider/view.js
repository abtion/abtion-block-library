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

      const paginationEl =
        ref.querySelector(':scope > .swiper-pagination') ||
        ref.querySelector('.swiper-pagination');

      const {
        slidesPerView = 2,
        behavior = 'normal',
        autoplayDelay = 3000,
        speed = 6000,
        pauseOnHover = true,
      } = ctx;

      const baseOptions = {
        wrapperClass: 'wp-block-abtion-block-library-slider-slides',
        slideClass: 'wp-block-abtion-block-library-slider-slide',
        slidesPerView,
        loop: true,
      };

      let options;

      if (behavior === 'marquee') {
        options = {
          ...baseOptions,
          slidesPerView: 'auto', // marquee works best with auto widths
          speed, // higher = slower
          allowTouchMove: true,
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
        options = {
          ...baseOptions,
          autoplay:
            autoplayDelay > 0
              ? {
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: pauseOnHover,
                }
              : false,
          pagination: paginationEl
            ? {
                el: paginationEl,
                clickable: true,
              }
            : false,
        };
      }

      new Swiper(ref, options);
    },
  },
});
