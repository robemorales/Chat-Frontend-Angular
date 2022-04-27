import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthClientConfig } from './auth.config';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { AuthState } from './auth.state';
import * as ɵngcc0 from '@angular/core';
export declare class AuthHttpInterceptor implements HttpInterceptor {
    private configFactory;
    private auth0Client;
    private authState;
    constructor(configFactory: AuthClientConfig, auth0Client: Auth0Client, authState: AuthState);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    /**
     * Duplicate of AuthService.getAccessTokenSilently, but with a slightly different error handling.
     * Only used internally in the interceptor.
     * @param options The options for configuring the token fetch.
     */
    private getAccessTokenSilently;
    /**
     * Strips the query and fragment from the given uri
     * @param uri The uri to remove the query and fragment from
     */
    private stripQueryFrom;
    /**
     * Determines whether the specified route can have an access token attached to it, based on matching the HTTP request against
     * the interceptor route configuration.
     * @param route The route to test
     * @param request The HTTP request
     */
    private canAttachToken;
    /**
     * Tries to match a route from the SDK configuration to the HTTP request.
     * If a match is found, the route configuration is returned.
     * @param request The Http request
     * @param config HttpInterceptorConfig
     */
    private findMatchingRoute;
    private allowAnonymous;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<AuthHttpInterceptor, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<AuthHttpInterceptor>;
}

//# sourceMappingURL=auth.interceptor.d.ts.map