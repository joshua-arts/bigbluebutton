import { makeCall } from '/imports/ui/services/api/index.js';
import Users from '/imports/api/2.0/users';
import mapUser from '/imports/ui/services/user/mapUser';
import Auth from '/imports/ui/services/auth';

const endMeeting = () => {
  makeCall('endMeeting', Auth.credentials);
};

const isModerator = () => {
  const currentUserId = Auth.userID;
  const currentUser = Users.findOne({ userId: currentUserId });

  return (currentUser) ? mapUser(currentUser).isModerator : null;
};

export default {
  endMeeting,
  isModerator,
};
