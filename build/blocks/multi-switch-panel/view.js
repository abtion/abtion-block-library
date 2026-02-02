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
/*!***********************************************!*\
  !*** ./src/blocks/multi-switch-panel/view.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/**
 * WordPress dependencies
 */

(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('abtion-block-library/multi-switch-panel', {
  actions: {
    switch() {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const clickedItemId = ref.dataset.id;
      const multiSwitchPanel = ref.closest('.wp-block-abtion-block-library-multi-switch-panel');

      // Flag the active navigation items.
      const multiSwitchPanelNavItems = multiSwitchPanel.querySelectorAll('.wp-block-abtion-block-library-multi-switch-panel-navigation-item');
      multiSwitchPanelNavItems.forEach(item => {
        if (item.dataset.id === clickedItemId) {
          item.classList.add('wp-block-abtion-block-library-multi-switch-panel-navigation-item--active');
        } else {
          item.classList.remove('wp-block-abtion-block-library-multi-switch-panel-navigation-item--active');
        }
      });

      // Flag the active section panels.
      const multiSwitchPanelSections = multiSwitchPanel.querySelectorAll('.wp-block-abtion-block-library-multi-switch-panel-section');
      multiSwitchPanelSections.forEach(section => {
        const sectionItem = section.querySelectorAll('.wp-block-abtion-block-library-multi-switch-panel-section-item');
        sectionItem.forEach(sectionItem => {
          if (sectionItem.dataset.navigationId === clickedItemId) {
            sectionItem.classList.add('wp-block-abtion-block-library-multi-switch-panel-section-item--active');
          } else {
            sectionItem.classList.remove('wp-block-abtion-block-library-multi-switch-panel-section-item--active');
          }
        });
      });
    }
  },
  callbacks: {
    setup() {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();

      // Flag the first navigation item as active.
      const firstNavItem = ref.querySelector('.wp-block-abtion-block-library-multi-switch-panel-navigation-item');
      if (!firstNavItem) {
        return;
      }
      firstNavItem.classList.add('wp-block-abtion-block-library-multi-switch-panel-navigation-item--active');

      // Flag the first panel section item of every section as active.
      const panelSections = ref.querySelectorAll('.wp-block-abtion-block-library-multi-switch-panel-section');
      panelSections.forEach(section => {
        const firstPanelSection = section.querySelector('.wp-block-abtion-block-library-multi-switch-panel-section-item');
        if (!firstPanelSection) {
          return;
        }
        firstPanelSection.classList.add('wp-block-abtion-block-library-multi-switch-panel-section-item--active');
      });
    }
  }
});
})();


//# sourceMappingURL=view.js.map