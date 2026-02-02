/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/multi-switch-panel/block.json":
/*!**************************************************!*\
  !*** ./src/blocks/multi-switch-panel/block.json ***!
  \**************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"abtion-block-library/multi-switch-panel","version":"1.0.0","title":"Multi Switch Panel","category":"abtion-blocks","keywords":["tabs","sections","switch","panel","navigation"],"icon":"index-card","description":"A flexible layout block that syncs navigation with multiple content sections","example":{},"supports":{"interactivity":true,"layout":{"allowSwitching":true},"spacing":{"margin":true,"padding":true,"blockGap":true}},"attributes":{"activeNavId":{"type":"string","default":""}},"providesContext":{"abtion-block-library/activeNavId":"activeNavId"},"textdomain":"abtion-block-library","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScriptModule":"file:./view.js"}');

/***/ }),

/***/ "./src/blocks/multi-switch-panel/edit.js":
/*!***********************************************!*\
  !*** ./src/blocks/multi-switch-panel/edit.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WordPress dependencies.
 */






const FIRST_NAV_ID = 'initial-tab-1';
const MY_TEMPLATE = [['abtion-block-library/multi-switch-panel-navigation', {}, [['abtion-block-library/multi-switch-panel-navigation-item', {
  id: FIRST_NAV_ID
}, [['core/paragraph', {
  placeholder: 'First Tab'
}]]]]], ['abtion-block-library/multi-switch-panel-section', {}, [['abtion-block-library/multi-switch-panel-section-item', {
  navigationItemId: FIRST_NAV_ID
}, [['core/paragraph', {
  placeholder: 'First Section Item'
}]]]]], ['abtion-block-library/multi-switch-panel-section', {}, [['abtion-block-library/multi-switch-panel-section-item', {
  navigationItemId: FIRST_NAV_ID
}, [['core/paragraph', {
  placeholder: 'Second Section Item'
}]]]]]];

/**
 * Helper function to flatten all descendant blocks
 *
 * @param {Array} blocks Blocks array
 * @returns {Array} All descendant blocks in a flat array
 */
function flattenAllDescendants(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) return [];
  const stack = blocks.filter(Boolean);
  const result = [];
  while (stack.length) {
    const block = stack.shift();
    if (!block) continue;
    result.push(block);
    if (Array.isArray(block.innerBlocks) && block.innerBlocks.length) {
      stack.push(...block.innerBlocks.filter(Boolean));
    }
  }
  return result;
}

/**
 * Generate a unique navigation item id.
 *
 * Uses crypto.randomUUID() when available.
 * Falls back to a timestamp + random string for older environments.
 *
 * @returns {string}
 */
