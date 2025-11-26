import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Save(props) {
  const {
    attributes: { id },
  } = props;

  const blockProps = useBlockProps.save({
    'data-id': id,
    'data-wp-on--click': 'actions.switch',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}

export default Save;
