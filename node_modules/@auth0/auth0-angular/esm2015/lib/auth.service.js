import { Injectable, Inject } from '@angular/core';
import { Auth0Client, } from '@auth0/auth0-spa-js';
import { of, from, Subject, iif, defer, ReplaySubject, throwError, } from 'rxjs';
import { concatMap, tap, map, takeUntil, catchError, switchMap, withLatestFrom, } from 'rxjs/operators';
import { Auth0ClientService } from './auth.client';
import { AbstractNavigator } from './abstract-navigator';
import { AuthClientConfig } from './auth.config';
import { AuthState } from './auth.state';
import * as i0 from "@angular/core";
import * as i1 from "./auth.client";
import * as i2 from "./auth.config";
import * as i3 from "./abstract-navigator";
import * as i4 from "./auth.state";
export class AuthService {
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
AuthService.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthService_Factory() { return new AuthService(i0.ɵɵinject(i1.Auth0ClientService), i0.ɵɵinject(i2.AuthClientConfig), i0.ɵɵinject(i3.AbstractNavigator), i0.ɵɵinject(i4.AuthState)); }, token: AuthService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYXV0aDAtYW5ndWxhci9zcmMvbGliL2F1dGguc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQ0wsV0FBVyxHQWNaLE1BQU0scUJBQXFCLENBQUM7QUFFN0IsT0FBTyxFQUNMLEVBQUUsRUFDRixJQUFJLEVBQ0osT0FBTyxFQUVQLEdBQUcsRUFDSCxLQUFLLEVBQ0wsYUFBYSxFQUNiLFVBQVUsR0FDWCxNQUFNLE1BQU0sQ0FBQztBQUVkLE9BQU8sRUFDTCxTQUFTLEVBQ1QsR0FBRyxFQUNILEdBQUcsRUFDSCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFNBQVMsRUFDVCxjQUFjLEdBQ2YsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUFFLGdCQUFnQixFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7Ozs7OztBQUt6QyxNQUFNLE9BQU8sV0FBVztJQXNDdEIsWUFDc0MsV0FBd0IsRUFDcEQsYUFBK0IsRUFDL0IsU0FBNEIsRUFDNUIsU0FBb0I7UUFIUSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUNwRCxrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFDL0IsY0FBUyxHQUFULFNBQVMsQ0FBbUI7UUFDNUIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQXhDdEIscUJBQWdCLEdBQUcsSUFBSSxhQUFhLENBQVksQ0FBQyxDQUFDLENBQUM7UUFFM0QsdUNBQXVDO1FBQy9CLG1CQUFjLEdBQUcsSUFBSSxPQUFPLEVBQVEs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YUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUMvQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7Ozs7WUFoWEYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7WUE1Q0MsV0FBVyx1QkFvRlIsTUFBTSxTQUFDLGtCQUFrQjtZQTdDckIsZ0JBQWdCO1lBRGhCLGlCQUFpQjtZQUVqQixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQXV0aDBDbGllbnQsXG4gIFJlZGlyZWN0TG9naW5PcHRpb25zLFxuICBQb3B1cExvZ2luT3B0aW9ucyxcbiAgUG9wdXBDb25maWdPcHRpb25zLFxuICBMb2dvdXRPcHRpb25zLFxuICBHZXRUb2tlblNpbGVudGx5T3B0aW9ucyxcbiAgR2V0VG9rZW5XaXRoUG9wdXBPcHRpb25zLFxuICBSZWRpcmVjdExvZ2luUmVzdWx0LFxuICBMb2dvdXRVcmxPcHRpb25zLFxuICBHZXRUb2tlblNpbGVudGx5VmVyYm9zZVJlc3BvbnNlLFxuICBHZXRVc2VyT3B0aW9ucyxcbiAgVXNlcixcbiAgR2V0SWRUb2tlbkNsYWltc09wdGlvbnMsXG4gIElkVG9rZW4sXG59IGZyb20gJ0BhdXRoMC9hdXRoMC1zcGEtanMnO1xuXG5pbXBvcnQge1xuICBvZixcbiAgZnJvbSxcbiAgU3ViamVjdCxcbiAgT2JzZXJ2YWJsZSxcbiAgaWlmLFxuICBkZWZlcixcbiAgUmVwbGF5U3ViamVjdCxcbiAgdGhyb3dFcnJvcixcbn0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7XG4gIGNvbmNhdE1hcCxcbiAgdGFwLFxuICBtYXAsXG4gIHRha2VVbnRpbCxcbiAgY2F0Y2hFcnJvcixcbiAgc3dpdGNoTWFwLFxuICB3aXRoTGF0ZXN0RnJvbSxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBBdXRoMENsaWVudFNlcnZpY2UgfSBmcm9tICcuL2F1dGguY2xpZW50JztcbmltcG9ydCB7IEFic3RyYWN0TmF2aWdhdG9yIH0gZnJvbSAnLi9hYnN0cmFjdC1uYXZpZ2F0b3InO1xuaW1wb3J0IHsgQXV0aENsaWVudENvbmZpZywgQXBwU3RhdGUgfSBmcm9tICcuL2F1dGguY29uZmlnJztcbmltcG9ydCB7IEF1dGhTdGF0ZSB9IGZyb20gJy4vYXV0aC5zdGF0ZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZTxUQXBwU3RhdGUgZXh0ZW5kcyBBcHBTdGF0ZSA9IEFwcFN0YXRlPlxuICBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgYXBwU3RhdGVTdWJqZWN0JCA9IG5ldyBSZXBsYXlTdWJqZWN0PFRBcHBTdGF0ZT4oMSk7XG5cbiAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQxMTc3MTYzXG4gIHByaXZhdGUgbmdVbnN1YnNjcmliZSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAvKipcbiAgICogRW1pdHMgYm9vbGVhbiB2YWx1ZXMgaW5kaWNhdGluZyB0aGUgbG9hZGluZyBzdGF0ZSBvZiB0aGUgU0RLLlxuICAgKi9cbiAgcmVhZG9ubHkgaXNMb2FkaW5nJCA9IHRoaXMuYXV0aFN0YXRlLmlzTG9hZGluZyQ7XG5cbiAgLyoqXG4gICAqIEVtaXRzIGJvb2xlYW4gdmFsdWVzIGluZGljYXRpbmcgdGhlIGF1dGhlbnRpY2F0aW9uIHN0YXRlIG9mIHRoZSB1c2VyLiBJZiBgdHJ1ZWAsIGl0IG1lYW5zIGEgdXNlciBoYXMgYXV0aGVudGljYXRlZC5cbiAgICogVGhpcyBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiBgaXNMb2FkaW5nJGAsIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gbWFudWFsbHkgY2hlY2sgdGhlIGxvYWRpbmcgc3RhdGUgb2YgdGhlIFNESy5cbiAgICovXG4gIHJlYWRvbmx5IGlzQXV0aGVudGljYXRlZCQgPSB0aGlzLmF1dGhTdGF0ZS5pc0F1dGhlbnRpY2F0ZWQkO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBkZXRhaWxzIGFib3V0IHRoZSBhdXRoZW50aWNhdGVkIHVzZXIsIG9yIG51bGwgaWYgbm90IGF1dGhlbnRpY2F0ZWQuXG4gICAqL1xuICByZWFkb25seSB1c2VyJCA9IHRoaXMuYXV0aFN0YXRlLnVzZXIkO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBJRCB0b2tlbiBjbGFpbXMgd2hlbiBhdXRoZW50aWNhdGVkLCBvciBudWxsIGlmIG5vdCBhdXRoZW50aWNhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgaWRUb2tlbkNsYWltcyQgPSB0aGlzLmF1dGhTdGF0ZS5pZFRva2VuQ2xhaW1zJDtcblxuICAvKipcbiAgICogRW1pdHMgZXJyb3JzIHRoYXQgb2NjdXIgZHVyaW5nIGxvZ2luLCBvciB3aGVuIGNoZWNraW5nIGZvciBhbiBhY3RpdmUgc2Vzc2lvbiBvbiBzdGFydHVwLlxuICAgKi9cbiAgcmVhZG9ubHkgZXJyb3IkID0gdGhpcy5hdXRoU3RhdGUuZXJyb3IkO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgdmFsdWUgKGlmIGFueSkgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSBgbG9naW5XaXRoUmVkaXJlY3RgIG1ldGhvZCBjYWxsXG4gICAqIGJ1dCBvbmx5ICoqYWZ0ZXIqKiBgaGFuZGxlUmVkaXJlY3RDYWxsYmFja2AgaXMgZmlyc3QgY2FsbGVkXG4gICAqL1xuICByZWFkb25seSBhcHBTdGF0ZSQgPSB0aGlzLmFwcFN0YXRlU3ViamVjdCQuYXNPYnNlcnZhYmxlKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChBdXRoMENsaWVudFNlcnZpY2UpIHByaXZhdGUgYXV0aDBDbGllbnQ6IEF1dGgwQ2xpZW50LFxuICAgIHByaXZhdGUgY29uZmlnRmFjdG9yeTogQXV0aENsaWVudENvbmZpZyxcbiAgICBwcml2YXRlIG5hdmlnYXRvcjogQWJzdHJhY3ROYXZpZ2F0b3IsXG4gICAgcHJpdmF0ZSBhdXRoU3RhdGU6IEF1dGhTdGF0ZVxuICApIHtcbiAgICBjb25zdCBjaGVja1Nlc3Npb25PckNhbGxiYWNrJCA9IChpc0NhbGxiYWNrOiBib29sZWFuKSA9PlxuICAgICAgaWlmKFxuICAgICAgICAoKSA9PiBpc0NhbGxiYWNrLFxuICAgICAgICB0aGlzLmhhbmRsZVJlZGlyZWN0Q2FsbGJhY2soKSxcbiAgICAgICAgZGVmZXIoKCkgPT4gdGhpcy5hdXRoMENsaWVudC5jaGVja1Nlc3Npb24oKSlcbiAgICAgICk7XG5cbiAgICB0aGlzLnNob3VsZEhhbmRsZUNhbGxiYWNrKClcbiAgICAgIC5waXBlKFxuICAgICAgICBzd2l0Y2hNYXAoKGlzQ2FsbGJhY2spID0+XG4gICAgICAgICAgY2hlY2tTZXNzaW9uT3JDYWxsYmFjayQoaXNDYWxsYmFjaykucGlwZShcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29uZmlnRmFjdG9yeS5nZXQoKTtcbiAgICAgICAgICAgICAgdGhpcy5hdXRoU3RhdGUuc2V0RXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRvci5uYXZpZ2F0ZUJ5VXJsKGNvbmZpZy5lcnJvclBhdGggfHwgJy8nKTtcbiAgICAgICAgICAgICAgcmV0dXJuIG9mKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmF1dGhTdGF0ZS5zZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9KSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMubmdVbnN1YnNjcmliZSQpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHNlcnZpY2UgaXMgZGVzdHJveWVkXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDExNzcxNjNcbiAgICB0aGlzLm5nVW5zdWJzY3JpYmUkLm5leHQoKTtcbiAgICB0aGlzLm5nVW5zdWJzY3JpYmUkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogYGBganNcbiAgICogbG9naW5XaXRoUmVkaXJlY3Qob3B0aW9ucyk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBQZXJmb3JtcyBhIHJlZGlyZWN0IHRvIGAvYXV0aG9yaXplYCB1c2luZyB0aGUgcGFyYW1ldGVyc1xuICAgKiBwcm92aWRlZCBhcyBhcmd1bWVudHMuIFJhbmRvbSBhbmQgc2VjdXJlIGBzdGF0ZWAgYW5kIGBub25jZWBcbiAgICogcGFyYW1ldGVycyB3aWxsIGJlIGF1dG8tZ2VuZXJhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgbG9naW4gb3B0aW9uc1xuICAgKi9cbiAgbG9naW5XaXRoUmVkaXJlY3QoXG4gICAgb3B0aW9ucz86IFJlZGlyZWN0TG9naW5PcHRpb25zPFRBcHBTdGF0ZT5cbiAgKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIGZyb20odGhpcy5hdXRoMENsaWVudC5sb2dpbldpdGhSZWRpcmVjdChvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogYGBganNcbiAgICogYXdhaXQgbG9naW5XaXRoUG9wdXAob3B0aW9ucyk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBPcGVucyBhIHBvcHVwIHdpdGggdGhlIGAvYXV0aG9yaXplYCBVUkwgdXNpbmcgdGhlIHBhcmFtZXRlcnNcbiAgICogcHJvdmlkZWQgYXMgYXJndW1lbnRzLiBSYW5kb20gYW5kIHNlY3VyZSBgc3RhdGVgIGFuZCBgbm9uY2VgXG4gICAqIHBhcmFtZXRlcnMgd2lsbCBiZSBhdXRvLWdlbmVyYXRlZC4gSWYgdGhlIHJlc3BvbnNlIGlzIHN1Y2Nlc3NmdWwsXG4gICAqIHJlc3VsdHMgd2lsbCBiZSB2YWxpZCBhY2NvcmRpbmcgdG8gdGhlaXIgZXhwaXJhdGlvbiB0aW1lcy5cbiAgICpcbiAgICogSU1QT1JUQU5UOiBUaGlzIG1ldGhvZCBoYXMgdG8gYmUgY2FsbGVkIGZyb20gYW4gZXZlbnQgaGFuZGxlclxuICAgKiB0aGF0IHdhcyBzdGFydGVkIGJ5IHRoZSB1c2VyIGxpa2UgYSBidXR0b24gY2xpY2ssIGZvciBleGFtcGxlLFxuICAgKiBvdGhlcndpc2UgdGhlIHBvcHVwIHdpbGwgYmUgYmxvY2tlZCBpbiBtb3N0IGJyb3dzZXJzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgbG9naW4gb3B0aW9uc1xuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBwb3B1cCB3aW5kb3dcbiAgICovXG4gIGxvZ2luV2l0aFBvcHVwKFxuICAgIG9wdGlvbnM/OiBQb3B1cExvZ2luT3B0aW9ucyxcbiAgICBjb25maWc/OiBQb3B1cENvbmZpZ09wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIGZyb20oXG4gICAgICB0aGlzLmF1dGgwQ2xpZW50LmxvZ2luV2l0aFBvcHVwKG9wdGlvbnMsIGNvbmZpZykudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuYXV0aFN0YXRlLnJlZnJlc2goKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgYGBqc1xuICAgKiBsb2dvdXQoKTtcbiAgICogYGBgXG4gICAqXG4gICAqIENsZWFycyB0aGUgYXBwbGljYXRpb24gc2Vzc2lvbiBhbmQgcGVyZm9ybXMgYSByZWRpcmVjdCB0byBgL3YyL2xvZ291dGAsIHVzaW5nXG4gICAqIHRoZSBwYXJhbWV0ZXJzIHByb3ZpZGVkIGFzIGFyZ3VtZW50cywgdG8gY2xlYXIgdGhlIEF1dGgwIHNlc3Npb24uXG4gICAqIElmIHRoZSBgZmVkZXJhdGVkYCBvcHRpb24gaXMgc3BlY2lmaWVkIGl0IGFsc28gY2xlYXJzIHRoZSBJZGVudGl0eSBQcm92aWRlciBzZXNzaW9uLlxuICAgKiBJZiB0aGUgYGxvY2FsT25seWAgb3B0aW9uIGlzIHNwZWNpZmllZCwgaXQgb25seSBjbGVhcnMgdGhlIGFwcGxpY2F0aW9uIHNlc3Npb24uXG4gICAqIEl0IGlzIGludmFsaWQgdG8gc2V0IGJvdGggdGhlIGBmZWRlcmF0ZWRgIGFuZCBgbG9jYWxPbmx5YCBvcHRpb25zIHRvIGB0cnVlYCxcbiAgICogYW5kIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duIGlmIHlvdSBkby5cbiAgICogW1JlYWQgbW9yZSBhYm91dCBob3cgTG9nb3V0IHdvcmtzIGF0IEF1dGgwXShodHRwczovL2F1dGgwLmNvbS9kb2NzL2xvZ291dCkuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIFRoZSBsb2dvdXQgb3B0aW9uc1xuICAgKi9cbiAgbG9nb3V0KG9wdGlvbnM/OiBMb2dvdXRPcHRpb25zKTogdm9pZCB7XG4gICAgY29uc3QgbG9nb3V0ID0gdGhpcy5hdXRoMENsaWVudC5sb2dvdXQob3B0aW9ucykgfHwgb2YobnVsbCk7XG5cbiAgICBmcm9tKGxvZ291dCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zPy5sb2NhbE9ubHkpIHtcbiAgICAgICAgdGhpcy5hdXRoU3RhdGUucmVmcmVzaCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgYSBuZXcgYWNjZXNzIHRva2VuIGFuZCByZXR1cm5zIHRoZSByZXNwb25zZSBmcm9tIHRoZSAvb2F1dGgvdG9rZW4gZW5kcG9pbnQsIG9taXR0aW5nIHRoZSByZWZyZXNoIHRva2VuLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHRva2VuIGZldGNoLlxuICAgKi9cbiAgZ2V0QWNjZXNzVG9rZW5TaWxlbnRseShcbiAgICBvcHRpb25zOiBHZXRUb2tlblNpbGVudGx5T3B0aW9ucyAmIHsgZGV0YWlsZWRSZXNwb25zZTogdHJ1ZSB9XG4gICk6IE9ic2VydmFibGU8R2V0VG9rZW5TaWxlbnRseVZlcmJvc2VSZXNwb25zZT47XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgYSBuZXcgYWNjZXNzIHRva2VuIGFuZCByZXR1cm5zIGl0LlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHRva2VuIGZldGNoLlxuICAgKi9cbiAgZ2V0QWNjZXNzVG9rZW5TaWxlbnRseShvcHRpb25zPzogR2V0VG9rZW5TaWxlbnRseU9wdGlvbnMpOiBPYnNlcnZhYmxlPHN0cmluZz47XG5cbiAgLyoqXG4gICAqIGBgYGpzXG4gICAqIGdldEFjY2Vzc1Rva2VuU2lsZW50bHkob3B0aW9ucykuc3Vic2NyaWJlKHRva2VuID0+IC4uLilcbiAgICogYGBgXG4gICAqXG4gICAqIElmIHRoZXJlJ3MgYSB2YWxpZCB0b2tlbiBzdG9yZWQsIHJldHVybiBpdC4gT3RoZXJ3aXNlLCBvcGVucyBhblxuICAgKiBpZnJhbWUgd2l0aCB0aGUgYC9hdXRob3JpemVgIFVSTCB1c2luZyB0aGUgcGFyYW1ldGVycyBwcm92aWRlZFxuICAgKiBhcyBhcmd1bWVudHMuIFJhbmRvbSBhbmQgc2VjdXJlIGBzdGF0ZWAgYW5kIGBub25jZWAgcGFyYW1ldGVyc1xuICAgKiB3aWxsIGJlIGF1dG8tZ2VuZXJhdGVkLiBJZiB0aGUgcmVzcG9uc2UgaXMgc3VjY2Vzc2Z1bCwgcmVzdWx0c1xuICAgKiB3aWxsIGJlIHZhbGlkIGFjY29yZGluZyB0byB0aGVpciBleHBpcmF0aW9uIHRpbWVzLlxuICAgKlxuICAgKiBJZiByZWZyZXNoIHRva2VucyBhcmUgdXNlZCwgdGhlIHRva2VuIGVuZHBvaW50IGlzIGNhbGxlZCBkaXJlY3RseSB3aXRoIHRoZVxuICAgKiAncmVmcmVzaF90b2tlbicgZ3JhbnQuIElmIG5vIHJlZnJlc2ggdG9rZW4gaXMgYXZhaWxhYmxlIHRvIG1ha2UgdGhpcyBjYWxsLFxuICAgKiB0aGUgU0RLIGZhbGxzIGJhY2sgdG8gdXNpbmcgYW4gaWZyYW1lIHRvIHRoZSAnL2F1dGhvcml6ZScgVVJMLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBtYXkgdXNlIGEgd2ViIHdvcmtlciB0byBwZXJmb3JtIHRoZSB0b2tlbiBjYWxsIGlmIHRoZSBpbi1tZW1vcnlcbiAgICogY2FjaGUgaXMgdXNlZC5cbiAgICpcbiAgICogSWYgYW4gYGF1ZGllbmNlYCB2YWx1ZSBpcyBnaXZlbiB0byB0aGlzIGZ1bmN0aW9uLCB0aGUgU0RLIGFsd2F5cyBmYWxsc1xuICAgKiBiYWNrIHRvIHVzaW5nIGFuIGlmcmFtZSB0byBtYWtlIHRoZSB0b2tlbiBleGNoYW5nZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IGluIGFsbCBjYXNlcywgZmFsbGluZyBiYWNrIHRvIGFuIGlmcmFtZSByZXF1aXJlcyBhY2Nlc3MgdG9cbiAgICogdGhlIGBhdXRoMGAgY29va2llLCBhbmQgdGh1cyB3aWxsIG5vdCB3b3JrIGluIGJyb3dzZXJzIHRoYXQgYmxvY2sgdGhpcmQtcGFydHlcbiAgICogY29va2llcyBieSBkZWZhdWx0IChTYWZhcmksIEJyYXZlLCBldGMpLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHRva2VuIGZldGNoLlxuICAgKi9cbiAgZ2V0QWNjZXNzVG9rZW5TaWxlbnRseShcbiAgICBvcHRpb25zOiBHZXRUb2tlblNpbGVudGx5T3B0aW9ucyA9IHt9XG4gICk6IE9ic2VydmFibGU8c3RyaW5nIHwgR2V0VG9rZW5TaWxlbnRseVZlcmJvc2VSZXNwb25zZT4ge1xuICAgIHJldHVybiBvZih0aGlzLmF1dGgwQ2xpZW50KS5waXBlKFxuICAgICAgY29uY2F0TWFwKChjbGllbnQpID0+XG4gICAgICAgIG9wdGlvbnMuZGV0YWlsZWRSZXNwb25zZSA9PT0gdHJ1ZVxuICAgICAgICAgID8gY2xpZW50LmdldFRva2VuU2lsZW50bHkoeyAuLi5vcHRpb25zLCBkZXRhaWxlZFJlc3BvbnNlOiB0cnVlIH0pXG4gICAgICAgICAgOiBjbGllbnQuZ2V0VG9rZW5TaWxlbnRseShvcHRpb25zKVxuICAgICAgKSxcbiAgICAgIHRhcCgodG9rZW4pID0+XG4gICAgICAgIHRoaXMuYXV0aFN0YXRlLnNldEFjY2Vzc1Rva2VuKFxuICAgICAgICAgIHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycgPyB0b2tlbiA6IHRva2VuLmFjY2Vzc190b2tlblxuICAgICAgICApXG4gICAgICApLFxuICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5hdXRoU3RhdGUuc2V0RXJyb3IoZXJyb3IpO1xuICAgICAgICB0aGlzLmF1dGhTdGF0ZS5yZWZyZXNoKCk7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgYGBqc1xuICAgKiBnZXRUb2tlbldpdGhQb3B1cChvcHRpb25zKS5zdWJzY3JpYmUodG9rZW4gPT4gLi4uKVxuICAgKiBgYGBcbiAgICpcbiAgICogR2V0IGFuIGFjY2VzcyB0b2tlbiBpbnRlcmFjdGl2ZWx5LlxuICAgKlxuICAgKiBPcGVucyBhIHBvcHVwIHdpdGggdGhlIGAvYXV0aG9yaXplYCBVUkwgdXNpbmcgdGhlIHBhcmFtZXRlcnNcbiAgICogcHJvdmlkZWQgYXMgYXJndW1lbnRzLiBSYW5kb20gYW5kIHNlY3VyZSBgc3RhdGVgIGFuZCBgbm9uY2VgXG4gICAqIHBhcmFtZXRlcnMgd2lsbCBiZSBhdXRvLWdlbmVyYXRlZC4gSWYgdGhlIHJlc3BvbnNlIGlzIHN1Y2Nlc3NmdWwsXG4gICAqIHJlc3VsdHMgd2lsbCBiZSB2YWxpZCBhY2NvcmRpbmcgdG8gdGhlaXIgZXhwaXJhdGlvbiB0aW1lcy5cbiAgICovXG4gIGdldEFjY2Vzc1Rva2VuV2l0aFBvcHVwKFxuICAgIG9wdGlvbnM/OiBHZXRUb2tlbldpdGhQb3B1cE9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gb2YodGhpcy5hdXRoMENsaWVudCkucGlwZShcbiAgICAgIGNvbmNhdE1hcCgoY2xpZW50KSA9PiBjbGllbnQuZ2V0VG9rZW5XaXRoUG9wdXAob3B0aW9ucykpLFxuICAgICAgdGFwKCh0b2tlbikgPT4gdGhpcy5hdXRoU3RhdGUuc2V0QWNjZXNzVG9rZW4odG9rZW4pKSxcbiAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuYXV0aFN0YXRlLnNldEVycm9yKGVycm9yKTtcbiAgICAgICAgdGhpcy5hdXRoU3RhdGUucmVmcmVzaCgpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogYGBganNcbiAgICogZ2V0VXNlcihvcHRpb25zKS5zdWJzY3JpYmUodXNlciA9PiAuLi4pO1xuICAgKiBgYGBcbiAgICpcbiAgICogUmV0dXJucyB0aGUgdXNlciBpbmZvcm1hdGlvbiBpZiBhdmFpbGFibGUgKGRlY29kZWRcbiAgICogZnJvbSB0aGUgYGlkX3Rva2VuYCkuXG4gICAqXG4gICAqIElmIHlvdSBwcm92aWRlIGFuIGF1ZGllbmNlIG9yIHNjb3BlLCB0aGV5IHNob3VsZCBtYXRjaCBhbiBleGlzdGluZyBBY2Nlc3MgVG9rZW5cbiAgICogKHRoZSBTREsgc3RvcmVzIGEgY29ycmVzcG9uZGluZyBJRCBUb2tlbiB3aXRoIGV2ZXJ5IEFjY2VzcyBUb2tlbiwgYW5kIHVzZXMgdGhlXG4gICAqIHNjb3BlIGFuZCBhdWRpZW5jZSB0byBsb29rIHVwIHRoZSBJRCBUb2tlbilcbiAgICpcbiAgICogQHJlbWFya3NcbiAgICpcbiAgICogVGhlIHJldHVybmVkIG9ic2VydmFibGUgd2lsbCBlbWl0IG9uY2UgYW5kIHRoZW4gY29tcGxldGUuXG4gICAqXG4gICAqIEB0eXBlcGFyYW0gVFVzZXIgVGhlIHR5cGUgdG8gcmV0dXJuLCBoYXMgdG8gZXh0ZW5kIHtAbGluayBVc2VyfS5cbiAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgdG8gZ2V0IHRoZSB1c2VyXG4gICAqL1xuICBnZXRVc2VyPFRVc2VyIGV4dGVuZHMgVXNlcj4oXG4gICAgb3B0aW9ucz86IEdldFVzZXJPcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFVzZXIgfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gZGVmZXIoKCkgPT4gdGhpcy5hdXRoMENsaWVudC5nZXRVc2VyPFRVc2VyPihvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogYGBganNcbiAgICogZ2V0SWRUb2tlbkNsYWltcyhvcHRpb25zKS5zdWJzY3JpYmUoY2xhaW1zID0+IC4uLik7XG4gICAqIGBgYFxuICAgKlxuICAgKiBSZXR1cm5zIGFsbCBjbGFpbXMgZnJvbSB0aGUgaWRfdG9rZW4gaWYgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBJZiB5b3UgcHJvdmlkZSBhbiBhdWRpZW5jZSBvciBzY29wZSwgdGhleSBzaG91bGQgbWF0Y2ggYW4gZXhpc3RpbmcgQWNjZXNzIFRva2VuXG4gICAqICh0aGUgU0RLIHN0b3JlcyBhIGNvcnJlc3BvbmRpbmcgSUQgVG9rZW4gd2l0aCBldmVyeSBBY2Nlc3MgVG9rZW4sIGFuZCB1c2VzIHRoZVxuICAgKiBzY29wZSBhbmQgYXVkaWVuY2UgdG8gbG9vayB1cCB0aGUgSUQgVG9rZW4pXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHdpbGwgZW1pdCBvbmNlIGFuZCB0aGVuIGNvbXBsZXRlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBnZXQgdGhlIElkIHRva2VuIGNsYWltc1xuICAgKi9cbiAgZ2V0SWRUb2tlbkNsYWltcyhcbiAgICBvcHRpb25zPzogR2V0SWRUb2tlbkNsYWltc09wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxJZFRva2VuIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIGRlZmVyKCgpID0+IHRoaXMuYXV0aDBDbGllbnQuZ2V0SWRUb2tlbkNsYWltcyhvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogYGBganNcbiAgICogaGFuZGxlUmVkaXJlY3RDYWxsYmFjayh1cmwpLnN1YnNjcmliZShyZXN1bHQgPT4gLi4uKVxuICAgKiBgYGBcbiAgICpcbiAgICogQWZ0ZXIgdGhlIGJyb3dzZXIgcmVkaXJlY3RzIGJhY2sgdG8gdGhlIGNhbGxiYWNrIHBhZ2UsXG4gICAqIGNhbGwgYGhhbmRsZVJlZGlyZWN0Q2FsbGJhY2tgIHRvIGhhbmRsZSBzdWNjZXNzIGFuZCBlcnJvclxuICAgKiByZXNwb25zZXMgZnJvbSBBdXRoMC4gSWYgdGhlIHJlc3BvbnNlIGlzIHN1Y2Nlc3NmdWwsIHJlc3VsdHNcbiAgICogd2lsbCBiZSB2YWxpZCBhY2NvcmRpbmcgdG8gdGhlaXIgZXhwaXJhdGlvbiB0aW1lcy5cbiAgICpcbiAgICogQ2FsbGluZyB0aGlzIG1ldGhvZCBhbHNvIHJlZnJlc2hlcyB0aGUgYXV0aGVudGljYXRpb24gYW5kIHVzZXIgc3RhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0gdXJsIFRoZSBVUkwgdG8gdGhhdCBzaG91bGQgYmUgdXNlZCB0byByZXRyaWV2ZSB0aGUgYHN0YXRlYCBhbmQgYGNvZGVgIHZhbHVlcy4gRGVmYXVsdHMgdG8gYHdpbmRvdy5sb2NhdGlvbi5ocmVmYCBpZiBub3QgZ2l2ZW4uXG4gICAqL1xuICBoYW5kbGVSZWRpcmVjdENhbGxiYWNrKFxuICAgIHVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFJlZGlyZWN0TG9naW5SZXN1bHQ8VEFwcFN0YXRlPj4ge1xuICAgIHJldHVybiBkZWZlcigoKSA9PlxuICAgICAgdGhpcy5hdXRoMENsaWVudC5oYW5kbGVSZWRpcmVjdENhbGxiYWNrPFRBcHBTdGF0ZT4odXJsKVxuICAgICkucGlwZShcbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuYXV0aFN0YXRlLmlzTG9hZGluZyQpLFxuICAgICAgdGFwKChbcmVzdWx0LCBpc0xvYWRpbmddKSA9PiB7XG4gICAgICAgIGlmICghaXNMb2FkaW5nKSB7XG4gICAgICAgICAgdGhpcy5hdXRoU3RhdGUucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFwcFN0YXRlID0gcmVzdWx0Py5hcHBTdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gYXBwU3RhdGU/LnRhcmdldCA/PyAnLyc7XG5cbiAgICAgICAgaWYgKGFwcFN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5hcHBTdGF0ZVN1YmplY3QkLm5leHQoYXBwU3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5uYXZpZ2F0b3IubmF2aWdhdGVCeVVybCh0YXJnZXQpO1xuICAgICAgfSksXG4gICAgICBtYXAoKFtyZXN1bHRdKSA9PiByZXN1bHQpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgYGBqc1xuICAgKiBidWlsZEF1dGhvcml6ZVVybCgpLnN1YnNjcmliZSh1cmwgPT4gLi4uKVxuICAgKiBgYGBcbiAgICpcbiAgICogQnVpbGRzIGFuIGAvYXV0aG9yaXplYCBVUkwgZm9yIGxvZ2luV2l0aFJlZGlyZWN0IHVzaW5nIHRoZSBwYXJhbWV0ZXJzXG4gICAqIHByb3ZpZGVkIGFzIGFyZ3VtZW50cy4gUmFuZG9tIGFuZCBzZWN1cmUgYHN0YXRlYCBhbmQgYG5vbmNlYFxuICAgKiBwYXJhbWV0ZXJzIHdpbGwgYmUgYXV0by1nZW5lcmF0ZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zXG4gICAqIEByZXR1cm5zIEEgVVJMIHRvIHRoZSBhdXRob3JpemUgZW5kcG9pbnRcbiAgICovXG4gIGJ1aWxkQXV0aG9yaXplVXJsKG9wdGlvbnM/OiBSZWRpcmVjdExvZ2luT3B0aW9ucyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgcmV0dXJuIGRlZmVyKCgpID0+IHRoaXMuYXV0aDBDbGllbnQuYnVpbGRBdXRob3JpemVVcmwob3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIGBgYGpzXG4gICAqIGJ1aWxkTG9nb3V0VXJsKCkuc3Vic2NyaWJlKHVybCA9PiAuLi4pXG4gICAqIGBgYFxuICAgKiBCdWlsZHMgYSBVUkwgdG8gdGhlIGxvZ291dCBlbmRwb2ludC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgdXNlZCB0byBjb25maWd1cmUgdGhlIHBhcmFtZXRlcnMgdGhhdCBhcHBlYXIgaW4gdGhlIGxvZ291dCBlbmRwb2ludCBVUkwuXG4gICAqIEByZXR1cm5zIGEgVVJMIHRvIHRoZSBsb2dvdXQgZW5kcG9pbnQgdXNpbmcgdGhlIHBhcmFtZXRlcnMgcHJvdmlkZWQgYXMgYXJndW1lbnRzLlxuICAgKi9cbiAgYnVpbGRMb2dvdXRVcmwob3B0aW9ucz86IExvZ291dFVybE9wdGlvbnMpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiBvZih0aGlzLmF1dGgwQ2xpZW50LmJ1aWxkTG9nb3V0VXJsKG9wdGlvbnMpKTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvdWxkSGFuZGxlQ2FsbGJhY2soKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG9mKGxvY2F0aW9uLnNlYXJjaCkucGlwZShcbiAgICAgIG1hcCgoc2VhcmNoKSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgKHNlYXJjaC5pbmNsdWRlcygnY29kZT0nKSB8fCBzZWFyY2guaW5jbHVkZXMoJ2Vycm9yPScpKSAmJlxuICAgICAgICAgIHNlYXJjaC5pbmNsdWRlcygnc3RhdGU9JykgJiZcbiAgICAgICAgICAhdGhpcy5jb25maWdGYWN0b3J5LmdldCgpLnNraXBSZWRpcmVjdENhbGxiYWNrXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==