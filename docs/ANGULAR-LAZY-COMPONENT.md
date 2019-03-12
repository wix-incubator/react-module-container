# Angular Module
You should create a React component for your angular application using `AngularLazyComponent`.  
The `AngularLazyComponent` uses the manifest to lazy load dependencies and bootstrap the angular app.  
You should register the new react component using `ModuleRegistry.registerComponent()`.  

```js
class MyNgComp extends AngularLazyComponent {
  constructor(props) {
    super(props, {
      /*see manifest below*/
    });
  }
}

ModuleRegistry.registerComponent('Prefix.componentName', () => MyNgComp);
```

`props` contains the parameters from the host and will be available within the manifest.  

## Manifest

### Fields:
* `files`: Array of `file entry` and sub arrays of `file entry`.
* `file entry` url string or object of type { url : string, optional: boolean }, when optional set to `true` the component will keep loading even when that resource failed to load, by default `false`. 

Every **url string** in the main array will be **loaded independently**.  
Using a **sub array** allows to **serialize** the download of its items.  
* `resolve`(optional): A function (`() => Promise<object>`) to fetch data **before** bootstrap and **in parallel** of downloading the `files`.
* `prepare`(optional): A function (`() => Promise<any> || void`) to prepare data **before** bootstrap and **after** all `files` were downloaded and `resolve` resolved.
* `module`: The name of the angular module that will be bootstrapped.  
* `component`: The name of your angular application's root directive/component that should be rendered.  
* `unloadStylesOnDestroy`(optional, default true): Specifies if loaded stylesheets should be unloaded when component is destroyed.
  
##### Please note
* The `resolve` function must return a `promise`. Common usage for `resolve` would be to fetch data that affects how your app is rendered, like **experiments** or **user privileges**.
* The `prepare` function can return a new promise if asynchronous behaviour is required.

### Explanation
Before being rendered, all of the required `files` will be downloaded and `resolve` will executed.  
Once all `files` are loaded and `resolve` resolved, the function `prepare` will be executed.    
Once `prepare` finished/resolved `angular.bootstrap()` will be called with the component and module you passed.  

### Example
```js
{
  files: ['y.js', `${props.files.fakeFile}`, ['1.js', '2.js', '3.js'], 'z.js'],
  resolve: () => {
    return fetchExperiments().then(response => {
      return {
        experiments: response.data // experiments would be available on the props service
      };
    });
  },
  prepare: () => {
    // customLogic();
    // or
    // return new Promise(...);
  },
  module: 'your-module-name'
  component: 'your-main-component-name'
}
```
## Accessing parameters
Your angular application can use a service called `props` which contains all the parameters passed from the host.  
Once any of the props values are changed, `$digest()` will be called for you.  

### Example
```js
class MyCompController {
  constructor(props) {
    this.value = 'angular-input-value';
    this.props = props;
  }
}

myApp.component('myComp', {
  template:
  `<div>
    <div id="value-in-angular">{{$ctrl.props().value}}</div>
    <input id="angular-input" ng-model="$ctrl.value" />
  </div>`,
  controller: MyCompController
});
```
This `props` parameter is an angular `services` that can be injects and if called as a function can return `props` object.
See `{{$ctrl.props().value}}` line in the example above.


## Advanced topics

### Changing The host's route (switching modules)
Use the `routerLink` directive, example:
`<router-link to="contacts/inner-route">name</router-link>`

### Hosting another component within a hosted component
Use the `moduleRegistry` directive, example:
```js
<module-registry component="moduleName" props="{value: 123}"></module-registry>
```

### Lifecycle events
All lazy components fire 3 lifecycle events (Via the ModuleRegistry):
* `reactModuleContainer.componentStartLoading` fires before the scripts are loaded, and before the `prepare` function is called
* `reactModuleContainer.componentReady` fires after the scripts are loaded, the `prepare` promise resolved, and the component is on the stage.
* `reactModuleContainer.componentWillUnmount` fire before the component is removed from the DOM.
