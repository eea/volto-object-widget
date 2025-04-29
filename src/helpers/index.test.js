import {
  getImageScaleParams
} from '@eeacms/volto-object-widget/helpers';
import { flattenToAppURL, getFieldURL } from '@plone/volto/helpers/Url/Url';

jest.mock('@plone/volto/helpers', () => ({
  flattenToAppURL: jest.fn((url) => url),
  isInternalURL: jest.fn((url) => !url?.startsWith('http://external')),
}));

describe('getImageScaleParams', () => {
  it('returns expected image scale URL obj when image_field and image_scales properties are passed', () => {
    const image = {
      '@id': 'http://localhost:3000/image',
      image_field: 'image',
      image_scales: {
        image: [
          {
            download: '@@images/image.png',
            width: 400,
            height: 400,
            scales: {
              preview: {
                download: '@@images/image-400.png',
                width: 400,
                height: 400,
              },
            },
          },
        ],
      },
    };

    const expectedUrlObj = {
      download: '/image/@@images/image-400.png',
      width: 400,
      height: 400,
    };
    expect(getImageScaleParams(image, 'preview')).toEqual(expectedUrlObj);
  });

  it('returns expected image scale URL obj when image_field and image_scales properties are passed but with no scales', () => {
    const image = {
      '@id': 'http://localhost:3000/image',
      image_field: 'image',
      image_scales: {
        image: [
          {
            download: '@@images/image.png',
            width: 400,
            height: 400,
          },
        ],
      },
    };

    const expectedUrlObj = {
      download: '/image/@@images/image.png',
      width: 400,
      height: 400,
    };
    expect(getImageScaleParams(image, 'preview')).toEqual(expectedUrlObj);
  });

  it('returns expected image scale URL obj when image properties are passed', () => {
    const image = {
      '@id': 'http://localhost:3000/image',
      image: {
        download: 'http://localhost:3000/image/@@images/image.png',
        width: 400,
        height: 400,
        scales: {
          preview: {
            download: 'http://localhost:3000/image/@@images/image-400.png',
            width: 400,
            height: 400,
          },
        },
      },
    };
    const expectedUrlObj = {
      download: '/image/@@images/image-400.png',
      width: 400,
      height: 400,
    };
    expect(getImageScaleParams(image, 'preview')).toEqual(expectedUrlObj);
  });

  it('returns expected image scale URL string when image url (string) is passed', () => {
    const image = 'http://localhost:3000/image/image.png';
    expect(getImageScaleParams(image, 'preview')).toEqual({
      download: '/image/image.png/@@images/image/preview',
    });
  });

  it('returns image URL string when external image url (string) is passed', () => {
    const image = 'http://external-url.com';
    expect(getImageScaleParams(image)).toEqual({
      download: image,
    });
  });

  it('returns image URL string when external image url (object) is passed', () => {
    const image = {
      '@id': 'http://external-url.com',
      image: {
        download: 'http://external-url.com',
        width: 400,
        height: 400,
        scales: {
          preview: {
            download: 'hhttp://external-url.com',
            width: 400,
            height: 400,
          },
        },
      },
    };
    expect(getImageScaleParams(image)).toEqual({
      download: image['@id'],
    });
  });

  it('returns undefined when image is null', () => {
    expect(getImageScaleParams(null, 'preview')).toBeUndefined();
  });

  it('returns undefined when image is undefined', () => {
    expect(getImageScaleParams(undefined, 'preview')).toBeUndefined();
  });

  it('returns the base scale when the requested scale does not exist (image_scales structure)', () => {
    const image = {
      '@id': 'http://localhost:3000/image',
      image_field: 'image',
      image_scales: {
        image: [
          {
            download: '@@images/image.png',
            width: 400,
            height: 400,
            scales: {
              preview: {
                download: '@@images/image-400.png',
                width: 400,
                height: 400,
              },
            },
          },
        ],
      },
    };
    const expectedUrlObj = {
      download: '/image/@@images/image.png',
      width: 400,
      height: 400,
    };
    expect(getImageScaleParams(image, 'nonexistent_scale')).toEqual(
      expectedUrlObj,
    );
  });

  it('returns the base image object when the requested scale does not exist (image.scales structure)', () => {
    const image = {
      '@id': 'http://localhost:3000/image',
      image: {
        download: '/image/@@images/image.png',
        width: 400,
        height: 400,
        scales: {
          preview: {
            download: '/image/@@images/image-400.png',
            width: 400,
            height: 400,
          },
        },
      },
    };
    const expectedUrlObj = {
      download: '/image/@@images/image.png',
      width: 400,
      height: 400,
    };
    expect(getImageScaleParams(image, 'nonexistent_scale')).toEqual(
      expectedUrlObj,
    );
  });

  it('returns fallback URL when image object has no scale information', () => {
    const image = {
      '@id': 'http://localhost:3000/some-image',
      image_field: 'my_image_field',
    };
    const expectedUrlObj = {
      download: '/some-image/@@images/my_image_field/preview',
    };
    expect(getImageScaleParams(image, 'preview')).toEqual(expectedUrlObj);
  });

  it('returns fallback URL using default field "image" when image object has no scale or field info', () => {
    const image = {
      '@id': 'http://localhost:3000/another-image',
    };
    const expectedUrlObj = {
      download: '/another-image/@@images/image/large',
    };
    expect(getImageScaleParams(image, 'large')).toEqual(expectedUrlObj);
  });

  it('defaults to "preview" scale when size argument is not provided (string URL)', () => {
    const image = 'http://localhost:3000/Plone/some-image.png';
    const scaleToUse = undefined; // Simulate calling without size
    const expectedScale = 'preview'; // The actual default fallback
    // Expect the constructed URL with default scale 'preview'
    expect(getImageScaleParams(image, scaleToUse)).toEqual({
      download: `/Plone/some-image.png/@@images/image/${expectedScale}`,
    });
  });

  it('defaults to "preview" scale when size argument is not provided (object URL with scales)', () => {
    const image = {
      '@id': 'http://localhost:3000/image',
      image: {
        download: 'http://localhost:3000/image/@@images/image.png',
        width: 1200,
        height: 800,
        scales: {
          huge: {
            download: 'http://localhost:3000/image/@@images/image-1200.png',
            width: 1200,
            height: 800,
          },
          preview: {
            download: 'http://localhost:3000/image/@@images/image-400.png',
            width: 400,
            height: 400,
          },
        },
      },
    };
    const scaleToUse = undefined; // Simulate calling without size
    // Expect the details of the existing 'preview' scale
    const expectedUrlObj = {
      download: '/image/@@images/image-400.png',
      width: 400,
      height: 400,
    };
    expect(getImageScaleParams(image, scaleToUse)).toEqual(expectedUrlObj);
  });
});

