import type { RequestHandler } from '@sveltejs/kit';
import logger from '$lib/logger';
import { execa } from 'execa';
import 'dotenv/config';

export const GET: RequestHandler = async () => {
  let { WG_HOST } = process.env;

  // if the host is not set, then we are using the server's public IP
  if (!WG_HOST) {
    const { stdout: resp } = await execa('curl -s ifconfig.me', { shell: true });
    WG_HOST = resp.trim();
  }

  // check if WG_HOST is still not set
  if (!WG_HOST) {
    logger.error('WG_HOST is not set');
    return new Response('NOT_SET', { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }

  return new Response(WG_HOST, { status: 200, headers: { 'Content-Type': 'text/plain' } });
};
