##Angular Module
You should create a React component for your angular application using `AngularLazyComponent`.
The `AngularLazyComponent` uses the manifest to lazy load dependencies and bootstrap the angular app.
You should register the new react component using `ModuleRegistry.registerComponent()`.

```js
class MyNgComp extends AngularLazyComponent {
  constructor(props) {
    super(props, {/*see manifest below*/});
  }
}

ModuleRegistry.registerComponent('Prefix.componentName', () => MyNgComp);
```

###props
`props` contains the parameters from the host and will be available within the manifest.

###Manifest
####Fields:
* `files`: Array of either url strings or sub arrays of url strings.
Every item in the main array will be loaded independently.
Using a sub array allows to serialize the download of its items.
* `prepare`(optional): A function to prepare data before bootstrap.
* `module`: The name of the angular module that will be bootstrapped.
* `component`: The name of your angular application's root directive/component that should be rendered.
* `unloadStylesOnDestroy`(optional, default false): Specifies if loaded stylesheets should be unloaded when component is destroyed.

####Explanation
Before being rendered all of the required `files` will be loaded.
Once all `files` are loaded, the function `prepare` will be executed.
The `prepare` function can return a new promise if asynchronous behaviour is required.
Once `prepare` finished/resolved `angular.bootstrap()` will be called with the component and module you passed.

####Example
```js
{
files: ['y.js', `${props.files.fakeFile}`, ['1.js', '2.js', '3.js'], 'z.js'],
prepare: () => {
//customLogic();
//or
//return new Promise(...);
},
module: 'your-module-name'
component: 'your-main-component-name'
}
```
###Accessing parameters
Your angular application can use a service called `props` which contains all the parameters passed from the host.
Once any of the props values are changed, `$digest()` will be called for you.

//TODO - example?

###Advanced topics

####Changing The host's route (switching modules)
Use the `routerLink` directive, example:
`<router-link to="contacts/inner-route">name</router-link>`

####Hosting another component within a hosted component
Use the `moduleRegistry` directive, example:
```js
<module-registry component="moduleName" props="{value: 123}"></module-registry>
```
