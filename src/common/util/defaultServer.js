export const createDefaultServer = () => ({
  id: 0,
  attributes: {},
  registration: false,
  readonly: false,
  deviceReadonly: false,
  map: null,
  bingKey: null,
  mapUrl: null,
  overlayUrl: null,
  latitude: 0,
  longitude: 0,
  zoom: 0,
  twelveHourFormat: false,
  forceSettings: false,
  coordinateFormat: null,
  limitCommands: false,
  disableReports: false,
  fixedEmail: false,
  poiLayer: null,
  newServer: false,
  emailEnabled: false,
  openIdEnabled: false,
  openIdForce: false,
  announcement: '',
  version: '',
  textEnabled: false,
  geocoderEnabled: false,
});

export const mergeServer = (server = {}) => {
  const defaultServer = createDefaultServer();
  return {
    ...defaultServer,
    ...server,
    attributes: {
      ...defaultServer.attributes,
      ...(server.attributes || {}),
    },
  };
};
