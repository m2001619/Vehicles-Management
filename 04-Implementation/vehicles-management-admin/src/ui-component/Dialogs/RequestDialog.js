import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import ApiConfigs from '../../api/apiConfigs';
import PropTypes from 'prop-types';
import TableLoader from '../TabelLoader';
import { toast } from 'react-toastify';

const RequestDialog = ({ open, onClose, vehicleId, getAllVehicles }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [state, setState] = useState({
    requestsArr: [],
    isLoading: false,
    selectedRequest: ''
  });
  const { requestsArr, isLoading, selectedRequest } = state;
  const updateState = (data) => setState((prevState) => ({ ...prevState, ...data }));

  const getVehicleRequests = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.Request.getVehicleRequests + vehicleId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        updateState({ requestsArr: res.data.data });
      }
    } catch (e) {
      console.log(e);
    }
    updateState({ isLoading: false });
  }, [vehicleId]);

  useLayoutEffect(() => {
    getVehicleRequests().catch(console.error);
  }, [getVehicleRequests]);

  /* Start Main Return */

  return (
    <Dialog open={open} fullWidth={true} maxWidth={'lg'} onClose={onClose}>
      {isLoading ? (
        <TableLoader />
      ) : (
        <>
          <DialogTitle sx={{ ...theme.typography.h3, textAlign: 'center' }}>{t('Select Request')}</DialogTitle>
          <RequestDialogContent />
          <DialogActions sx={{ pr: 5, pb: 3, gap: 2 }}>
            <Button variant={'outlined'} color={'secondary'} sx={{ py: 2 }} onClick={onClose}>
              <Typography>{t('Cancel')}</Typography>
            </Button>
            <Button onClick={acceptRequest} disabled={selectedRequest === ''} variant={'contained'} color={'primary'} sx={{ py: 2 }}>
              <Typography>{t('Accept Request')}</Typography>
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  /* End Main Return */

  function RequestDialogContent() {
    return (
      <DialogContent>
        <Grid container spacing={2} padding={2}>
          {requestsArr.map((item) => {
            const selectRequest = () => updateState({ selectedRequest: item._id });
            return (
              <Grid item lg={3} md={4} sm={6} xs={12} key={item._id}>
                <Box
                  sx={{
                    borderStyle: 'solid',
                    borderWidth: selectedRequest === item._id ? 2 : 1,
                    borderColor: selectedRequest === item._id ? theme.palette.secondary.dark : '#ddd',
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={selectRequest}
                >
                  <Typography>{item.user.name}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    );
  }

  async function acceptRequest() {
    const token = sessionStorage.getItem('token');
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.Request.acceptRequest + selectedRequest,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        onClose();
        await getAllVehicles();
      }
    } catch (e) {
      if (e.response.data.message) {
        toast.error(t(e.response.data.message));
      } else {
        toast.error(t('Network Error'));
        console.log(e);
      }
    }
    updateState({ isLoading: false });
  }
};

export default RequestDialog;

RequestDialog.propTypes = {
  open: PropTypes.bool,
  vehicleId: PropTypes.string,
  onClose: PropTypes.func,
  getAllVehicles: PropTypes.func
};
