import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Edit() {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InnerBlocks allowedBlocks={['abtion-block-library/accordion-item']} />
    </div>
  );
}

export default Edit;
