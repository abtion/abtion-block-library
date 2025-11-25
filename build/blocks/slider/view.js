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
        slidesPerView = 2,
        behavior = 'normal',
        autoplayDelay = 3000,
        speed = 6000,
        pauseOnHover = true
      } = ctx;
      const baseOptions = {
        wrapperClass: 'wp-block-abtion-block-library-slider-slides',
        slideClass: 'wp-block-abtion-block-library-slider-slide',
        slidesPerView,
        loop: true
      };
      let options;
      if (behavior === 'marquee') {
        options = {
          ...baseOptions,
          slidesPerView: 'auto',
          // marquee works best with auto widths
          speed,
          // higher = slower
          allowTouchMove: true,
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
          autoplay: autoplayDelay > 0 ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: pauseOnHover
          } : false,
          pagination: paginationEl ? {
            el: paginationEl,
            clickable: true
          } : false
        };
      }
      new Swiper(ref, options);
    }
  }
});
})();


//# sourceMappingURL=view.js.map