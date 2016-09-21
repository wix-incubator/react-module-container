class MyCompController {
  constructor(props) {
    this.aaa = 'shahata';
    this.props = props;
  }
}
angular.module('myApp', []).component('myComp', {
  template:
  `<div>
    <input ng-model="$ctrl.aaa" type="text" />
    <span>hi {{$ctrl.aaa}} {{$ctrl.props().value}}!!!</span>
  </div>`,
  controller: MyCompController
});
