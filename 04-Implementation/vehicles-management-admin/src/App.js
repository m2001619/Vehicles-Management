import './utils/Notification';
import { useCallback, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';

// routing
import Routes from 'routes';
import { useTranslation } from 'react-i18next';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { initI18Next } from './utils/Translater';
import ApiConfigs from './api/apiConfigs';
import { handleRequestError } from './utils/RequestHandler';
import { SET_DEFAULT_CONTENT } from './store/actions';

// ==============================|| APP ||============================== //

initI18Next.catch(console.error);

const App = () => {
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const defaultContent = customization.defaultContent;
  const { t } = useTranslation();

  const getContent = useCallback(async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.Content.getContent
      });
      if (res.status === 200) {
        localStorage.setItem('content', JSON.stringify(res.data.data[0]));
        dispatch({ type: SET_DEFAULT_CONTENT, defaultContent: res.data.data[0] });
      }
    } catch (e) {
      handleRequestError(e, t);
    }
  }, [t, dispatch]);

  useLayoutEffect(() => {
    getContent().catch(console.error);
  }, [getContent]);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{defaultContent.adminTitle}</title>
        <link rel="icon" href={defaultContent.adminLogo} />
      </Helmet>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <ToastContainer />
            <Routes />
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
};

export default App;
