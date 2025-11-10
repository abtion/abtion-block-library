/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Card, CardBody } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

function Edit() {
  const blockProps = useBlockProps();

  return (
    <Card {...blockProps}>
      <CardBody>
        <p>controls here</p>
      </CardBody>
    </Card>
  );
}

export default Edit;
