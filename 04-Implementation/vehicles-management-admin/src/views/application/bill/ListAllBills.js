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
import moment from 'moment/moment';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

// project imports
import { gridSpacing } from '../../../store/constant';
import ApiConfigs from '../../../api/apiConfigs';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import FilterBills from '../../../ui-component/Form/FilterInputs/FilterBills';
import TableLoader from '../../../ui-component/TabelLoader';
import { convertToExcel } from '../../../utils/xlsx';
import { handleRequestError } from '../../../utils/RequestHandler';

// assets
import { toast } from 'react-toastify';
import { FiFilter } from 'react-icons/fi';
import { SiMicrosoftexcel } from 'react-icons/si';
import { MdEdit } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
import { BiSolidShow } from 'react-icons/bi';

const ListAllBills = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const MySwal = withReactContent(Swal);
  const { t } = useTranslation();
  const classes = useStyles();

  // React-Hook-form for handling the form's inputs
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      vehicle: 'All Vehicle',
      user: 'All User',
      fuelType: 'All Fuel',
      fuelVolume: {
        min: '',
        max: ''
      },
      price: {
        min: '',
        max: ''
      },
      date: {
        min: '2000-01-01T00:00',
        max: '2100-01-01T00:00'
      },
      station: '',
      note: ''
    }
  });

  const [state, setState] = useState({
    billList: [],
    limit: 5,
    page: 0,
    count: 0,
    showFilter: false,
    isLoading: false
  });
  const { limit, page, billList, count, showFilter, isLoading } = state;
  const updateState = (data) => setState((prevState) => ({ ...prevState, ...data }));

  // Get All Bills Function
  const getAllBills = handleSubmit(async (data) => {
    updateState({ isLoading: true });
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.FuelBill.getAllFuelBill,
        headers: { Authorization: `Bearer ${token}` },
        params: handleParams(data)
      });
      if (res.status === 200) {
        updateState({ billList: res.data.data, count: res.data.length });
      }
    } catch (e) {
      handleRequestError(e, t);
    }
    updateState({ isLoading: false });
  });

  useLayoutEffect(() => {
    getAllBills().catch(console.error);
  }, [page, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Start Main Return */

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Box sx={classes.headerContainer}>
          <Typography variant={'h3'}>{t('Bills')}</Typography>
          <Box display={'flex'} alignItems={'center'} gap={2}>
            {Filter()}
            {ExcelFile()}
          </Box>
        </Box>
        <FilterBills
          control={control}
          register={register}
          showFilter={showFilter}
          clickReset={() => {
            reset();
            getAllBills().catch(console.error);
          }}
          clickFilter={getAllBills}
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
              <TableCell align={'center'}>{t('Fuel Type')}</TableCell>
              <TableCell align={'center'}>{t('Fuel Volume')}</TableCell>
              <TableCell align={'center'}>{t('Price')}</TableCell>
              <TableCell align={'center'}>{t('Station')}</TableCell>
              <TableCell align={'center'}>{t('Date')}</TableCell>
              <TableCell align={'center'}>{t('Note')}</TableCell>
              <TableCell align={'center'}>{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billList.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell component="th" scope="row">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </TableCell>
                <TableCell align={'center'}>{handleInfo(item.user.photo, item.user.name)}</TableCell>
                <TableCell align={'center'}>
                  {handleInfo(item.vehicle.images[0], `${item.vehicle.make} ${item.vehicle.model} ${item.vehicle.year}`)}
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{t(item.fuelType)}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.fuelVolume}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.price}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.station}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{moment(item.date).format('DD/MM/YY hh:mm')}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{item.note}</Typography>
                </TableCell>
                <TableCell>{BillActions(item)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  function BillActions(item) {
    const onClickDelete = async () => {
      try {
        const result = await MySwal.fire({
          title: <Typography sx={theme.typography.h4}>{t('Do you want to delete this Bill?')}</Typography>,
          showCancelButton: true,
          confirmButtonText: t('Yes'),
          cancelButtonText: t('Cancel'),
          confirmButtonColor: theme.palette.secondary.main,
          focusCancel: true
        });
        if (result.isConfirmed) {
          await deleteBill(item._id);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const editArchive = () =>
      navigate('/application/bill/edit-bill/' + item?._id, {
        state: {
          item,
          isEdit: true
        }
      });

    return (
      <Box>
        <a href={item.picture} target={'_blank'} rel={'noreferrer'}>
          <IconButton aria-label="see-vehicle" title={t('View Bill')} color={'info'}>
            <BiSolidShow size={20} color={theme.palette.secondary.dark} />
          </IconButton>
        </a>
        <IconButton aria-label="edit-archive" title={t('Edit Bill')} onClick={editArchive}>
          <MdEdit size={20} color={theme.palette.success.dark} />
        </IconButton>
        <IconButton title={t('Delete Bill')} color={'error'} onClick={onClickDelete}>
          <FaTrashCan size={20} color={theme.palette.error.main} />
        </IconButton>
      </Box>
    );
  }

  function Filter() {
    const onClick = () => updateState({ showFilter: !showFilter });
    return (
      <AnimateButton>
        <IconButton title={t('Filter Archives')} color={'primary'} onClick={onClick}>
          <FiFilter size={20} color={theme.palette.primary.dark} />
        </IconButton>
      </AnimateButton>
    );
  }

  function handleInfo(image, name) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <img alt={'user'} src={image} style={{ width: 30, height: 30, borderRadius: '50%' }} />
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

  function ExcelFile() {
    const filterList = billList.map((item) => ({
      [t('User')]: item.user.name,
      [t('Vehicle')]: `${item.vehicle.make} ${item.vehicle.model} ${item.vehicle.year}`,
      [t('Fuel Type')]: t(item.fuelType),
      [t('Fuel Volume')]: t(item.fuelVolume),
      [t('Price')]: item.price,
      [t('Station')]: item.station,
      [t('Date')]: moment(item.date).format('DD/MM/YY hh:mm'),
      [t('Note')]: item.note
    }));
    const onClick = () => convertToExcel(filterList, t('List All Bills'));
    return (
      <IconButton title={t('Convert To Excel')} color={'primary'} onClick={onClick}>
        <SiMicrosoftexcel size={20} color={theme.palette.success.dark} />
      </IconButton>
    );
  }

  async function deleteBill(id) {
    const token = sessionStorage.getItem('token');
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: 'DELETE',
        url: ApiConfigs.FuelBill.delete + id,
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
    const { user, vehicle, fuelVolume, fuelType } = data;
    const reservationArchive = location.state?.reservationArchive;
    return {
      limit,
      page: page + 1,
      user: user !== 'All User' ? user : null,
      reservationArchive: reservationArchive ? reservationArchive : null,
      vehicle: vehicle !== 'All Vehicle' ? vehicle : null,
      fuelType: fuelType !== 'All Fuel' ? fuelType : null,
      fuelVolume: {
        gte: fuelVolume.min !== '' ? fuelVolume.min : null,
        lte: fuelVolume.max !== '' ? fuelVolume.max : null
      }
    };
  }
};

export default ListAllBills;

const useStyles = createStyles(() => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingBottom: 3
  }
}));
