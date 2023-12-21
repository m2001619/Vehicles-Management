import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Button, FormControl, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';

// assets
import { FaTrash } from 'react-icons/fa';
import { AiOutlinePlusCircle } from 'react-icons/ai';

const FeaturesInput = ({ control, register, errors, name, disabled = false }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  const addFeature = () => append({ value: '' });

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mx: 'auto',
        width: '100%',
        my: 1,
        padding: 2,
        border: '1px solid #eee',
        borderRadius: 2
      }}
    >
      {fields.map((item, index) => {
        const removeItem = () => remove(index);
        const inputName = `features.${index}.value`;
        const errorMessage = () => (
          <ErrorMessage errors={errors} name={inputName} render={({ message }) => <FormHelperText error>{t(message)}</FormHelperText>} />
        );

        return (
          <Grid key={item.id} item lg={3} md={4} sm={6} xs={12}>
            <FormControl fullWidth error={Boolean(errors[inputName])} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor={`outlined-vehicle-feature-${index}`}>
                {t('Feature')} {index + 1}
              </InputLabel>
              <OutlinedInput
                id={`outlined-vehicle-feature-${index}`}
                {...register(inputName)}
                label={`${t('Feature')} ${index + 1}`}
                disabled={disabled}
                endAdornment={
                  !disabled && (
                    <IconButton onClick={removeItem} title={`${t('Remove Feature')} ${index + 1}`} variant={'text'} color={'error'}>
                      <FaTrash fontSize={15} />
                    </IconButton>
                  )
                }
              />
              {errorMessage()}
            </FormControl>
          </Grid>
        );
      })}
      <Grid item lg={3} md={4} sm={6} xs={12} sx={{ display: disabled ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant={'outlined'} color={'secondary'} fullWidth sx={{ py: 2.5, borderRadius: 2, gap: 1 }} onClick={addFeature}>
          <AiOutlinePlusCircle size={20} />
          <Typography fontWeight={'500'}>{t('Add Feature')}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default FeaturesInput;

FeaturesInput.propTypes = {
  control: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.func.isRequired,
  name: PropTypes.string,
  disabled: PropTypes.bool
};
