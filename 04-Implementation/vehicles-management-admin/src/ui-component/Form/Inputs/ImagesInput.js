import React, { useRef } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Button, FormHelperText, Grid, Typography } from '@mui/material';

// third-party
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ImagesInput = ({ control, name, disabled = false, errors }) => {
  const fileInputRef = useRef();
  const { t } = useTranslation();
  const error = errors[name];

  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  const addImage = (e) =>
    append({
      file: e.target.files[0],
      uri: URL.createObjectURL(e.target.files[0])
    });

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
            {t('Images')}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            height: 100,
            display: fields.length ? 'none' : 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography>{t('No Images')}</Typography>
        </Grid>

        {fields.map((item, index) => {
          const removeImage = () => remove(index);
          return (
            <Grid key={item.id} item lg={3} md={4} sm={6} xs={12}>
              <img alt={`vehicle-${item.id}`} src={item?.uri} width={'100%'} height={150} style={{ borderRadius: 10 }} />
              {!disabled && (
                <Box display={'flex'} justifyContent={'center'}>
                  <Button variant={'contained'} color={'error'} title={t('Remove Image')} onClick={removeImage}>
                    <Typography>{t('Remove')}</Typography>
                  </Button>
                </Box>
              )}
            </Grid>
          );
        })}
        <Grid item xs={12}>
          <Box sx={{ display: disabled ? 'none' : 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 1 }}>
            <input
              ref={fileInputRef}
              onChange={addImage}
              accept="image/*"
              style={{ display: 'none' }}
              id="vehicle-add-image"
              type="file"
              disabled={disabled}
            />
            <label htmlFor={'vehicle-add-image'}>
              <Button
                title={t('Add Image')}
                variant={'contained'}
                color={'secondary'}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <Typography>{t('Add Image')}</Typography>
              </Button>
            </label>
          </Box>
        </Grid>
      </Grid>
      {error && (
        <FormHelperText error={!!error} id="vehicle-add-image">
          {t(error?.message)}
        </FormHelperText>
      )}
    </>
  );
};

export default ImagesInput;

ImagesInput.propTypes = {
  control: PropTypes.func.isRequired,
  errors: PropTypes.func.isRequired,
  name: PropTypes.string,
  disabled: PropTypes.bool
};
