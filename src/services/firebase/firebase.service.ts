import { HttpException, Injectable } from '@nestjs/common';
import fireAdmin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth';
import { BatchResponse } from 'firebase-admin/lib/messaging';

@Injectable()
export class FirebaseService {
  async verifyIdToken(accessToken): Promise<DecodedIdToken> {
    try {
      return await fireAdmin.auth().verifyIdToken(accessToken);
    } catch (err) {
      throw new HttpException(
        {
          code: 'failure',
          massage: 'verifyIdToken verifying failed',
        },
        500,
      );
    }
  }

  async createCustomToken(uid, developerClaims): Promise<string> {
    try {
      return await fireAdmin.auth().createCustomToken(uid, developerClaims);
    } catch (err) {
      throw new HttpException(
        { code: 'failure', massage: 'firebase create token failed' },
        500,
      );
    }
  }

  async sendMessage(registrationTokens, message): Promise<BatchResponse> {
    try {
      const _message = {
        tokens: registrationTokens,
        notification: {
          title: message.title,
          body: message.body,
        },
        data: {
          payload: JSON.stringify(message.data),
        },
      };

      return await fireAdmin.messaging().sendMulticast(_message);
    } catch (err) {
      throw new HttpException(
        {
          code: 'failure',
          message: 'firebase sendMessage failed ',
        },
        500,
      );
    }
  }
}
