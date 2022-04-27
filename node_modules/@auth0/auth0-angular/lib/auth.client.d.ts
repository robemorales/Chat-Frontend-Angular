import { InjectionToken } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { AuthClientConfig } from './auth.config';
export declare class Auth0ClientFactory {
    static createClient(configFactory: AuthClientConfig): Auth0Client;
}
export declare const Auth0ClientService: InjectionToken<Auth0Client>;
