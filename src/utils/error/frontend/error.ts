import axios, { AxiosError } from 'axios';

export function getError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axErr: AxiosError = err;
    if (axErr.response?.data && axErr.response?.data.errormsg) {
      const status: number = axErr.response.data.status;
      if (status >= 500) {
        return 'Internal Server Error'; // errormsg is server generated, potentially technical revealing...
      }
      // (401/404) User not found. (400) Validation error e.g. Age mustn't exceed 99 ...
      return axErr.response.data.errormsg;
    }
  }

  // Browser issued
  const error = (err as Error).message.toLowerCase();

  const posOfStatusCode = error.indexOf('status code');

  if (posOfStatusCode !== -1) {
    if (error.indexOf('404') !== -1) {
      return 'Invalid url';
    }
    if (error.indexOf('401') !== -1) {
      return 'Unauthorized access not permitted';
    }
    if (error.indexOf('400') !== -1) {
      return 'Bad request';
    }
    if (error.indexOf('500') !== -1 || error.indexOf('501') !== -1) {
      return 'Internal Server Error';
    }

    // eslint-disable-next-line no-console
    console.log('error', error);

    return error;
  }

  // eslint-disable-next-line no-console
  console.log('err', err);

  return 'Exception error'; // due to e.g. await axios.TYPOget() instead of await axios.get()
}
