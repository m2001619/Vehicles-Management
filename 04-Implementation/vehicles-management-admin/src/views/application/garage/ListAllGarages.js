import React, { useCallback, useLayoutEffect, useState } from 'react';

// material-ui
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
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
import { createStyles, styled, useTheme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';

// third-party
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

// project imports
import TableLoader from '../../../ui-component/TabelLoader';
import { convertToExcel } from '../../../utils/xlsx';
import ApiConfigs from '../../../api/apiConfigs';
import { gridSpacing } from '../../../store/constant';
import { handleRequestError } from '../../../utils/RequestHandler';

// assets
import { toast } from 'react-toastify';
import { BiBlock, BiSolidShow } from 'react-icons/bi';
import { MdEdit } from 'react-icons/md';
import { IconSearch } from '@tabler/icons-react';
import { FaTrashCan } from 'react-icons/fa6';
import { SiMicrosoftexcel } from 'react-icons/si';
import { IoAddCircleSharp } from 'react-icons/io5';

const ListAllGarages = () => {
  const token = sessionStorage.getItem('token');
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();
  const MySwal = withReactContent(Swal);

  const [state, setState] = useState({
    garageList: [],
    limit: 5,
    page: 0,
    count: 0,
    searchText: '',
    isLoading: false
  });
  const { limit, page, searchText, garageList, count, isLoading } = state;
  const updateState = (data) => setState((prevState) => ({ ...prevState, ...data }));

  // Get All Users Function
  const getAllGarages = useCallback(async () => {
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.Garage.getAllGarages,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit,
          page: page + 1
        }
      });
      if (res.status === 200) {
        updateState({ garageList: res.data.data, count: res.data.length });
      }
    } catch (e) {
      handleRequestError(e, t);
    }
    updateState({ isLoading: false });
  }, [page, limit, token, t]);

  useLayoutEffect(() => {
    getAllGarages().catch(console.error);
  }, [getAllGarages]);

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Box sx={classes.headerContainer}>
          <Typography variant={'h3'}>{t('Garages')}</Typography>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginLeft: 5
            }}
          >
            {SearchGarage()}
            {ExcelFile()}
          </Box>
        </Box>
        {isLoading ? <TableLoader /> : TableInfo()}
        {Pagination()}
      </Paper>
    </Grid>
  );

  function TableInfo() {
    return (
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('Garage Profile')}</TableCell>
              <TableCell align={'center'}>{t('Address')}</TableCell>
              <TableCell align={'center'}>{t('Phone Number')}</TableCell>
              <TableCell align={'center'}>{t('Vehicles')}</TableCell>
              <TableCell align={'center'}>{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {garageList.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </TableCell>
                <TableCell>{GarageInfo(row)}</TableCell>
                <TableCell align={'center'}>
                  <Typography sx={theme.typography.caption}>{row?.address}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{row?.phoneNumber}</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography>{row?.vehicles.length}</Typography>
                </TableCell>
                <TableCell align={'center'}>{GarageActions(row)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

  function GarageActions(item) {
    const isBlock = item?.status === 'BLOCK';

    const onDeleteGarage = async () => {
      try {
        const result = await MySwal.fire({
          title: <Typography sx={theme.typography.h4}>{t('Do you want to delete this garage?')}</Typography>,
          text: t('This will delete all the archive and the bills that belong to this garage'),
          showCancelButton: true,
          confirmButtonText: t('Yes'),
          cancelButtonText: t('Cancel'),
          confirmButtonColor: theme.palette.secondary.main,
          focusConfirm: true
        });
        if (result.isConfirmed) {
          await deleteGarage(item._id);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const viewGarage = () =>
      navigate('/application/garage/view-garage/' + item?._id, {
        state: {
          item,
          isView: true
        }
      });

    const editGarage = () =>
      navigate('/application/garage/edit-garage/' + item?._id, {
        state: {
          item,
          isEdit: true
        }
      });

    return (
      <Box>
        <IconButton aria-label="edit-vehicle" title={t('Edit Garage')} onClick={editGarage}>
          <MdEdit size={20} color={theme.palette.success.dark} />
        </IconButton>
        <IconButton title={t('View Garage')} color={'info'} onClick={viewGarage}>
          <BiSolidShow size={20} />
        </IconButton>
        {item?.vehicles.length === 0 && (
          <>
            <IconButton
              title={t(`${!isBlock ? 'Block' : 'Active'} Garage`)}
              color={!isBlock ? 'error' : 'success'}
              onClick={() => blockActiveGarage(item._id)}
            >
              {!isBlock ? <BiBlock size={20} /> : <IoAddCircleSharp size={20} />}
            </IconButton>
            <IconButton title={t('Delete Garage')} color={'error'} onClick={() => onDeleteGarage()}>
              <FaTrashCan size={20} />
            </IconButton>
          </>
        )}
      </Box>
    );
  }

  function GarageInfo(item) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img alt={'user'} src={item?.photo} style={{ width: 40, height: 40, borderRadius: '50%' }} />
        <Box>
          <Typography sx={theme.typography.subtitle1}>{item.name}</Typography>
        </Box>
      </Box>
    );
  }

  function SearchGarage() {
    const onChange = (e) => updateState({ searchText: e.target.value });
    return (
      <OutlineInputStyle
        id="input-search-header"
        value={searchText}
        onChange={onChange}
        placeholder={t('Search')}
        startAdornment={
          <InputAdornment position="start">
            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
          </InputAdornment>
        }
      />
    );
  }

  function ExcelFile() {
    const filterList = garageList.map((item) => ({
      [t('Name')]: item.name,
      [t('Address')]: item.address,
      [t('Phone Number')]: item.phoneNumber,
      [t('Vehicles Count')]: item.vehicles.length
    }));
    const onClick = () => convertToExcel(filterList, t('List All Garages'));
    return (
      <IconButton title={t('Convert To Excel')} color={'primary'} onClick={onClick}>
        <SiMicrosoftexcel size={20} color={theme.palette.success.dark} />
      </IconButton>
    );
  }

  async function blockActiveGarage(garageId) {
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.Garage.blockActiveGarage + garageId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        toast.success(t(res.data.message));
        await getAllGarages();
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }

  async function deleteGarage(garageId) {
    try {
      const res = await axios({
        method: 'DELETE',
        url: ApiConfigs.Garage.deleteGarage + garageId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 204) {
        toast.success(t('Deleted Successfully'));
        await getAllGarages();
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }
};

export default ListAllGarages;

const useStyles = createStyles(() => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingBottom: 3
  }
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
  width: 250,
  height: 45,
  marginLeft: 16,
  paddingLeft: 16,
  paddingRight: 16,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('md')]: {
    width: 200,
    marginLeft: 4,
    background: '#fff'
  }
}));
