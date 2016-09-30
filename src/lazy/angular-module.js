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
