import { Box, Button, FormHelperText, Grid, Typography } from '@mui/material';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { IoCloudUploadSharp } from 'react-icons/io5';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const ImageInput = ({
  setValue,
  value,
  disabled = false,
  errors,
  clearErrors,
  setError,
  errorMessage,
  name = 'photo',
  title = 'Image'
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const fileInputRef = useRef();
  const firstError = errors[name];
  const error = firstError?.uri.message;

  const onChange = (e) => {
    setValue(e.target.files[0], URL.createObjectURL(e.target.files[0]));
    clearErrors(`${name}.uri`);
  };
  const onRemove = () => {
    setValue(undefined, undefined);
    setError(`${name}.uri`, { type: 'required', message: t(errorMessage) });
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          mx: 'auto',
          width: '100%',
          my: 1,
          padding: 2,
          border: `1px solid ${error ? 'red' : '#eee'}`,
          borderRadius: 2
        }}
      >
        <Grid item xs={12}>
          <Typography variant={'h3'} sx={{ mb: 1 }}>
            {t(title)}
          </Typography>
        </Grid>
        {value ? (
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img alt={`garage`} src={value} width={150} height={150} style={{ borderRadius: 10 }} />
            {!disabled && (
              <Box display={'flex'} justifyContent={'center'}>
                <Button variant={'contained'} color={'error'} title={'Remove Image'} onClick={onRemove}>
                  <Typography>{t('Remove')}</Typography>
                </Button>
              </Box>
            )}
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            sx={{
              height: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: disabled ? 'none' : 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                marginTop: 1
              }}
            >
              <input
                ref={fileInputRef}
                onChange={onChange}
                accept="image/*"
                style={{ display: 'none' }}
                id="vehicle-add-image"
                type="file"
                disabled={disabled}
              />
              <label
                htmlFor={'vehicle-add-image'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
              >
                <IoCloudUploadSharp size={40} color={theme.palette.primary.dark} />
                <Typography>{t('Select Image')}</Typography>
              </label>
            </Box>
          </Grid>
        )}
      </Grid>
      {!!error && (
        <FormHelperText error={!!error} id="vehicle-add-image">
          {t(error)}
        </FormHelperText>
      )}
    </>
  );
};
export default ImageInput;

ImageInput.propTypes = {
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
  setError: PropTypes.func,
  errors: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string
};
