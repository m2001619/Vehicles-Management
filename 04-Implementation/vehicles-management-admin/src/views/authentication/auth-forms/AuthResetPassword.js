import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ApiConfigs from '../../../api/apiConfigs';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthResetPassword = ({ ...others }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          token: '',
          password: '',
          passwordConfirm: ''
        }}
        validationSchema={Yup.object().shape({
          token: Yup.string().required(t('Enter the code that sent to your email')),
          password: Yup.string().max(255).required(t('Password is required')).min(8, t('Password must contain at least 8 characters')),
          passwordConfirm: Yup.string()
            .max(255)
            .required(t('Password is required'))
            .oneOf([Yup.ref('password')], t('Passwords must match'))
        })}
        onSubmit={ResetPassword}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.token && errors.token)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-token-reset-password">{t('Reset Code')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-token-reset-password"
                type="text"
                value={values.token}
                name="token"
                onBlur={handleBlur}
                onChange={handleChange}
                label={t('Reset Code')}
                inputProps={{}}
              />
              {touched.token && errors.token && (
                <FormHelperText error id="standard-weight-helper-text-token-reset-password">
                  {errors.token}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-reset-password">{t('Password')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-reset-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label={t('Password')}
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-reset-password">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-confirm-password-reset-password">{t('Confirm Password')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-confirm-reset-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.passwordConfirm}
                name="passwordConfirm"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                      size="large"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label={t('Confirm Password')}
                inputProps={{}}
              />
              {touched.passwordConfirm && errors.passwordConfirm && (
                <FormHelperText error id="standard-weight-helper-text-password-reset-password">
                  {errors.passwordConfirm}
                </FormHelperText>
              )}
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  {t('Reset Password')}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );

  async function ResetPassword(data) {
    try {
      const res = await axios({
        method: 'PATCH',
        url: ApiConfigs.Auth.resetPassword,
        data: {
          token: data.token,
          password: data.password,
          passwordConfirm: data.passwordConfirm
        }
      });
      if (res.status === 200) {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('adminInfo', JSON.stringify(res.data.data));
        navigate('/dashboard/default');
        toast.success(t('Password Reset Successfully'));
      }
    } catch (e) {
      if (e.response?.data?.message) {
        toast.error(t(e.response.data.message));
        console.log(data);
      } else {
        console.log(e);
        toast.error(t('Network Error'));
      }
    }
  }
};

export default AuthResetPassword;
