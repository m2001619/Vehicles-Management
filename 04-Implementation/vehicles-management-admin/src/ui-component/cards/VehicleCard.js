import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// project imports
import ApiConfigs from '../../api/apiConfigs';
import { handleRequestError } from '../../utils/RequestHandler';

// assets
import { FaLocationDot, FaTrashCan } from 'react-icons/fa6';
import { MdEdit } from 'react-icons/md';
import { BiBlock, BiSolidShow } from 'react-icons/bi';
import { ImFilesEmpty } from 'react-icons/im';
import { IoAddCircleSharp, IoReturnUpBackOutline } from 'react-icons/io5';

const VehicleCard = ({ item, showRequests, getAllVehicles }) => {
  const token = sessionStorage.getItem('token');
  const vehicleId = item._id;
  const isBlock = item.status === 'BLOCK';
  const status = filterStatus(item);

  const MySwal = withReactContent(Swal);
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const returnVehicle = async () => {
    try {
      const result = await MySwal.fire({
        title: <Typography sx={theme.typography.h4}>{t('Do you want to return this vehicle?')}</Typography>,
        showCancelButton: true,
        confirmButtonText: t('Yes'),
        cancelButtonText: t('Cancel'),
        confirmButtonColor: theme.palette.secondary.main,
        focusConfirm: true
      });
      if (result.isConfirmed) {
        await acceptReturnVehicle();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDeleteVehicle = async () => {
    try {
      const result = await MySwal.fire({
        title: <Typography sx={theme.typography.h4}>{t('Do you want to delete this vehicle?')}</Typography>,
        text: t('This will delete all the archive and the bills that belong to this vehicle'),
        showCancelButton: true,
        confirmButtonText: t('Yes'),
        cancelButtonText: t('Cancel'),
        confirmButtonColor: theme.palette.secondary.main,
        focusConfirm: true
      });
      if (result.isConfirmed) {
        await deleteVehicle();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const editVehicle = () => navigate('/application/vehicle/edit-vehicle/' + item?._id, { state: { item, isEdit: true } });
  const viewVehicle = () => navigate('/application/vehicle/view-vehicle/' + item?._id, { state: { item, isView: true } });
  const viewLocation = () => navigate('/map/' + item?._id, { state: { item } });

  const InfoContent = (title, value) => (
    <Grid item sm={4} xs={6} sx={{ textAlign: 'center' }}>
      <Typography sx={theme.typography.caption}>{t(title)}</Typography>
      <Typography sx={{ ...theme.typography.h6 }}>{value}</Typography>
    </Grid>
  );

  return (
    <Card style={{ boxShadow: '0px 0px 5px 0px #ddd' }}>
      <CardMedia sx={{ height: 140 }} image={item?.images[0]} title={`${item?.make} ${item?.model} ${item?.year}`} />
      <CardHeader
        sx={{ padding: '10px' }}
        title={`${item?.make} ${item?.model} ${item?.year}`}
        subheader={
          <Box>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FaLocationDot size={14} color={theme.palette.grey.A700} />
              <Typography>{item?.garage?.name}</Typography>
            </Box>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ ...theme.typography.h6 }}>{t('Status')}:</Typography>
              <Typography sx={theme.typography.caption}>{t(status)}</Typography>
            </Box>
          </Box>
        }
      />
      <CardContent sx={{ padding: '10px' }}>
        <Grid container spacing={2}>
          {InfoContent('Engine Output', t(item?.engineOutput))}
          {InfoContent('Max Speed', `${item?.maxSpeed} ${t('km/h')}`)}
          {InfoContent('Capacity', `${item?.numSeats} ${t('Seats')}`)}
          {InfoContent('Fuel', t(item?.fuelType))}
          {InfoContent('Body', t(item?.bodyType))}
          {InfoContent('Transmission', t(item?.TransmissionType))}
        </Grid>
      </CardContent>
      <CardActions sx={{ py: 0.5, justifyContent: 'space-around', borderTop: '1px solid #ddd' }}>
        {status === 'requested' && (
          <IconButton aria-label="see-requests" title={t('See Requests')} color={'primary'} onClick={showRequests}>
            <ImFilesEmpty size={20} />
          </IconButton>
        )}
        {status === 'ask-to-return' && (
          <IconButton aria-label="return-vehicle" title={t('Return Vehicle')} color={'primary'} onClick={returnVehicle}>
            <IoReturnUpBackOutline size={20} />
          </IconButton>
        )}
        <IconButton aria-label="see-vehicle" title={t('See Vehicle')} color={'info'} onClick={viewVehicle}>
          <BiSolidShow size={20} />
        </IconButton>
        <IconButton aria-label="see-location" title={t('View Location')} color={'info'} onClick={viewLocation}>
          <FaLocationDot size={20} />
        </IconButton>
        {(status === 'available' || status === 'requested') && (
          <>
            <IconButton aria-label="edit-vehicle" title={t('Edit Vehicle')} color={'success'} onClick={editVehicle}>
              <MdEdit size={20} />
            </IconButton>
            <IconButton
              title={t(`${!isBlock ? 'Block' : 'Active'} Vehicle`)}
              color={!isBlock ? 'error' : 'success'}
              onClick={blockActiveVehicle}
            >
              {!isBlock ? <BiBlock size={20} /> : <IoAddCircleSharp size={20} />}
            </IconButton>
            <IconButton title={t('Delete Vehicle')} color={'error'} onClick={onDeleteVehicle}>
              <FaTrashCan size={20} />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );

  async function acceptReturnVehicle() {
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.Vehicle.acceptReturnVehicle + vehicleId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        toast.success(t(res.data.message));
        await getAllVehicles();
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }

  async function blockActiveVehicle() {
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.Vehicle.blockActiveVehicle + vehicleId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        toast.success(t(res.data.message));
        await getAllVehicles();
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }

  async function deleteVehicle() {
    try {
      const res = await axios({
        method: 'DELETE',
        url: ApiConfigs.Vehicle.deleteVehicle + vehicleId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 204) {
        toast.success(t('Deleted Successfully'));
        await getAllVehicles();
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }
};

VehicleCard.propTypes = {
  item: PropTypes.object,
  showRequests: PropTypes.func,
  getAllVehicles: PropTypes.func
};

function filterStatus(item) {
  if (item?.requests.length) {
    return 'requested';
  } else {
    return item?.usingStatus;
  }
}

export default VehicleCard;
