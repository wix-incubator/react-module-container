import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {filesAppender} from './tag-appender';

class AddRouterContext extends React.Component {
  getChildContext() {
    return {router: this.props.router};
  }
  render() {
    return this.props.children;
  }
}
AddRouterContext.childContextTypes = {
  router: React.PropTypes.any
};
AddRouterContext.propTypes = {
  router: React.PropTypes.any,
  children: React.PropTypes.any
};

class AngularLazyComponent extends React.Component {
  constructor(props, manifest) {
    super(props);
    this.manifest = manifest;
  }

  componentWillMount() {
    this.promise = filesAppender(this.manifest.files).then(this.manifest.prepare || () => undefined);
  }

  componentDidMount() {
    this.mounted = true;
    this.promise.then(() => {
      if (this.mounted) {
        const component = `<${this.manifest.component}></${this.manifest.component}>`;
        this.$injector = angular.bootstrap(component, [this.manifest.module, ($provide, $compileProvider) => {
          $provide.factory('props', () => () => this.props);
          $compileProvider.directive('moduleRegistry', () => ({
            scope: {component: '@', props: '<'},
            controller: ($scope, $element) => {
              const Component = window.ModuleRegistry.component($scope.component);
              $scope.$watch(() => $scope.props, () => {
                render(
                  <AddRouterContext router={this.props.router}>
                    <Component {...$scope.props}/>
                  </AddRouterContext>, $element[0]);
              }, true);
              $scope.$on('$destroy', () => unmountComponentAtNode($element[0]));
              //super hack to prevent angular from preventing external route changes
              $element.on('click', e => e.preventDefault = () => delete e.preventDefault);
            }
          }));
          $compileProvider.directive('routerLink', () => ({
            transclude: true,
            scope: {to: '@'},
            template: '<a ng-href="{{to}}" ng-click="handleClick($event)"><ng-transclude></ng-transclude></a>',
            controller: $scope => {
              $scope.handleClick = event => {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.which === 2 || event.button === 2) {
                  return;
                } else {
                  this.props.router.push($scope.to);
                  event.preventDefault();
                }
              };
            }
          }));
        }]);
        this.node.appendChild(this.$injector.get('$rootElement')[0]);
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.$injector) {
      this.$injector.get('$rootScope').$destroy();
      this.$injector = null;
    }
  }

  componentDidUpdate() {
    if (this.$injector && !this.$injector.get('$rootScope').$$phase) {
      this.$injector.get('$rootScope').$digest();
    }
  }

  render() {
    return <div ref={node => this.node = node}/>;
  }
}
AngularLazyComponent.propTypes = {
  router: React.PropTypes.any
};

export default AngularLazyComponent;
