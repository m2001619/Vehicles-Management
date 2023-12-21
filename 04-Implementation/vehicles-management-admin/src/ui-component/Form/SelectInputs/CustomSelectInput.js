import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// third-party
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const CustomSelectInput = ({ control, name, label = undefined, arr, disabled }) => {
  const { t } = useTranslation();
  const { field } = useController({
    control,
    name,
    disabled
  });
  return (
    <FormControl variant="standard" fullWidth>
      {label && <InputLabel htmlFor={`outlined-vehicle-${name}`}>{t(label)}</InputLabel>}
      <Select {...field} labelId={`select-vehicle-${name}`} id={`select-vehicle-${name}`} label={label}>
        {arr.map((item, index) => (
          <MenuItem key={index + 1} value={item.value}>
            {t(item.name)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelectInput;

CustomSelectInput.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  arr: PropTypes.array,
  disabled: PropTypes.bool
};
