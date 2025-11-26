/**
 * WordPress dependencies.
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

function Edit() {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InnerBlocks />
    </div>
  );
}

export default Edit;
