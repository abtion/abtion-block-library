class AccordionItem extends HTMLElement {
  static get defaultConfig() {
    return {
      initiallyOpen: false,
      openBreakpoint: 0,
      autoClose: true,
      clickToClose: true,
    };
  }

  static get class() {
    return 'js-accordion-item';
  }

  static get duration() {
    return 250;
  }

  /**
   * Initialize component
   */
  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
    this.onkeydown = this.onkeydown.bind(this);

    this.isOpen = false;
    this.uuid = this.dataset.uuid;
    if (!this.uuid) return;
    this.classList.remove('no-js');

    // Get ancestors and siblings
    this.ancestors = this.getAncestors();
    this.siblings = this.getSiblings();

    // Save children elements
    this.controller = this.querySelector(`:scope > #at-${this.uuid}`);
    this.content = this.querySelector(`:scope > #ac-${this.uuid}`);
    if (!this.controller || !this.content) return;

    // Add Listeners
    this.controller.addEventListener('click', this.toggle);
    this.controller.addEventListener('keydown', this.onkeydown);

    // Set basic attributes
    this.controller.setAttribute('tabindex', 0);
    this.controller.setAttribute('aria-controls', 'ac-' + this.uuid);

    // Get the config from the dataset
    this.getConfig();

    // Set default attributes
    this.setAttributes(this.isOpen);
  }

  /**
   * Go up the DOM tree to retrieve ancestors accordion items (in case of nested items)
   * @returns array
   */
  getAncestors() {
    let current = this;
    let list = [];

    while (
      current.parentNode != null &&
      current.parentNode != document.documentElement
    ) {
      if (current.parentNode.classList.contains(AccordionItem.class)) {
        list.push(current.parentNode);
      }
      current = current.parentNode;
    }
    return list;
  }

  /**
   * Get immediately adjacent Accordion items
   * @returns array
   */
  getSiblings() {
    const siblings = [];
    ['previous', 'next'].forEach(dir => {
      let element = this;
      while (element) {
        if (
          element[dir + 'ElementSibling'] &&
          element[dir + 'ElementSibling'].nodeName === 'ACCORDION-ITEM'
        ) {
          element = element[dir + 'ElementSibling'];
          siblings.push(element);
        } else {
          element = null;
        }
      }
    });

    return siblings;
  }

  /**
   * Retrieve item configuration by looking at dataset
   * then sets the inital state of the component
   */
  getConfig() {
    const nodeConfig = {};
    for (const key in this.dataset) {
      nodeConfig[key] = this.maybeParse(this.dataset[key]);
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
   * Checks if the window hash matches the compenent uuid
   * @returns Boolean
   */
  isInHash() {
     return location.hash.replace('#', '') === this.uuid;
  }

  /**
   * Try parsing a string and returns the result
   * @param {string} string
   * @returns mixed
   */
  maybeParse(string) {
    return (() => {
      try {
        return JSON.parse(string);
      } catch (error) {
        return string;
      }
    })();
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
      this.classList.add('is-read', 'is-open');
      this.isRead = true;
    } else {
      this.classList.remove('is-open');
    }

    this.controller.setAttribute('aria-expanded', this.isOpen);
    open
      ? this.content.removeAttribute('hidden')
      : this.content.setAttribute(
          'hidden',
          !!window.chrome ? 'until-found' : ''
        );
    this.content.style = null;
  }

  /**
   * Automatically opens ancestors when opening the item
   */
  checkAncestors() {
    this.ancestors.forEach(element => {
      if (!element.isOpen) {
        element.open({ noSiblingsCheck: true });
      }
    });
  }

  /**
   * Automatically closes siblings when opening then item
   */
  checkSiblings() {
    this.siblings.forEach(element => {
      if (element.config.autoClose) {
        element.close({ force: true });
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
}

/**
 * Register custom elements & hashchange listener
 */
if (typeof customElements !== 'undefined') {
  customElements.define('accordion-item', AccordionItem);

  const items = document.querySelectorAll('accordion-item');
  const eventParams = { capture: false };
  let resizeDebounce;

  addEventListener(
    'hashchange',
    () => {
      const hash = location.hash.replace('#', '');
      const match = document.querySelector(`[data-uuid="${CSS.escape(hash)}"]`);

      if (match && match instanceof AccordionItem) {
        match.open();
      }
    },
    eventParams
  );

  addEventListener(
    'resize',
    event => {
      if (!event.isTrusted) return;

      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        items.forEach(item => item.maybeOpen());
      }, 150);
    },
    eventParams
  );

  // Open all items on cmd/ctrl F on browser without until-found support
  if (!window.chrome) {
    addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.code === 'KeyF') {
        items.forEach(item => item.open());
      }
    });
  }
}
