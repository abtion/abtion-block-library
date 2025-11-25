import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import {
  TextControl,
  SelectControl,
  ToggleControl,
  PanelBody,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps({
    className: `swiper is-${attributes.behavior || 'normal'}`,
  });
  const { slidesPerView, behavior, autoplayDelay, speed, pauseOnHover } =
    attributes;
  const ALLOWED_BLOCKS = ['abtion-block-library/slider-slide'];

  return (
    <div {...blockProps}>
      <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
      <InspectorControls>
        <PanelBody title="Slider settings" initialOpen={true}>
          <SelectControl
            label="Behavior"
            value={behavior}
            options={[
              { label: 'Normal slider', value: 'normal' },
              { label: 'Continuous marquee', value: 'marquee' },
            ]}
            onChange={value => setAttributes({ behavior: value })}
            __next40pxDefaultSize
            __nextHasNoMarginBottom
          />
          <TextControl
            label="Slides per view"
            type="number"
            value={slidesPerView}
            onChange={value =>
              setAttributes({ slidesPerView: Number(value) || 1 })
            }
            __next40pxDefaultSize
            __nextHasNoMarginBottom
          />

          {behavior === 'normal' && (
            <TextControl
              label="Autoplay delay (ms)"
              type="number"
              value={autoplayDelay}
              min={0}
              help="0 disables autoplay"
              onChange={value =>
                setAttributes({ autoplayDelay: Number(value) || 0 })
              }
              __next40pxDefaultSize
              __nextHasNoMarginBottom
            />
          )}

          {behavior === 'marquee' && (
            <>
              <TextControl
                label="Marquee speed"
                type="number"
                value={speed}
                min={1000}
                help="Higher number = slower continuous scroll"
                onChange={value =>
                  setAttributes({ speed: Number(value) || 6000 })
                }
                __next40pxDefaultSize
                __nextHasNoMarginBottom
              />
              <ToggleControl
                label="Pause on hover"
                checked={pauseOnHover}
                onChange={value => setAttributes({ pauseOnHover: !!value })}
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
