/* eslint-disable no-restricted-syntax */

/**
 * Accordion item (frontend)
 *
 * Updated to work with a normal <div> wrapper instead of a custom element.
 * We now initialize on: [data-accordion-item="true"]
 */

class AccordionItem {
  static get defaultConfig() {
    return {
      initiallyOpen: false,
      openBreakpoint: 0,
      autoClose: true,
      clickToClose: true,
    };
  }

  static get duration() {
    return 250;
  }

  /**
   * Initialize component
   * @param {HTMLElement} root
   */
  constructor(root) {
    this.root = root;

    this.toggle = this.toggle.bind(this);
    this.onkeydown = this.onkeydown.bind(this);

    this.isOpen = false;
    this.isRead = false;

    this.uuid = this.root?.dataset?.uuid;
    if (!this.uuid) return;

    this.root.classList.remove('no-js');

    // Get ancestors and siblings
    this.ancestors = this.getAncestors();
    this.siblings = this.getSiblings();

    // Save children elements
    this.controller = this.root.querySelector(`#at-${this.uuid}`);
    this.content = this.root.querySelector(`#ac-${this.uuid}`);
    if (!this.controller || !this.content) return;

    // Add Listeners
    this.controller.addEventListener('click', this.toggle);
    this.controller.addEventListener('keydown', this.onkeydown);

    // Set basic attributes (match markup from save.js)
    this.controller.setAttribute('tabindex', '0');
    this.controller.setAttribute('aria-controls', `ac-${this.uuid}`);

    // Get the config from the dataset
    this.getConfig();

    // Set default attributes
    this.setAttributes(this.isOpen);
  }

  /**
   * Go up the DOM tree to retrieve ancestor accordion items (nested items)
   * @returns {HTMLElement[]}
   */
  getAncestors() {
    let current = this.root;
    const list = [];

    while (current?.parentNode && current.parentNode !== document.documentElement) {
      const parent = current.parentNode;
      if (
        parent instanceof HTMLElement &&
        parent.dataset?.accordionItem === 'true'
      ) {
        list.push(parent);
      }
      current = parent;
    }

    return list;
  }

  /**
   * Get immediately adjacent accordion items (same wrapper type)
   * @returns {HTMLElement[]}
   */
  getSiblings() {
    const siblings = [];

    ['previous', 'next'].forEach((dir) => {
      let element = this.root;

      while (element) {
        const sib = element[`${dir}ElementSibling`];
        if (
          sib &&
          sib instanceof HTMLElement &&
          sib.dataset?.accordionItem === 'true'
        ) {
          element = sib;
          siblings.push(element);
        } else {
          element = null;
        }
      }
    });

    return siblings;
  }

  /**
   * Retrieve item configuration from dataset
   * then set the initial state of the component
   */
  getConfig() {
    const nodeConfig = {};
    for (const key in this.root.dataset) {
      nodeConfig[key] = this.maybeParse(this.root.dataset[key]);
    }

    this.config = Object.assign({}, AccordionItem.defaultConfig, nodeConfig);

    const shouldOpen =
      this.config.initiallyOpen &&
      window.innerWidth >= this.config.openBreakpoint;

    if (shouldOpen || this.isInHash()) {
      this.isOpen = true;
      this.checkAncestors();
    }
  }

  /**
   * Checks if the window hash matches the component uuid
   * @returns {boolean}
   */
  isInHash() {
    return location.hash.replace('#', '') === String(this.uuid);
  }

  /**
   * Try parsing a string and return the result
   * @param {string} string
   * @returns {*}
   */
  maybeParse(string) {
    try {
      return JSON.parse(string);
    } catch (error) {
      return string;
    }
  }

  /**
   * Handles Escape, Space & Enter key
   * @param {KeyboardEvent} event
   */
  onkeydown(event) {
    if (event.key === 'Escape') {
      this.close();
    }

    if (event.code === 'Space' || event.key === 'Enter') {
      if (this.controller.nodeName !== 'BUTTON') {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
      }
    }
  }

