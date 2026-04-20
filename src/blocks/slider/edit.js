import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { TextControl, SelectControl, PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps({
    className: `swiper is-${attributes.behavior || 'normal'}`,
  });
  const { slidesPerViewDesktop, slidesPerViewMobile, behavior } = attributes;
  const ALLOWED_BLOCKS = ['abtion-block-library/slider-slide'];

  return (
    <div {...blockProps}>
      <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
      <InspectorControls>
        <PanelBody
          title={__('Slider settings', 'abtion-block-library')}
          initialOpen={true}
        >
          <SelectControl
            label={__('Behavior', 'abtion-block-library')}
            value={behavior}
            options={[
              {
                label: __('Normal slider', 'abtion-block-library'),
                value: 'normal',
              },
              {
                label: __('Continuous marquee', 'abtion-block-library'),
                value: 'marquee',
              },
              {
                label: __('Vertical', 'abtion-block-library'),
                value: 'vertical',
              },
              {
                label: __('Hero with Progress Bar', 'abtion-block-library'),
                value: 'hero-progress',
              },
            ]}
            onChange={value => setAttributes({ behavior: value })}
            __next40pxDefaultSize
            __nextHasNoMarginBottom
          />

          {behavior === 'normal' && (
            <>
              <TextControl
                label={__('Slides per view (Desktop)', 'abtion-block-library')}
                type="number"
                value={slidesPerViewDesktop}
                onChange={value =>
                  setAttributes({ slidesPerViewDesktop: Number(value) || 1 })
                }
                __next40pxDefaultSize
                __nextHasNoMarginBottom
              />
              <TextControl
                label={__('Slides per view (Mobile)', 'abtion-block-library')}
                type="number"
                value={slidesPerViewMobile}
                onChange={value =>
                  setAttributes({ slidesPerViewMobile: Number(value) || 1 })
                }
                __next40pxDefaultSize
                __nextHasNoMarginBottom
              />
            </>
          )}
        </PanelBody>
      </InspectorControls>
    </div>
  );
}

export default Edit;
