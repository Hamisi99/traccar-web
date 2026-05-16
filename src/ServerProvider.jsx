import { useState } from 'react';
import { Alert, IconButton } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectAsync } from './reactHelper';
import { sessionActions } from './store';

const ServerProvider = ({ children }) => {
  const dispatch = useDispatch();

  const loaded = useSelector((state) => state.session.serverLoaded);
  const [error, setError] = useState(null);

  useEffectAsync(async () => {
    if (loaded || error) {
      return null;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch('/api/server', { signal: controller.signal });
      if (response.ok) {
        dispatch(sessionActions.updateServer(await response.json()));
      } else {
        const message = await response.text();
        throw Error(message || response.statusText);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Server configuration request timed out. Check the API connection and try again.');
      } else {
        setError(error.message);
      }
    } finally {
      window.clearTimeout(timeoutId);
    }
    return null;
  }, [error, loaded]);

  if (error) {
    return (
      <>
        <Alert
          severity="error"
          action={
            <IconButton color="inherit" size="small" onClick={() => setError(null)}>
              <ReplayIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
        {children}
      </>
    );
  }
  return children;
};

export default ServerProvider;
