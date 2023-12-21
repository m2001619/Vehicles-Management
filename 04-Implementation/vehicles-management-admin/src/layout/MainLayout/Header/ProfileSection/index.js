// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';

// assets
import { IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const LogoutSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Chip
      sx={{
        height: '48px',
        alignItems: 'center',
        borderRadius: '27px',
        transition: 'all .2s ease-in-out',
        borderColor: theme.palette.primary.light,
        backgroundColor: theme.palette.primary.light,
        '&[aria-controls="menu-list-grow"], &:hover': {
          borderColor: theme.palette.primary.main,
          background: `${theme.palette.primary.main}!important`,
          color: theme.palette.primary.light,
          '& svg': {
            stroke: theme.palette.primary.light
          }
        },
        '& .MuiChip-label': {
          lineHeight: 0
        }
      }}
      label={<IconLogout stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
      variant="outlined"
      color="primary"
      onClick={handleLogout}
    />
  );
};

export default LogoutSection;
