import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import {
  TextControl,
  SelectControl,
  ToggleControl,
  PanelBody,
  ColorPalette,
  BaseControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import {
  SLIDER_QUERY_NAMESPACE,
  SLIDER_QUERY_INNER_BLOCKS,
} from './variations';

const ALLOWED_BLOCKS_MANUAL = ['abtion-block-library/slider-slide'];
const ALLOWED_BLOCKS_DYNAMIC = ['core/query'];

// Seeded when switching to the dynamic content source. Kept in sync with the
// core/query variation registered in ./variations.
const DYNAMIC_TEMPLATE = [
  [
    'core/query',
    {
      namespace: SLIDER_QUERY_NAMESPACE,
      query: {
        perPage: 8,
        pages: 0,
        offset: 0,
        postType: 'post',
        order: 'desc',
        orderBy: 'date',
        inherit: false,
      },
    },
    SLIDER_QUERY_INNER_BLOCKS,
  ],
];

function Edit({ attributes, setAttributes, clientId }) {
  const blockProps = useBlockProps({
    className: `swiper is-${attributes.behavior || 'normal'}`,
  });
  const {
    slidesPerViewDesktop,
    slidesPerViewMobile,
    behavior,
    progressBarColor,
    dotActiveColor,
    autoSlideDuration,
    contentSource = 'manual',
  } = attributes;
  const isDynamic = contentSource === 'dynamic';
  const ALLOWED_BLOCKS = isDynamic
    ? ALLOWED_BLOCKS_DYNAMIC
    : ALLOWED_BLOCKS_MANUAL;

  const { replaceInnerBlocks } = useDispatch('core/block-editor');

  const themeColors = useSelect(select => {
    const settings = select('core/block-editor').getSettings();
    return settings.colors || [];
  }, []);

  const onChangeContentSource = useDynamicSource => {
    setAttributes({
      contentSource: useDynamicSource ? 'dynamic' : 'manual',
    });
    // A template prop alone won't replace existing (wrong) children, so reset
    // the inner blocks explicitly on every switch.
    replaceInnerBlocks(
      clientId,
      useDynamicSource
        ? createBlocksFromInnerBlocksTemplate(DYNAMIC_TEMPLATE)
        : [],
      false
    );
  };

  return (
    <div {...blockProps}>
      <InnerBlocks
        allowedBlocks={ALLOWED_BLOCKS}
        // Keep the inner query/post-template fully editable. templateLock
        // cascades to descendants, so "all" here would also lock the slide
        // design inside the query — we don't want that. renderAppender={false}
        // is enough to stop a second top-level query being added in dynamic mode.
        templateLock={false}
        renderAppender={isDynamic ? false : undefined}
      />
      <InspectorControls>
        <PanelBody
          title={__('Slider settings', 'abtion-block-library')}
          initialOpen={true}
        >
          <ToggleControl
            label={__('Load posts dynamically', 'abtion-block-library')}
            help={__(
              'If enabled, the slider will automatically load items from the selected post type.',
              'abtion-block-library'
            )}
            checked={isDynamic}
            onChange={onChangeContentSource}
            __nextHasNoMarginBottom
          />

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
                label: __('Gallery', 'abtion-block-library'),
                value: 'gallery',
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

          {behavior === 'gallery' && (
            <BaseControl
              label={__('Dot color', 'abtion-block-library')}
              __nextHasNoMarginBottom
            >
              <ColorPalette
                colors={themeColors}
                value={dotActiveColor}
                onChange={value =>
                  setAttributes({ dotActiveColor: value || '#062929' })
                }
              />
            </BaseControl>
          )}

          {(behavior === 'normal' ||
            behavior === 'gallery' ||
            behavior === 'testimonials') && (
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
