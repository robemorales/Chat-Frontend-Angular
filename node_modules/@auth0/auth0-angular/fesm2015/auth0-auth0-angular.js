import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Injector, Optional, Inject, NgModule } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js';
export { InMemoryCache, LocalStorageCache, User } from '@auth0/auth0-spa-js';
import { BehaviorSubject, Subject, ReplaySubject, merge, defer, of, iif, from, throwError } from 'rxjs';
import { scan, filter, distinctUntilChanged, switchMap, mergeMap, shareReplay, concatMap, catchError, tap, takeUntil, withLatestFrom, map, take, pluck, first } from 'rxjs/operators';
import { __rest } from 'tslib';
import { Router } from '@angular/router';
import * as i1 from '@angular/common';
import { Location } from '@angular/common';

var useragent = { name: '@auth0/auth0-angular', version: '1.9.0' };

class Auth0ClientFactory {
    static createClient(configFactory) {
        const config = configFactory.get();
        if (!config) {
            throw new Error('Configuration must be specified either through AuthModule.forRoot or through AuthClientConfig.set');
        }
        const { redirectUri, clientId, maxAge, httpInterceptor } = config, rest = __rest(config, ["redirectUri", "clientId", "maxAge", "httpInterceptor"]);
        return new Auth0Client(Object.assign(Object.assign({ redirect_uri: redirectUri || window.location.origin, client_id: clientId, max_age: maxAge }, rest), { auth0Client: {
                name: useragent.name,
                version: useragent.version,
            } }));
    }
}
const Auth0ClientService = new InjectionToken('auth0.client');

class AbstractNavigator {
    constructor(location, injector) {
        this.location = location;
        try {
            this.router = injector.get(Router);
        }
        catch (_a) { }
    }
    /**
     * Navigates to the specified url. The router will be used if one is available, otherwise it falls back
     * to `window.history.replaceState`.
     * @param url The url to navigate to
     */
    navigateByUrl(url) {
        if (this.router) {
            this.router.navigateByUrl(url);
            return;
        }
        this.location.replaceState(url);
    }
}
AbstractNavigator.ɵprov = i0.ɵɵdefineInjectable({ factory: function AbstractNavigator_Factory() { return new AbstractNavigator(i0.ɵɵinject(i1.Location), i0.ɵɵinject(i0.INJECTOR)); }, token: AbstractNavigator, providedIn: "root" });
AbstractNavigator.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
AbstractNavigator.ctorParameters = () => [
    { type: Location },
    { type: Injector }
];

/**
 * A custom type guard to help identify route definitions that are actually HttpInterceptorRouteConfig types.
 * @param def The route definition type
 */
function isHttpInterceptorRouteConfig(def) {
    return typeof def !== 'string';
}
/**
 * Gets and sets configuration for the internal Auth0 client. This can be
 * used to provide configuration outside of using AuthModule.forRoot, i.e. from
 * a factory provided by APP_INITIALIZER.
 *
 * @usage
 *
 * ```js
 * // app.module.ts
 * // ---------------------------
 * import { AuthModule, AuthClientConfig } from '@auth0/auth0-angular';
 *
 * // Provide an initializer function that returns a Promise
 * function configInitializer(
 *   http: HttpClient,
 *   config: AuthClientConfig
 * ) {
 *   return () =>
 *     http
 *       .get('/config')
 *       .toPromise()
 *       .then((loadedConfig: any) => config.set(loadedConfig));   // Set the config that was loaded asynchronously here
 * }
 *
 * // Provide APP_INITIALIZER with this function. Note that there is no config passed to AuthModule.forRoot
 * imports: [
 *   // other imports..
 *
 *   HttpClientModule,
 *   AuthModule.forRoot(),   //<- don't pass any config here
 * ],
 * providers: [
 *   {
 *     provide: APP_INITIALIZER,
 *     useFactory: configInitializer,    // <- pass your initializer function here
 *     deps: [HttpClient, AuthClientConfig],
 *     multi: true,
 *   },
 * ],
 * ```
 *
 */
