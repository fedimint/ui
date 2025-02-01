import React from 'react';
import { render, screen } from '../../utils/testing/customRender';
import '@testing-library/jest-dom';
import HomePage from './Home';

// Mock AppContext
const mockedUseAppContext = jest.fn();
jest.mock('../../hooks', () => ({
  useAppContext: () => mockedUseAppContext(),
}));

describe('pages/Home', () => {
  describe('When there are no services', () => {
    beforeEach(() => {
      mockedUseAppContext.mockImplementation(() => ({
        guardians: {},
        gateways: {},
        dispatch: jest.fn(),
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render an add services button', async () => {
      render(<HomePage />);
      const btn = screen.getByLabelText('connect-service-btn');
      expect(btn).toBeInTheDocument();
    });
  });

  describe('When there is a guardian', () => {
    beforeEach(() => {
      mockedUseAppContext.mockImplementation(() => ({
        guardians: {
          '51c1eeeb3b350bfe050d8b7ac04700548f6d96c3d8dc2e8f4489a2ebc662833d': {
            config: {
              id: '51c1eeeb3b350bfe050d8b7ac04700548f6d96c3d8dc2e8f4489a2ebc662833d',
              baseUrl: 'wss://fedimintd-l7ik.test.app:8174',
            },
          },
        },
        gateways: {},
        dispatch: jest.fn(),
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render guardian url', () => {
      render(<HomePage />);
      const url = screen.getByText('wss://fedimintd-l7ik.test.app:8174');
      expect(url).toBeInTheDocument();
    });
  });

  describe('When there is a gateway', () => {
    beforeEach(() => {
      mockedUseAppContext.mockImplementation(() => ({
        guardians: {},
        gateways: {
          '08fbbdb098ed66e0735a43c70ba71e4df12f27888f3facb619325e6f06bea314': {
            config: {
              id: '08fbbdb098ed66e0735a43c70ba71e4df12f27888f3facb619325e6f06bea314',
              baseUrl: 'https://gatewayd-1234.test.app:8175',
            },
          },
        },
        dispatch: jest.fn(),
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render gateway url', () => {
      render(<HomePage />);
      const url = screen.getByText('https://gatewayd-1234.test.app:8175');
      expect(url).toBeInTheDocument();
    });
  });
});
