import { Response, Request as ExpressRequest } from 'express';
export type AccessMode = 'online' | 'offline';

export interface Request extends ExpressRequest {
  cookies: { [key: string]: string | undefined }
}
export interface AuthConfig {
  secret: string;
  apiKey: string;
  myShopifyDomain?: string;
  accessMode?: 'online' | 'offline';
  afterAuth?(req: Request, res: Response): void;
}

export type OAuthStartOptionsPrefixType = string;

export interface OAuthStartOptions extends AuthConfig {
  prefix?: OAuthStartOptionsPrefixType;
  scopes?: string[];
}

export interface OAuthStartOptionsInternal extends OAuthStartOptions {
  oAuthStartPath: string;
}

export interface NextFunction {
  (): any;
}

