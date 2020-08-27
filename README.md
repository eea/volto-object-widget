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
a `schema` parameter to the field. See the `src/demo/schema.js` file for an
example. This package provides a demo block, with a schema that uses 2 object
widgets: the `link` field which uses the ObjectWidget and the `tabs` field
which uses the `ObjectListWidget`. Activate the demo by passing
`@eeacms/volto-object-widget:installDemo` in the `addons` key of your
`package.json`.

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
        "@eeacms/volto-object-widget:installDemo"
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
