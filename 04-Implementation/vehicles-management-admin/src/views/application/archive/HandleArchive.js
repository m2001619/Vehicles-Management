import React, { useState } from 'react';

// material-ui
import { Grid, Paper } from '@mui/material';

// third-party
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// project imports
import { gridSpacing } from '../../../store/constant';
import CustomInput from '../../../ui-component/Form/Inputs/CustomInput';
import ApiConfigs from '../../../api/apiConfigs';
import FormButtons from '../../../ui-component/Form/Buttons/FormButtons';
import { handleRequestError } from '../../../utils/RequestHandler';

// assets
import { toast } from 'react-toastify';

const HandleArchive = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const archiveData = location.state?.item;

  // Yup inputs validation
  const schema = yup.object({
    departure: yup.object({
      from: yup.string().required(t("Enter departure's location")),
      odo: yup.number().positive("Departure's odo should be positive").typeError(t("Departure's odo must be a number"))
    }),
    arrival: yup.object({
      to: yup.string().required(t("Enter arrival's location")),
      odo: yup.number().positive("Arrival's odo should be positive").typeError(t("Arrival's odo must be a number"))
    })
  });

  /* React Hook Form */
  const { control, handleSubmit, reset } = useForm({
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      departure: {
        from: archiveData.departure.from,
        time: archiveData.departure.time,
        odo: archiveData.departure.odo
      },
      arrival: {
        to: archiveData.arrival.to,
        odo: archiveData.arrival.odo,
        time: archiveData.arrival.time
      },
      note: archiveData.note
    }
  });

  const onReset = () => reset();
  const onSubmit = handleSubmit(
    (data) => editArchive(data),
    (errors) => console.log(errors)
  );

  /* Main Return */

  return (
    <Grid>
      <Paper sx={{ padding: gridSpacing, overflowX: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'departure.from', label: 'From' })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'arrival.to', label: 'To' })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'departure.odo', label: 'Departure Odo', type: 'number' })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'arrival.odo', label: 'Arrival Odo', type: 'number' })}
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
            {CustomInput({ control: control, name: 'note', label: 'Note' })}
          </Grid>
          <FormButtons onReset={onReset} onSubmit={onSubmit} isLoading={isLoading} />
        </Grid>
      </Paper>
    </Grid>
  );

  /* Main Return */

  async function editArchive(data) {
    const token = sessionStorage.getItem('token');
    setIsLoading(true);
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.ReservationArchive.editArchive + archiveData._id,
        headers: { Authorization: `Bearer ${token}` },
        data
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
export default HandleArchive;
