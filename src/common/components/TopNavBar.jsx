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
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Map, BarChart3, Settings2, CircleUser, LogOut, MapPin, Bell, Wrench, Users, Terminal, Menu as MenuIcon, X } from 'lucide-react';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useAdministrator, useManager, useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';
import useFeatures from '../util/useFeatures';

const NAV_ICON_SIZE = 15;
const NAV_STROKE = 1.75;
const DRAWER_WIDTH = 240;

const useStyles = makeStyles()((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 2,
    background: theme.palette.mode === 'dark' ? '#0b1628' : '#1a56db',
    borderBottom:
      theme.palette.mode === 'dark'
        ? '1px solid rgba(59, 130, 246, 0.14)'
        : 'none',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.35)',
    width: '100%',
    overflowX: 'hidden',
    '@media print': {
      display: 'none',
    },
  },
  toolbar: {
    minHeight: `${theme.dimensions.topNavBarHeight}px !important`,
    maxHeight: `${theme.dimensions.topNavBarHeight}px`,
    padding: theme.spacing(0, 1.5),
    gap: 0,
    flexWrap: 'nowrap',
    overflowX: 'hidden',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
    marginRight: theme.spacing(2.5),
    flexShrink: 0,
    userSelect: 'none',
    cursor: 'default',
  },
  brandSimpo: {
    fontSize: '0.6875rem',
    fontWeight: 400,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(147, 197, 253, 0.85)',
  },
  brandTracker: {
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#fff',
    marginTop: '-1px',
  },
  navButton: {
    color: 'rgba(255, 255, 255, 0.72)',
    textTransform: 'none',
    minWidth: 'auto',
    height: 48,
    padding: theme.spacing(0, 1.75),
    gap: theme.spacing(0.5),
    borderRadius: 0,
    fontSize: '0.8rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    borderBottom: '2px solid transparent',
    transition: 'color 0.15s ease, background 0.15s ease, border-color 0.15s ease',
    whiteSpace: 'nowrap',
    '&:hover': {
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.08)',
      borderBottom: '2px solid rgba(255, 255, 255, 0.35)',
    },
  },
  navButtonActive: {
    color: '#fff',
    fontWeight: 600,
    borderBottom: '2px solid #60a5fa',
    background: 'rgba(96, 165, 250, 0.12)',
    '&:hover': {
      background: 'rgba(96, 165, 250, 0.18)',
      borderBottom: '2px solid #60a5fa',
    },
  },
  accountButton: {
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'none',
    minWidth: 'auto',
    height: 32,
    padding: theme.spacing(0, 1.25),
    gap: theme.spacing(0.6),
    borderRadius: theme.spacing(0.5),
    fontSize: '0.8125rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.35)',
    },
  },
  hamburger: {
    color: '#fff',
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(0.75),
  },
  navDrawerPaper: {
    width: DRAWER_WIDTH,
    top: `${theme.dimensions.topNavBarHeight}px`,
    height: `calc(100% - ${theme.dimensions.topNavBarHeight}px)`,
    background: theme.palette.mode === 'dark' ? '#0b1628' : '#1565c0',
    borderRight: 'none',
  },
  drawerItem: {
    color: 'rgba(255,255,255,0.78)',
    borderLeft: '3px solid transparent',
    '&:hover': {
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
    },
  },
  drawerItemActive: {
    color: '#fff',
    background: 'rgba(96, 165, 250, 0.15)',
    borderLeft: '3px solid #60a5fa',
    '&:hover': {
      background: 'rgba(96, 165, 250, 0.2)',
    },
  },
  drawerIcon: {
    color: 'inherit',
    minWidth: 36,
  },
  drawerItemText: {
    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },
}));

