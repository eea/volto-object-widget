# volto-object-widget
[![Releases](https://img.shields.io/github/v/release/eea/volto-object-widget)](https://github.com/eea/volto-object-widget/releases)

[Volto](https://github.com/plone/volto) add-on

## Features

This package provides two widgets: ObjectWidget and ObjectListWidget.

The ObjectWidget is a generic widget that provides a form for other javascript
objects. That means that, if you have a value such as:

```
const myvalue = {
  firstname: "John",
  lastname: "Doe",
}
```

the ObjectWidget component would provide a set of widgets to edit it.

The ObjectListWidget component provides a way to edit lists of JS objects using
the ObjectWidget as the editor.

If you're using a schema to describe the information, you can need to pass
a `schema` parameter to the field, like in the following example:

```
export const LinkSchema = {
  title: 'Link',
  fieldsets: [
    {
      id: 'internal',
      title: 'Internal',
      fields: ['internal_link'],
    },
    {
      id: 'external',
      title: 'External',
      fields: ['external_link'],
    },
    {
      id: 'email',
      title: 'Email',
      fields: ['email_address', 'email_subject'],
    },
  ],
  properties: {
    internal_link: {
      widget: 'object_browser',
      title: 'Internal link',
      default: [],
    },
    external_link: {
      title: 'External URL',
      description:
        'URL can be relative within this site or absolute if it starts with http:// or https://',
    },
    email_address: {
      title: 'Email address',
    },
    email_subject: {
      title: 'Email subject',
      description: 'Optional',
    },
  },
  required: [],
};

const LinkEditSchema = {
  title: 'Insert link',
  fieldsets: [
    {
      id: 'default',
      title: 'Internal link',
      fields: ['link', 'target', 'title'],
    },
  ],
  properties: {
    link: {
      widget: 'object',
      schema: LinkSchema,
    },
    target: {
      title: 'Target',
      choices: [
        ['', 'Open in this window / frame'],
        ['_blank', 'Open in new window'],
        ['_parent', 'Open in parent window / frame'],
        ['_top', 'Open in top frame (replaces all frames)'],
      ],
    },
    title: {
      title: 'Title',
    },
  },
  required: [],
};
export default LinkEditSchema;
```

For the `ObjectListWidget`, the schema can look like this:

```
export const Tab = {
  title: 'Tab',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title'],
    },
  ],

  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
  },

  required: ['title'],
};

export const Tabs = {
  title: 'Tabs',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['tabs'],
    },
    {
      id: 'settings',
      title: 'Settings',
      fields: ['position', 'css_class'],
    },
  ],

  properties: {
    css_class: {
      title: 'CSS Class',
      default: 'default-tabsblock',
      widget: 'string',
    },
    tabs: {
      widget: 'object_list',
      title: 'Tabs',
      schema: Tab,
    },
    position: {
      title: 'Position',
      description: 'Position of the tabs, content related',
      factory: 'Choice',
      type: 'string',
      choices: [
        ['top', 'Top'],
        ['bottom', 'Bottom'],
        ['left', 'Left'],
        ['right', 'Right'],
      ],
    },
  },

  required: ['tabs'],
};

export default Tabs;
```


###

Demo GIF

## Getting started

1. Create new volto project if you don't already have one:
    ```
    $ npm install -g @plone/create-volto-app
    $ create-volto-app my-volto-project
    $ cd my-volto-project
    ```

1. Update `package.json`:
    ``` JSON
    "addons": [
        "@eeacms/volto-object-widget"
    ],

    "dependencies": {
        "@eeacms/volto-object-widget": "github:eea/volto-object-widget#0.1.0"
    }
    ```

1. Install new add-ons and restart Volto:
    ```
    $ yarn
    $ yarn start
    ```

1. Go to http://localhost:3000

1. Happy editing!

## How to contribute

See [DEVELOP.md](DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
