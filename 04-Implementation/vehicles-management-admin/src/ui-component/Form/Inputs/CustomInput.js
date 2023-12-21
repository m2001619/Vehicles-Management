import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// third-party
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const CustomInput = ({ control, name, label, type = 'text', disabled = false, endAdornment = null, startAdornment = null }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const { field, fieldState } = useController({
    control,
    name,
    disabled
  });

  return (
    <FormControl fullWidth error={!!fieldState.error} sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor={`outlined-vehicle-${name}`}>{t(label)}</InputLabel>
      <OutlinedInput
        endAdornment={type === 'password' ? PasswordInputAdornment() : endAdornment}
        startAdornment={startAdornment}
        id={`outlined-vehicle-${name}`}
        type={showPassword ? 'text' : type}
        {...field}
        label={label}
      />
      {fieldState.error && (
        <FormHelperText error={!!fieldState.error} id={`outlined-vehicle-${name}`}>
          {t(fieldState.error?.message)}
        </FormHelperText>
      )}
    </FormControl>
  );

  function PasswordInputAdornment() {
    const handleClickShowPassword = () => setShowPassword((prevState) => !prevState);
    return (
      <InputAdornment position="end">
        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" size="large">
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    );
  }
};

export default CustomInput;

CustomInput.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  endAdornment: PropTypes.element,
  startAdornment: PropTypes.element
};
