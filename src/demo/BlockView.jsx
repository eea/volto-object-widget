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

const BlockView = (props) => (
  <div>
    <p>{JSON.stringify(props.data)} </p>
    <ItemImage
      image={props.data.image}
      imageSize={props.data.imageSize || 'large'}
      verticalAlign={props.data.verticalAlign || 'middle'}
    />
  </div>
);

export default BlockView;
