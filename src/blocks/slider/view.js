/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

store('abtion-block-library', {
  callbacks: {
    setup() {
      const { ref } = getElement();
      const ctx = getContext();
      const slidesPerView = ctx.slidesPerView;

      console.log(ctx);
      console.log(ref);

      const pagination = ref.querySelector('.swiper-pagination');
      console.log(pagination);
      //const table = ref.querySelector('table');
      console.log('running setup!');

      new Swiper(ref, {
        wrapperClass: 'wp-block-abtion-block-library-slider-slides',
        slideClass: 'wp-block-abtion-block-library-slider-slide',
        slidesPerView,
        loop: true,
        pagination: {
          el: pagination,
          clickable: true,
          /*  dynamicBullets: true, */
        },
      });
    },
  },
});
