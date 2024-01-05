import React, { useLayoutEffect, useState } from 'react';

// material-ui
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { createStyles, useTheme } from '@mui/material/styles';

// third-party
import axios from 'axios';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

// project imports
import { gridSpacing } from '../../../store/constant';
import ApiConfigs from '../../../api/apiConfigs';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import FilterArchives from '../../../ui-component/Form/FilterInputs/FilterArchive';
import TableLoader from '../../../ui-component/TabelLoader';
import { convertToExcel } from '../../../utils/xlsx';

// assets
import { toast } from 'react-toastify';
import { FiFilter } from 'react-icons/fi';
import { SiMicrosoftexcel } from 'react-icons/si';
import { MdEdit } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
import { IconReportMoney } from '@tabler/icons-react';
import { handleRequestError } from '../../../utils/RequestHandler';

const ListAllArchive = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const MySwal = withReactContent(Swal);
  const classes = useStyles();

  // React-Hook-form for handling the form's inputs
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      vehicle: 'All Vehicle',
      user: 'All User',
      garage: 'All Garage',
      departure: {
        from: '',
        odo: {
          min: '',
          max: ''
        },
        time: {
          min: '2000-01-01T00:00',
          max: '2100-01-01T00:00'
        }
      },
      arrival: {
        to: '',
        odo: {
          min: '',
          max: ''
        },
        time: {
          min: '2000-01-01T00:00',
          max: '2100-01-01T00:00'
        }
      },
      note: ''
    }
  });

  const [state, setState] = useState({
    archiveList: [],
    limit: 5,
    page: 0,
    count: 0,
    showFilter: false,
    isLoading: false
  });
  const { limit, page, archiveList, count, showFilter, isLoading } = state;
  const updateState = (data) => setState((prevState) => ({ ...prevState, ...data }));

  // Get All Archive Function
  const getAllReservations = handleSubmit(async (data) => {
    updateState({ isLoading: true });
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.ReservationArchive.getAllReservations,
        headers: { Authorization: `Bearer ${token}` },
        params: handleParams(data)
      });
      if (res.status === 200) {
        updateState({ archiveList: res.data.data, count: res.data.length });
      }
    } catch (e) {
      handleRequestError(e, t);
    }
    updateState({ isLoading: false });
  });

  useLayoutEffect(() => {
    getAllReservations().catch(console.error);
  }, [page, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Main Return */

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Box sx={classes.headerContainer}>
          <Typography variant={'h3'}>{t('Archives')}</Typography>
          <Box display={'flex'} alignItems={'center'} gap={2}>
            {Filter()}
            {ExcelFile()}
          </Box>
        </Box>
        <FilterArchives
          control={control}
          register={register}
          showFilter={showFilter}
          clickReset={() => {
            reset();
            getAllReservations().catch(console.error);
          }}
          clickFilter={getAllReservations}
        />
        {isLoading ? <TableLoader /> : InfoTable()}
        {Pagination()}
      </Paper>
    </Grid>
  );

  /* End Main Return */

  function InfoTable() {
    return (
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align={'center'}>{t('User')}</TableCell>
              <TableCell align={'center'}>{t('Vehicle')}</TableCell>
              <TableCell align={'center'}>{t('Garage')}</TableCell>
              <TableCell align={'center'}>{t('From')}</TableCell>
              <TableCell align={'center'}>{t('To')}</TableCell>
              <TableCell align={'center'}>{t('Departure Date')}</TableCell>
              <TableCell align={'center'}>{t('Departure Odo')}</TableCell>
              <TableCell align={'center'}>{t('Arrival Date')}</TableCell>
              <TableCell align={'center'}>{t('Arrival Odo')}</TableCell>
              <TableCell align={'center'}>{t('Bills')}</TableCell>
              <TableCell align={'center'}>{t('Note')}</TableCell>
              <TableCell align={'center'}>{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {archiveList.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell component="th" scope="row">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </TableCell>
                <TableCell align={'center'}>{handleInfo(item.user.photo, item.user.name)}</TableCell>
                <TableCell align={'center'}>
                  {handleInfo(item.vehicle.images[0], `${item.vehicle.make} ${item.vehicle.model} ${item.vehicle.year}`)}
                </TableCell>
                <TableCell align={'center'}>{handleInfo(item.garage.photo, item.garage.name)}</TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.departure?.from}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.arrival?.to}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{moment(item.departure?.time).format('DD/MM/YY hh:mm')}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.departure?.odo}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{moment(item.arrival?.time).format('DD/MM/YY hh:mm')}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.arrival?.odo}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.fuelBill.length}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.note}</Typography>
                </TableCell>
                <TableCell align={'center'}>{ArchiveActions(item)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  function Filter() {
    const onClick = () => updateState({ showFilter: !showFilter });
    return (
      <AnimateButton>
        <IconButton title={'Filter Archives'} color={'primary'} onClick={onClick}>
          <FiFilter size={20} color={theme.palette.primary.dark} />
        </IconButton>
      </AnimateButton>
    );
  }

  function handleInfo(image, name) {
    const src = image ? image : require('../../../assets/images/users/user.png');
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <img alt={'user'} src={src} style={{ width: 30, height: 30, borderRadius: '50%' }} />
        <Box>
          <Typography sx={theme.typography.h6}>{name}</Typography>
        </Box>
      </Box>
    );
  }

  function Pagination() {
    const handleChangePage = (event, page) => {
      updateState({ page });
    };

    const handleChangeRowsPerPage = (event) => {
      updateState({ limit: event.target.value });
      updateState({ page: 0 });
    };

    return (
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={count}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    );
  }

  function ArchiveActions(item) {
    const onClickDelete = async () => {
      try {
        const result = await MySwal.fire({
          title: <Typography sx={theme.typography.h4}>{t('Do you want to delete this archive?')}</Typography>,
          text: t('This well delete all the bills that belong to this !!'),
          showCancelButton: true,
          confirmButtonText: t('Yes'),
          cancelButtonText: t('Cancel'),
          confirmButtonColor: theme.palette.secondary.main,
          focusCancel: true
        });
        if (result.isConfirmed) {
          await deleteArchive(item._id);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const editArchive = () =>
      navigate('/application/archive/edit-archive/' + item?._id, {
        state: {
          item,
          isEdit: true
        }
      });

    const viewBills = () =>
      navigate('/application/bill/list-all-bills', {
        state: {
          reservationArchive: item._id
        }
      });

    return (
      <Box>
        {item.fuelBill.length > 0 && (
          <IconButton aria-label="view-bills" title={t('View Bills')} onClick={viewBills}>
            <IconReportMoney size={20} color={theme.palette.primary.dark} />
          </IconButton>
        )}
        <IconButton aria-label="edit-archive" title={t('Edit Archive')} onClick={editArchive}>
          <MdEdit size={20} color={theme.palette.success.dark} />
        </IconButton>
        <IconButton title={t('Delete Archive')} color={'error'} onClick={onClickDelete}>
          <FaTrashCan size={20} color={theme.palette.error.main} />
        </IconButton>
      </Box>
    );
  }

  function ExcelFile() {
    const filterList = archiveList.map((item) => ({
      [t('User')]: item.user.name,
      [t('Vehicle')]: `${item.vehicle.make} ${item.vehicle.model} ${item.vehicle.year}`,
      [t('Garage')]: item.garage.name,
      [t('From')]: item.departure.from,
      [t('To')]: item.arrival.to,
      [t('Departure Date')]: moment(item.departure?.time).format('DD/MM/YY hh:mm'),
      [t('Departure Odo')]: item.departure.odo,
      [t('Arrival Date')]: moment(item.arrival?.time).format('DD/MM/YY hh:mm'),
      [t('Arrival Odo')]: item.arrival.odo,
      [t('Bills')]: item.fuelBill.length,
      [t('Note')]: item.note
    }));
    const onClick = () => convertToExcel(filterList, t('List All Archives'));
    return (
      <IconButton title={t('Convert To Excel')} color={'primary'} onClick={onClick}>
        <SiMicrosoftexcel size={20} color={theme.palette.success.dark} />
      </IconButton>
    );
  }

  async function deleteArchive(id) {
    const token = sessionStorage.getItem('token');
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: 'DELETE',
        url: ApiConfigs.ReservationArchive.deleteArchive + id,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 204) {
        toast.success(t('Deleted Successfully'));
      }
    } catch (e) {
      handleRequestError(e, t);
    }
    updateState({ isLoading: false });
  }

  function handleParams(data) {
    const { garage, user, vehicle, departure, arrival, note } = data;
    return {
      limit,
      status: 'returned',
      page: page + 1,
      garage: garage !== 'All Garage' ? garage : null,
      user: user !== 'All User' ? user : null,
      vehicle: vehicle !== 'All Vehicle' ? vehicle : null,
      'departure.from': { regex: departure.from, options: 'i' },
      'departure.odo': {
        gte: departure.odo.min !== '' ? departure.odo.min : null,
        lte: departure.odo.max !== '' ? departure.odo.max : null
      },
      'arrival.to': { regex: arrival.to, options: 'i' },
      'departure.time': {
        gte: departure.time.min,
        lte: departure.time.max
      },
      'arrival.odo': {
        gte: arrival.odo.min !== '' ? arrival.odo.min : null,
        lte: arrival.odo.max !== '' ? arrival.odo.max : null
      },
      'arrival.time': {
        gte: arrival.time.min,
        lte: arrival.time.max
      },
      note: { regex: note, options: 'i' }
    };
  }
};

export default ListAllArchive;

const useStyles = createStyles(() => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingBottom: 3
  }
}));
