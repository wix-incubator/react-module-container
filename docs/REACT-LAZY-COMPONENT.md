# React Module

You should register your main react component using `ModuleRegistry.registerComponent()`.  
```js
//src/main-component.js:

const MainComponent = props => (
  <div>
    {/*Your applcation*/}
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
* `component`: The name you used to register your main react component to the `ModuleRegistry`.  

### Example
```js 
{
  files: ['y.js', `${props.files.fakeFile}`, ['1.js', '2.js', '3.js'], 'z.js'],
  component: 'Prefix.mainComponentName'
}
```

### Explanation
When the host tries to render the lazy component, it starts by loading all the required `files`.  
Once all `files` are loaded, the component is rendered and receives the props parameter as `props`.  
