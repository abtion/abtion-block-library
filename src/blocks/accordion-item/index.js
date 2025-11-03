/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import icon from './icon';
import './style.scss';
import './editor.scss';

registerBlockType('abtion-block-library/accordion-item', {
  edit,
  save,
  icon,
});
