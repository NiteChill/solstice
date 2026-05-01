import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { api } from './axios';
import * as tokenService from '../utils/token-service';

describe('Axios Auth Interceptor', () => {
  let apiMock: MockAdapter;
  let globalAxiosMock: MockAdapter;

  beforeEach(() => {
    apiMock = new MockAdapter(api);
    globalAxiosMock = new MockAdapter(axios);

    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue('expired-token');
    vi.spyOn(tokenService, 'getRefreshToken').mockReturnValue(
      'valid-refresh-token',
    );
    vi.spyOn(tokenService, 'setTokens').mockImplementation(() => {});
    vi.spyOn(tokenService, 'clearTokens').mockImplementation(() => {});

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    apiMock.reset();
    globalAxiosMock.reset();
    vi.restoreAllMocks();
  });

  it('should queue concurrent 401 requests and only call /refresh ONCE', async () => {
    apiMock.onGet('/test-endpoint').replyOnce(401, { code: 'TOKEN_EXPIRED' });
    apiMock.onGet('/test-endpoint').replyOnce(401, { code: 'TOKEN_EXPIRED' });
    apiMock.onGet('/test-endpoint').replyOnce(401, { code: 'TOKEN_EXPIRED' });

    globalAxiosMock
      .onPost('http://localhost:8080/api/v1/auth/refresh')
      .reply(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              200,
              { accessToken: 'new-access', refreshToken: 'new-refresh' },
            ]);
          }, 50);
        });
      });

    apiMock.onGet('/test-endpoint').reply(200, { success: true });

    const req1 = api.get('/test-endpoint');
    const req2 = api.get('/test-endpoint');
    const req3 = api.get('/test-endpoint');

    const results = await Promise.all([req1, req2, req3]);

    expect(results[0].status).toBe(200);
    expect(results[1].status).toBe(200);
    expect(results[2].status).toBe(200);

    const refreshCalls = globalAxiosMock.history.post.filter(
      (req) => req.url === 'http://localhost:8080/api/v1/auth/refresh',
    );
    expect(refreshCalls.length).toBe(1);

    expect(tokenService.setTokens).toHaveBeenCalledWith({
      access: 'new-access',
      refresh: 'new-refresh',
    });
  });

  it('should instantly logout if code is INVALID_TOKEN', async () => {
    apiMock.onGet('/secure-data').reply(401, { code: 'INVALID_TOKEN' });

    try {
      await api.get('/secure-data');
    } catch (_error) {
      // Expected to throw
    }

    expect(tokenService.clearTokens).toHaveBeenCalled();
    expect(window.location.href).toBe('/auth/login');

    expect(globalAxiosMock.history.post.length).toBe(0);
  });
});
