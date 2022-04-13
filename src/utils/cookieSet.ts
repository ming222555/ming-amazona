import Cookies from 'js-cookie';

export default function cookieSet(name: string, val: string | number | boolean | object): void {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line no-console
    console.log("You're trying to set Cookie in NON BROWSER environment!");
    return;
  }
  const valType = typeof val;

  if (valType === 'string') {
    Cookies.set(name, val as string);
    return;
  }
  if (valType === 'object') {
    Cookies.set(name, JSON.stringify(val));
    return;
  }
  if (valType === 'number' || valType === 'boolean') {
    Cookies.set(name, val.toString());
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Cookies.set(name, JSON.stringify(val));
}
