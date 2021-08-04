import 'global-jsdom/register';
import { configure } from '@testing-library/react';
import { use } from 'chai';
import sinonChai from 'sinon-chai';

configure({ testIdAttribute: 'data-hook' });
use(sinonChai);