class AuthClientConfig {
    constructor(config) {
        if (config) {
            this.set(config);
        }
    }
    /**
     * Sets configuration to be read by other consumers of the service (see usage notes)
     * @param config The configuration to set
     */
    set(config) {
        this.config = config;
    }
    /**
     * Gets the config that has been set by other consumers of the service
     */
    get() {
        return this.config;
    }
}
AuthClientConfig.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthClientConfig_Factory() { return new AuthClientConfig(i0.ɵɵinject(AuthConfigService, 8)); }, token: AuthClientConfig, providedIn: "root" });
AuthClientConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
AuthClientConfig.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [AuthConfigService,] }] }
];
/**
 * Injection token for accessing configuration.
 *
 * @usageNotes
 *
 * Use the `Inject` decorator to access the configuration from a service or component:
 *
 * ```
 * class MyService(@Inject(AuthConfigService) config: AuthConfig) {}
 * ```
 */
const AuthConfigService = new InjectionToken('auth0-angular.config');

/**
 * Tracks the Authentication State for the SDK
 */
class AuthState {
    constructor(auth0Client) {
        this.auth0Client = auth0Client;
        this.isLoadingSubject$ = new BehaviorSubject(true);
        this.refresh$ = new Subject();
        this.accessToken$ = new ReplaySubject(1);
        this.errorSubject$ = new ReplaySubject(1);
        /**
         * Emits boolean values indicating the loading state of the SDK.
         */
        this.isLoading$ = this.isLoadingSubject$.asObservable();
        /**
         * Trigger used to pull User information from the Auth0Client.
         * Triggers when the access token has changed.
         */
        this.accessTokenTrigger$ = this.accessToken$.pipe(scan((acc, current) => {
            return {
                previous: acc.current,
                current,
            };
        }, { current: null, previous: null }), filter(({ previous, current }) => previous !== current));
        /**
         * Trigger used to pull User information from the Auth0Client.
         * Triggers when an event occurs that needs to retrigger the User Profile information.
         * Events: Login, Access Token change and Logout
         */
        this.isAuthenticatedTrigger$ = this.isLoading$.pipe(filter((loading) => !loading), distinctUntilChanged(), switchMap(() => 
        // To track the value of isAuthenticated over time, we need to merge:
        //  - the current value
        //  - the value whenever the access token changes. (this should always be true of there is an access token
        //    but it is safer to pass this through this.auth0Client.isAuthenticated() nevertheless)
        //  - the value whenever refreshState$ emits
        merge(defer(() => this.auth0Client.isAuthenticated()), this.accessTokenTrigger$.pipe(mergeMap(() => this.auth0Client.isAuthenticated())), this.refresh$.pipe(mergeMap(() => this.auth0Client.isAuthenticated())))));
        /**
         * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
         * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
         */
        this.isAuthenticated$ = this.isAuthenticatedTrigger$.pipe(distinctUntilChanged(), shareReplay(1));
        /**
         * Emits details about the authenticated user, or null if not authenticated.
         */
        this.user$ = this.isAuthenticatedTrigger$.pipe(concatMap((authenticated) => authenticated ? this.auth0Client.getUser() : of(null)));
        /**
         * Emits ID token claims when authenticated, or null if not authenticated.
         */
        this.idTokenClaims$ = this.isAuthenticatedTrigger$.pipe(concatMap((authenticated) => authenticated ? this.auth0Client.getIdTokenClaims() : of(null)));
        /**
         * Emits errors that occur during login, or when checking for an active session on startup.
         */
        this.error$ = this.errorSubject$.asObservable();
    }
    /**
     * Update the isLoading state using the provided value
     * @param isLoading The new value for isLoading
     */
    setIsLoading(isLoading) {
        this.isLoadingSubject$.next(isLoading);
    }
    /**
     * Refresh the state to ensure the `isAuthenticated`, `user$` and `idTokenClaims$`
     * reflect the most up-to-date values from  Auth0Client.
     */
    refresh() {
        this.refresh$.next();
    }
    /**
     * Update the access token, doing so will also refresh the state.
     * @param accessToken The new Access Token
     */
    setAccessToken(accessToken) {
        this.accessToken$.next(accessToken);
    }
    /**
     * Emits the error in the `error$` observable.
     * @param error The new error
     */
    setError(error) {
        this.errorSubject$.next(error);
    }
}
AuthState.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthState_Factory() { return new AuthState(i0.ɵɵinject(Auth0ClientService)); }, token: AuthState, providedIn: "root" });
AuthState.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
AuthState.ctorParameters = () => [
    { type: Auth0Client, decorators: [{ type: Inject, args: [Auth0ClientService,] }] }
];

