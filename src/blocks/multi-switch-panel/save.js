import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Save() {
  const blockProps = useBlockProps.save({
    'data-wp-interactive': 'abtion-block-library/multi-switch-panel',
    'data-wp-init--setup': 'callbacks.setup',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}

export default Save;
