import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Save() {
  const blockProps = useBlockProps.save();

  const blockClass = blockProps.className
    ? blockProps.className + ' swiper-slide'
    : 'swiper-slide';

  blockProps.className = blockClass;

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}

export default Save;