class AuthService {
    constructor(auth0Client, configFactory, navigator, authState) {
        this.auth0Client = auth0Client;
        this.configFactory = configFactory;
        this.navigator = navigator;
        this.authState = authState;
        this.appStateSubject$ = new ReplaySubject(1);
        // https://stackoverflow.com/a/41177163
        this.ngUnsubscribe$ = new Subject();
        /**
         * Emits boolean values indicating the loading state of the SDK.
         */
        this.isLoading$ = this.authState.isLoading$;
        /**
         * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
         * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
         */
        this.isAuthenticated$ = this.authState.isAuthenticated$;
        /**
         * Emits details about the authenticated user, or null if not authenticated.
         */
        this.user$ = this.authState.user$;
        /**
         * Emits ID token claims when authenticated, or null if not authenticated.
         */
        this.idTokenClaims$ = this.authState.idTokenClaims$;
        /**
         * Emits errors that occur during login, or when checking for an active session on startup.
         */
        this.error$ = this.authState.error$;
        /**
         * Emits the value (if any) that was passed to the `loginWithRedirect` method call
         * but only **after** `handleRedirectCallback` is first called
         */
        this.appState$ = this.appStateSubject$.asObservable();
        const checkSessionOrCallback$ = (isCallback) => iif(() => isCallback, this.handleRedirectCallback(), defer(() => this.auth0Client.checkSession()));
        this.shouldHandleCallback()
            .pipe(switchMap((isCallback) => checkSessionOrCallback$(isCallback).pipe(catchError((error) => {
            const config = this.configFactory.get();
            this.authState.setError(error);
            this.navigator.navigateByUrl(config.errorPath || '/');
            return of(undefined);
        }))), tap(() => {
            this.authState.setIsLoading(false);
        }), takeUntil(this.ngUnsubscribe$))
            .subscribe();
    }
    /**
     * Called when the service is destroyed
     */
    ngOnDestroy() {
        // https://stackoverflow.com/a/41177163
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
    /**
     * ```js
     * loginWithRedirect(options);
     * ```
     *
     * Performs a redirect to `/authorize` using the parameters
     * provided as arguments. Random and secure `state` and `nonce`
     * parameters will be auto-generated.
     *
     * @param options The login options
     */
    loginWithRedirect(options) {
        return from(this.auth0Client.loginWithRedirect(options));
    }
    /**
     * ```js
     * await loginWithPopup(options);
     * ```
     *
     * Opens a popup with the `/authorize` URL using the parameters
     * provided as arguments. Random and secure `state` and `nonce`
     * parameters will be auto-generated. If the response is successful,
     * results will be valid according to their expiration times.
     *
     * IMPORTANT: This method has to be called from an event handler
     * that was started by the user like a button click, for example,
     * otherwise the popup will be blocked in most browsers.
     *
     * @param options The login options
     * @param config Configuration for the popup window
     */
    loginWithPopup(options, config) {
        return from(this.auth0Client.loginWithPopup(options, config).then(() => {
            this.authState.refresh();
        }));
    }
    /**
     * ```js
     * logout();
     * ```
     *
     * Clears the application session and performs a redirect to `/v2/logout`, using
     * the parameters provided as arguments, to clear the Auth0 session.
     * If the `federated` option is specified it also clears the Identity Provider session.
     * If the `localOnly` option is specified, it only clears the application session.
     * It is invalid to set both the `federated` and `localOnly` options to `true`,
     * and an error will be thrown if you do.
     * [Read more about how Logout works at Auth0](https://auth0.com/docs/logout).
     *
     * @param options The logout options
     */
    logout(options) {
        const logout = this.auth0Client.logout(options) || of(null);
        from(logout).subscribe(() => {
            if (options === null || options === void 0 ? void 0 : options.localOnly) {
                this.authState.refresh();
            }
        });
    }
    /**
     * ```js
     * getAccessTokenSilently(options).subscribe(token => ...)
     * ```
     *
     * If there's a valid token stored, return it. Otherwise, opens an
     * iframe with the `/authorize` URL using the parameters provided
     * as arguments. Random and secure `state` and `nonce` parameters
     * will be auto-generated. If the response is successful, results
     * will be valid according to their expiration times.
     *
     * If refresh tokens are used, the token endpoint is called directly with the
     * 'refresh_token' grant. If no refresh token is available to make this call,
     * the SDK falls back to using an iframe to the '/authorize' URL.
     *
     * This method may use a web worker to perform the token call if the in-memory
     * cache is used.
     *
     * If an `audience` value is given to this function, the SDK always falls
     * back to using an iframe to make the token exchange.
     *
     * Note that in all cases, falling back to an iframe requires access to
     * the `auth0` cookie, and thus will not work in browsers that block third-party
     * cookies by default (Safari, Brave, etc).
     *
     * @param options The options for configuring the token fetch.
     */
    getAccessTokenSilently(options = {}) {
        return of(this.auth0Client).pipe(concatMap((client) => options.detailedResponse === true
            ? client.getTokenSilently(Object.assign(Object.assign({}, options), { detailedResponse: true }))
            : client.getTokenSilently(options)), tap((token) => this.authState.setAccessToken(typeof token === 'string' ? token : token.access_token)), catchError((error) => {
            this.authState.setError(error);
            this.authState.refresh();
            return throwError(error);
        }));
    }
    /**
     * ```js
     * getTokenWithPopup(options).subscribe(token => ...)
     * ```
     *
     * Get an access token interactively.
     *
     * Opens a popup with the `/authorize` URL using the parameters
     * provided as arguments. Random and secure `state` and `nonce`
     * parameters will be auto-generated. If the response is successful,
     * results will be valid according to their expiration times.
     */
    getAccessTokenWithPopup(options) {
        return of(this.auth0Client).pipe(concatMap((client) => client.getTokenWithPopup(options)), tap((token) => this.authState.setAccessToken(token)), catchError((error) => {
            this.authState.setError(error);
            this.authState.refresh();
            return throwError(error);
        }));
    }
    /**
     * ```js
     * getUser(options).subscribe(user => ...);
     * ```
     *
     * Returns the user information if available (decoded
     * from the `id_token`).
     *
     * If you provide an audience or scope, they should match an existing Access Token
     * (the SDK stores a corresponding ID Token with every Access Token, and uses the
     * scope and audience to look up the ID Token)
     *
     * @remarks
     *
     * The returned observable will emit once and then complete.
     *
     * @typeparam TUser The type to return, has to extend {@link User}.
     * @param options The options to get the user
     */
    getUser(options) {
        return defer(() => this.auth0Client.getUser(options));
    }
    /**
     * ```js
     * getIdTokenClaims(options).subscribe(claims => ...);
     * ```
     *
     * Returns all claims from the id_token if available.
     *
     * If you provide an audience or scope, they should match an existing Access Token
     * (the SDK stores a corresponding ID Token with every Access Token, and uses the
     * scope and audience to look up the ID Token)
     *
     * @remarks
     *
     * The returned observable will emit once and then complete.
     *
     * @param options The options to get the Id token claims
     */
    getIdTokenClaims(options) {
        return defer(() => this.auth0Client.getIdTokenClaims(options));
    }
    /**
     * ```js
     * handleRedirectCallback(url).subscribe(result => ...)
     * ```
     *
     * After the browser redirects back to the callback page,
     * call `handleRedirectCallback` to handle success and error
     * responses from Auth0. If the response is successful, results
     * will be valid according to their expiration times.
     *
     * Calling this method also refreshes the authentication and user states.
     *
     * @param url The URL to that should be used to retrieve the `state` and `code` values. Defaults to `window.location.href` if not given.
     */
    handleRedirectCallback(url) {
        return defer(() => this.auth0Client.handleRedirectCallback(url)).pipe(withLatestFrom(this.authState.isLoading$), tap(([result, isLoading]) => {
            var _a;
            if (!isLoading) {
                this.authState.refresh();
            }
            const appState = result === null || result === void 0 ? void 0 : result.appState;
            const target = (_a = appState === null || appState === void 0 ? void 0 : appState.target) !== null && _a !== void 0 ? _a : '/';
            if (appState) {
                this.appStateSubject$.next(appState);
            }
            this.navigator.navigateByUrl(target);
        }), map(([result]) => result));
    }
    /**
     * ```js
     * buildAuthorizeUrl().subscribe(url => ...)
     * ```
     *
     * Builds an `/authorize` URL for loginWithRedirect using the parameters
     * provided as arguments. Random and secure `state` and `nonce`
     * parameters will be auto-generated.
     * @param options The options
     * @returns A URL to the authorize endpoint
     */
    buildAuthorizeUrl(options) {
        return defer(() => this.auth0Client.buildAuthorizeUrl(options));
    }
    /**
     * ```js
     * buildLogoutUrl().subscribe(url => ...)
     * ```
     * Builds a URL to the logout endpoint.
     *
     * @param options The options used to configure the parameters that appear in the logout endpoint URL.
     * @returns a URL to the logout endpoint using the parameters provided as arguments.
     */
    buildLogoutUrl(options) {
        return of(this.auth0Client.buildLogoutUrl(options));
    }
    shouldHandleCallback() {
        return of(location.search).pipe(map((search) => {
            return ((search.includes('code=') || search.includes('error=')) &&
                search.includes('state=') &&
                !this.configFactory.get().skipRedirectCallback);
        }));
    }
}
AuthService.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthService_Factory() { return new AuthService(i0.ɵɵinject(Auth0ClientService), i0.ɵɵinject(AuthClientConfig), i0.ɵɵinject(AbstractNavigator), i0.ɵɵinject(AuthState)); }, token: AuthService, providedIn: "root" });
AuthService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
AuthService.ctorParameters = () => [
    { type: Auth0Client, decorators: [{ type: Inject, args: [Auth0ClientService,] }] },
    { type: AuthClientConfig },
    { type: AbstractNavigator },
    { type: AuthState }
];

