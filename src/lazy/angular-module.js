const myApp = angular.module('myApp', ['ngRoute']);

class MyCompController {
  constructor(props) {
    this.aaa = 'shahata';
    this.props = props;
  }
}

myApp.config(($routeProvider, $locationProvider) => {
  $locationProvider.html5Mode({enabled: true, requireBase: false});
  $routeProvider
    .when('/my-app/a', {template: '<h1>BAZINGA!</h1>'})
    .when('/my-app/b', {template: '<h1>STAGADISH!</h1>'})
    .otherwise('/my-app/a');
});

myApp.component('myComp', {
  template:
  `<div>
    <input ng-model="$ctrl.aaa" type="text" />
    <span>hi {{$ctrl.aaa}} {{$ctrl.props().value}}!!!</span>
    <a href="/my-app/a">a</a>
    <a href="/my-app/b">b</a>
    <a href="/my-app3/">my-app3</a>
    <ng-view></ng-view>
  </div>`,
  controller: MyCompController
});

const myApp2 = angular.module('myApp2', ['ngRoute']);

class MyCompController2 {
  constructor(props) {
    this.aaa = 'shahata';
    this.props = props;
  }
}

myApp2.config(($routeProvider, $locationProvider) => {
  $locationProvider.html5Mode({enabled: true, requireBase: false});
  $routeProvider
    .when('/my-app2/a', {template: '<h1>BAZINGA2!</h1>'})
    .when('/my-app2/b', {template: '<h1>STAGADISH2!</h1>'})
    .otherwise('/my-app2/a');
});

myApp2.component('myComp', {
  template:
  `<div>
    <input ng-model="$ctrl.aaa" type="text" />
    <span>hi {{$ctrl.aaa}} {{$ctrl.props().value}}!!!</span>
    <a href="/my-app2/a">a</a>
    <a href="/my-app2/b">b</a>
    <ng-view></ng-view>
  </div>`,
  controller: MyCompController2
});
