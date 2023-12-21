import React, { useState } from 'react';

// material-ui
import { Grid, Paper } from '@mui/material';

// third-party
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// project imports
import { gridSpacing } from '../../../store/constant';
import { bodyTypes, fuelTypes, transmissionTypes } from '../../../constans/constans';
import CustomInput from '../../../ui-component/Form/Inputs/CustomInput';
import CustomSelectInput from '../../../ui-component/Form/SelectInputs/CustomSelectInput';
import FeaturesInput from '../../../ui-component/Form/ArrayInputs/FeaturesInput';
import ImagesInput from '../../../ui-component/Form/Inputs/ImagesInput';
import ApiConfigs from '../../../api/apiConfigs';

// assets
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import FormButtons from '../../../ui-component/Form/Buttons/FormButtons';

const HandleVehicle = () => {
  const location = useLocation();
  const garageSelectorArr = JSON.parse(sessionStorage.getItem('garageSelectorArr'));
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const vehicleData = location.state?.item;
  const isEdit = location.state?.isEdit === true;
  const isView = location.state?.isView === true;

  // Yup inputs validation
  const schema = yup.object({
    images: yup.array().min(1, t('Vehicle should have at least one image.')),
    features: yup.array().of(yup.object({ value: yup.string().required(t('Enter Feature')) })),
    make: yup.string().required(t('Enter Make')),
    model: yup.string().required(t('Enter Model')),
    year: yup
      .number()
      .required(t('Enter Year'))
      .min(1900, t("Vehicle's year should be 1900 at least"))
      .typeError(t('Year must be a number')),
    maxSpeed: yup
      .number()
      .required(t('Enter Max Speed'))
      .positive(t('Max speed should be positive number'))
      .typeError(t('Max speed must be a number')),
    engineOutput: yup
      .number()
      .required(t('Enter Engine Out'))
      .positive(t('Engine Out should be positive number'))
      .typeError(t('Engine Out must be a number')),
    mileage: yup
      .number()
      .required(t('Enter Mileage'))
      .positive(t('Mileage should be positive number'))
      .typeError(t('Mileage Out must be a number')),
    VIN: yup.string().required(t('Enter VIN')),
    registrationNumber: yup.string().required(t('Enter Registration Number')),
    numSeats: yup
      .number()
      .required(t("Enter seats' number"))
      .positive(t("Seats' number should be positive number"))
      .typeError(t("Seats' number must be a number"))
  });

  /* React Hook Form */
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: {
      images: isView || isEdit ? vehicleData.images.map((i) => ({ uri: i })) : [],
      features: isView || isEdit ? vehicleData.features.map((i) => ({ value: i })) : [],
      fuelType: isView || isEdit ? vehicleData.fuelType : fuelTypes[0].value,
      bodyType: isView || isEdit ? vehicleData.bodyType : bodyTypes[0].value,
      TransmissionType: isView || isEdit ? vehicleData.TransmissionType : transmissionTypes[0].value,
      garage: isView || isEdit ? vehicleData.garage._id : garageSelectorArr[0].value,
      make: isView || isEdit ? vehicleData.make : '',
      model: isView || isEdit ? vehicleData.model : '',
      year: isView || isEdit ? vehicleData.year : '',
      maxSpeed: isView || isEdit ? vehicleData.maxSpeed : '',
      engineOutput: isView || isEdit ? vehicleData.engineOutput : '',
      mileage: isView || isEdit ? vehicleData.mileage : '',
      VIN: isView || isEdit ? vehicleData.VIN : '',
      registrationNumber: isView || isEdit ? vehicleData.registrationNumber : '',
      numSeats: isView || isEdit ? vehicleData.numSeats : ''
    }
  });

  const onReset = () => reset();
  const onSubmit = handleSubmit(
    (data) => (isEdit ? editVehicle(data) : createVehicle(data)),
    (errors) => console.log(errors)
  );

  /* Main Return */

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'make', label: 'Make', disabled: isView })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'model', label: 'Model', disabled: isView })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'year', label: 'Year', type: 'number', disabled: isView })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({
              control: control,
              name: 'maxSpeed',
              label: 'Max Speed',
              type: 'number',
              disabled: isView
            })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({
              control: control,
              name: 'engineOutput',
              label: 'Engine Output',
              type: 'number',
              disabled: isView
            })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({
              control: control,
              name: 'mileage',
              label: 'Mileage',
              type: 'number',
              disabled: isView
            })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'VIN', label: 'VIN', disabled: isView })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({
              control: control,
              name: 'registrationNumber',
              label: 'Registration Number',
              disabled: isView
            })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({
              control: control,
              name: 'numSeats',
              label: "Seats' Number",
              type: 'number',
              disabled: isView
            })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12} display={'flex'} alignItems={'center'}>
            {CustomSelectInput({
              control: control,
              name: 'fuelType',
              label: 'Fuel Type',
              arr: fuelTypes,
              disabled: isView
            })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12} display={'flex'} alignItems={'center'}>
            {CustomSelectInput({
              control: control,
              name: 'bodyType',
              label: 'Body Type',
              arr: bodyTypes,
              disabled: isView
            })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12} display={'flex'} alignItems={'center'}>
            {CustomSelectInput({
              control: control,
              name: 'TransmissionType',
              label: 'Transmission Type',
              arr: transmissionTypes,
              disabled: isView
            })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12} display={'flex'} alignItems={'center'}>
            {CustomSelectInput({
              control: control,
              name: 'garage',
              label: 'Garage',
              arr: garageSelectorArr,
              disabled: isView
            })}
          </Grid>
          <Grid item xs={12}>
            {FeaturesInput({
              control: control,
              register: register,
              errors: errors,
              name: 'features',
              disabled: isView
            })}
          </Grid>
          <Grid item xs={12}>
            {ImagesInput({ control: control, name: 'images', disabled: isView, errors: errors })}
          </Grid>
          {!isView && <FormButtons isLoading={isLoading} onSubmit={onSubmit} onReset={onReset} />}
        </Grid>
      </Paper>
    </Grid>
  );

  /* Main Return */

  async function createVehicle(data) {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    try {
      const res = await axios({
        method: 'POST',
        url: ApiConfigs.Vehicle.createVehicle,
        headers: { Authorization: `Bearer ${token}` },
        data: handleFormData(data)
      });
      if (res.status === 201) {
        toast.success(t('Created Successfully'));
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

  async function editVehicle(data) {
    setIsLoading(true);
    const token = sessionStorage.getItem('token');
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.Vehicle.editVehicle + vehicleData._id,
        headers: { Authorization: `Bearer ${token}` },
        data: handleFormData(data)
      });
      if (res.status === 200) {
        toast.success(t('Edit Successfully'));
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

export default HandleVehicle;

function handleFormData(data) {
  const images = data.images.map((i) => (i.uri.includes('blob') ? i.file : i.uri));
  const features = data.features.map((i) => i.value);
  const formData = new FormData();
  images.forEach((i) => formData.append('images', i));
  formData.append('features', JSON.stringify(features));
  formData.append('fuelType', data.fuelType);
  formData.append('bodyType', data.bodyType);
  formData.append('TransmissionType', data.TransmissionType);
  formData.append('garage', data.garage);
  formData.append('make', data.make);
  formData.append('model', data.model);
  formData.append('year', data.year);
  formData.append('maxSpeed', data.maxSpeed);
  formData.append('engineOutput', data.engineOutput);
  formData.append('mileage', data.mileage);
  formData.append('VIN', data.VIN);
  formData.append('registrationNumber', data.registrationNumber);
  formData.append('numSeats', data.numSeats);

  return formData;
}
