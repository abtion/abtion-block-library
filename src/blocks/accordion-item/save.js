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

function Save({ attributes }) {
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

  let itemClasses = [
    'wp-block-abtion-block-library-accordion-item__item',
    'js-accordion-item',
    'no-js',
  ];

  let contentStyles = {};

  if (initiallyOpen) {
    itemClasses.push('is-open');
  } else {
    contentStyles.display = 'none';
  }

  const blockProps = useBlockProps.save({
    className: [...itemClasses, className].join(' '),
    'data-initially-open': initiallyOpen,
    'data-open-breakpoint': openBreakpoint,
    'data-click-to-close': clickToClose,
    'data-auto-close': autoClose,
    'data-uuid': uuid,
  });

  const innerBlocksProps = useInnerBlocksProps.save({
    className: 'wp-block-abtion-block-library-accordion-item__content-wrapper',
  });

  const contentProps = {
    id: 'ac-' + uuid,
    className: 'wp-block-abtion-block-library-accordion-item__content',
    hidden: initiallyOpen ? undefined : 'until-found',
  };

  return (
    <accordion-item {...blockProps}>
      <RichText.Content
        id={'at-' + uuid}
        className={classNames(
          'js-accordion-controller',
          'wp-block-abtion-block-library-accordion-item__title'
        )}
        tagName={titleTag}
        value={title}
        role="button"
      />
      <div {...contentProps}>
        <div {...innerBlocksProps}></div>
      </div>
    </accordion-item>
  );
}

export default Save;
