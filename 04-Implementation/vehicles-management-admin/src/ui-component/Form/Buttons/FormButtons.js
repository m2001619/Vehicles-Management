import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// material-ui
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';

const FormButtons = ({ onReset, onSubmit, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, height: 40 }}>
        <Button variant={'outlined'} onClick={onReset}>
          <Typography>{t('Reset')}</Typography>
        </Button>
        <Button variant={'contained'} color={'secondary'} onClick={onSubmit}>
          {isLoading ? (
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <CircularProgress size={30} color={'inherit'} />
            </Box>
          ) : (
            <Typography>{t('Submit')}</Typography>
          )}
        </Button>
      </Box>
    </Grid>
  );
};

export default FormButtons;

FormButtons.propTypes = {
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool
};
