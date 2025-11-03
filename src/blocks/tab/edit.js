/**
 * WordPress dependencies.
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Edit({ attributes, context }) {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <div
        className="wp-block-abtion-block-library-tab__content"
        hidden={context['abtion-block-library/activeTabId'] !== attributes.id}
      >
        <InnerBlocks />
      </div>
    </div>
  );
}
