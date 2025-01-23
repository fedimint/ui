import React from 'react';
import { render, screen, waitFor } from './utils/testing/customRender';
import '@testing-library/jest-dom';
import App from './App';

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
    it('should render the NoConnectedServices page', () => {
      render(<App />);
      const title = screen.getByText('No services connected yet.');
      expect(title).toBeInTheDocument();
    });
  });

  describe('With guardian env var', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env.REACT_APP_FM_CONFIG_API = 'wss://guardian.com';
    });

    afterEach(() => {
      process.env = OLD_ENV; // restore
    });

    it('should call dispatch and navigate', async () => {
      render(<App />);

      await waitFor(() => {
        expect(mockedDispatch).toBeCalledTimes(1);
        expect(mockedNavigate).toBeCalledTimes(1);
      });
    });
  });

  describe('With gateway env var', () => {
    const OLD_ENV = process.env;

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
        expect(mockedDispatch).toBeCalledTimes(1);
        expect(mockedNavigate).toBeCalledTimes(1);
      });
    });
  });
});
