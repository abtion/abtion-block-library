/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import './style.scss';
import icon from './icon';

registerBlockType(metadata.name, {
  edit: Edit,
  icon,
});
