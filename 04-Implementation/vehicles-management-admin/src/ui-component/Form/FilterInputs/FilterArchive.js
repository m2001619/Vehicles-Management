import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Button, Collapse, FormControl, Grid, Input, InputLabel, Typography } from '@mui/material';

// third-party
import { useTranslation } from 'react-i18next';

// project imports
import CustomSelectInput from '../SelectInputs/CustomSelectInput';

const FilterArchives = ({ control, register, clickFilter, clickReset, showFilter = true }) => {
  const { t } = useTranslation();

  const garageSelectorArr = JSON.parse(sessionStorage.getItem('garageSelectorArr'));
  const userSelectorArr = JSON.parse(sessionStorage.getItem('userSelectorArr'));
  const vehicleSelectorArr = JSON.parse(sessionStorage.getItem('vehicleSelectorArr'));

  return (
    <Collapse in={showFilter} timeout={500} unmountOnExit>
      <Grid container spacing={2} sx={{ padding: 2, border: '1px solid #eee', borderRadius: 2, marginTop: 2 }}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <CustomSelectInput
            control={control}
            name={'garage'}
            label={'Garage'}
            arr={[{ name: 'All Garage', value: 'All Garage' }, ...garageSelectorArr]}
          />
        </Grid>
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
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('From')}</InputLabel>
            <Input {...register('departure.from')} fullWidth placeholder={t('From')} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Departure Odo')}</InputLabel>
            <Input {...register('departure.odo.min')} fullWidth placeholder={t('Min Departure Odo')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Departure Odo')}</InputLabel>
            <Input {...register('departure.odo.max')} fullWidth placeholder={t('Max Departure Odo')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Departure Date')}</InputLabel>
            <Input {...register('departure.time.min')} fullWidth type={'datetime-local'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Departure Date')}</InputLabel>
            <Input {...register('departure.time.max')} fullWidth type={'datetime-local'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('To')}</InputLabel>
            <Input {...register('arrival.to')} fullWidth placeholder={t('To')} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Arrival Odo')}</InputLabel>
            <Input {...register('arrival.odo.min')} fullWidth placeholder={t('Min Arrival Odo')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Arrival Odo')}</InputLabel>
            <Input {...register('arrival.odo.max')} fullWidth placeholder={t('Max Arrival Odo')} type={'number'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Min Arrival Date')}</InputLabel>
            <Input {...register('arrival.time.min')} fullWidth placeholder={t('Min Arrival Date')} type={'datetime-local'} />
          </FormControl>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>{t('Max Arrival Date')}</InputLabel>
            <Input {...register('arrival.time.max')} fullWidth placeholder={t('Max Arrival Date')} type={'datetime-local'} />
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

export default FilterArchives;

FilterArchives.propTypes = {
  register: PropTypes.any,
  control: PropTypes.object,
  clickFilter: PropTypes.func,
  clickReset: PropTypes.func,
  showFilter: PropTypes.bool
};
