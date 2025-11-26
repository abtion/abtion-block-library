import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Save(props) {
  const {
    attributes: { navigationItemId },
  } = props;

  const blockProps = useBlockProps.save({
    id: `panel-${navigationItemId}`,
    'data-navigation-id': navigationItemId,
    role: 'tabpanel',
    'aria-labelledby': `nav-item-${navigationItemId}`,
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}

export default Save;
