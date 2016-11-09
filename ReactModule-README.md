##React Module
You should register your main react component using `ModuleRegistry.registerComponent()`.  
You should create a new React component using `ReactLazyComponent` to lazy load dependencies for your main component.  
You should register the new lazy component using `ModuleRegistry.registerComponent()`.  

```
 ModuleRegistry.registerComponent('Prefix.mainComponentName', () => YourMainReactComponent);

 class MyNgComp extends ReactLazyComponent {
   constructor(props) {
     super(props, {/*see manifest below*/});
   }
 }
 
 ModuleRegistry.registerComponent('Prefix.lazyComponentName', () => MyNgComp);
 ```

###props
`props` contains the parameters from the host and will be available within the manifest.

###Manifest
####Fields
* `files`: Array of either url strings or sub arrays of url strings.  
Every item in the main array will be loaded independently.  
Using a sub array allows to serialize the download of its items.  
* `component`: The name you used to register your main react component to the `ModuleRegistry`.

####Example
```
{
files: ['y.js', `${props.files.fakeFile}`, ['1.js', '2.js', '3.js'], 'z.js'],
component: 'Prefix.mainComponentName'
}
```

####Explanation
Before being rendered all of the required `files` will be loaded.  
Once all `files` are loaded, your component will be rendered receiving the props parameter as props.  
