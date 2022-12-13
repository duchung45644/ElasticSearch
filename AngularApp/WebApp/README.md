# NgNiq

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

####################################
## Update version project

1. Remove angular cli
npm uninstall -g angular-cli

npm uninstall -g @angular/cli

npm cache clean --force
2. Install angular/cli@13
npm i -g @angular/cli@13.3.7

#3. npm-check-updates is a utility that automatically adjusts a package.json with the latest version of all dependencies

see https://www.npmjs.org/package/npm-check-updates

npm install -g npm-check-updates
ncu -u
npm install  --force


