import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import {
  TextControl,
  SelectControl,
  PanelBody,
  ColorPalette,
  BaseControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps({
    className: `swiper is-${attributes.behavior || 'normal'}`,
  });
  const {
    slidesPerViewDesktop,
    slidesPerViewMobile,
    behavior,
    progressBarColor,
    autoSlideDuration,
  } = attributes;
  const ALLOWED_BLOCKS = ['abtion-block-library/slider-slide'];

  const themeColors = useSelect(select => {
    const settings = select('core/block-editor').getSettings();
    return settings.colors || [];
  }, []);

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
              {
                label: __('Testimonials', 'abtion-block-library'),
                value: 'testimonials',
              },
            ]}
            onChange={value => setAttributes({ behavior: value })}
            __next40pxDefaultSize
            __nextHasNoMarginBottom
          />

          {behavior === 'hero-progress' && (
            <>
              <TextControl
                label={__(
                  'Auto-slide duration (seconds)',
                  'abtion-block-library'
                )}
                help={__(
                  'Set an integer greater than 0 to enable auto-sliding. Leave empty to disable.',
                  'abtion-block-library'
                )}
                type="number"
                min={0}
                step={1}
                value={autoSlideDuration ?? ''}
                onChange={value => {
                  const n = parseInt(value, 10);
                  setAttributes({
                    autoSlideDuration:
                      Number.isInteger(n) && n > 0 ? n : undefined,
                  });
                }}
                __next40pxDefaultSize
                __nextHasNoMarginBottom
              />
              <BaseControl
                label={__('Progress bar color', 'abtion-block-library')}
                __nextHasNoMarginBottom
              >
                <ColorPalette
                  colors={themeColors}
                  value={progressBarColor}
                  onChange={value =>
                    setAttributes({ progressBarColor: value || '#C6FA5F' })
                  }
                />
              </BaseControl>
            </>
          )}

          {(behavior === 'normal' || behavior === 'testimonials') && (
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
