import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Save(props) {
  const {
    attributes: { id },
  } = props;

  const blockProps = useBlockProps.save({
    id: `nav-item-${id}`,
    'data-id': id,
    'data-wp-on--click': 'actions.switch',
    role: 'tab',
    'aria-controls': `panel-${id}`
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}

export default Save;