describe('getFieldURL', () => {
  it('handles a URL type object with type and value', () => {
    const data = {
      '@type': 'URL',
      value: 'value_url',
      url: 'url_url',
      href: 'href_url',
    };
    expect(getFieldURL(data)).toEqual('value_url');
  });

  it('handles an object with type and url', () => {
    const data = {
      '@type': 'URL',
      url: 'url_url',
      href: 'href_url',
    };
    expect(getFieldURL(data)).toEqual('url_url');
  });

  it('handles an object with type and href', () => {
    const data = {
      '@type': 'URL',
      href: 'href_url',
    };
    expect(getFieldURL(data)).toEqual('href_url');
  });

  it('handles an object with type and no value, url and href', () => {
    const data = {
      '@type': 'URL',
    };
    expect(getFieldURL(data)).toEqual({ '@type': 'URL' });
  });

  it('handles an object without a specific type and url', () => {
    const data = {
      url: 'url_url',
      href: 'href_url',
    };
    expect(getFieldURL(data)).toEqual('url_url');
  });

  it('handles an object without a specific type and href', () => {
    const data = {
      href: 'href_url',
    };
    expect(getFieldURL(data)).toEqual('href_url');
  });

  it('handles an object without a specific type and no id, url, href', () => {
    const data = {
      test: 'test_url',
    };
    expect(getFieldURL(data)).toEqual({
      test: 'test_url',
    });
  });

  it('handles an array', () => {
    const data = [
      {
        '@type': 'URL',
        value: 'value_url',
        url: 'url_url',
        href: 'href_url',
      },
      {
        '@id': 'id_url',
        url: 'url_url',
        href: 'href_url',
      },
    ];
    expect(getFieldURL(data)).toEqual(['value_url', 'id_url']);
  });

  it('handles a string', () => {
    const data = '/some/url';
    expect(getFieldURL(data)).toEqual('/some/url');
  });

  it('returns the data unchanged for non-object/non-array/non-string inputs', () => {
    expect(getFieldURL(42)).toEqual(42);
    expect(getFieldURL(undefined)).toEqual(undefined);
    expect(getFieldURL(null)).toEqual(null);
  });
});
