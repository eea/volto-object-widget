import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { getFieldURL, isInternalURL, flattenToAppURL } from '@plone/volto/helpers/Url/Url';

export function getImageScaleParams(image, size) {
  const imageScale = size || 'preview'; //listings use preview scale

  if (isArray(image)) {
    const result = image.map((item) => getImageScaleParams(item, size));
    return result.length > 0 ? result[0] : undefined;
  }

  if (isString(image))
    return isInternalURL(image)
      ? { download: flattenToAppURL(`${image}/@@images/image/${imageScale}`) }
      : { download: image };
  const url = getFieldURL(image);
  if (image) {
    if (url && isInternalURL(url)) {
      if (image?.image_scales?.[image?.image_field]) {
        const scale =
          image.image_scales[image.image_field]?.[0].scales?.[imageScale] ||
          image.image_scales[image.image_field]?.[0];

        const download = flattenToAppURL(
          `${url}/${scale?.download}`,
        );
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
      } else {
        //fallback if we do not have scales
        return {
          download: flattenToAppURL(
            `${url}/@@images/${
              image.image_field || 'image'
            }/${imageScale}`,
          ),
        };
      }
    } else {
      return { download: url };
    }
  }
}
