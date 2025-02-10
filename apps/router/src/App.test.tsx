import React from 'react';
import { render, screen } from './utils/testing/customRender';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
  describe('When page loads', () => {
    it('should render the Home page', () => {
      render(<App />);

      const btn = screen.getByLabelText('connect-service-btn');
      const link = screen.getByText(/learn more about fedimint services/i);

      expect(btn).toBeInTheDocument();
      expect(link).toBeInTheDocument();
    });
  });
});
