import { getServiceType } from './service';

describe('helpers/service', () => {
  describe('when empty string is provided', () => {
    it('should return null', () => {
      const result = getServiceType('');

      expect(result).toBe(null);
    });
  });

  describe('when invalid url is provided', () => {
    it('should return null', () => {
      const result = getServiceType('invalid-url');

      expect(result).toBe(null);
    });
  });

  describe('when valid guardian url is provided', () => {
    it('should return guardian', () => {
      const result = getServiceType('wss://test-url.com');

      expect(result).toBe('guardian');
    });
  });

  describe('when valid gateway url is provided', () => {
    it('should return gateway', () => {
      const result = getServiceType('https://test-url.com');

      expect(result).toBe('gateway');
    });
  });
});
