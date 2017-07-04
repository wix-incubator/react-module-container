# React Module

You should register your main react component using `ModuleRegistry.registerComponent()`.  
```js
// ../src/main-component.js:

const MainComponent = props => (
  <div>
    {/*Your application*/}
  </div>
);

window.ModuleRegistry.registerComponent('appName.mainComponentName', () => MainComponent);
```

You should create a new React component using `ReactLazyComponent` to lazy load your main component and its dependencies.  
You should add the path for the script which register your main component to the manifest's `files` array.  
You should register the new lazy component using `ModuleRegistry.registerComponent()`.  

```js
 class MainComponentLazyComponent extends ReactLazyComponent {
   constructor(props) {
     //see manifest explanation below
     const manifest = {
       files: ['src/main-component.js'],
       resolve: () => { /* fetch some data */ }, // optional
       component: 'appName.mainComponentName'
     };
     super(props, manifest);
   }
 }
 
 ModuleRegistry.registerComponent('appName.lazyMainComponentName', () => MainComponentLazyComponent);
 ```

`props` contains the parameters from the host and will be available within the manifest.

## Manifest
### Fields
* `files`: Array of url strings and sub arrays of url strings.  
Every **url string** in the main array will be **loaded independently**.  
Using a **sub array** allows to **serialize** the download of its items.
* `resolve`(optional): A function which will execute **in parallel of downloading the** `files`.
* `component`: The name you used to register your main react component to the `ModuleRegistry`.
  
##### Please note
* The `resolve` function must return a `promise`. Common usage for `resolve` would be to fetch data that affects how your app is rendered, like **experiments** or **user privileges**.  

### Example
```js 
{
  files: ['y.js', `${props.files.fakeFile}`, ['1.js', '2.js', '3.js'], 'z.js'],
  resolve: () => {
    return fetchExperiments().then(response => {
      return {
        experiments: response.data // experiments would be available on the props
      };
    });
  },
  component: 'Prefix.mainComponentName'
}
```

### Explanation
When the host tries to render the lazy component, it starts by downloading all the required `files` and execute `resolve`.  
Once all `files` are loaded and `resolve` resolved, the component is rendered and receives the props parameter as `props`.  

### Lifecycle events
All lazy components fire 3 lifecycle events (Via the ModuleRegistry):
* `reactModuleContainer.componentStartLoading` fires before the scripts are loaded
* `reactModuleContainer.componentReady` fires after the scripts are loaded and the component is on the stage
* `reactModuleContainer.componentWillUnmount` fire before the component is removed from the DOM.
