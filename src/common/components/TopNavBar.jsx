import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Badge,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Map, BarChart3, Settings2, CircleUser, LogOut } from 'lucide-react';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';

const NAV_ICON_SIZE = 18;
const NAV_STROKE = 1.75;

const useStyles = makeStyles()((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(4, 10, 23, 0.97)'
        : theme.palette.background.paper,
    backdropFilter: theme.palette.mode === 'dark' ? 'blur(20px)' : undefined,
    WebkitBackdropFilter: theme.palette.mode === 'dark' ? 'blur(20px)' : undefined,
    borderBottom:
      theme.palette.mode === 'dark'
        ? '1px solid rgba(59, 130, 246, 0.15)'
        : `1px solid ${theme.palette.divider}`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 4px 20px rgba(0, 0, 0, 0.4)'
        : theme.shadows[1],
    '@media print': {
      display: 'none',
    },
  },
  navButton: {
    color:
      theme.palette.mode === 'dark'
        ? 'rgba(147, 197, 253, 0.7)'
        : theme.palette.text.secondary,
    textTransform: 'none',
    minWidth: 'auto',
    padding: theme.spacing(0.75, 1.5),
    gap: theme.spacing(0.75),
    borderRadius: theme.spacing(1),
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    '&:hover': {
      color: theme.palette.mode === 'dark' ? '#93c5fd' : theme.palette.primary.main,
      background:
        theme.palette.mode === 'dark'
          ? 'rgba(59, 130, 246, 0.1)'
          : theme.palette.action.hover,
    },
  },
  navButtonActive: {
    color: theme.palette.mode === 'dark' ? '#60a5fa' : theme.palette.primary.main,
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.15)'
        : theme.palette.action.selected,
    '&:hover': {
      background:
        theme.palette.mode === 'dark'
          ? 'rgba(59, 130, 246, 0.2)'
          : theme.palette.action.selected,
    },
  },
}));

const TopNavBar = () => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const devices = useSelector((state) => state.devices.items);
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user.id}`) return 'account';
    if (location.pathname.startsWith('/settings')) return 'settings';
    if (location.pathname.startsWith('/reports')) return 'reports';
    if (location.pathname === '/') return 'map';
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

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
                ? tokens.filter((it) => it !== notificationToken).join(',')
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

  const handleReports = () => {
    let id = selectedDeviceId;
    if (id == null) {
      const deviceIds = Object.keys(devices);
      if (deviceIds.length === 1) {
        [id] = deviceIds;
      }
    }
    if (id != null) {
      navigate(`/reports/combined?deviceId=${id}`);
    } else {
      navigate('/reports/combined');
    }
  };

  const active = currentSelection();

  return (
    <AppBar position="static" className={classes.appBar} elevation={0} color="default">
      <Toolbar sx={{ gap: 0.5 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          className={cx(classes.navButton, active === 'map' && classes.navButtonActive)}
          onClick={() => navigate('/')}
          startIcon={
            <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
              <Map size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />
            </Badge>
          }
        >
          {t('mapTitle')}
        </Button>
        {!disableReports && (
          <Button
            className={cx(classes.navButton, active === 'reports' && classes.navButtonActive)}
            onClick={handleReports}
            startIcon={<BarChart3 size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />}
          >
            {t('reportTitle')}
          </Button>
        )}
        <Button
          className={cx(classes.navButton, active === 'settings' && classes.navButtonActive)}
          onClick={() => navigate('/settings/preferences?menu=true')}
          startIcon={<Settings2 size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />}
        >
          {t('settingsTitle')}
        </Button>
        {readonly ? (
          <Button
            className={classes.navButton}
            onClick={handleLogout}
            startIcon={<LogOut size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />}
          >
            {t('loginLogout')}
          </Button>
        ) : (
          <Button
            className={cx(classes.navButton, active === 'account' && classes.navButtonActive)}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            startIcon={<CircleUser size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />}
          >
            {t('settingsUser')}
          </Button>
        )}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleAccount}>
            <Typography color="textPrimary">{t('settingsUser')}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography color="error">{t('loginLogout')}</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
