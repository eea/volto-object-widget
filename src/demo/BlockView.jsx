import React from 'react';
import { getImageScaleParams } from '@eeacms/volto-object-widget/helpers';
import config from '@plone/volto/registry';

const ItemImage = ({ image, imageSize, verticalAlign }) => {
  if (!image) return null;
  const scaledImage = getImageScaleParams(image, imageSize);
  const imageSizes = config.blocks?.blocksConfig?.item?.imageSizes ?? {};
  const size = imageSizes[imageSize] ?? { width: undefined, height: undefined };

  return (
    <img
      src={scaledImage?.download}
      className={`ui image ${imageSize} ${verticalAlign} aligned`}
      alt=""
      width={size.width}
      height={size.height}
      loading="lazy"
    />
  );
};

const BlockView = (props) => {
  const data = props.data || {};

  return (
    <div>
      <p>{JSON.stringify(data)} </p>
      <ItemImage
        image={data.image}
        imageSize={data.imageSize || 'large'}
        verticalAlign={data.verticalAlign || 'middle'}
      />
    </div>
  );
};

export default BlockView;
