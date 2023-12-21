import React, { useState } from 'react';

// material-ui
import { Grid, Paper, Typography } from '@mui/material';

// third-party
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

// project imports
import { gridSpacing } from '../../../store/constant';
import CustomInput from '../../../ui-component/Form/Inputs/CustomInput';
import ApiConfigs from '../../../api/apiConfigs';
import FormButtons from '../../../ui-component/Form/Buttons/FormButtons';
import ImageInput from '../../../ui-component/Form/Inputs/ImageInput';
import { handleRequestError } from '../../../utils/RequestHandler';
import { SET_DEFAULT_CONTENT } from '../../../store/actions';

// assets
import { toast } from 'react-toastify';

const HandleContent = () => {
  const { t } = useTranslation();
  const defaultContent = useSelector((state) => state.customization.defaultContent);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Yup inputs validation
  const schema = yup.object({
    adminTitle: yup.string().required(t("Admin page's title is required")),
    appTitle: yup.string().required(t("App's title is required")),
    adminLogo: yup.object({
      uri: yup.string().required(t("Admin page's logo is required"))
    }),
    appLogo: yup.object({
      uri: yup.string().required(t("App's logo is required"))
    })
  });

  const {
    control,
    reset,
    handleSubmit,
    clearErrors,
    setError,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      adminTitle: defaultContent.adminTitle,
      appTitle: defaultContent.appTitle,
      adminLogo: { uri: defaultContent.adminLogo },
      appLogo: { uri: defaultContent.appLogo }
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
        <Typography variant={'h3'}>{t('Content Information')}</Typography>
        <Grid container spacing={gridSpacing * 0.25} mt={1.5}>
          <Grid item xs={12}>
            <CustomInput control={control} label={t("Admin page's title")} name={'adminTitle'} />
          </Grid>
          <Grid item xs={12}>
            <CustomInput control={control} label={t("App's title")} name={'appTitle'} />
          </Grid>
          <Grid item xs={12}>
            {ImageInput({
              errors: errors,
              value: watch('adminLogo').uri,
              setValue: (file, uri) => setValue('adminLogo', { uri, file }),
              clearErrors: clearErrors,
              setError: setError,
              errorMessage: "Admin page's logo is required",
              name: 'adminLogo',
              title: "Admin page's logo"
            })}
          </Grid>
          <Grid item xs={12}>
            {ImageInput({
              errors: errors,
              value: watch('appLogo').uri,
              setValue: (file, uri) => setValue('appLogo', { uri, file }),
              clearErrors: clearErrors,
              setError: setError,
              errorMessage: "App's logo is required",
              name: 'appLogo',
              title: "App's logo"
            })}
          </Grid>
          <FormButtons onReset={onReset} onSubmit={onSubmit} isLoading={isLoading} />
        </Grid>
      </Paper>
    </Grid>
  );

  async function updatePassword(data) {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    const formData = new FormData();
    formData.append('adminTitle', data.adminTitle);
    formData.append('appTitle', data.appTitle);
    formData.append('adminLogo', data.adminLogo.uri.includes('blob') ? data.adminLogo.file : data.adminLogo.uri);
    formData.append('appLogo', data.appLogo.uri.includes('blob') ? data.appLogo.file : data.appLogo.uri);
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.Content.edit + defaultContent._id,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: formData
      });
      if (res.status === 200) {
        sessionStorage.setItem('content', JSON.stringify(res.data.data));
        dispatch({ type: SET_DEFAULT_CONTENT, defaultContent: res.data.data });
        toast.success(t(`Edit Successfully`));
      }
    } catch (e) {
      handleRequestError(e, t);
    }
    setIsLoading(false);
  }
};

export default HandleContent;
