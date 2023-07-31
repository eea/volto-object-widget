# volto-object-widget

[![Releases](https://img.shields.io/github/v/release/eea/volto-object-widget)](https://github.com/eea/volto-object-widget/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-object-widget%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-object-widget/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-object-widget-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-object-widget-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-object-widget-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-object-widget-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-object-widget-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-object-widget-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-object-widget-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-object-widget-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-object-widget%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-object-widget/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-object-widget-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-object-widget-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-object-widget-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-object-widget-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-object-widget-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-object-widget-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-object-widget-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-object-widget-develop)


[Volto](https://github.com/plone/volto) add-on

## Features

Demo GIF

## Getting started

### Try volto-object-widget with Docker

      git clone https://github.com/eea/volto-object-widget.git
      cd volto-object-widget
      make
      make start

Go to http://localhost:3000

### Add volto-object-widget to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-object-widget"
   ],

   "dependencies": {
       "@eeacms/volto-object-widget": "*"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --canary --addon @eeacms/volto-object-widget
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-object-widget/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-object-widget/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-object-widget/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
