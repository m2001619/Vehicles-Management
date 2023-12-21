import React, { useLayoutEffect, useState } from 'react';

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
  Pagination,
  Paper,
  Select,
  Typography
} from '@mui/material';
import { createStyles, styled, useTheme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';

// third-party
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// project imports
import { gridSpacing } from '../../../store/constant';
import ApiConfigs from '../../../api/apiConfigs';
import VehicleCard from '../../../ui-component/cards/VehicleCard';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import FilterVehicles from '../../../ui-component/Form/FilterInputs/FilterVehicles';
import TableLoader from '../../../ui-component/TabelLoader';
import { convertToExcel } from '../../../utils/xlsx';
import RequestDialog from '../../../ui-component/Dialogs/RequestDialog';
import { handleRequestError } from '../../../utils/RequestHandler';

// assets
import { IconSearch } from '@tabler/icons-react';
import { FiFilter } from 'react-icons/fi';
import { SiMicrosoftexcel } from 'react-icons/si';

const ListAllVehicle = () => {
  const token = sessionStorage.getItem('token');
  const theme = useTheme();
  const { t } = useTranslation();
  const classes = useStyles(theme);

  // React-Hook-form for handling the form's inputs
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      model: '',
      year: {
        min: '',
        max: ''
      },
      maxSpeed: {
        min: '',
        max: ''
      },
      engineOutput: {
        min: '',
        max: ''
      },
      fuelType: 'All Fuel',
      bodyType: 'All Body',
      garage: 'All Garage'
    }
  });

  const [state, setState] = useState({
    vehiclesList: [],
    searchText: '',
    selectedStatus: 'all',
    limit: 4,
    page: 1,
    count: 0,
    showFilter: false,
    isLoading: false,
    showRequestDialog: false,
    requestVehicle: ''
  });
  const { vehiclesList, searchText, limit, page, count, selectedStatus, showFilter, isLoading, showRequestDialog, requestVehicle } = state;
  const updateState = (data) => setState((prevState) => ({ ...prevState, ...data }));

  const handleChangePage = (event, page) => {
    updateState({ page });
  };

  const getAllVehicles = handleSubmit(async (data) => {
    updateState({ isLoading: true });
    const { getAllVehicles, getRequestedVehicles } = ApiConfigs.Vehicle;
    const url = selectedStatus === 'requested' ? getRequestedVehicles : getAllVehicles;
    const { model, year, maxSpeed, engineOutput, bodyType, fuelType, garage } = data;
    try {
      const res = await axios({
        method: 'GET',
        url,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          make: { regex: searchText, options: 'i' },
          usingStatus: selectedStatus !== 'requested' && selectedStatus !== 'all' ? selectedStatus : null,
          limit,
          page,
          model: { regex: model, options: 'i' },
          engineOutput: {
            gte: engineOutput.min !== '' ? engineOutput.min : null,
            lte: engineOutput.max !== '' ? engineOutput.max : null
          },
          maxSpeed: {
            gte: maxSpeed.min !== '' ? maxSpeed.min : null,
            lte: maxSpeed.max !== '' ? maxSpeed.max : null
          },
          year: {
            gte: year.min !== '' ? year.min : null,
            lte: year.max !== '' ? year.max : null
          },
          bodyType: bodyType !== 'All Body' ? { regex: bodyType, options: 'i' } : null,
          fuelType: fuelType !== 'All Fuel' ? { regex: fuelType, options: 'i' } : null,
          garage: garage !== 'All Garage' ? garage : null
        }
      });
      if (res.status === 200) {
        updateState({ vehiclesList: res.data.data, count: +(res.data.length / limit).toFixed() });
      }
    } catch (e) {
      handleRequestError(e, t);
    }
    updateState({ isLoading: false });
  });

  useLayoutEffect(() => {
    getAllVehicles().catch(console.error);
  }, [searchText, limit, page, selectedStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Box sx={classes.headerContainer}>
          <Typography variant={'h3'}>{t('Vehicles')}</Typography>
          <Box sx={classes.headerOptionsStyle}>
            {SelectStatus()}
            {SearchVehicle()}
            {FilterVehicle()}
            {ExcelFile()}
          </Box>
        </Box>
        {FilterCollapse()}
        {isLoading ? <TableLoader /> : VehicleList()}
        <Pagination count={count} color="primary" onChange={handleChangePage} />
      </Paper>
      {showRequestDialog && (
        <RequestDialog
          getAllVehicles={getAllVehicles}
          open={showRequestDialog}
          vehicleId={requestVehicle}
          onClose={() => updateState({ showRequestDialog: false })}
        />
      )}
    </Grid>
  );

  function FilterCollapse() {
    const clickReset = () => {
      reset();
      getAllVehicles().catch(console.error);
    };

    return (
      <FilterVehicles control={control} clickFilter={getAllVehicles} clickReset={clickReset} register={register} showFilter={showFilter} />
    );
  }

  function VehicleList() {
    return (
      <Grid container spacing={2} sx={{ marginY: gridSpacing, marginX: 'auto', width: '100%' }}>
        {vehiclesList.map((item) => {
          const showRequests = () => updateState({ showRequestDialog: true, requestVehicle: item._id });
          return (
            <Grid item xl={3} lg={4} md={6} sm={6} xs={12} key={item._id}>
              <VehicleCard item={item} showRequests={showRequests} getAllVehicles={getAllVehicles} />
            </Grid>
          );
        })}
      </Grid>
    );
  }

  function FilterVehicle() {
    const onClick = () => updateState({ showFilter: !showFilter });
    return (
      <AnimateButton>
        <IconButton title={t('Filter Vehicles')} color={'primary'} onClick={onClick}>
          <FiFilter size={20} color={theme.palette.primary.dark} />
        </IconButton>
      </AnimateButton>
    );
  }

  function SearchVehicle() {
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

  function SelectStatus() {
    const updateSelectedType = (e) => updateState({ selectedStatus: e.target.value });

    return (
      <FormControl style={{ width: 150 }}>
        <InputLabel id="demo-simple-select-label">{t('Status')}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedStatus}
          label={t('Type')}
          onChange={updateSelectedType}
        >
          <MenuItem value={'all'}>{t('All')}</MenuItem>
          <MenuItem value={'available'}>{t('Available')}</MenuItem>
          <MenuItem value={'requested'}>{t('Requested')}</MenuItem>
          <MenuItem value={'in-use'}>{t('In Use')}</MenuItem>
          <MenuItem value={'ask-to-return'}>{t('Ask To Return')}</MenuItem>
        </Select>
      </FormControl>
    );
  }

  function ExcelFile() {
    const filterList = vehiclesList.map((item) => ({
      [t('Make')]: item.make,
      [t('Model')]: item.model,
      [t('Year')]: item.year,
      [t('Garage')]: item.garage.name,
      [t('Engine Output')]: item.engineOutput,
      [t('Max Speed')]: item.maxSpeed,
      [t('Capacity')]: item.numSeats,
      [t('Fuel Type')]: t(item.fuelType),
      [t('Body Type')]: t(item.bodyType),
      [t('Transmission Type')]: t(item.TransmissionType),
      [t('Features')]: item.features.join(', ')
    }));
    const onClick = () => convertToExcel(filterList, t('List All Vehicles'));
    return (
      <IconButton title={t('Convert To Excel')} color={'primary'} onClick={onClick}>
        <SiMicrosoftexcel size={20} color={theme.palette.success.dark} />
      </IconButton>
    );
  }
};

export default ListAllVehicle;

const useStyles = createStyles((theme) => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    borderBottom: '1px solid #eee',
    paddingBottom: 3,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  headerOptionsStyle: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    marginLeft: 0.5,
    [theme.breakpoints.down('md')]: {
      marginTop: 2
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 2
    }
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
