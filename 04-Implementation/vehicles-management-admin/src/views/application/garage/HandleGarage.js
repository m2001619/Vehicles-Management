import React, { useState } from 'react';

// material-ui
import { Grid, Paper } from '@mui/material';

// third-party
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// project imports
import { gridSpacing } from '../../../store/constant';
import CustomInput from '../../../ui-component/Form/Inputs/CustomInput';
import ApiConfigs from '../../../api/apiConfigs';

// assets
import { toast } from 'react-toastify';
import ImageInput from '../../../ui-component/Form/Inputs/ImageInput';
import FormButtons from '../../../ui-component/Form/Buttons/FormButtons';

const HandleGarage = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const garageData = location.state?.item;
  const isEdit = location.state?.isEdit === true;
  const isView = location.state?.isView === true;

  // Yup inputs validation
  const schema = yup.object({
    name: yup.string().required(t('Enter Name')),
    address: yup.string().required(t('Enter Address')),
    phoneNumber: yup.string().required(t('Enter Phone Number')),
    photo: yup.object({
      uri: yup.string().required(t("Garage's image is required"))
    })
  });

  /* React Hook Form */
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: {
      name: isView || isEdit ? garageData.name : '',
      address: isView || isEdit ? garageData.address : '',
      phoneNumber: isView || isEdit ? garageData.phoneNumber : '',
      photo: isView || isEdit ? { uri: garageData.photo } : {}
    }
  });

  const setImage = (file, uri) => setValue('photo', { uri, file });
  const onReset = () => reset();
  const onSubmit = handleSubmit(
    (data) => createAndEditGarage(data),
    (errors) => console.log(errors)
  );

  /* Main Return */

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'name', label: 'Name', disabled: isView })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'address', label: 'Address', disabled: isView })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'phoneNumber', label: 'Phone Number', disabled: isView })}
          </Grid>
          <Grid item xs={12}>
            {ImageInput({
              disabled: isView,
              errors: errors,
              value: watch('photo').uri,
              setValue: setImage,
              clearErrors: clearErrors,
              setError: setError,
              errorMessage: "Garage's image is required"
            })}
          </Grid>
          {!isView && <FormButtons onReset={onReset} onSubmit={onSubmit} isLoading={isLoading} />}
        </Grid>
      </Paper>
    </Grid>
  );

  /* Main Return */

  async function createAndEditGarage(data) {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('photo', data.photo.uri.includes('blob') ? data.photo.file : data.photo.uri);

    try {
      const res = await axios({
        method: isEdit ? 'PATCH' : 'POST',
        url: ApiConfigs.Garage.createGarage + `${isEdit ? `${garageData._id}` : ''}`,
        headers: { Authorization: `Bearer ${token}` },
        data: formData
      });
      if (res.status === isEdit ? 200 : 201) {
        toast.success(t(`${isEdit ? 'Edit' : 'Created'} Successfully`));
      }
    } catch (e) {
      if (e.response.data.message) {
        toast.error(t(e.response.data.message));
      } else {
        toast.error(t('Network Error'));
        console.log(e);
      }
    }
    setIsLoading(false);
  }
};

export default HandleGarage;
