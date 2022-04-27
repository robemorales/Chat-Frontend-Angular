import { Inject, Injectable } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject, defer, merge, of, ReplaySubject, Subject, } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, mergeMap, scan, shareReplay, switchMap, } from 'rxjs/operators';
import { Auth0ClientService } from './auth.client';
import * as i0 from "@angular/core";
import * as i1 from "./auth.client";
/**
 * Tracks the Authentication State for the SDK
 */
export class AuthState {
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
AuthState.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthState_Factory() { return new AuthState(i0.ɵɵinject(i1.Auth0ClientService)); }, token: AuthState, providedIn: "root" });
AuthState.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
AuthState.ctorParameters = () => [
    { type: Auth0Client, decorators: [{ type: Inject, args: [Auth0ClientService,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2F1dGgwLWFuZ3VsYXIvc3JjL2xpYi9hdXRoLnN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsZUFBZSxFQUNmLEtBQUssRUFDTCxLQUFLLEVBQ0wsRUFBRSxFQUNGLGFBQWEsRUFDYixPQUFPLEdBQ1IsTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQ0wsU0FBUyxFQUNULG9CQUFvQixFQUNwQixNQUFNLEVBQ04sUUFBUSxFQUNSLElBQUksRUFDSixXQUFXLEVBQ1gsU0FBUyxHQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFFbkQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sU0FBUztJQXVGcEIsWUFBZ0QsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUF0RmhFLHNCQUFpQixHQUFHLElBQUksZUFBZSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBQ3ZELGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQy9CLGlCQUFZLEdBQUcsSUFBSSxhQUFhLENBQVMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsa0JBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBUSxDQUFDLENBQUMsQ0FBQztRQUVwRDs7V0FFRztRQUNhLGVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFbkU7OztXQUdHO1FBQ0ssd0JBQW1CLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQ2xELElBQUksQ0FDRixDQUNFLEdBQXdELEVBQ3hELE9BQXNCLEVBQ3RC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dCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXV0aDBDbGllbnQgfSBmcm9tICdAYXV0aDAvYXV0aDAtc3BhLWpzJztcbmltcG9ydCB7XG4gIEJlaGF2aW9yU3ViamVjdCxcbiAgZGVmZXIsXG4gIG1lcmdlLFxuICBvZixcbiAgUmVwbGF5U3ViamVjdCxcbiAgU3ViamVjdCxcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBjb25jYXRNYXAsXG4gIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxuICBmaWx0ZXIsXG4gIG1lcmdlTWFwLFxuICBzY2FuLFxuICBzaGFyZVJlcGxheSxcbiAgc3dpdGNoTWFwLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBBdXRoMENsaWVudFNlcnZpY2UgfSBmcm9tICcuL2F1dGguY2xpZW50JztcblxuLyoqXG4gKiBUcmFja3MgdGhlIEF1dGhlbnRpY2F0aW9uIFN0YXRlIGZvciB0aGUgU0RLXG4gKi9cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgQXV0aFN0YXRlIHtcbiAgcHJpdmF0ZSBpc0xvYWRpbmdTdWJqZWN0JCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4odHJ1ZSk7XG4gIHByaXZhdGUgcmVmcmVzaCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIGFjY2Vzc1Rva2VuJCA9IG5ldyBSZXBsYXlTdWJqZWN0PHN0cmluZz4oMSk7XG4gIHByaXZhdGUgZXJyb3JTdWJqZWN0JCA9IG5ldyBSZXBsYXlTdWJqZWN0PEVycm9yPigxKTtcblxuICAvKipcbiAgICogRW1pdHMgYm9vbGVhbiB2YWx1ZXMgaW5kaWNhdGluZyB0aGUgbG9hZGluZyBzdGF0ZSBvZiB0aGUgU0RLLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGlzTG9hZGluZyQgPSB0aGlzLmlzTG9hZGluZ1N1YmplY3QkLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIHVzZWQgdG8gcHVsbCBVc2VyIGluZm9ybWF0aW9uIGZyb20gdGhlIEF1dGgwQ2xpZW50LlxuICAgKiBUcmlnZ2VycyB3aGVuIHRoZSBhY2Nlc3MgdG9rZW4gaGFzIGNoYW5nZWQuXG4gICAqL1xuICBwcml2YXRlIGFjY2Vzc1Rva2VuVHJpZ2dlciQgPSB0aGlzLmFjY2Vzc1Rva2VuJC5waXBlKFxuICAgIHNjYW4oXG4gICAgICAoXG4gICAgICAgIGFjYzogeyBjdXJyZW50OiBzdHJpbmcgfCBudWxsOyBwcmV2aW91czogc3RyaW5nIHwgbnVsbCB9LFxuICAgICAgICBjdXJyZW50OiBzdHJpbmcgfCBudWxsXG4gICAgICApID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwcmV2aW91czogYWNjLmN1cnJlbnQsXG4gICAgICAgICAgY3VycmVudCxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICB7IGN1cnJlbnQ6IG51bGwsIHByZXZpb3VzOiBudWxsIH1cbiAgICApLFxuICAgIGZpbHRlcigoeyBwcmV2aW91cywgY3VycmVudCB9KSA9PiBwcmV2aW91cyAhPT0gY3VycmVudClcbiAgKTtcblxuICAvKipcbiAgICogVHJpZ2dlciB1c2VkIHRvIHB1bGwgVXNlciBpbmZvcm1hdGlvbiBmcm9tIHRoZSBBdXRoMENsaWVudC5cbiAgICogVHJpZ2dlcnMgd2hlbiBhbiBldmVudCBvY2N1cnMgdGhhdCBuZWVkcyB0byByZXRyaWdnZXIgdGhlIFVzZXIgUHJvZmlsZSBpbmZvcm1hdGlvbi5cbiAgICogRXZlbnRzOiBMb2dpbiwgQWNjZXNzIFRva2VuIGNoYW5nZSBhbmQgTG9nb3V0XG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGlzQXV0aGVudGljYXRlZFRyaWdnZXIkID0gdGhpcy5pc0xvYWRpbmckLnBpcGUoXG4gICAgZmlsdGVyKChsb2FkaW5nKSA9PiAhbG9hZGluZyksXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICBzd2l0Y2hNYXAoKCkgPT5cbiAgICAgIC8vIFRvIHRyYWNrIHRoZSB2YWx1ZSBvZiBpc0F1dGhlbnRpY2F0ZWQgb3ZlciB0aW1lLCB3ZSBuZWVkIHRvIG1lcmdlOlxuICAgICAgLy8gIC0gdGhlIGN1cnJlbnQgdmFsdWVcbiAgICAgIC8vICAtIHRoZSB2YWx1ZSB3aGVuZXZlciB0aGUgYWNjZXNzIHRva2VuIGNoYW5nZXMuICh0aGlzIHNob3VsZCBhbHdheXMgYmUgdHJ1ZSBvZiB0aGVyZSBpcyBhbiBhY2Nlc3MgdG9rZW5cbiAgICAgIC8vICAgIGJ1dCBpdCBpcyBzYWZlciB0byBwYXNzIHRoaXMgdGhyb3VnaCB0aGlzLmF1dGgwQ2xpZW50LmlzQXV0aGVudGljYXRlZCgpIG5ldmVydGhlbGVzcylcbiAgICAgIC8vICAtIHRoZSB2YWx1ZSB3aGVuZXZlciByZWZyZXNoU3RhdGUkIGVtaXRzXG4gICAgICBtZXJnZShcbiAgICAgICAgZGVmZXIoKCkgPT4gdGhpcy5hdXRoMENsaWVudC5pc0F1dGhlbnRpY2F0ZWQoKSksXG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW5UcmlnZ2VyJC5waXBlKFxuICAgICAgICAgIG1lcmdlTWFwKCgpID0+IHRoaXMuYXV0aDBDbGllbnQuaXNBdXRoZW50aWNhdGVkKCkpXG4gICAgICAgICksXG4gICAgICAgIHRoaXMucmVmcmVzaCQucGlwZShtZXJnZU1hcCgoKSA9PiB0aGlzLmF1dGgwQ2xpZW50LmlzQXV0aGVudGljYXRlZCgpKSlcbiAgICAgIClcbiAgICApXG4gICk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIGJvb2xlYW4gdmFsdWVzIGluZGljYXRpbmcgdGhlIGF1dGhlbnRpY2F0aW9uIHN0YXRlIG9mIHRoZSB1c2VyLiBJZiBgdHJ1ZWAsIGl0IG1lYW5zIGEgdXNlciBoYXMgYXV0aGVudGljYXRlZC5cbiAgICogVGhpcyBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiBgaXNMb2FkaW5nJGAsIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gbWFudWFsbHkgY2hlY2sgdGhlIGxvYWRpbmcgc3RhdGUgb2YgdGhlIFNESy5cbiAgICovXG4gIHJlYWRvbmx5IGlzQXV0aGVudGljYXRlZCQgPSB0aGlzLmlzQXV0aGVudGljYXRlZFRyaWdnZXIkLnBpcGUoXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICBzaGFyZVJlcGxheSgxKVxuICApO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBkZXRhaWxzIGFib3V0IHRoZSBhdXRoZW50aWNhdGVkIHVzZXIsIG9yIG51bGwgaWYgbm90IGF1dGhlbnRpY2F0ZWQuXG4gICAqL1xuICByZWFkb25seSB1c2VyJCA9IHRoaXMuaXNBdXRoZW50aWNhdGVkVHJpZ2dlciQucGlwZShcbiAgICBjb25jYXRNYXAoKGF1dGhlbnRpY2F0ZWQpID0+XG4gICAgICBhdXRoZW50aWNhdGVkID8gdGhpcy5hdXRoMENsaWVudC5nZXRVc2VyKCkgOiBvZihudWxsKVxuICAgIClcbiAgKTtcblxuICAvKipcbiAgICogRW1pdHMgSUQgdG9rZW4gY2xhaW1zIHdoZW4gYXV0aGVudGljYXRlZCwgb3IgbnVsbCBpZiBub3QgYXV0aGVudGljYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGlkVG9rZW5DbGFpbXMkID0gdGhpcy5pc0F1dGhlbnRpY2F0ZWRUcmlnZ2VyJC5waXBlKFxuICAgIGNvbmNhdE1hcCgoYXV0aGVudGljYXRlZCkgPT5cbiAgICAgIGF1dGhlbnRpY2F0ZWQgPyB0aGlzLmF1dGgwQ2xpZW50LmdldElkVG9rZW5DbGFpbXMoKSA6IG9mKG51bGwpXG4gICAgKVxuICApO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBlcnJvcnMgdGhhdCBvY2N1ciBkdXJpbmcgbG9naW4sIG9yIHdoZW4gY2hlY2tpbmcgZm9yIGFuIGFjdGl2ZSBzZXNzaW9uIG9uIHN0YXJ0dXAuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZXJyb3IkID0gdGhpcy5lcnJvclN1YmplY3QkLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoQXV0aDBDbGllbnRTZXJ2aWNlKSBwcml2YXRlIGF1dGgwQ2xpZW50OiBBdXRoMENsaWVudCkge31cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBpc0xvYWRpbmcgc3RhdGUgdXNpbmcgdGhlIHByb3ZpZGVkIHZhbHVlXG4gICAqIEBwYXJhbSBpc0xvYWRpbmcgVGhlIG5ldyB2YWx1ZSBmb3IgaXNMb2FkaW5nXG4gICAqL1xuICBwdWJsaWMgc2V0SXNMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuaXNMb2FkaW5nU3ViamVjdCQubmV4dChpc0xvYWRpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZnJlc2ggdGhlIHN0YXRlIHRvIGVuc3VyZSB0aGUgYGlzQXV0aGVudGljYXRlZGAsIGB1c2VyJGAgYW5kIGBpZFRva2VuQ2xhaW1zJGBcbiAgICogcmVmbGVjdCB0aGUgbW9zdCB1cC10by1kYXRlIHZhbHVlcyBmcm9tICBBdXRoMENsaWVudC5cbiAgICovXG4gIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xuICAgIHRoaXMucmVmcmVzaCQubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgYWNjZXNzIHRva2VuLCBkb2luZyBzbyB3aWxsIGFsc28gcmVmcmVzaCB0aGUgc3RhdGUuXG4gICAqIEBwYXJhbSBhY2Nlc3NUb2tlbiBUaGUgbmV3IEFjY2VzcyBUb2tlblxuICAgKi9cbiAgcHVibGljIHNldEFjY2Vzc1Rva2VuKGFjY2Vzc1Rva2VuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KGFjY2Vzc1Rva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgZXJyb3IgaW4gdGhlIGBlcnJvciRgIG9ic2VydmFibGUuXG4gICAqIEBwYXJhbSBlcnJvciBUaGUgbmV3IGVycm9yXG4gICAqL1xuICBwdWJsaWMgc2V0RXJyb3IoZXJyb3I6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZXJyb3JTdWJqZWN0JC5uZXh0KGVycm9yKTtcbiAgfVxufVxuIl19