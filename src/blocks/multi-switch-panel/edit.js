/**
 * WordPress dependencies.
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

function syncNavigationItemsWithPanelSections(
  navigationItems,
  panelSections,
  insertBlock,
  removeBlock
) {
  panelSections.forEach(section => {
    const sectionItems = section.innerBlocks;

    const navigationItemIds = navigationItems.map(item => item.attributes.id);
    const sectionItemIds = sectionItems.map(
      item => item.attributes.navigationItemId
    );

    // Add missing items
    navigationItemIds.forEach(navId => {
      if (!sectionItemIds.includes(navId)) {
        insertBlock(
          createBlock('abtion-block-library/multi-switch-panel-section-item', {
            navigationItemId: navId,
          }),
          section.innerBlocks.length,
          section.clientId
        );
      }
    });

    // Remove extra items
    sectionItemIds.forEach(secId => {
      if (!navigationItemIds.includes(secId)) {
        const itemToRemove = sectionItems.find(
          item => item.attributes.navigationItemId === secId
        );

        if (itemToRemove) {
          removeBlock(itemToRemove.clientId);
        }
      }
    });
  });
}

/**
 * Helper function to flatten all descendant blocks
 *
 * @param {*} blocks Blocks array
 * @returns All descendant blocks in a flat array
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

function Edit(props) {
  const blockProps = useBlockProps();

  const { setAttributes, clientId, insertBlock, removeBlock } = props;

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
        block.name ===
          'abtion-block-library/multi-switch-panel-navigation-item' &&
        block.attributes?.id
    );

    panelSections = descendants.filter(
      block =>
        block &&
        block.name === 'abtion-block-library/multi-switch-panel-section'
    );
  }

  /**
   * Sync navigation items with panel sections.
   */
  useEffect(() => {
    syncNavigationItemsWithPanelSections(
      navigationItems,
      panelSections,
      insertBlock,
      removeBlock
    );
  }, [navigationItems.length]);

  /**
   * Find active navigation item based on selected block.
   */
  const activeNavId = useSelect(
    select => {
      const editorSelect = select('core/block-editor');
      let activeId = null;

      navigationItems.forEach(item => {
        if (!item.attributes.id) {
          return;
        }

        const isSelected = editorSelect.isBlockSelected(item.clientId);
        const hasSelectedInner = editorSelect.hasSelectedInnerBlock(
          item.clientId,
          true
        );

        if (isSelected || hasSelectedInner) {
          activeId = item.attributes.id;
        }
      });

      return activeId;
    },
    [navigationItems.map(i => i.clientId).join(',')]
  );

  /**
   * Update activeNavId attribute when it changes.
   */
  useEffect(() => {
    if (activeNavId) {
      setAttributes({ activeNavId });
    }
  }, [activeNavId]);

  /**
   * Exclude Multi Switch Panel from being insertable inside itself.
   */
  const allowedBlocks = useSelect(select => {
    const all = select('core/blocks')
      .getBlockTypes()
      .map(block => block.name);

    return all.filter(
      name => name !== 'abtion-block-library/multi-switch-panel'
    );
  }, []);

  return (
    <div {...blockProps}>
      <InnerBlocks allowedBlocks={allowedBlocks} />
    </div>
  );
}

export default compose([
  withDispatch(dispatch => ({
    setInnerBlockAttributes: (clientId, attributes) =>
      dispatch('core/block-editor').updateBlock(clientId, attributes),
    insertBlock: (block, index, clientId) =>
      dispatch('core/block-editor').insertBlock(block, index, clientId),
    removeBlock: clientId =>
      dispatch('core/block-editor').removeBlock(clientId),
    selectBlock: clientId =>
      dispatch('core/block-editor').selectBlock(clientId),
  })),
])(Edit);
