import { Request } from '../types';

export default function getCookieOptions(req: Request) {
  const { headers } = req;
  const userAgent = headers['user-agent'];
  const isChrome = userAgent && userAgent.match(/chrome|crios/i);
  let cookieOptions = {};
  if (isChrome) {
    cookieOptions = {
      sameSite: 'none',
      secure: true,
    };
  }
  return cookieOptions;
}
