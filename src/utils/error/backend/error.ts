import db from '../../../db/db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export async function onError(err: any, req: any, res: any, next: any): Promise<void> {
  await db.disconnect();
  const status = 500;
  res.status(status).send({ errormsg: err.message, status });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onNoMatch(req: any, res: any): void {
  const errormsg = `Method '${req.method}' Not Allowed`;
  const status = 405;
  res.status(status).send({ errormsg, status });
}
