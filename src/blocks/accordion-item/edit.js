/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
  BlockControls,
  InspectorControls,
  RichText,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
  BaseControl,
  PanelBody,
  ToolbarGroup,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import HtmlTagIcon from './html-tag-icon';

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    title,
    initiallyOpen,
    openBreakpoint,
    clickToClose,
    autoClose,
    titleTag,
    uuid,
  } = attributes;

  /**
   * We store a stable per-block UUID in attributes.
   *
   * - It must be stable so block serialization/validation works across machines
   *   and after editor reloads (especially when inserting patterns).
   * - We use the block's clientId as the initial UUID when missing.
   *
   * If we ever need guaranteed uniqueness across multiple posts rendered on the
   * same page (e.g. archives), IDs should be namespaced at render time (dynamic
   * block) rather than regenerated in the editor.
   */

  const safeUuid = uuid || clientId;

  const formatTypes = useSelect(select => {
    const store = select('core/rich-text');
    let types = [];

    if (store) {
      types = store.getFormatTypes().filter(i => i.name !== 'core/link');
      types = types.map(i => i.name);
    }

    return types;
  });

  useEffect(() => {
    if (!uuid) {
      setAttributes({ uuid: clientId });
    }
  }, [uuid, clientId]);

  const isNestedAccordion = useSelect(select => {
    const parentBlocks = select('core/block-editor').getBlockParentsByBlockName(
      clientId,
      'abtion-block-library/accordion-item'
    );

    return !!parentBlocks.length;
  });

  const blockProps = useBlockProps({
    className: classNames(
      'wp-block-abtion-block-library-accordion-item__item',
      'js-accordion-item'
    ),
  });

  blockProps.class = blockProps.className;
  blockProps.className = null;

  const contentProps = useInnerBlocksProps(
    {
      id: `ac-${safeUuid}`,
      className: 'wp-block-abtion-block-library-accordion-item__content',
      hidden: initiallyOpen ? undefined : 'until-found',
    },
    {
      template: [['core/paragraph']],
    }
  );

  return (
    <>
      <BlockControls group="block">
        <ToolbarGroup
          icon={<HtmlTagIcon tag={titleTag} />}
          label={__('Change accordion title tag', 'abtion-block-library')}
          controls={[
            {
              tag: 'h1',
              label: __('Heading 1', 'abtion-block-library'),
            },
            {
              tag: 'h2',
              label: __('Heading 2', 'abtion-block-library'),
            },
            {
              tag: 'h3',
              label: __('Heading 3', 'abtion-block-library'),
            },
            {
              tag: 'h4',
              label: __('Heading 4', 'abtion-block-library'),
            },
            {
              tag: 'h5',
              label: __('Heading 5', 'abtion-block-library'),
            },
            {
              tag: 'h6',
              label: __('Heading 6', 'abtion-block-library'),
            },
          ].map(control => {
            return {
              name: control.tag,
              icon: <HtmlTagIcon tag={control.tag} />,
              title: control.label,
              isActive: titleTag === control.tag,
              onClick: () => setAttributes({ titleTag: control.tag }),
            };
          })}
          isCollapsed={true}
        />
      </BlockControls>
      <InspectorControls>
        {isNestedAccordion && (
          <div
            className="components-notice is-warning"
            style={{
              margin: '0',
              borderTop: '1px solid #f0f0f0',
            }}
          >
            {__(
              'This accordion item is nested inside another accordion item. While this will work, it may not be what you intended.',
              'abtion-block-library'
            )}
          </div>
        )}
        <PanelBody
          title={__('Accordion Item Settings', 'abtion-block-library')}
        >
          <ToggleControl
            label={__('Open By Default', 'abtion-block-library')}
            help={
              initiallyOpen
                ? __(
                    'This accordion item will be open when the page loads.',
                    'abtion-block-library'
                  )
                : __(
                    'This accordion item will be closed when the page loads.',
                    'abtion-block-library'
                  )
            }
            checked={initiallyOpen}
            onChange={value =>
              setAttributes({
                initiallyOpen: value,
                openBreakpoint: value ? openBreakpoint : 0,
              })
            }
            __nextHasNoMarginBottom
          />
          {initiallyOpen && (
            <BaseControl
              label={__('Breakpoint', 'abtion-block-library')}
              help={__(
                'Only open this accordion by default on devices larger than a given width.',
                'abtion-block-library'
              )}
              __nextHasNoMarginBottom
            >
              <NumberControl
                value={openBreakpoint}
                onChange={value =>
                  setAttributes({ openBreakpoint: parseInt(value, 10) })
                }
                __next40pxDefaultSize
              />
            </BaseControl>
          )}
          <ToggleControl
            label={__('Click to Close', 'abtion-block-library')}
            help={
              clickToClose
                ? __(
                    'When open, this accordion item title can be clicked again to close it.',
                    'abtion-block-library'
                  )
                : __(
                    'Once opened, this accordion item cannot be closed by clicking the title.',
                    'abtion-block-library'
                  )
            }
            checked={clickToClose}
            onChange={value => setAttributes({ clickToClose: value })}
            __nextHasNoMarginBottom
          />
          <ToggleControl
            label={__('Auto Close', 'abtion-block-library')}
            help={
              autoClose
                ? __(
                    'This accordion item will close when opening another item.',
                    'abtion-block-library'
                  )
                : __(
                    'This accordion item will remain open when opening another item.',
                    'abtion-block-library'
                  )
            }
            checked={autoClose}
            onChange={value => setAttributes({ autoClose: value })}
            __nextHasNoMarginBottom
          />
        </PanelBody>
      </InspectorControls>
      <accordion-item {...blockProps}>
        <div
          className={classNames(
            'wp-block-abtion-block-library-accordion-item__header',
            'js-accordion-controller'
          )}
          aria-controls={`ac-${safeUuid}`}
          aria-expanded={initiallyOpen}
        >
          <RichText
            id={`at-${safeUuid}`}
            className="wp-block-abtion-block-library-accordion-item__title"
            tagName={titleTag}
            allowedFormats={formatTypes}
            placeholder={__('Accordion item title…', 'abtion-block-library')}
            value={title}
            onChange={value => setAttributes({ title: value })}
          />
          <span
            className="wp-block-abtion-block-library-accordion-item__icon"
            aria-hidden="true"
          />
        </div>
        <div {...contentProps} />
      </accordion-item>
    </>
  );
};

export default Edit;
