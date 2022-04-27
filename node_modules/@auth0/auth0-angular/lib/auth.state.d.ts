import { Auth0Client } from '@auth0/auth0-spa-js';
/**
 * Tracks the Authentication State for the SDK
 */
import * as ɵngcc0 from '@angular/core';
export declare class AuthState {
    private auth0Client;
    private isLoadingSubject$;
    private refresh$;
    private accessToken$;
    private errorSubject$;
    /**
     * Emits boolean values indicating the loading state of the SDK.
     */
    readonly isLoading$: import("rxjs").Observable<boolean>;
    /**
     * Trigger used to pull User information from the Auth0Client.
     * Triggers when the access token has changed.
     */
    private accessTokenTrigger$;
    /**
     * Trigger used to pull User information from the Auth0Client.
     * Triggers when an event occurs that needs to retrigger the User Profile information.
     * Events: Login, Access Token change and Logout
     */
    private readonly isAuthenticatedTrigger$;
    /**
     * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
     * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
     */
    readonly isAuthenticated$: import("rxjs").Observable<boolean>;
    /**
     * Emits details about the authenticated user, or null if not authenticated.
     */
    readonly user$: import("rxjs").Observable<import("@auth0/auth0-spa-js").User | null | undefined>;
    /**
     * Emits ID token claims when authenticated, or null if not authenticated.
     */
    readonly idTokenClaims$: import("rxjs").Observable<import("@auth0/auth0-spa-js").IdToken | null | undefined>;
    /**
     * Emits errors that occur during login, or when checking for an active session on startup.
     */
    readonly error$: import("rxjs").Observable<Error>;
    constructor(auth0Client: Auth0Client);
    /**
     * Update the isLoading state using the provided value
     * @param isLoading The new value for isLoading
     */
    setIsLoading(isLoading: boolean): void;
    /**
     * Refresh the state to ensure the `isAuthenticated`, `user$` and `idTokenClaims$`
     * reflect the most up-to-date values from  Auth0Client.
     */
    refresh(): void;
    /**
     * Update the access token, doing so will also refresh the state.
     * @param accessToken The new Access Token
     */
    setAccessToken(accessToken: string): void;
    /**
     * Emits the error in the `error$` observable.
     * @param error The new error
     */
    setError(error: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<AuthState, never>;
}

//# sourceMappingURL=auth.state.d.ts.map