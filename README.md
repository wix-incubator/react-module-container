# Welcome to React Module Container

## Why?
It's a small library that allows big things. 
Its main purpose is to enable building large-scale application with lazy-loaded modules based on either React or Angular.

## Getting started or 4 simple steps to convert to lazy module
### Step 1: Add `react-module-container`
Add `react-module-container` npm module as your dependency.
```bash
npm install --save react-module-container
```
### Step 2: Create manifest file and register your component
Create a `manifest.js` file that describe your future lazy module. It can be either [Angular](./docs/ANGULAR-LAZY-COMPONENT.md) or [React](./docs/REACT-LAZY-COMPONENT.md) lazy module.

```js
class NgMainApp extends AngularLazyComponent {
  constructor(props) {
    super(props, {
      files: [
        `${props.topology.staticsBaseUrl}angular-client.css`,
        `${props.topology.staticsBaseUrl}angular-client.bundle.js`
      ],
      module: 'myApp',
      component: 'main-app',
      unloadStylesOnDestroy: true
    });
  }
}

ModuleRegistry.registerComponent('angular.main', () => NgMainApp);
```

### Step 3: Load the manifest file by hosting application
Load `manifest.js` file in the `index.html` of your hosting application.
```html
<script src="<path-to-your-manifest-file>/manifest.js"></script>
```

### Step 4: Instantiate your lazy component
Instantiate your lazy component using `ModuleRegistry` and render it inside hosting application.

```js
class App extends React.Component {
  render() {
    const AngularComponent = ModuleRegistry.component('angular.main');
    const topology = {
      staticsBaseUrl: 'http://localhost:3200'
    };

    return (
      <AngularComponent topology={topology}/>
    );
  }
}
```

## API
* [`ModuleRegistry`](./docs/MODULE-REGISTRY.md)
* [`ReactLazyComponent`](./docs/REACT-LAZY-COMPONENT.md)
* [`AngularLazyComponent`](./docs/ANGULAR-LAZY-COMPONENT.md)

## Demo
* `git clone git@github.com:wix/react-module-container.git`
* `cd react-module-container`
* `npm install`
* `npm start`
* `http://localhost:3200`
