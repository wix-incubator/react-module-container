import React from 'react';
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
    this.elementId = `ng-comp-${Math.random()}`;
  }

  componentDidMount() {
    this.mounted = true;
    this.promise.then(() => {
      if (this.mounted) {
        const component = `<${this.manifest.component}></${this.manifest.component}>`;
        this.$injector = angular.bootstrap(component, [this.manifest.module, $provide => {
          $provide.factory('props', () => () => this.props);
        }]);
        document.getElementById(this.elementId).appendChild(this.$injector.get('$rootElement')[0]);
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
    return (
      <div id={this.elementId}></div>
    );
  }
}

export default AngularLazyComponent;
