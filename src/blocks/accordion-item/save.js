/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

function Save( { attributes } ) {
	const {
		className,
		title,
		initiallyOpen,
		openBreakpoint,
		clickToClose,
		autoClose,
		titleTag,
		uuid,
	} = attributes;

	// Hardening: avoid outputting ids like "ac-undefined" if uuid is missing
	// (e.g. legacy content or edge-case save before the edit effect ran).
	const safeUuid = uuid || '';

	const itemClasses = [
		'wp-block-abtion-block-library-accordion-item__item',
		'js-accordion-item',
		'no-js',
	];

	if ( initiallyOpen ) {
		itemClasses.push( 'is-open' );
	}

	const blockProps = useBlockProps.save( {
		className: [ ...itemClasses, className ].filter( Boolean ).join( ' ' ),
		'data-initially-open': initiallyOpen,
		'data-open-breakpoint': openBreakpoint,
		'data-click-to-close': clickToClose,
		'data-auto-close': autoClose,
		...( safeUuid ? { 'data-uuid': safeUuid } : {} ),
	} );

	const contentProps = useInnerBlocksProps.save( {
		...( safeUuid ? { id: `ac-${ safeUuid }` } : {} ),
		className: 'wp-block-abtion-block-library-accordion-item__content',
		hidden: initiallyOpen ? undefined : 'until-found',
	} );

	const Tag = titleTag || 'h5';

	return (
		<accordion-item { ...blockProps }>
			<div
				className={ classNames(
					'wp-block-abtion-block-library-accordion-item__header',
					'js-accordion-controller'
				) }
				{ ...( safeUuid ? { id: `at-${ safeUuid }` } : {} ) }
				role="button"
				tabIndex="0"
				{ ...( safeUuid ? { 'aria-controls': `ac-${ safeUuid }` } : {} ) }
				aria-expanded={ initiallyOpen }
			>
				<RichText.Content
					tagName={ Tag }
					className="wp-block-abtion-block-library-accordion-item__title"
					value={ title }
				/>
				<span
					className="wp-block-abtion-block-library-accordion-item__icon"
					aria-hidden="true"
				/>
			</div>

			<div { ...contentProps } />
		</accordion-item>
	);
}

export default Save;