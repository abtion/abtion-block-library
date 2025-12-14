/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

store('abtion-block-library/tabs', {
  actions: {
    open() {
      const context = getContext();
      context.tabs.forEach(
        singleTab => (singleTab.isActive = singleTab.id === context.item.id)
      );

      const { ref } = getElement();
      const tabs = ref
        .closest('.wp-block-abtion-block-library-tabs')
        .querySelectorAll('.wp-block-abtion-block-library-tabs__content > div');

      tabs.forEach(tab => {
        if (tab.dataset.tabId === context.item.id) {
          tab.classList.add(
            'wp-block-abtion-block-library-tabs__content-item--active'
          );
        } else {
          tab.classList.remove(
            'wp-block-abtion-block-library-tabs__content-item--active'
          );
        }
      });
    },
  },
});