function generateNavId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: sufficiently unique for editor-only usage
  return `nav-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Sync: For EACH section block, ensure it contains exactly one section-item per nav id.
 * Supports multiple sections linked to the same nav items (because we run per section).
 */
function syncNavigationItemsWithPanelSections(navigationItems, panelSections, insertBlock, removeBlock) {
  const navigationItemIds = navigationItems.map(item => item?.attributes?.id).filter(Boolean);
  if (!navigationItemIds.length || !panelSections.length) return;
  panelSections.forEach(section => {
    const sectionItems = Array.isArray(section?.innerBlocks) ? section.innerBlocks : [];
    const sectionItemIds = sectionItems.map(item => item?.attributes?.navigationItemId).filter(Boolean);

    // Add missing items
    let insertIndex = sectionItems.length;
    navigationItemIds.forEach(navId => {
      if (!sectionItemIds.includes(navId)) {
        insertBlock((0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.createBlock)('abtion-block-library/multi-switch-panel-section-item', {
          navigationItemId: navId
        }), insertIndex, section.clientId);
        insertIndex++;
      }
    });

    // Remove extra items
    sectionItemIds.forEach(secNavId => {
      if (!navigationItemIds.includes(secNavId)) {
        const itemToRemove = sectionItems.find(item => item?.attributes?.navigationItemId === secNavId);
        if (itemToRemove) {
          removeBlock(itemToRemove.clientId);
        }
      }
    });
  });
}

/**
 * When a nav item is duplicated, Gutenberg duplicates attributes (including id).
 * We detect duplicates and:
 *  - assign a new unique id to the duplicated nav item
 *  - clone section-item content from the original id into the new id (if there is content)
 *  - select the duplicated nav item so it becomes active immediately
 *
 * Works with multiple sections: clones into EACH section block.
 */
function handleDuplicatedNavItems({
  navigationItems,
  panelSections,
  setInnerBlockAttributes,
  insertBlock,
  selectBlock
}) {
  if (!navigationItems.length) return;

  // Track first occurrence of each id
  const firstById = new Map();
  navigationItems.forEach(navItem => {
    const currentId = navItem?.attributes?.id;

    // If missing id, just assign one (not a duplication scenario)
    if (!currentId) {
      setInnerBlockAttributes(navItem.clientId, {
        id: generateNavId()
      });
      return;
    }

    // First occurrence => original
    if (!firstById.has(currentId)) {
      firstById.set(currentId, navItem);
      return;
    }

    // Duplicate detected
    const originalId = currentId;
    const newId = generateNavId();

    // 1) Give duplicated nav item a new unique id
    setInnerBlockAttributes(navItem.clientId, {
      id: newId
    });

    // 2) If sections exist, clone section-items content from originalId into newId
    if (panelSections.length) {
      panelSections.forEach(section => {
        const sectionItems = Array.isArray(section?.innerBlocks) ? section.innerBlocks : [];
        const originalSectionItem = sectionItems.find(item => item?.attributes?.navigationItemId === originalId);

        // If no source item exists yet, do nothing here; normal sync will create an empty one.
        if (!originalSectionItem) return;

        // Only clone if there is actual content
        const originalInnerBlocks = originalSectionItem.innerBlocks || [];
        if (originalInnerBlocks.length === 0) return;
        const clonedInnerBlocks = originalInnerBlocks.map(b => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.cloneBlock)(b));
        const newSectionItemBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.createBlock)('abtion-block-library/multi-switch-panel-section-item', {
          navigationItemId: newId
        }, clonedInnerBlocks);

        // Insert right after the original item (nice UX)
        const originalIndex = sectionItems.findIndex(item => item?.clientId === originalSectionItem.clientId);
        const insertIndex = originalIndex >= 0 ? originalIndex + 1 : sectionItems.length;
        insertBlock(newSectionItemBlock, insertIndex, section.clientId);
      });
    }

    // 3) Select duplicated nav item ONCE so it becomes active immediately
    if (selectBlock) {
      selectBlock(navItem.clientId);
    }
  });
}
function Edit(props) {
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)();
  const {
    setAttributes,
    clientId,
    insertBlock,
    removeBlock,
    setInnerBlockAttributes,
    selectBlock
  } = props;
  const currentBlock = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => select('core/block-editor').getBlock(clientId), [clientId]);
  let navigationItems = [];
  let panelSections = [];
  if (currentBlock && Array.isArray(currentBlock.innerBlocks)) {
    const descendants = flattenAllDescendants(currentBlock.innerBlocks);
    navigationItems = descendants.filter(block => block?.name === 'abtion-block-library/multi-switch-panel-navigation-item');
    panelSections = descendants.filter(block => block?.name === 'abtion-block-library/multi-switch-panel-section');
  }
  const navClientKey = navigationItems.map(i => i.clientId).join('|');
  const sectionsKey = panelSections.map(s => s.clientId).join('|');
  const navIdsKey = navigationItems.map(i => i?.attributes?.id || '').join('|');

  /**
   * 1) Handle duplication + ensure uniqueness.
   * Also re-runs when sections appear (so duplication can clone into them if present).
   * Must run BEFORE sync.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    handleDuplicatedNavItems({
      navigationItems,
      panelSections,
      setInnerBlockAttributes,
      insertBlock,
      selectBlock
    });
  }, [navClientKey, sectionsKey]);

  /**
   * 2) Normal sync: ensures every section has one item per nav id, and removes extras.
   * Big UX win: runs when nav ids change AND when sections appear later.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    syncNavigationItemsWithPanelSections(navigationItems, panelSections, insertBlock, removeBlock);
  }, [navIdsKey, sectionsKey]);

  /**
   * Find active navigation item based on selected block.
   */
  const activeNavId = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const editorSelect = select('core/block-editor');
    let activeId = null;
    navigationItems.forEach(item => {
      const id = item?.attributes?.id;
      if (!id) return;
      const isSelected = editorSelect.isBlockSelected(item.clientId);
      const hasSelectedInner = editorSelect.hasSelectedInnerBlock(item.clientId, true);
      if (isSelected || hasSelectedInner) {
        activeId = id;
      }
    });
    return activeId;
  }, [navClientKey, navIdsKey]);

  /**
   * Update activeNavId attribute when it changes.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (activeNavId) {
      setAttributes({
        activeNavId
      });
    }
  }, [activeNavId]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks, {
      template: MY_TEMPLATE
    })
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.withDispatch)(dispatch => ({
  setInnerBlockAttributes: (clientId, attributes) => dispatch('core/block-editor').updateBlockAttributes(clientId, attributes),
  insertBlock: (block, index, clientId) => dispatch('core/block-editor').insertBlock(block, index, clientId),
  removeBlock: clientId => dispatch('core/block-editor').removeBlock(clientId),
  selectBlock: clientId => dispatch('core/block-editor').selectBlock(clientId)
}))])(Edit));

/***/ }),

/***/ "./src/blocks/multi-switch-panel/editor.scss":
/*!***************************************************!*\
  !*** ./src/blocks/multi-switch-panel/editor.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/multi-switch-panel/index.js":
/*!************************************************!*\
  !*** ./src/blocks/multi-switch-panel/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/multi-switch-panel/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./save */ "./src/blocks/multi-switch-panel/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/blocks/multi-switch-panel/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/multi-switch-panel/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/multi-switch-panel/editor.scss");
/**
 * WordPress dependencies.
 */


/**
 * Internal dependencies
 */





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./src/blocks/multi-switch-panel/save.js":
/*!***********************************************!*\
  !*** ./src/blocks/multi-switch-panel/save.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function Save() {
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    'data-wp-interactive': 'abtion-block-library/multi-switch-panel',
    'data-wp-init--setup': 'callbacks.setup'
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./src/blocks/multi-switch-panel/style.scss":
/*!**************************************************!*\
  !*** ./src/blocks/multi-switch-panel/style.scss ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"blocks/multi-switch-panel/index": 0,
/******/ 			"blocks/multi-switch-panel/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkabtion_block_library"] = globalThis["webpackChunkabtion_block_library"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["blocks/multi-switch-panel/style-index"], () => (__webpack_require__("./src/blocks/multi-switch-panel/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map