import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "@wordpress/interactivity":
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************************!*\
  !*** ./src/blocks/slider/view.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/**
 * WordPress dependencies
 */

(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('abtion-block-library', {
  callbacks: {
    setup() {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();

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
      const paginationEl = ref.querySelector(':scope > .swiper-pagination') || ref.querySelector('.swiper-pagination');
      const {
        slidesPerViewDesktop = 2.5,
        slidesPerViewMobile = 1.5,
        behavior = 'normal',
        speed = 6000,
        pauseOnHover = true
      } = ctx;
      const baseOptions = {
        wrapperClass: 'wp-block-abtion-block-library-slider-slides',
        slideClass: 'wp-block-abtion-block-library-slider-slide',
        slidesPerView: slidesPerViewDesktop,
        loop: true
      };
      let options;
      if (behavior === 'marquee') {
        const wrapper = ref.querySelector('.wp-block-abtion-block-library-slider-slides');
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
          watchOverflow: false,
          // <-- important: don't auto-disable
          allowTouchMove: false,
          freeMode: {
            enabled: true,
            momentum: false
          },
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: pauseOnHover
          }
        };
      } else {
        options = {
          ...baseOptions,
          slidesPerGroup: 1,
          watchOverflow: false,
          pagination: paginationEl ? {
            el: paginationEl,
            clickable: true
          } : false,
          breakpoints: {
            0: {
              slidesPerView: slidesPerViewMobile,
              slidesPerGroup: 1
            },
            782: {
              slidesPerView: slidesPerViewDesktop,
              slidesPerGroup: 1
            }
          }
        };
      }
      new Swiper(ref, options);
    }
  }
});
})();


//# sourceMappingURL=view.js.map