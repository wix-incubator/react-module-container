import React from 'react';
import ModuleRegistry from '../module-registry';

interface EventsListenerProps {

}
interface EventsListenerState {}
export class EventsListener extends React.Component<EventsListenerProps, EventsListenerState> {
  unSubscribeStartLoading?: ReturnType<typeof ModuleRegistry.addListener>;
  unSubscribeComponentReady?: ReturnType<typeof ModuleRegistry.addListener>;
  unSubscribeComponentWillUnmount?: ReturnType<typeof ModuleRegistry.addListener>;

  state = {
    gotStartLoadingEvent: false,
    gotComponentReady: false,
    gotComponentWillUnmount: false
  }

  componentWillMount() {
    this.unSubscribeStartLoading = ModuleRegistry.addListener('reactModuleContainer.componentStartLoading', () => {
      this.setState({gotStartLoadingEvent: true});
    });

    this.unSubscribeComponentReady = ModuleRegistry.addListener('reactModuleContainer.componentReady', () => {
      this.setState({gotComponentReady: true});
    });

    this.unSubscribeComponentWillUnmount = ModuleRegistry.addListener('reactModuleContainer.componentWillUnmount', () => {
      this.setState({gotComponentWillUnmount: true});
    });
  }

  componentWillUnmount() {
    this.unSubscribeStartLoading?.remove();
    this.unSubscribeComponentReady?.remove();
    this.unSubscribeComponentWillUnmount?.remove();
  }

  render() {
    return (<div>
      <div>gotStartLoadingEvent:
        <span id="got-start-loading">{this.state.gotStartLoadingEvent ? 'true' : 'false'}</span></div>
      <div>gotComponentReady: <span id="got-component-ready">{this.state.gotComponentReady ? 'true' : 'false'}</span>
      </div>
      <div>gotComponentWillUnmount:
        <span id="got-component-will-unmount">{this.state.gotComponentWillUnmount ? 'true' : 'false'}</span></div>
    </div>);
  }
}

