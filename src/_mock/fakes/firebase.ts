import fireAdmin from 'firebase-admin';

// 원본 FirebaseService 는 fireAdmin.auth() 를 직접 부른다(firebase.service.ts:10,24).
// auth 는 네임스페이스 프로토타입의 게터라, 인스턴스에 같은 이름 속성을 두어 가린다. initializeApp 은 부르지 않는다.

const avatar = (n: number) => `http://localhost:${process.env.SERVER_PORT}/_mock/assets/img/avatar/avatar-0${n}.svg`;

// 목업 Google ID token → verifyIdToken 결과(auth.service.ts:412-495 가 읽는 필드)
const GOOGLE_ID_TOKENS: Record<string, () => Record<string, unknown>> = {
  'mock-google': () => ({
    uid: 'google-mock-0001',
    user_id: 'google-mock-0001',
    email: 'google-demo@example.com',
    email_verified: true,
    name: '구글데모',
    picture: avatar(8),
  }),
};

const fakeAuth = {
  async createCustomToken(uid: string): Promise<string> {
    return `mock-firebase-custom-token.${uid}`;
  },
  async verifyIdToken(idToken: string): Promise<Record<string, unknown>> {
    const decoded = GOOGLE_ID_TOKENS[idToken];
    if (!decoded) throw new Error('[mock] 알 수 없는 ID token');
    return decoded();
  },
};

export function installFakeFirebase(): void {
  Object.defineProperty(fireAdmin, 'auth', { value: () => fakeAuth, configurable: true });
}
