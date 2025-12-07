/**
 * WordPress dependencies
 */
import { store, getElement } from '@wordpress/interactivity';

store('abtion-block-library', {
  actions: {
    switch() {
      const { ref } = getElement();
      const clickedItemId = ref.dataset.id;

      const multiSwitchPanel = ref.closest(
        '.wp-block-abtion-block-library-multi-switch-panel'
      );

      // Flag the active navigation items.
      const multiSwitchPanelNavItems = multiSwitchPanel.querySelectorAll(
        '.wp-block-abtion-block-library-multi-switch-panel-navigation-item'
      );

      multiSwitchPanelNavItems.forEach(item => {
        if (item.dataset.id === clickedItemId) {
          item.classList.add(
            'wp-block-abtion-block-library-multi-switch-panel-navigation-item--active'
          );
        } else {
          item.classList.remove(
            'wp-block-abtion-block-library-multi-switch-panel-navigation-item--active'
          );
        }
      });

      // Flag the active section panels.
      const multiSwitchPanelSections = multiSwitchPanel.querySelectorAll(
        '.wp-block-abtion-block-library-multi-switch-panel-section'
      );

      multiSwitchPanelSections.forEach(section => {
        const sectionItem = section.querySelectorAll(
          '.wp-block-abtion-block-library-multi-switch-panel-section-item'
        );

        sectionItem.forEach(sectionItem => {
          if (sectionItem.dataset.navigationId === clickedItemId) {
            sectionItem.classList.add(
              'wp-block-abtion-block-library-multi-switch-panel-section-item--active'
            );
          } else {
            sectionItem.classList.remove(
              'wp-block-abtion-block-library-multi-switch-panel-section-item--active'
            );
          }
        });
      });
    },
  },
  callbacks: {
    setup() {
      const { ref } = getElement();

      // Flag the first navigation item as active.
      const firstNavItem = ref.querySelector(
        '.wp-block-abtion-block-library-multi-switch-panel-navigation-item'
      );

      if (!firstNavItem) {
        return;
      }

      firstNavItem.classList.add(
        'wp-block-abtion-block-library-multi-switch-panel-navigation-item--active'
      );

      // Flag the first panel section item of every section as active.
      const panelSections = ref.querySelectorAll(
        '.wp-block-abtion-block-library-multi-switch-panel-section'
      );

      panelSections.forEach(section => {
        const firstPanelSection = section.querySelector(
          '.wp-block-abtion-block-library-multi-switch-panel-section-item'
        );

        if (!firstPanelSection) {
          return;
        }

        firstPanelSection.classList.add(
          'wp-block-abtion-block-library-multi-switch-panel-section-item--active'
        );
      });
    },
  },
});
