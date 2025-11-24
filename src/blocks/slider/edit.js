import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InnerBlocks />
      <InspectorControls>
        <TextControl
          label="Slides per view"
          value={attributes.slidesPerView}
          onChange={value => setAttributes({ slidesPerView: Number(value) })}
          __next40pxDefaultSize
          __nextHasNoMarginBottom
        />
      </InspectorControls>
    </div>
  );
}

export default Edit;
