/**
 * WordPress dependencies
 */
import { registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Namespace used to scope this Query Loop variation to the slider block.
 *
 * The same value is read server-side by the render_block_core/query filter
 * (see includes/slider-query-normalize.php) to re-tag the post-template output
 * into the slider's swiper wrapper/slide markup.
 */
export const SLIDER_QUERY_NAMESPACE = 'abtion-block-library/slider-query';

/**
 * Default inner blocks seeded for a slider query loop slide.
 *
 * Editors are free to change these — this is just a sensible starting point
 * built from core post blocks that pull from the queried post context.
 */
export const SLIDER_QUERY_INNER_BLOCKS = [
  [
    'core/post-template',
    {},
    [
      ['core/post-featured-image', { isLink: true }],
      ['core/post-title', { isLink: true, level: 3 }],
      ['core/post-excerpt', {}],
    ],
  ],
];

registerBlockVariation('core/query', {
  name: SLIDER_QUERY_NAMESPACE,
  title: __('Slider Query Loop', 'abtion-block-library'),
  description: __(
    'A query loop rendered as slider slides.',
    'abtion-block-library'
  ),
  // Keep it out of the global inserter; it is seeded by the slider block only.
  scope: ['block'],
  isActive: ['namespace'],
  attributes: {
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
  innerBlocks: SLIDER_QUERY_INNER_BLOCKS,
});
