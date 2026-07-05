import * as crypto from 'crypto';

export class JwtHelper {
  private static readonly SECRET =
    process.env.JWT_SECRET ||
    'eduguilder_default_secret_key_1234567890_super_secret_for_development';

  static sign(
    payload: Record<string, unknown>,
    expiresInSeconds: number = 86400,
  ): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const fullPayload = { ...payload, exp };

    const headerStr = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadStr = Buffer.from(JSON.stringify(fullPayload)).toString(
      'base64url',
    );

    const signature = crypto
      .createHmac('sha256', this.SECRET)
      .update(`${headerStr}.${payloadStr}`)
      .digest('base64url');

    return `${headerStr}.${payloadStr}.${signature}`;
  }

  static verify(token: string): Record<string, unknown> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token structure');
    }
    const [headerStr, payloadStr, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', this.SECRET)
      .update(`${headerStr}.${payloadStr}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    const payload = JSON.parse(
      Buffer.from(payloadStr, 'base64url').toString('utf8'),
    ) as Record<string, unknown>;
    const exp = payload.exp as number | undefined;
    if (exp && exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  }
}
