// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import ApiConfigs from '../../../api/apiConfigs';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{
          email: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email(t('Must be a valid email')).max(255).required(t('Email is required'))
        })}
        onSubmit={ForgotPassword}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">{t('Email Address')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label={t('Email Address')}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  {t('Send Code')}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );

  async function ForgotPassword(data) {
    try {
      const res = await axios({
        method: 'POST',
        url: ApiConfigs.Auth.forgotPassword,
        data: {
          email: data.email,
          role: 'admin'
        }
      });
      if (res.status === 200) {
        navigate('/reset-password');
        toast.success(t(res.data.message));
      } else {
        toast.error(t(res.data.message));
      }
    } catch (e) {
      if (e.response?.data?.message) {
        toast.error(t(e.response.data.message));
      } else {
        console.log(e);
        toast.error(t('Network Error'));
      }
    }
  }
};

export default AuthForgotPassword;
