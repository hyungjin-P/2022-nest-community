import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios';

// AuthModule 의 HttpModule 이 만든 axios 인스턴스(auth.module.ts:30)에 붙이는 adapter.
// 카카오·네이버 API 를 fixture 로 응답하고, 그 밖의 요청은 보내지 않고 실패시킨다.

const avatar = (n: number) => `http://localhost:${process.env.SERVER_PORT}/_mock/assets/img/avatar/avatar-0${n}.svg`;

// 카카오 accessToken → /v2/user/me 응답(KakaoUserInfoDto.init 이 읽는 필드)
const KAKAO_USERS: Record<string, () => Record<string, unknown>> = {
  'mock-kakao-existing': () => ({
    id: 1000000009,
    properties: { nickname: '카카오데모', thumbnail_image: avatar(9) },
    kakao_account: { email: 'kakao-demo@example.com', is_email_verified: true },
  }),
  'mock-kakao-new': () => ({
    id: 1000000010,
    properties: { nickname: '카카오신규', thumbnail_image: avatar(5) },
    kakao_account: { email: 'kakao-new@example.com', is_email_verified: true },
  }),
};

const NAVER_CODE = 'mock-naver';
const NAVER_ACCESS_TOKEN = 'mock-naver-access-token';
const NAVER_USER = () => ({
  id: 'naver-mock-0001',
  email: 'naver-demo@example.com',
  name: '네이버데모',
  profile_image: avatar(6),
});

function respond(config: AxiosRequestConfig, status: number, data: unknown): Promise<AxiosResponse> {
  const response: AxiosResponse = { data, status, statusText: status < 400 ? 'OK' : 'Mock Error', headers: {}, config, request: {} };
  if (config.validateStatus && !config.validateStatus(status)) {
    return Promise.reject(Object.assign(new Error(`[mock] ${status}`), { config, response, isAxiosError: true }));
  }
  return Promise.resolve(response);
}

export const socialApiAdapter: AxiosAdapter = (config) => {
  const url = new URL(config.url);
  const endpoint = `${url.origin}${url.pathname}`;
  const auth = String((config.headers && config.headers.Authorization) || '');
  const token = auth.replace(/^Bearer /, '');

  if (endpoint === 'https://kapi.kakao.com/v2/user/me') {
    const user = KAKAO_USERS[token];
    return user ? respond(config, 200, user()) : respond(config, 401, { code: -401, msg: 'this access token does not exist' });
  }
  if (endpoint === 'https://kapi.kakao.com/v1/user/unlink') {
    const user = KAKAO_USERS[token];
    return user ? respond(config, 200, { id: user().id }) : respond(config, 401, { code: -401 });
  }
  if (endpoint === process.env.NAVER_LOGIN_API_URL) {
    return url.searchParams.get('code') === NAVER_CODE
      ? respond(config, 200, { access_token: NAVER_ACCESS_TOKEN, token_type: 'bearer', expires_in: '3600' })
      : respond(config, 200, { error: 'invalid_request', error_description: 'mock: unknown code' });
  }
  if (endpoint === 'https://openapi.naver.com/v1/nid/me') {
    return token === NAVER_ACCESS_TOKEN
      ? respond(config, 200, { resultcode: '00', message: 'success', response: NAVER_USER() })
      : respond(config, 401, { resultcode: '024', message: 'Authentication failed' });
  }
  // 쿼리에 client_secret 이 들어가는 요청이 있어 경로까지만 남긴다
  return Promise.reject(new Error(`[mock] 목업에 없는 외부 API 요청 차단: ${config.method} ${endpoint}`));
};
