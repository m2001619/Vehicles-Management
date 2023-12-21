import React from 'react';
import { Box, Button, Collapse, FormControl, Grid, Input, InputLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CustomSelectInput from '../SelectInputs/CustomSelectInput';
import { fuelTypes } from '../../../constans/constans';
import { useTranslation } from 'react-i18next';

const FilterBills = ({ control, register, clickFilter, clickReset, showFilter = true }) => {
  const { t } = useTranslation();

  const userSelectorArr = JSON.parse(sessionStorage.getItem('userSelectorArr'));
  const vehicleSelectorArr = JSON.parse(sessionStorage.getItem('vehicleSelectorArr'));
  return (
    <Collapse in={showFilter} timeout={500} unmountOnExit>
      <Grid container spacing={2} sx={{ padding: 2, border: '1px solid #eee', borderRadius: 2, marginTop: 2 }}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <CustomSelectInput
            control={control}
            name={'user'}
            label={'User'}
            arr={[{ name: 'All User', value: 'All User' }, ...userSelectorArr]}
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <CustomSelectInput
            control={control}
            name={'vehicle'}
            label={'Vehicle'}
            arr={[{ name: 'All Vehicle', value: 'All Vehicle' }, ...vehicleSelectorArr]}
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <CustomSelectInput
            control={control}
            name={'fuelType'}
            label={'Fuel Type'}
            arr={[{ name: 'All Fuel', value: 'All Fuel' }, ...fuelTypes]}
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Fuel Volume')}</InputLabel>
            <Input {...register('fuelVolume.min')} fullWidth placeholder={t('Min Fuel Volume')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Fuel Volume')}</InputLabel>
            <Input {...register('fuelVolume.max')} fullWidth placeholder={t('Max Fuel Volume')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Price')}</InputLabel>
            <Input {...register('price.min')} fullWidth placeholder={t('Min Price')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Price')}</InputLabel>
            <Input {...register('price.max')} fullWidth placeholder={t('Max Price')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Station')}</InputLabel>
            <Input {...register('station')} fullWidth placeholder={t('Station')} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Date')}</InputLabel>
            <Input {...register('date.min')} fullWidth placeholder={t('Min Date')} type={'datetime-local'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Date')}</InputLabel>
            <Input {...register('date.max')} fullWidth placeholder={t('Max Date')} type={'datetime-local'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Note')}</InputLabel>
            <Input {...register('note')} fullWidth placeholder={t('Note')} />
          </FormControl>
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

export default FilterBills;

FilterBills.propTypes = {
  register: PropTypes.any,
  control: PropTypes.object,
  clickFilter: PropTypes.func,
  clickReset: PropTypes.func,
  showFilter: PropTypes.bool
};
