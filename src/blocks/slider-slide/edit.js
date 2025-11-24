import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

function Edit() {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <div className="wp-block-abtion-block-library-slider-slide">
        <InnerBlocks />
      </div>
    </div>
  );
}

export default Edit;
