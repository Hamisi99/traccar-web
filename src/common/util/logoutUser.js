import { sessionActions } from '../../store';
import { nativePostMessage } from '../components/NativeInterface';

const logoutUser = async ({ user, dispatch, navigate }) => {
  const notificationToken = window.localStorage.getItem('notificationToken');

  if (notificationToken && !user.readonly) {
    window.localStorage.removeItem('notificationToken');
    const tokens = user.attributes.notificationTokens?.split(',') || [];

    if (tokens.includes(notificationToken)) {
      const updatedUser = {
        ...user,
        attributes: {
          ...user.attributes,
          notificationTokens:
            tokens.length > 1
              ? tokens.filter((item) => item !== notificationToken).join(',')
              : undefined,
        },
      };

      await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
    }
  }

  await fetch('/api/session', { method: 'DELETE' });
  nativePostMessage('logout');
  navigate('/login');
  dispatch(sessionActions.updateUser(null));
};

export default logoutUser;
