import { toast } from 'react-toastify';

export function handleRequestError(error, translate) {
  if (error.response?.data?.message) {
    toast.error(translate(error.response.data.message));
  } else {
    console.log(error);
    toast.error(translate('Network Error'));
  }
}
