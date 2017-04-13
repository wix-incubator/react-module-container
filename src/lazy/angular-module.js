const myApp = angular.module('myApp', ['ngRoute']);

class MyCompController {
  constructor(props) {
    this.value = 'angular-input-value';
    this.props = props;
  }
}

myApp.config(($routeProvider, $locationProvider) => {
  $locationProvider.html5Mode({enabled: true, requireBase: false});
  $routeProvider
    .when('/ng-router-app/a', {template: '<div>BAZINGA!</div>'})
    .when('/ng-router-app/b', {template: '<div>STAGADISH!</div>'})
    .otherwise('/ng-router-app/a');
});

myApp.component('myComp', {
  template:
  `<div>
    <div id="value-in-angular">{{$ctrl.props().value}}</div>
    <input id="angular-input" ng-model="$ctrl.value" />
    <div>
      <router-link id="bazinga" to="/ng-router-app/a">a</router-link>
      <router-link id="stagadish" to="/ng-router-app/b">b</router-link>
      <router-link id="react-app-link" to="/rt-router-app/">rt-router-app</router-link>
      <ng-view></ng-view>
      <module-registry component="Hello" props="{value: $ctrl.value}"></module-registry>
    </div>
  </div>`,
  controller: MyCompController
});

const myApp2 = angular.module('myApp2', ['ui.router']);

class MyCompController2 {
  constructor(props) {
    this.value = 'angular-input-value';
    this.props = props;
  }
}

myApp2.config(($stateProvider, $locationProvider, $urlRouterProvider) => {
  $locationProvider.html5Mode({enabled: true, requireBase: false});
  $stateProvider.state('a', {url: '/ui-router-app/a', template: 'BAZINGA!'});
  $stateProvider.state('b', {url: '/ui-router-app/b', template: 'STAGADISH!'});
  $urlRouterProvider.otherwise('/ui-router-app/a');
});

myApp2.component('myComp', {
  template:
  `<div>
    <div id="value-in-angular">{{$ctrl.props().value}}</div>
    <input id="angular-input" ng-model="$ctrl.value" />
    <div>
      <a id="bazinga" ui-sref="a">a</a>
      <a id="stagadish" ui-sref="b">b</a>
      <router-link id="react-app-link" to="/rt-router-app/">rt-router-app</router-link>
      <div><ui-view></ui-view></div>
      <module-registry component="Hello" props="{value: $ctrl.value}"></module-registry>
    </div>
  </div>`,
  controller: MyCompController2
});

const SHARED_TEMPLATE = `
  <div class="demo-shared">
    <div class="demo-4">demo-4</div>
    <div class="demo-5">demo-5</div>
  </div>`;

angular.module('myApp4', [])
  .component('myComp', {template: SHARED_TEMPLATE});

angular.module('myApp5', [])
  .component('myComp', {template: SHARED_TEMPLATE});

class DialogHostController {
  constructor(props) {
    this.value = 5;
    this.props = props;
    this.isDialogOpen = false;
    this.onDialogClose = () => {
      this.isDialogOpen = false;
      console.log('Dialog is closed!');
    };
  }
  openDialog() {
    this.isDialogOpen = true;
  }
}

angular.module('ngDialogHost', [])
  .component('dialogHost', {
    template: `
      <div>
        Passed to dialog value: <input ng-model="$ctrl.value"/>
      </div>
      <button ng-click="$ctrl.openDialog()">Open Dialog</button>
      <div>
        <module-registry component="NgDialog" props="{value: $ctrl.value, topology: $ctrl.props().topology, isOpen: $ctrl.isDialogOpen, onSuccess: $ctrl.onDialogClose, onCancel: $ctrl.onDialogClose}">
        </module-registry>
      </div>
    `,
    controller: DialogHostController
  });
