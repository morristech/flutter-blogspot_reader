import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { md5Hash, sha1Hmac } from './crypto';

export interface Config {
  generateWebsubCallbackForHubTopic(hubTopic: string): string;
  generateWebsubSecretForHubTopic(hubTopic: string): string;
  getHub(): string;
}

export const firestoreCollectionSubscriptions = 'subscriptions';
export const firestoreFieldChallengeDate = 'challenge_date';
export const firestoreFieldHubTopic = 'hub_topic';
export const firestoreFieldLatestItemDate = 'latest_item_date';
export const firestoreFieldLeaseEndDate = 'lease_end_date';
export const firestoreFieldLeaseSeconds = 'lease_seconds';
export const firestoreFieldSubscribeDate = 'subscribe_date';

export const hubTopicPrefix = 'https://www.blogger.com';

export const registrationTokenParamKey = 'br.registration_token';

export const generateFcmTopicForHubTopic = (hubTopic: string): string =>
  hubTopic.replace(/[^a-zA-Z0-9-_.~%]/g, '');

class _Config implements Config {
  _config: {
    secret: string,
    url: string,
  };

  constructor() {
    admin.initializeApp();

    this._config = functions.config().websub || {
      secret: process.env.WEBSUB_SECRET || '123456',
      url: process.env.WEBSUB_URL || 'http://localhost',
    };
  }

  generateWebsubCallbackForHubTopic = (hubTopic: string) =>
    `${this._config.url}?md5=${md5Hash(hubTopic)}`

  generateWebsubSecretForHubTopic = (hubTopic: string) =>
    sha1Hmac(hubTopic, this._config.secret);

  getHub = () => 'https://pubsubhubbub.appspot.com';
}

export default new _Config();
