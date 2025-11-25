import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

function Edit() {
  const blockProps = useBlockProps({
    className: 'wp-block-abtion-block-library-slider-slide',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks />
    </div>
  );
}

export default Edit;
