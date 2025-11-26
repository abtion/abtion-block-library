/**
 * WordPress dependencies.
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

function Edit(props) {
  const { attributes, context, setAttributes } = props;

  const blockProps = useBlockProps({
    className:
      context['abtion-block-library/activeNavId'] ===
      attributes.navigationItemId
        ? 'wp-block-abtion-block-library-multi-switch-panel-section-item--active'
        : '',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks />
    </div>
  );
}

export default Edit;
