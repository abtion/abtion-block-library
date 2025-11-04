/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
  Card,
  CardBody,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
  TextControl,
} from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Icon from './icon';

function Edit({
  attributes: {
    widgetType,
    templateId,
    businessUnitId,
    locale,
    reviewLanguages,
    stars,
    reviewsUrl,
  },
  setAttributes,
}) {
  const blockProps = useBlockProps();

  return (
    <Card {...blockProps}>
      <CardBody>
        <p>
          <Icon /> {__('Trustpilot', 'abtion-block-library')}
        </p>
        <ToggleGroupControl
          label={__('Widget type', 'abtion-block-library')}
          value={widgetType}
          isBlock
          onChange={value => setAttributes({ widgetType: value })}
          __nextHasNoMarginBottom
          __next40pxDefaultSize
        >
          <ToggleGroupControlOption
            value="micro-combo"
            label={__('Micro combo', 'abtion-block-library')}
          />
          <ToggleGroupControlOption
            value="carousel"
            label={__('Carousel', 'abtion-block-library')}
          />
        </ToggleGroupControl>
        <br />
        <TextControl
          label={__('Template ID', 'abtion-block-library')}
          value={templateId}
          onChange={value => setAttributes({ templateId: value })}
          __nextHasNoMarginBottom
          __next40pxDefaultSize
        />
        <br />
        <TextControl
          label={__('Business Unit ID', 'abtion-block-library')}
          value={businessUnitId}
          onChange={value => setAttributes({ businessUnitId: value })}
          __nextHasNoMarginBottom
          __next40pxDefaultSize
        />
        <br />
        <TextControl
          label={__('Locale', 'abtion-block-library')}
          value={locale}
          onChange={value => setAttributes({ locale: value })}
          __nextHasNoMarginBottom
          __next40pxDefaultSize
        />
        <br />
        <TextControl
          label={__('Review Languages', 'abtion-block-library')}
          value={reviewLanguages}
          onChange={value => setAttributes({ reviewLanguages: value })}
          __nextHasNoMarginBottom
          __next40pxDefaultSize
        />
        <br />
        <TextControl
          label={__('Stars', 'abtion-block-library')}
          value={stars}
          onChange={value => setAttributes({ stars: value })}
          __nextHasNoMarginBottom
          __next40pxDefaultSize
        />
        <br />
        <TextControl
          label={__('Reviews URL', 'abtion-block-library')}
          value={reviewsUrl}
          onChange={value => setAttributes({ reviewsUrl: value })}
          __nextHasNoMarginBottom
          __next40pxDefaultSize
        />
      </CardBody>
    </Card>
  );
}

export default Edit;
