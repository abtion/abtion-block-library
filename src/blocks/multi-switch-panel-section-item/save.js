import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Save(props) {
  const {
    attributes: { navigationItemId },
  } = props;

  const blockProps = useBlockProps.save({
    'data-navigation-id': navigationItemId,
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}

export default Save;
