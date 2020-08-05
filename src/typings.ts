export interface FileConfig {
  url: string;
  optional?: boolean;
}

export type ResolveData = {
  default: ((...args: unknown[]) => unknown)
} | ((...args: unknown[]) => unknown);

export type Manifest = {
  component: string;
  module?: string;
  files?: (string | FileConfig)[];
  resolve?: () => Promise<ResolveData>;
  prepare?: () => unknown;
  crossorigin?: true | false;
  unloadStylesOnDestroy?: true | false;
}
