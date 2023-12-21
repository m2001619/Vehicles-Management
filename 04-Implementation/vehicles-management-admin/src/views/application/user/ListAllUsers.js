import React, { useCallback, useLayoutEffect, useState } from 'react';

// material-ui
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { shouldForwardProp } from '@mui/system';
import { styled, useTheme, createStyles } from '@mui/material/styles';

// third-party
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// project imports
import TableLoader from '../../../ui-component/TabelLoader';
import { convertToExcel } from '../../../utils/xlsx';
import { gridSpacing } from '../../../store/constant';
import ApiConfigs from '../../../api/apiConfigs';
import { handleRequestError } from '../../../utils/RequestHandler';

// assets
import { IconSearch } from '@tabler/icons-react';
import { BiBlock } from 'react-icons/bi';
import { BsPersonFillAdd } from 'react-icons/bs';
import { IoAddCircleSharp } from 'react-icons/io5';
import { SiMicrosoftexcel } from 'react-icons/si';

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

const ListAllUsers = () => {
  const token = sessionStorage.getItem('token');
  const theme = useTheme();
  const { t } = useTranslation();
  const classes = useStyles(theme);
  const MySwal = withReactContent(Swal);

  const [state, setState] = useState({
    userList: [],
    searchText: '',
    limit: 5,
    page: 0,
    count: 0,
    selectedType: 'all',
    isLoading: false
  });
  const { userList, searchText, limit, page, count, selectedType, isLoading } = state;
  const updateState = (data) => setState((prevState) => ({ ...prevState, ...data }));

  // Get All Users Function
  const getAllUser = useCallback(async () => {
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.User.getAllUser,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          name: { regex: searchText, options: 'i' },
          block: selectedType === 'block' ? true : null,
          active: selectedType === 'active' ? true : null,
          role: selectedType === 'pending' ? { regex: 'pending-user' } : null,
          limit,
          page: page + 1
        }
      });
      if (res.status === 200) {
        updateState({ userList: res.data.data, count: res.data.length });
      }
    } catch (e) {
      handleRequestError(e, t);
    }
    updateState({ isLoading: false });
  }, [searchText, page, limit, selectedType, token, t]);

  useLayoutEffect(() => {
    getAllUser().catch(console.error);
  }, [getAllUser]);

  /* Main Return */

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Box sx={classes.headerContainer}>
          <Typography variant={'h3'}>{t('Users')}</Typography>
          <Box style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 5 }}>
            {SelectType()}
            {SearchUser()}
            {ExcelFile()}
          </Box>
        </Box>
        {isLoading ? <TableLoader /> : TableInfo()}
        {Pagination()}
      </Paper>
    </Grid>
  );

  /* Main Return  */

  function TableInfo() {
    return (
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('User Profile')}</TableCell>
              <TableCell align={'center'}>{t('Phone Number')}</TableCell>
              <TableCell>{t('Status')}</TableCell>
              <TableCell align={'center'}>{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </TableCell>
                <TableCell>{UserProfile(row)}</TableCell>
                <TableCell align={'center'}>
                  <Typography>{row?.phoneNumber}</Typography>
                </TableCell>
                <TableCell>{UserStatus(row?.role, row?.block)}</TableCell>
                <TableCell align={'center'}>{UserActions(row?._id, row?.block, row?.role === 'pending-user')}</TableCell>
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

  function UserActions(userId, isBlock, isPending) {
    const onClickBlock = async () => {
      try {
        const result = await MySwal.fire({
          title: <Typography sx={theme.typography.h4}>{t('Do you want to block this user?')}</Typography>,
          showCancelButton: true,
          confirmButtonText: t('Yes'),
          cancelButtonText: t('Cancel'),
          confirmButtonColor: theme.palette.secondary.main,
          focusCancel: true
        });
        if (result.isConfirmed) {
          await blockUser(userId);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const onClickActive = async () => {
      try {
        const result = await MySwal.fire({
          title: <Typography sx={theme.typography.h4}>{t('Do you want to active this user?')}</Typography>,
          showCancelButton: true,
          confirmButtonText: t('Yes'),
          cancelButtonText: t('Cancel'),
          confirmButtonColor: theme.palette.secondary.main,
          focusConfirm: true
        });
        if (result.isConfirmed) {
          await activeUser(userId);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const onClickAccept = async () => {
      try {
        const result = await MySwal.fire({
          title: <Typography sx={theme.typography.h4}>{t('Do you want to accept this user ?')}</Typography>,
          showCancelButton: true,
          confirmButtonText: t('Yes'),
          cancelButtonText: t('Cancel'),
          confirmButtonColor: theme.palette.secondary.main,
          focusConfirm: true
        });
        if (result.isConfirmed) {
          await acceptPendingUser(userId);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const button = isPending ? (
      <IconButton title={t('Accept User')} onClick={onClickAccept} color={'success'}>
        <BsPersonFillAdd size={20} />
      </IconButton>
    ) : isBlock ? (
      <IconButton title={t('Active User')} onClick={onClickActive} color={'success'}>
        <IoAddCircleSharp size={20} />
      </IconButton>
    ) : (
      <IconButton title={t('Block User')} onClick={onClickBlock} color={'error'}>
        <BiBlock size={20} />
      </IconButton>
    );

    return <Box>{button}</Box>;
  }

  function UserStatus(role, block) {
    let style = {};
    let status = 'Active';
    if (role === 'pending-user') {
      style.backgroundColor = theme.palette.warning.light;
      style.color = theme.palette.warning.dark;
      status = 'Pending';
    } else if (block) {
      style.backgroundColor = theme.palette.error.light;
      style.color = theme.palette.error.dark;
      status = 'Block';
    }
    return <Typography sx={{ ...classes.statusStyle, ...style }}>{t(status)}</Typography>;
  }

  function UserProfile(item) {
    const image = item?.photo ? item.photo : require('../../../assets/images/users/user.png');
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img alt={'user'} src={image} style={{ width: 40, height: 40, borderRadius: '50%' }} />
        <Box>
          <Typography sx={theme.typography.subtitle1}>{item.name}</Typography>
          <Typography sx={theme.typography.caption}>{item.email}</Typography>
        </Box>
      </Box>
    );
  }

  function SearchUser() {
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

  function SelectType() {
    const updateSelectedType = (e) => updateState({ selectedType: e.target.value });

    return (
      <FormControl style={{ width: 100 }}>
        <InputLabel id="demo-simple-select-label">{t('Type')}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedType}
          label={t('Type')}
          onChange={updateSelectedType}
        >
          <MenuItem value={'all'}>{t('All')}</MenuItem>
          <MenuItem value={'active'}>{t('Active')}</MenuItem>
          <MenuItem value={'block'}>{t('Block')}</MenuItem>
          <MenuItem value={'pending'}>{t('Pending')}</MenuItem>
        </Select>
      </FormControl>
    );
  }

  function ExcelFile() {
    const filterList = userList.map((item) => ({
      [t('Name')]: item.name,
      [t('Email')]: item.email,
      [t('Phone Number')]: item.phoneNumber,
      [t('Status')]: item.block ? t('Block') : item.role === 'pending-user' ? t('Pending') : t('Active')
    }));
    const onClick = () => convertToExcel(filterList, 'List All Users');
    return (
      <IconButton title={t('Convert To Excel')} color={'primary'} onClick={onClick}>
        <SiMicrosoftexcel size={20} color={theme.palette.success.dark} />
      </IconButton>
    );
  }

  async function blockUser(userId) {
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.User.blockUser + userId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        await getAllUser();
        toast.success(t(res.data.message));
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }

  async function activeUser(userId) {
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.User.activeUser + userId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        await getAllUser();
        toast.success(t(res.data.message));
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }

  async function acceptPendingUser(userId) {
    try {
      const res = await axios({
        method: 'POST',
        url: ApiConfigs.User.acceptPendingUser + userId,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        await getAllUser();
        toast.success(t(res.data.message));
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }
};

export default ListAllUsers;

const useStyles = createStyles((theme) => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingBottom: 3
  },
  statusStyle: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
    width: 'max-content',
    padding: 1,
    borderRadius: 2
  }
}));
