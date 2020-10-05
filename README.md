# volto-object-widget
[![Releases](https://img.shields.io/github/v/release/eea/volto-object-widget)](https://github.com/eea/volto-object-widget/releases)

[Volto](https://github.com/plone/volto) add-on

## Features

Several widgets to organize complex information for block schemas.

### FlatListObject

![Flat List object](./img/flat-list-widget.png)

### Mapping Widget

![Mapping widget](./img/mapping-widget.png)

### Object by type

![Object by type](./img/object-by-type-widget.png)


##
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
        "@eeacms/volto-blocks-form",
        "@eeacms/volto-object-widget:installDemo"
    ],

    "dependencies": {
        "@eeacms/volto-blocks-form": "github:eea/volto-blocks-form#"0.4.1",
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
