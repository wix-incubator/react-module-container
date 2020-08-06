import {ElementArrayFinder, ElementFinder} from 'protractor/built/element';
import {ProtractorBrowser} from 'protractor/built/browser';

declare global {
  const browser: ProtractorBrowser;
  const $: (search: string) => ElementFinder;
  const $$: (search: string) => ElementArrayFinder;
}

export {};
