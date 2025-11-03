/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import icon from './icon';
import metadata from './block.json';

registerBlockType(metadata.name, {
  edit: Edit,
  save: Save,
  icon,
});
