import { useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// material-ui
import { Box, Grid, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import ApiConfigs from '../../../api/apiConfigs';
import { initializeMessage, onMessageListener } from '../../../utils/Notification';
import ChangePassword from './ChangePassword';
import HandleContent from './HandleContent';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const { t } = useTranslation();

  useEffect(() => {
    getGarageSelector().catch(console.error);
    getVehicleSelector().catch(console.error);
    getUserSelector().catch(console.error);
    initializeMessage(t).catch(console.error);
    handleNotification().catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item sm={6} xs={12}>
        <Grid container spacing={gridSpacing}>
          <HandleContent />
        </Grid>
      </Grid>
      <Grid item sm={6} xs={12}>
        <Grid container spacing={gridSpacing}>
          <ChangePassword />
        </Grid>
      </Grid>
    </Grid>
  );

  // Handle Notification
  async function handleNotification() {
    try {
      const payload = await onMessageListener();
      const message = { title: payload.notification.title, body: payload.notification.body };
      toast.info(
        <>
          <Box>
            <Typography variant={'h4'}>{message.title}</Typography>
            <Typography variant={'h6'}>{message.body}</Typography>
          </Box>
        </>
      );
    } catch (e) {
      console.log('Error in handleNotification');
      console.log(e);
    }
  }

  // Get All Garages Function
  async function getGarageSelector() {
    const token = sessionStorage.getItem('token');
    try {
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.Garage.getAllGarages,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          fields: 'name'
        }
      });
      if (res.status === 200) {
        const garageSelectorArr = res.data.data.map((i) => ({ name: i.name, value: i._id }));
        sessionStorage.setItem('garageSelectorArr', JSON.stringify(garageSelectorArr));
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Get All Garages Function
  async function getUserSelector() {
    const token = sessionStorage.getItem('token');
    try {
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.User.getAllUser,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          fields: 'name'
        }
      });
      if (res.status === 200) {
        const userSelectorArr = res.data.data.map((i) => ({ name: i.name, value: i._id }));
        sessionStorage.setItem('userSelectorArr', JSON.stringify(userSelectorArr));
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Get All Garages Function
  async function getVehicleSelector() {
    const token = sessionStorage.getItem('token');
    try {
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.Vehicle.getAllVehicles,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          fields: 'make model year'
        }
      });
      if (res.status === 200) {
        const vehicleSelectorArr = res.data.data.map((i) => ({
          name: `${i.make} ${i.model} ${i.year}`,
          value: i._id
        }));
        sessionStorage.setItem('vehicleSelectorArr', JSON.stringify(vehicleSelectorArr));
      }
    } catch (e) {
      console.log(e);
    }
  }
};

export default Dashboard;
