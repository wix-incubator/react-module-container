import {useState} from 'react';
import ModuleRegistry from './module-registry';

export const useComponentFromModuleRegistry = (componentId) => {
  const [ComponentFromModuleRegistry] = useState(() => ModuleRegistry.component(componentId));
  return ComponentFromModuleRegistry;
}
