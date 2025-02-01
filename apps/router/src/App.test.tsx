import React from 'react';
import { render, waitFor } from './utils/testing/customRender';
import '@testing-library/jest-dom';
import App from './App';
import { APP_ACTION_TYPE } from './context/AppContext';

// Mock react router dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: () => mockedNavigate(),
}));

// Mock AppContext
const mockedDispatch = jest.fn();
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useAppContext: () => ({
    guardians: {},
    gateways: {},
    dispatch: mockedDispatch,
  }),
}));

// Mock sha256Hash
jest.mock('@fedimint/utils', () => ({
  ...jest.requireActual('@fedimint/utils'),
  sha256Hash: () => 'dummy-hash-value',
}));

describe('App', () => {
  describe('Without env vars', () => {
    it('should not make any dispatch calls', () => {
      render(<App />);

      expect(mockedNavigate).toBeCalledTimes(0);
    });
  });

  describe('With guardian env var', () => {
    const OLD_ENV = { ...process.env };

    beforeEach(() => {
      jest.resetModules();
      process.env.REACT_APP_FM_CONFIG_API = 'wss://guardian.com';
    });

    afterEach(() => {
      process.env = OLD_ENV; // restore
      jest.clearAllMocks();
    });

    it('should call dispatch and navigate', async () => {
      render(<App />);

      await waitFor(() => {
        expect(mockedDispatch).toBeCalledWith({
          type: APP_ACTION_TYPE.ADD_GUARDIAN,
          payload: {
            id: 'dummy-hash-value',
            guardian: {
              config: {
                id: 'dummy-hash-value',
                baseUrl: 'wss://guardian.com',
              },
            },
          },
        });
        expect(mockedNavigate).toBeCalledTimes(1);
      });
    });
  });

  describe('With gateway env var', () => {
    const OLD_ENV = { ...process.env };

    beforeEach(() => {
      jest.resetModules();
      process.env.REACT_APP_FM_GATEWAY_API = 'https://gateway.com';
    });

    afterEach(() => {
      process.env = OLD_ENV; // restore
    });

    it('should call dispatch and navigate', async () => {
      render(<App />);

      await waitFor(() => {
        expect(mockedDispatch).toBeCalledWith({
          type: APP_ACTION_TYPE.ADD_GATEWAY,
          payload: {
            id: 'dummy-hash-value',
            gateway: {
              config: {
                id: 'dummy-hash-value',
                baseUrl: 'https://gateway.com',
              },
            },
          },
        });
        expect(mockedNavigate).toBeCalledTimes(1);
      });
    });
  });
});
