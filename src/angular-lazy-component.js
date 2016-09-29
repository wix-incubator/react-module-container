import React from 'react';
import {render, findDOMNode, unmountComponentAtNode} from 'react-dom';
import {tagAppender} from './tag-appender';

class AngularLazyComponent extends React.Component {
  constructor(props, manifest) {
    super(props);
    this.manifest = manifest;
  }

  componentWillMount() {
    this.promise = Promise.all(this.manifest.files.map(file => {
      return tagAppender(file, file.split('.').pop());
    }));
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
                render(<Component {...$scope.props}/>, $element[0]);
              }, true);
              $scope.$on('$destroy', () => unmountComponentAtNode($element[0]));
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
        findDOMNode(this).appendChild(this.$injector.get('$rootElement')[0]);
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
    if (this.$injector) {
      this.$injector.get('$rootScope').$digest();
    }
  }

  render() {
    return <div/>;
  }
}
AngularLazyComponent.propTypes = {
  router: React.PropTypes.any
};

export default AngularLazyComponent;