const TopNavBar = () => {
  const { classes, cx } = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();
  const features = useFeatures();

  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const manager = useManager();
  const admin = useAdministrator();

  const devices = useSelector((state) => state.devices.items);
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentSelection = () => {
    const p = location.pathname;
    if (p === '/geofences' || p.startsWith('/settings/geofence')) return 'geofences';
    if (p.startsWith('/settings/notification')) return 'notifications';
    if (p.startsWith('/settings/maintenance')) return 'maintenance';
    if (p.startsWith('/settings/command')) return 'commands';
    if (
      p.startsWith('/settings/users') ||
      (p.startsWith('/settings/user') && p !== `/settings/user/${user.id}`)
    ) return 'users';
    if (p === `/settings/user/${user.id}`) return 'account';
    if (p.startsWith('/settings')) return 'settings';
    if (p.startsWith('/reports')) return 'reports';
    if (p === '/') return 'map';
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
    navigate(id != null ? `/reports/combined?deviceId=${id}` : '/reports/combined');
  };

  const active = currentSelection();

  const navItems = [
    {
      value: 'map',
      icon: (
        <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
          <Map size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />
        </Badge>
      ),
      label: 'Monitor',
      onClick: () => navigate('/'),
      show: true,
    },
    {
      value: 'geofences',
      icon: <MapPin size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />,
      label: t('sharedGeofences'),
      onClick: () => navigate('/geofences'),
      show: !readonly,
    },
    {
      value: 'notifications',
      icon: <Bell size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />,
      label: t('sharedNotifications'),
      onClick: () => navigate('/settings/notifications'),
      show: !readonly,
    },
    {
      value: 'reports',
      icon: <BarChart3 size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />,
      label: t('reportTitle'),
      onClick: handleReports,
      show: !disableReports,
    },
    {
      value: 'maintenance',
      icon: <Wrench size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />,
      label: t('sharedMaintenance'),
      onClick: () => navigate('/settings/maintenances'),
      show: !readonly && !features.disableMaintenance,
    },
    {
      value: 'commands',
      icon: <Terminal size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />,
      label: t('sharedSavedCommands'),
      onClick: () => navigate('/settings/commands'),
      show: !readonly && !features.disableSavedCommands,
    },
    {
      value: 'users',
      icon: <Users size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />,
      label: t('settingsUsers'),
      onClick: () => navigate('/settings/users'),
      show: manager,
    },
    {
      value: 'settings',
      icon: <Settings2 size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />,
      label: t('settingsTitle'),
      onClick: () => navigate('/settings/preferences?menu=true'),
      show: true,
    },
  ];

  const NavBtn = ({ value, icon, label, onClick }) => (
    <Button
      className={cx(classes.navButton, active === value && classes.navButtonActive)}
      onClick={onClick}
      startIcon={icon}
    >
      {label}
    </Button>
  );

  return (
    <>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          {mobile && (
            <IconButton className={classes.hamburger} onClick={() => setDrawerOpen((v) => !v)}>
              {drawerOpen ? <X size={20} strokeWidth={NAV_STROKE} /> : <MenuIcon size={20} strokeWidth={NAV_STROKE} />}
            </IconButton>
          )}

          {/* Brand wordmark */}
          <Box className={classes.brand}>
            <span className={classes.brandSimpo}>Simpo</span>
            <span className={classes.brandTracker}>Tracker</span>
          </Box>

          {/* Desktop nav buttons */}
          {!mobile && navItems.filter((i) => i.show).map((item) => (
            <NavBtn
              key={item.value}
              value={item.value}
              icon={item.icon}
              label={item.label}
              onClick={item.onClick}
            />
          ))}

          <Box sx={{ flexGrow: 1, minWidth: 8 }} />

          {/* Account / Logout — always visible */}
          {readonly ? (
            <Button
              className={classes.accountButton}
              onClick={handleLogout}
              startIcon={<LogOut size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />}
            >
              {!mobile && t('loginLogout')}
            </Button>
          ) : (
            <Button
              className={cx(classes.accountButton, active === 'account' && classes.navButtonActive)}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              startIcon={<CircleUser size={NAV_ICON_SIZE} strokeWidth={NAV_STROKE} />}
            >
              {!mobile && (user?.name || t('settingsUser'))}
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

      {/* Mobile slide-out navigation drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobile && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ className: classes.navDrawerPaper }}
        sx={{ zIndex: theme.zIndex.drawer + 1 }}
      >
        <List disablePadding>
          {navItems.filter((i) => i.show).map((item, idx) => (
            <div key={item.value}>
              {idx > 0 && item.value === 'settings' && <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />}
              <ListItemButton
                className={cx(classes.drawerItem, active === item.value && classes.drawerItemActive)}
                onClick={() => { item.onClick(); setDrawerOpen(false); }}
              >
                <ListItemIcon className={classes.drawerIcon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} className={classes.drawerItemText} />
              </ListItemButton>
            </div>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default TopNavBar;
