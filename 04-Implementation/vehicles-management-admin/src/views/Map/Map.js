import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Grid, Paper } from '@mui/material';

// third-party
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// project imports
import { gridSpacing } from '../../store/constant';
import { REACT_APP_GOOGLE_API_KEY } from '../../constans/constans';
import TableLoader from '../../ui-component/TabelLoader';
import { socket } from '../../api/apiConfigs';

const Map = () => {
  const location = useLocation();
  const vehicleData = location.state.item;
  const { i18n } = useTranslation();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_API_KEY,
    language: i18n.language
  });

  const [vehicleLocation, setVehicleLocation] = useState({
    lat: vehicleData.location.coordinates[0],
    lng: vehicleData.location.coordinates[1]
  });
  const { lat, lng } = vehicleLocation;

  useEffect(() => {
    if (vehicleData.user) {
      socket.on(`VEHICLE_LOCATION_CHANGED_${vehicleData._id}`, (data) =>
        setVehicleLocation({
          lat: data.location.coordinates[0],
          lng: data.location.coordinates[1]
        })
      );
    }
  }, [vehicleData._id, vehicleData.user]);

  window.addEventListener('popstate', function () {
    socket.off(`VEHICLE_LOCATION_CHANGED_${vehicleData._id}`);
  });

  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        {!isLoaded ? (
          <TableLoader />
        ) : (
          <GoogleMap mapContainerStyle={{ width: '100%', height: '500px' }} mapContainerClassName="map-container" center={center} zoom={16}>
            <Marker position={{ lat, lng }} />
          </GoogleMap>
        )}
      </Paper>
    </Grid>
  );
};

export default Map;
