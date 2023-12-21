import React, { useState } from 'react';

// material-ui
import { Grid, Paper, Typography } from '@mui/material';

// third-party
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// project imports
import { gridSpacing } from '../../../store/constant';
import CustomInput from '../../../ui-component/Form/Inputs/CustomInput';
import ApiConfigs from '../../../api/apiConfigs';
import FormButtons from '../../../ui-component/Form/Buttons/FormButtons';

// assets
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Yup inputs validation
  const schema = yup.object({
    currentPassword: yup.string().required(t('Enter current password')).min(8, t('Password must contain at least 8 characters')),
    newPassword: yup.string().required(t('Enter your password')).min(8, t('Password must contain at least 8 characters')),
    newPasswordConfirm: yup.string().oneOf([yup.ref('newPassword')], t('Passwords must match'))
  });

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange'
  });

  const onReset = () => reset();
  const onSubmit = handleSubmit(
    (data) => updatePassword(data),
    (errors) => console.log(errors)
  );

  return (
    <Grid item xs={12}>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Typography variant={'h3'}>{t('Change Password')}</Typography>
        <Grid container spacing={gridSpacing * 0.25} mt={1.5}>
          <Grid item xs={12}>
            <CustomInput control={control} label={t('Current Password')} type={'password'} name={'currentPassword'} />
          </Grid>
          <Grid item xs={12}>
            <CustomInput control={control} label={t('New Password')} type={'password'} name={'newPassword'} />
          </Grid>
          <Grid item xs={12}>
            <CustomInput control={control} label={t('Confirm New Password')} type={'password'} name={'newPasswordConfirm'} />
          </Grid>
          <FormButtons onReset={onReset} onSubmit={onSubmit} isLoading={isLoading} />
        </Grid>
      </Paper>
    </Grid>
  );

  async function updatePassword(data) {
    const token = sessionStorage.getItem('token');
    setIsLoading(true);
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.User.updatePassword,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data
      });
      if (res.status === 200) {
        sessionStorage.setItem('token', res.data.token);
        toast.success(t('Password has changed Successfully'));
      }
    } catch (e) {
      toast.error(t(e?.response?.data?.message));
    }
    setIsLoading(false);
  }
};

export default ChangePassword;
