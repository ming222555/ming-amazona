import axios, { AxiosError } from 'axios';

export function getError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axErr: AxiosError = err;
    if (axErr.response?.data && axErr.response?.data.errormsg) {
      const status: number = axErr.response.data.status;
      if (status >= 500) {
        return 'Internal Server Error'; // errormsg is server generated, potentially technical revealing...
      }
      return axErr.response.data.errormsg; // e.g. Invalid user or password
    }
  }

  const error = (err as Error).message;
  if (error.indexOf('404') !== -1) {
    return 'Requested entity not found';
  }
  if (error.indexOf('401') !== -1) {
    return 'Unauthorized access not permitted';
  }
  return error;
}
