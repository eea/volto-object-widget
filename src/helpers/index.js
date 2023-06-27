import isString from 'lodash/isString';
import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers';

export function getImageScaleParams(image, size) {
  const imageScale = size || 'preview'; //listings use preview scale

  if (isString(image))
    return isInternalURL(image)
      ? flattenToAppURL(`${image}/@@images/image/mini`)
      : image;
  if (image) {
    if (isInternalURL(image['@id'])) {
      if (image?.image_scales?.[image?.image_field]) {
        const scale =
          image.image_scales[image.image_field]?.[0].scales?.[imageScale] ||
          image.image_scales[image.image_field]?.[0];

        const download = flattenToAppURL(`${image['@id']}/${scale?.download}`);
        const width = scale?.width;
        const height = scale?.height;

        return {
          download,
          width,
          height,
        };
      } else if (image?.image?.scales) {
        const scale = image.image?.scales?.[imageScale] || image.image;
        const download = flattenToAppURL(scale?.download);
        const width = scale?.width;
        const height = scale?.height;

        return {
          download,
          width,
          height,
        };
      } //fallback if we do not have scales
      else {
        return {
          download: flattenToAppURL(
            `${image['@id']}/@@images/${
              image.image_field || 'image'
            }/${imageScale}`,
          ),
        };
      }
    } else {
      return { download: image['@id'] };
    }
  }
}