class AuthGuard {
    constructor(auth) {
        this.auth = auth;
    }
    canLoad(route, segments) {
        return this.auth.isAuthenticated$.pipe(take(1));
    }
    canActivate(next, state) {
        return this.redirectIfUnauthenticated(state);
    }
    canActivateChild(childRoute, state) {
        return this.redirectIfUnauthenticated(state);
    }
    redirectIfUnauthenticated(state) {
        return this.auth.isAuthenticated$.pipe(tap((loggedIn) => {
            if (!loggedIn) {
                this.auth.loginWithRedirect({
                    appState: { target: state.url },
                });
            }
        }));
    }
}
AuthGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthGuard_Factory() { return new AuthGuard(i0.ɵɵinject(AuthService)); }, token: AuthGuard, providedIn: "root" });
AuthGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
AuthGuard.ctorParameters = () => [
    { type: AuthService }
];

class AuthModule {
    /**
     * Initialize the authentication module system. Configuration can either be specified here,
     * or by calling AuthClientConfig.set (perhaps from an APP_INITIALIZER factory function).
     * @param config The optional configuration for the SDK.
     */
    static forRoot(config) {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService,
                AuthGuard,
                {
                    provide: AuthConfigService,
                    useValue: config,
                },
                {
                    provide: Auth0ClientService,
                    useFactory: Auth0ClientFactory.createClient,
                    deps: [AuthClientConfig],
                },
            ],
        };
    }
}
AuthModule.decorators = [
    { type: NgModule }
];

