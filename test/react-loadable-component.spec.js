import React, { Suspense } from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { ReactLoadableComponent, ReactModuleContainerContext } from '../src';
import sinon from 'sinon';

const hooks = {
  someComponent: 'some-component-root',
  loader: 'loader',
  subComponent: 'sub-component-root',
};

describe('ReactLoadableComponent', () => {
  afterEach(cleanup);

  afterEach(() => sinon.reset());

  it('render the component', async () => {
    const SomeComponent = ReactLoadableComponent('SomeComponent', () => import('./mock/SomeComponent'));
    const { findByTestId } = render(<SomeComponent />);

    const element = await findByTestId(hooks.someComponent);

    expect(element.textContent).to.equal('Hello World!');
  });

  describe('rendering with suspense support', () => {
    const resolver = sinon.fake(async () => { await new Promise(resolve => setTimeout(resolve, 100)); return import('./mock/SomeComponent') });

    let renderResult, SomeComponent;

    beforeEach(() => {
      SomeComponent = ReactLoadableComponent('SomeComponent', resolver);
      const wrapper = ({children}) => (
        <ReactModuleContainerContext.Provider value={{ suspense: true }}>
          <Suspense fallback={<div data-hook="loader">Loading...</div>}>{children}</Suspense>
        </ReactModuleContainerContext.Provider>
      );

      renderResult = render(<SomeComponent />, { wrapper });
    });

    it('should show a loader', async () => {
      const loader = await renderResult.findByTestId(hooks.loader);

      expect(loader).to.exist;
    });

    it('should handle rerenders', async () => {
      await renderResult.findByTestId(hooks.loader);
      await renderResult.rerender(<SomeComponent />);
      const loader = await renderResult.findByTestId(hooks.loader);

      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(loader).to.exist;
    });

    describe('when loader is rendered', () => {
      beforeEach(() => renderResult.findByTestId(hooks.loader));

      it('should render the component after the loader is shown', async () => {
        const element = await renderResult.findByTestId(hooks.someComponent);

        expect(element).to.exist;
      });

      describe('when component is rendered', () => {
        beforeEach(() => renderResult.findByTestId(hooks.someComponent));

        it('should call the resolver only once', async () => {
          expect(resolver).to.be.calledOnce;
        });

        it('should render the sub component without entering an infinite loop', async () => {
          const element = await renderResult.findByTestId(hooks.subComponent);

          expect(element).to.exist;
        });
      });
    });
  });
});