  /**
   * Opens the item
   * @param {object} option
   */
  open(option = {}) {
    const { noSiblingsCheck, noAncestorsCheck, noChecksAndScroll, noAnim } =
      option;

    this.isOpen = true;
    this.content.removeAttribute('hidden');

    this.setAttributes(true);

    // slideDown is provided by your slide-toggle.js
    this.content.slideDown(noAnim ? 0 : AccordionItem.duration, () => {
      this.triggerResize();
    });

    if (!noChecksAndScroll) {
      if (!noAncestorsCheck) {
        this.checkAncestors();
      }

      if (!noSiblingsCheck) {
        this.checkSiblings();
      }
    }
  }

  maybeOpen() {
    if (
      !this.isOpen &&
      !this.isRead &&
      this.config.initiallyOpen &&
      window.innerWidth >= this.config.openBreakpoint
    ) {
      this.open({ noSiblingsCheck: true, noScroll: true });
    }
  }

  /**
   * Closes the item
   * @param {object} options
   */
  close(options = {}) {
    const { noAnim, force } = options;

    if ((this.config.clickToClose || force) && this.isOpen) {
      this.isOpen = false;

      // slideUp is provided by your slide-toggle.js
      this.content.slideUp(noAnim ? 0 : AccordionItem.duration, () => {
        this.setAttributes(false);
        this.triggerResize();
      });
    }
  }

  /**
   * Toggles the item
   */
  toggle() {
    this[this.isOpen ? 'close' : 'open']();
  }

  /**
   * Set attributes and classes according to the current state
   * @param {boolean} open
   */
  setAttributes(open = true) {
    if (open) {
      this.root.classList.add('is-read', 'is-open');
      this.isRead = true;
    } else {
      this.root.classList.remove('is-open');
    }

    this.controller.setAttribute('aria-expanded', String(this.isOpen));

    if (open) {
      this.content.removeAttribute('hidden');
    } else {
      // Keep your original "until-found" behavior for Chrome.
      // (If you decide to remove this later, change to: this.content.setAttribute('hidden', '')
      this.content.setAttribute('hidden', !!window.chrome ? 'until-found' : '');
    }

    this.content.style = null;
  }

  /**
   * Automatically opens ancestors when opening the item
   */
  checkAncestors() {
    this.ancestors.forEach((el) => {
      const instance = AccordionItem.instances.get(el);
      if (instance && !instance.isOpen) {
        instance.open({ noSiblingsCheck: true });
      }
    });
  }

  /**
   * Automatically closes siblings when opening the item
   */
  checkSiblings() {
    this.siblings.forEach((el) => {
      const instance = AccordionItem.instances.get(el);
      if (instance && instance.config.autoClose) {
        instance.close({ force: true });
      }
    });
  }

  /**
   * Dispatch a resize event after opening or closing the item
   */
  triggerResize() {
    const event = new Event('resize');
    event.isAfterToggle = true;
    dispatchEvent(event);
  }

  /**
   * Initialize all accordion items on the page
   */
  static initAll() {
    const nodes = document.querySelectorAll('[data-accordion-item="true"]');
    AccordionItem.instances = new Map();

    nodes.forEach((node) => {
      const instance = new AccordionItem(node);
      // Only store instances that successfully initialized
      if (instance?.root && instance?.uuid && instance?.controller && instance?.content) {
        AccordionItem.instances.set(node, instance);
      }
    });
  }
}

/**
 * Boot + listeners
 */
AccordionItem.initAll();

const eventParams = { capture: false };
let resizeDebounce;

addEventListener(
  'hashchange',
  () => {
    const hash = location.hash.replace('#', '');
    const match = document.querySelector(`[data-uuid="${CSS.escape(hash)}"]`);
    const instance = match ? AccordionItem.instances.get(match) : null;

    if (instance) {
      instance.open();
    }
  },
  eventParams
);

addEventListener(
  'resize',
  (event) => {
    if (!event.isTrusted) return;

    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      AccordionItem.instances.forEach((item) => item.maybeOpen());
    }, 150);
  },
  eventParams
);

// Open all items on cmd/ctrl+F on browsers without until-found support
if (!window.chrome) {
  addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.code === 'KeyF') {
      AccordionItem.instances.forEach((item) => item.open());
    }
  });
}