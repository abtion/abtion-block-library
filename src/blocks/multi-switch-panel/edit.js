/**
 * WordPress dependencies.
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

/**
 * Helper function to flatten all descendant blocks
 *
 * @param {Array} blocks Blocks array
 * @returns {Array} All descendant blocks in a flat array
 */
function flattenAllDescendants(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) {
    return [];
  }

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
 * Generate a reasonably unique id for a nav item.
 * (Only used for editor bookkeeping; doesn’t need to be cryptographically strong.)
 */
function generateNavId() {
  return `nav-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Ensure each navigation item has a unique attributes.id.
 * Fixes the Gutenberg "duplicate block" behavior that copies attributes verbatim.
 */
function ensureUniqueNavigationIds(navigationItems, setInnerBlockAttributes) {
  const seen = new Set();

  navigationItems.forEach(item => {
    const currentId = item?.attributes?.id;

    // Missing or duplicate id => assign a new one
    if (!currentId || seen.has(currentId)) {
      setInnerBlockAttributes(item.clientId, { id: generateNavId() });
      return;
    }

    seen.add(currentId);
  });
}

/**
 * Sync: for EACH section block, ensure it contains exactly one section-item per nav id.
 * Supports multiple sections linked to the same nav items (because we run per section).
 */
function syncNavigationItemsWithPanelSections(
  navigationItems,
  panelSections,
  insertBlock,
  removeBlock
) {
  const navigationItemIds = navigationItems
    .map(item => item?.attributes?.id)
    .filter(Boolean);

  if (!navigationItemIds.length || !panelSections.length) {
    return;
  }

  panelSections.forEach(section => {
    const sectionItems = Array.isArray(section?.innerBlocks)
      ? section.innerBlocks
      : [];

    const sectionItemIds = sectionItems
      .map(item => item?.attributes?.navigationItemId)
      .filter(Boolean);

    // Add missing items (keep order aligned with navigationItemIds)
    let insertIndex = sectionItems.length;

    navigationItemIds.forEach(navId => {
      if (!sectionItemIds.includes(navId)) {
        insertBlock(
          createBlock('abtion-block-library/multi-switch-panel-section-item', {
            navigationItemId: navId,
          }),
          insertIndex,
          section.clientId
        );
        insertIndex++;
      }
    });

    // Remove extra items
    sectionItemIds.forEach(secNavId => {
      if (!navigationItemIds.includes(secNavId)) {
        const itemToRemove = sectionItems.find(
          item => item?.attributes?.navigationItemId === secNavId
        );

        if (itemToRemove) {
          removeBlock(itemToRemove.clientId);
        }
      }
    });
  });
}

function Edit(props) {
  const blockProps = useBlockProps();

  const {
    setAttributes,
    clientId,
    insertBlock,
    removeBlock,
    setInnerBlockAttributes,
  } = props;

  const currentBlock = useSelect(
    select => select('core/block-editor').getBlock(clientId),
    [clientId]
  );

  let navigationItems = [];
  let panelSections = [];

  if (currentBlock && Array.isArray(currentBlock.innerBlocks)) {
    const descendants = flattenAllDescendants(currentBlock.innerBlocks);

    navigationItems = descendants.filter(
      block =>
        block &&
        block.name === 'abtion-block-library/multi-switch-panel-navigation-item'
    );

    panelSections = descendants.filter(
      block =>
        block &&
        block.name === 'abtion-block-library/multi-switch-panel-section'
    );
  }

  /**
   * 1) Fix duplication bug: ensure nav item ids are unique (duplicates copy attributes.id).
   * Runs whenever nav item clientIds change (add/duplicate/remove).
   */
  useEffect(() => {
    if (!navigationItems.length) return;

    ensureUniqueNavigationIds(navigationItems, setInnerBlockAttributes);
  }, [navigationItems.map(i => i.clientId).join('|')]);

  /**
   * 2) Sync nav items -> section items.
   * Big UX win: this runs not only when nav changes, but also when sections appear later.
   * Supports multiple sections (each gets one section-item per nav id).
   */
  const navIdsKey = navigationItems.map(i => i?.attributes?.id || '').join('|');
  const sectionsKey = panelSections.map(s => s.clientId).join('|');

  useEffect(() => {
    syncNavigationItemsWithPanelSections(
      navigationItems,
      panelSections,
      insertBlock,
      removeBlock
    );
  }, [navIdsKey, sectionsKey]);

  /**
   * Find active navigation item based on selected block.
   */
  const activeNavId = useSelect(
    select => {
      const editorSelect = select('core/block-editor');
      let activeId = null;

      navigationItems.forEach(item => {
        const id = item?.attributes?.id;
        if (!id) return;

        const isSelected = editorSelect.isBlockSelected(item.clientId);
        const hasSelectedInner = editorSelect.hasSelectedInnerBlock(
          item.clientId,
          true
        );

        if (isSelected || hasSelectedInner) {
          activeId = id;
        }
      });

      return activeId;
    },
    // re-evaluate when nav items list changes
    [navigationItems.map(i => i.clientId).join('|')]
  );

  /**
   * Update activeNavId attribute when it changes.
   */
  useEffect(() => {
    if (activeNavId) {
      setAttributes({ activeNavId });
    }
  }, [activeNavId]);

  return (
    <div {...blockProps}>
      <InnerBlocks />
    </div>
  );
}

export default compose([
  withDispatch(dispatch => ({
    setInnerBlockAttributes: (clientId, attributes) =>
      dispatch('core/block-editor').updateBlockAttributes(clientId, attributes),
    insertBlock: (block, index, clientId) =>
      dispatch('core/block-editor').insertBlock(block, index, clientId),
    removeBlock: clientId =>
      dispatch('core/block-editor').removeBlock(clientId),
    selectBlock: clientId =>
      dispatch('core/block-editor').selectBlock(clientId),
  })),
])(Edit);
