import net from 'net';

// 목업 모드에서 loopback 밖으로 나가는 TCP 연결을 막고 기록한다(GET /_mock/egress).
// http·https·tls·mysql 드라이버 모두 net.Socket.prototype.connect 를 거친다. 호스트 이름은 이 단계에서 아직
// DNS 조회 전이라, 막으면 조회 요청도 나가지 않는다.

export interface EgressAttempt {
  at: string;
  target: string;
}

export const egressLog: EgressAttempt[] = [];

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '::ffff:127.0.0.1']);

type ConnectFn = (...args: unknown[]) => net.Socket;

function targetOf(args: unknown[]): { host?: string; port?: unknown } {
  // net.connect 는 정규화한 [options, cb] 배열을 첫 인자로 넘긴다
  const first = Array.isArray(args[0]) ? args[0][0] : args[0];
  if (first && typeof first === 'object') {
    const o = first as { path?: string; host?: string; port?: unknown };
    if (o.path) return {}; // IPC(named pipe)
    return { host: o.host ?? 'localhost', port: o.port };
  }
  if (typeof first === 'number' || (typeof first === 'string' && /^\d+$/.test(first))) {
    return { host: typeof args[1] === 'string' ? args[1] : 'localhost', port: first };
  }
  return {}; // IPC 경로 문자열
}

export function installEgressGuard(): void {
  const proto = net.Socket.prototype as unknown as { connect: ConnectFn };
  const original = proto.connect;
  proto.connect = function (this: net.Socket, ...args: unknown[]) {
    const { host, port } = targetOf(args);
    if (host !== undefined && !LOCAL_HOSTS.has(host)) {
      const target = `${host}:${port}`;
      egressLog.push({ at: new Date().toISOString(), target });
      console.warn(`[mock-egress] 외부 연결 차단: ${target}`);
      const err = Object.assign(new Error(`[mock] 외부 연결 차단: ${target}`), { code: 'EMOCKEGRESS' });
      process.nextTick(() => this.destroy(err));
      return this;
    }
    return original.apply(this, args);
  };
}