class AuthHttpInterceptor {
    constructor(configFactory, auth0Client, authState) {
        this.configFactory = configFactory;
        this.auth0Client = auth0Client;
        this.authState = authState;
    }
    intercept(req, next) {
        var _a;
        const config = this.configFactory.get();
        if (!((_a = config.httpInterceptor) === null || _a === void 0 ? void 0 : _a.allowedList)) {
            return next.handle(req);
        }
        return this.findMatchingRoute(req, config.httpInterceptor).pipe(concatMap((route) => iif(
        // Check if a route was matched
        () => route !== null, 
        // If we have a matching route, call getTokenSilently and attach the token to the
        // outgoing request
        of(route).pipe(pluck('tokenOptions'), concatMap((options) => {
            return this.getAccessTokenSilently(options).pipe(catchError((err) => {
                if (this.allowAnonymous(route, err)) {
                    return of('');
                }
                this.authState.setError(err);
                return throwError(err);
            }));
        }), switchMap((token) => {
            // Clone the request and attach the bearer token
            const clone = token
                ? req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${token}`),
                })
                : req;
            return next.handle(clone);
        })), 
        // If the URI being called was not found in our httpInterceptor config, simply
        // pass the request through without attaching a token
        next.handle(req))));
    }
    /**
     * Duplicate of AuthService.getAccessTokenSilently, but with a slightly different error handling.
     * Only used internally in the interceptor.
     * @param options The options for configuring the token fetch.
     */
    getAccessTokenSilently(options) {
        return of(this.auth0Client).pipe(concatMap((client) => client.getTokenSilently(options)), tap((token) => this.authState.setAccessToken(token)), catchError((error) => {
            this.authState.refresh();
            return throwError(error);
        }));
    }
    /**
     * Strips the query and fragment from the given uri
     * @param uri The uri to remove the query and fragment from
     */
    stripQueryFrom(uri) {
        if (uri.indexOf('?') > -1) {
            uri = uri.substr(0, uri.indexOf('?'));
        }
        if (uri.indexOf('#') > -1) {
            uri = uri.substr(0, uri.indexOf('#'));
        }
        return uri;
    }
    /**
     * Determines whether the specified route can have an access token attached to it, based on matching the HTTP request against
     * the interceptor route configuration.
     * @param route The route to test
     * @param request The HTTP request
     */
    canAttachToken(route, request) {
        const testPrimitive = (value) => {
            if (!value) {
                return false;
            }
            const requestPath = this.stripQueryFrom(request.url);
            if (value === requestPath) {
                return true;
            }
            // If the URL ends with an asterisk, match using startsWith.
            return (value.indexOf('*') === value.length - 1 &&
                request.url.startsWith(value.substr(0, value.length - 1)));
        };
        if (isHttpInterceptorRouteConfig(route)) {
            if (route.httpMethod && route.httpMethod !== request.method) {
                return false;
            }
            /* istanbul ignore if */
            if (!route.uri && !route.uriMatcher) {
                console.warn('Either a uri or uriMatcher is required when configuring the HTTP interceptor.');
            }
            return route.uriMatcher
                ? route.uriMatcher(request.url)
                : testPrimitive(route.uri);
        }
        return testPrimitive(route);
    }
    /**
     * Tries to match a route from the SDK configuration to the HTTP request.
     * If a match is found, the route configuration is returned.
     * @param request The Http request
     * @param config HttpInterceptorConfig
     */
    findMatchingRoute(request, config) {
        return from(config.allowedList).pipe(first((route) => this.canAttachToken(route, request), null));
    }
    allowAnonymous(route, err) {
        return (!!route &&
            isHttpInterceptorRouteConfig(route) &&
            !!route.allowAnonymous &&
            ['login_required', 'consent_required'].includes(err.error));
    }
}
AuthHttpInterceptor.decorators = [
    { type: Injectable }
];
AuthHttpInterceptor.ctorParameters = () => [
    { type: AuthClientConfig },
    { type: Auth0Client, decorators: [{ type: Inject, args: [Auth0ClientService,] }] },
    { type: AuthState }
];

/*
 * Public API Surface of auth0-angular
 */

/**
 * Generated bundle index. Do not edit.
 */

export { Auth0ClientFactory, Auth0ClientService, AuthClientConfig, AuthConfigService, AuthGuard, AuthHttpInterceptor, AuthModule, AuthService, AuthState, isHttpInterceptorRouteConfig, AbstractNavigator as ɵa };
//# sourceMappingURL=auth0-auth0-angular.js.map
