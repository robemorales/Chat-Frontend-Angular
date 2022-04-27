import { OnDestroy } from '@angular/core';
import { Auth0Client, RedirectLoginOptions, PopupLoginOptions, PopupConfigOptions, LogoutOptions, GetTokenSilentlyOptions, GetTokenWithPopupOptions, RedirectLoginResult, LogoutUrlOptions, GetTokenSilentlyVerboseResponse, GetUserOptions, User, GetIdTokenClaimsOptions, IdToken } from '@auth0/auth0-spa-js';
import { Observable } from 'rxjs';
import { AbstractNavigator } from './abstract-navigator';
import { AuthClientConfig, AppState } from './auth.config';
import { AuthState } from './auth.state';
import * as ɵngcc0 from '@angular/core';
export declare class AuthService<TAppState extends AppState = AppState> implements OnDestroy {
    private auth0Client;
    private configFactory;
    private navigator;
    private authState;
    private appStateSubject$;
    private ngUnsubscribe$;
    /**
     * Emits boolean values indicating the loading state of the SDK.
     */
    readonly isLoading$: Observable<boolean>;
    /**
     * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
     * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
     */
    readonly isAuthenticated$: Observable<boolean>;
    /**
     * Emits details about the authenticated user, or null if not authenticated.
     */
    readonly user$: Observable<User | null | undefined>;
    /**
     * Emits ID token claims when authenticated, or null if not authenticated.
     */
    readonly idTokenClaims$: Observable<IdToken | null | undefined>;
    /**
     * Emits errors that occur during login, or when checking for an active session on startup.
     */
    readonly error$: Observable<Error>;
    /**
     * Emits the value (if any) that was passed to the `loginWithRedirect` method call
     * but only **after** `handleRedirectCallback` is first called
     */
    readonly appState$: Observable<TAppState>;
    constructor(auth0Client: Auth0Client, configFactory: AuthClientConfig, navigator: AbstractNavigator, authState: AuthState);
    /**
     * Called when the service is destroyed
     */
    ngOnDestroy(): void;
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
    loginWithRedirect(options?: RedirectLoginOptions<TAppState>): Observable<void>;
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
    loginWithPopup(options?: PopupLoginOptions, config?: PopupConfigOptions): Observable<void>;
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
    logout(options?: LogoutOptions): void;
    /**
     * Fetches a new access token and returns the response from the /oauth/token endpoint, omitting the refresh token.
     *
     * @param options The options for configuring the token fetch.
     */
    getAccessTokenSilently(options: GetTokenSilentlyOptions & {
        detailedResponse: true;
    }): Observable<GetTokenSilentlyVerboseResponse>;
    /**
     * Fetches a new access token and returns it.
     *
     * @param options The options for configuring the token fetch.
     */
    getAccessTokenSilently(options?: GetTokenSilentlyOptions): Observable<string>;
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
    getAccessTokenWithPopup(options?: GetTokenWithPopupOptions): Observable<string>;
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
    getUser<TUser extends User>(options?: GetUserOptions): Observable<TUser | undefined>;
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
    getIdTokenClaims(options?: GetIdTokenClaimsOptions): Observable<IdToken | undefined>;
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
    handleRedirectCallback(url?: string): Observable<RedirectLoginResult<TAppState>>;
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
    buildAuthorizeUrl(options?: RedirectLoginOptions): Observable<string>;
    /**
     * ```js
     * buildLogoutUrl().subscribe(url => ...)
     * ```
     * Builds a URL to the logout endpoint.
     *
     * @param options The options used to configure the parameters that appear in the logout endpoint URL.
     * @returns a URL to the logout endpoint using the parameters provided as arguments.
     */
    buildLogoutUrl(options?: LogoutUrlOptions): Observable<string>;
    private shouldHandleCallback;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<AuthService<any>, never>;
}

//# sourceMappingURL=auth.service.d.ts.map