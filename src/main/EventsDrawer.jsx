import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { formatNotificationTitle, formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { eventsActions } from '../store';

const useStyles = makeStyles()((theme) => ({
  drawer: {
    width: theme.dimensions.eventsDrawerWidth,
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    ...(theme.palette.mode === 'dark' && {
      borderBottom: '1px solid rgba(59, 130, 246, 0.12)',
      background:
        'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(99, 102, 241, 0.06) 100%)',
    }),
  },
  title: {
    flexGrow: 1,
  },
}));

const EventsDrawer = ({ open, onClose }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const events = useSelector((state) => state.events.items);

  const formatType = (event) =>
    formatNotificationTitle(t, {
      type: event.type,
      attributes: {
        alarms: event.attributes.alarm,
      },
    });

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Toolbar className={classes.toolbar} disableGutters>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <NotificationsActiveIcon fontSize="small" color="primary" />
          <Typography variant="h6" className={classes.title}>
            {t('reportEvents')}
          </Typography>
        </Box>
        <IconButton
          size="small"
          color="inherit"
          onClick={() => dispatch(eventsActions.deleteAll())}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Toolbar>
      <List className={classes.drawer} dense>
        {events.map((event) => (
          <ListItemButton
            key={event.id}
            onClick={() => navigate(`/event/${event.id}`)}
            disabled={!event.id}
          >
            <ListItemText
              primary={`${devices[event.deviceId]?.name} • ${formatType(event)}`}
              secondary={formatTime(event.eventTime, 'seconds')}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(eventsActions.delete(event));
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default EventsDrawer;
