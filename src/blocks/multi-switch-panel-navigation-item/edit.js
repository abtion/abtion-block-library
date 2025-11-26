/**
 * WordPress dependencies.
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

function Edit(props) {
  const { attributes, context, setAttributes } = props;

  const blockProps = useBlockProps({
    'data-id': attributes.id,
    className:
      context['abtion-block-library/activeNavId'] === attributes.id
        ? 'wp-block-abtion-block-library-multi-switch-panel-navigation-item--active'
        : '',
  });

  useEffect(() => {
    if (!attributes.id) {
      const randomId = Math.random().toString(36).substring(2, 19);
      setAttributes({ id: randomId });
    }
  }, [attributes.id]);

  return (
    <div {...blockProps}>
      <InnerBlocks />
    </div>
  );
}

export default Edit;
