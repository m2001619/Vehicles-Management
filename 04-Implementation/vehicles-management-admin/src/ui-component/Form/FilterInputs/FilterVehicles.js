import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// material-ui
import { Box, Button, Collapse, FormControl, Grid, Input, InputLabel, Typography } from '@mui/material';
import { bodyTypes, fuelTypes } from '../../../constans/constans';
import CustomSelectInput from '../SelectInputs/CustomSelectInput';

const FilterVehicles = ({ control, register, clickFilter, clickReset, showFilter = true }) => {
  const garageSelectorArr = JSON.parse(sessionStorage.getItem('garageSelectorArr'));
  const { t } = useTranslation();

  return (
    <Collapse in={showFilter} timeout={500} unmountOnExit>
      <Grid container spacing={2} sx={{ padding: 2, border: '1px solid #eee', borderRadius: 2, marginTop: 2 }}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Model')}</InputLabel>
            <Input {...register('model')} fullWidth placeholder={t('Model')} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Year')}</InputLabel>
            <Input {...register('year.min')} fullWidth placeholder={t('Min Year')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Year')}</InputLabel>
            <Input {...register('year.max')} fullWidth placeholder={t('Max Year')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Speed')}</InputLabel>
            <Input {...register('maxSpeed.min')} fullWidth placeholder={t('Min Speed')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Speed')}</InputLabel>
            <Input {...register('maxSpeed.max')} fullWidth placeholder={t('Max Speed')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Engine Output')}</InputLabel>
            <Input {...register('engineOutput.min')} fullWidth placeholder={t('Min Engine Output')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Engine Output')}</InputLabel>
            <Input {...register('engineOutput.max')} fullWidth placeholder={t('Max Engine Output')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <CustomSelectInput
            control={control}
            label={'Fuel Type'}
            name={'fuelType'}
            arr={[{ name: 'All Fuel', value: 'All Fuel' }, ...fuelTypes]}
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <CustomSelectInput
            control={control}
            label={'Body Type'}
            name={'bodyType'}
            arr={[{ name: 'All Body', value: 'All Body' }, ...bodyTypes]}
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <CustomSelectInput
            control={control}
            label={'Garage'}
            name={'garage'}
            arr={[{ name: 'All Garage', value: 'All Garage' }, ...garageSelectorArr]}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant={'outlined'} onClick={clickReset}>
              <Typography>{t('Reset')}</Typography>
            </Button>
            <Button variant={'contained'} color={'secondary'} onClick={clickFilter}>
              <Typography>{t('Filter')}</Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Collapse>
  );
};

export default FilterVehicles;

FilterVehicles.propTypes = {
  register: PropTypes.func.isRequired,
  control: PropTypes.object,
  watch: PropTypes.func,
  clickFilter: PropTypes.func,
  clickReset: PropTypes.func,
  showFilter: PropTypes.bool
};
