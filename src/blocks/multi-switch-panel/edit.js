/**
 * WordPress dependencies.
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock, cloneBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

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
 * Generate a reasonably unique id for a nav item.
 */
function generateNavId() {
  return `nav-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/**
 * Sync: For EACH section block, ensure it contains exactly one section-item per nav id.
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

  if (!navigationItemIds.length || !panelSections.length) return;

  panelSections.forEach(section => {
    const sectionItems = Array.isArray(section?.innerBlocks)
      ? section.innerBlocks
      : [];

    const sectionItemIds = sectionItems
      .map(item => item?.attributes?.navigationItemId)
      .filter(Boolean);

    // Add missing items
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
  selectBlock,
}) {
  if (!navigationItems.length) return;

  // Track first occurrence of each id
  const firstById = new Map();

  navigationItems.forEach(navItem => {
    const currentId = navItem?.attributes?.id;

    // If missing id, just assign one (not a duplication scenario)
    if (!currentId) {
      setInnerBlockAttributes(navItem.clientId, { id: generateNavId() });
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
    setInnerBlockAttributes(navItem.clientId, { id: newId });

    // 2) If sections exist, clone section-items content from originalId into newId
    if (panelSections.length) {
      panelSections.forEach(section => {
        const sectionItems = Array.isArray(section?.innerBlocks)
          ? section.innerBlocks
          : [];

        const originalSectionItem = sectionItems.find(
          item => item?.attributes?.navigationItemId === originalId
        );

        // If no source item exists yet, do nothing here; normal sync will create an empty one.
        if (!originalSectionItem) return;

        // Only clone if there is actual content
        const originalInnerBlocks = originalSectionItem.innerBlocks || [];
        if (originalInnerBlocks.length === 0) return;

        const clonedInnerBlocks = originalInnerBlocks.map(b => cloneBlock(b));

        const newSectionItemBlock = createBlock(
          'abtion-block-library/multi-switch-panel-section-item',
          { navigationItemId: newId },
          clonedInnerBlocks
        );

        // Insert right after the original item (nice UX)
        const originalIndex = sectionItems.findIndex(
          item => item?.clientId === originalSectionItem.clientId
        );

        const insertIndex =
          originalIndex >= 0 ? originalIndex + 1 : sectionItems.length;

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
  const blockProps = useBlockProps();

  const {
    setAttributes,
    clientId,
    insertBlock,
    removeBlock,
    setInnerBlockAttributes,
    selectBlock,
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
        block?.name ===
        'abtion-block-library/multi-switch-panel-navigation-item'
    );

    panelSections = descendants.filter(
      block => block?.name === 'abtion-block-library/multi-switch-panel-section'
    );
  }

  const navClientKey = navigationItems.map(i => i.clientId).join('|');
  const sectionsKey = panelSections.map(s => s.clientId).join('|');
  const navIdsKey = navigationItems.map(i => i?.attributes?.id || '').join('|');

  /**
   * 1) Handle duplication + ensure uniqueness.
   * Also re-runs when sections appear (so duplication can clone into them if present).
   * Must run BEFORE sync.
   */
  useEffect(() => {
    handleDuplicatedNavItems({
      navigationItems,
      panelSections,
      setInnerBlockAttributes,
      insertBlock,
      selectBlock,
    });
  }, [navClientKey, sectionsKey]);

  /**
   * 2) Normal sync: ensures every section has one item per nav id, and removes extras.
   * Big UX win: runs when nav ids change AND when sections appear later.
   */
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
    [navClientKey, navIdsKey]
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
      <InnerBlocks template={MY_TEMPLATE} />
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

const FIRST_NAV_ID = 'initial-tab-1';

const MY_TEMPLATE = [
  [
    'abtion-block-library/multi-switch-panel-navigation',
    {},
    [
      [
        'abtion-block-library/multi-switch-panel-navigation-item',
        { id: FIRST_NAV_ID },
        [['core/paragraph', { placeholder: 'First Tab' }]],
      ],
    ],
  ],
  [
    'abtion-block-library/multi-switch-panel-section',
    {},
    [
      [
        'abtion-block-library/multi-switch-panel-section-item',
        { navigationItemId: FIRST_NAV_ID },
        [['core/paragraph', { placeholder: 'First Section Item' }]],
      ],
    ],
  ],
  [
    'abtion-block-library/multi-switch-panel-section',
    {},
    [
      [
        'abtion-block-library/multi-switch-panel-section-item',
        { navigationItemId: FIRST_NAV_ID },
        [['core/paragraph', { placeholder: 'Second Section Item' }]],
      ],
    ],
  ],
];
