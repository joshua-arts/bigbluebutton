import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis2x';
import Logger from '/imports/startup/server/logger';

export default function endMeeting(credentials) {
  const REDIS_CONFIG = Meteor.settings.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'LogoutAndEndMeetingCmdMsg';

  const { meetingId, requesterUserId, requesterToken } = credentials;

  check(meetingId, String);
  check(requesterUserId, String);
  check(requesterToken, String);

  const payload = {
      userId: requesterUserId,
  };

  const header = {
    meetingId,
    name: EVENT_NAME,
    userId: requesterUserId,
  };

  Logger.verbose(`Meeting '${meetingId}' is destroyed by '${requesterUserId}'`);

  return RedisPubSub.publish(CHANNEL, EVENT_NAME, meetingId, payload, header);
}
