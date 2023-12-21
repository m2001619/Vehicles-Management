import React, { useState } from 'react';

// material-ui
import { Grid, Paper } from '@mui/material';

// third-party
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// project imports
import { gridSpacing } from '../../../store/constant';
import { fuelTypes } from '../../../constans/constans';
import CustomInput from '../../../ui-component/Form/Inputs/CustomInput';
import CustomSelectInput from '../../../ui-component/Form/SelectInputs/CustomSelectInput';
import ApiConfigs from '../../../api/apiConfigs';
import ImageInput from '../../../ui-component/Form/Inputs/ImageInput';
import FormButtons from '../../../ui-component/Form/Buttons/FormButtons';
import { handleRequestError } from '../../../utils/RequestHandler';

// assets
import { toast } from 'react-toastify';

const HandleBill = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const billData = location.state?.item;

  // Yup inputs validation
  const schema = yup.object({
    fuelVolume: yup.number().positive(t('Fuel Volume should be positive')).typeError(t('Fuel Volume must be a number')),
    price: yup.number().positive(t('Price should be positive')).typeError(t('Price must be a number')),
    station: yup.string().required('Station name is required'),
    photo: yup.object({
      uri: yup.string().required(t("Bill's image is required"))
    })
  });

  /* React Hook Form */
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue
  } = useForm({
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      fuelType: billData.fuelType,
      fuelVolume: billData.fuelVolume,
      price: billData.price,
      station: billData.station,
      note: billData.note,
      photo: { uri: billData.picture }
    }
  });

  const setImage = (file, uri) => setValue('photo', { uri, file });
  const onReset = () => reset();
  const onSubmit = handleSubmit(
    (data) => editBill(data),
    (errors) => console.log(errors)
  );

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12} display={'flex'} alignItems={'center'}>
            {CustomSelectInput({ control: control, name: 'fuelType', label: 'Fuel Type', arr: fuelTypes })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'fuelVolume', label: 'Fuel Volume', type: 'number' })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'price', label: 'Price', type: 'number' })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'station', label: 'Station' })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'note', label: 'Note' })}
          </Grid>
          <Grid item xs={12}>
            {ImageInput({
              errors: errors,
              value: watch('photo').uri,
              setValue: setImage,
              clearErrors: clearErrors,
              setError: setError,
              errorMessage: "Bill's image is required"
            })}
          </Grid>
          <FormButtons onReset={onReset} isLoading={isLoading} onSubmit={onSubmit} />
        </Grid>
      </Paper>
    </Grid>
  );

  async function editBill(data) {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    const formData = new FormData();
    formData.append('fuelType', data.fuelType);
    formData.append('fuelVolume', data.fuelVolume);
    formData.append('price', data.price);
    formData.append('note', data.note);
    formData.append('picture', data.photo.uri.includes('blob') ? data.photo.file : data.photo.uri);
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.FuelBill.edit + billData._id,
        headers: { Authorization: `Bearer ${token}` },
        data: formData
      });
      if (res.status === 200) {
        toast.success(t(`Edit Successfully`));
      }
    } catch (e) {
      handleRequestError(e, t);
    }
    setIsLoading(false);
  }
};

export default HandleBill;
