import { from, of, iif, throwError } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { isHttpInterceptorRouteConfig, AuthClientConfig, } from './auth.config';
import { switchMap, first, concatMap, pluck, catchError, tap, } from 'rxjs/operators';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { Auth0ClientService } from './auth.client';
import { AuthState } from './auth.state';
export class AuthHttpInterceptor {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5pbnRlcmNlcHRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2F1dGgwLWFuZ3VsYXIvc3JjL2xpYi9hdXRoLmludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE9BQU8sRUFBYyxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkQsT0FBTyxFQUVMLDRCQUE0QixFQUM1QixnQkFBZ0IsR0FFakIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxVQUFVLEVBQ1YsR0FBRyxHQUNKLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFFLFdBQVcsRUFBMkIsTUFBTSxxQkFBcUIsQ0FBQztBQUMzRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUd6QyxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCLFlBQ1UsYUFBK0IsRUFDSCxXQUF3QixFQUNwRCxTQUFvQjtRQUZwQixrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFDSCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUNwRCxjQUFTLEdBQVQsU0FBUyxDQUFXO0lBQzNCLENBQUM7SUFFSixTQUFTLENBQ1AsR0FBcUIsRUFDckIsSUFBaUI7O1FBRWpCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLENBQUEsTUFBQSxNQUFNLENBQUMsZUFBZSwwQ0FBRSxXQUFXLENBQUEsRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxD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QUVEOzs7OztPQUtHO0lBQ0ssaUJBQWlCLENBQ3ZCLE9BQXlCLEVBQ3pCLE1BQTZCO1FBRTdCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQ2xDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQzVELENBQUM7SUFDSixDQUFDO0lBRU8sY0FBYyxDQUFDLEtBQWdDLEVBQUUsR0FBUTtRQUMvRCxPQUFPLENBQ0wsQ0FBQyxDQUFDLEtBQUs7WUFDUCw0QkFBNEIsQ0FBQyxLQUFLLENBQUM7WUFDbkMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjO1lBQ3RCLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUMzRCxDQUFDO0lBQ0osQ0FBQzs7O1lBdEtGLFVBQVU7OztZQWhCVCxnQkFBZ0I7WUFZVCxXQUFXLHVCQVFmLE1BQU0sU0FBQyxrQkFBa0I7WUFOckIsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEh0dHBJbnRlcmNlcHRvcixcbiAgSHR0cFJlcXVlc3QsXG4gIEh0dHBIYW5kbGVyLFxuICBIdHRwRXZlbnQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbSwgb2YsIGlpZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIEFwaVJvdXRlRGVmaW5pdGlvbixcbiAgaXNIdHRwSW50ZXJjZXB0b3JSb3V0ZUNvbmZpZyxcbiAgQXV0aENsaWVudENvbmZpZyxcbiAgSHR0cEludGVyY2VwdG9yQ29uZmlnLFxufSBmcm9tICcuL2F1dGguY29uZmlnJztcblxuaW1wb3J0IHtcbiAgc3dpdGNoTWFwLFxuICBmaXJzdCxcbiAgY29uY2F0TWFwLFxuICBwbHVjayxcbiAgY2F0Y2hFcnJvcixcbiAgdGFwLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBBdXRoMENsaWVudCwgR2V0VG9rZW5TaWxlbnRseU9wdGlvbnMgfSBmcm9tICdAYXV0aDAvYXV0aDAtc3BhLWpzJztcbmltcG9ydCB7IEF1dGgwQ2xpZW50U2VydmljZSB9IGZyb20gJy4vYXV0aC5jbGllbnQnO1xuaW1wb3J0IHsgQXV0aFN0YXRlIH0gZnJvbSAnLi9hdXRoLnN0YXRlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEF1dGhIdHRwSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNvbmZpZ0ZhY3Rvcnk6IEF1dGhDbGllbnRDb25maWcsXG4gICAgQEluamVjdChBdXRoMENsaWVudFNlcnZpY2UpIHByaXZhdGUgYXV0aDBDbGllbnQ6IEF1dGgwQ2xpZW50LFxuICAgIHByaXZhdGUgYXV0aFN0YXRlOiBBdXRoU3RhdGVcbiAgKSB7fVxuXG4gIGludGVyY2VwdChcbiAgICByZXE6IEh0dHBSZXF1ZXN0PGFueT4sXG4gICAgbmV4dDogSHR0cEhhbmRsZXJcbiAgKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29uZmlnRmFjdG9yeS5nZXQoKTtcbiAgICBpZiAoIWNvbmZpZy5odHRwSW50ZXJjZXB0b3I/LmFsbG93ZWRMaXN0KSB7XG4gICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5maW5kTWF0Y2hpbmdSb3V0ZShyZXEsIGNvbmZpZy5odHRwSW50ZXJjZXB0b3IpLnBpcGUoXG4gICAgICBjb25jYXRNYXAoKHJvdXRlKSA9PlxuICAgICAgICBpaWYoXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgYSByb3V0ZSB3YXMgbWF0Y2hlZFxuICAgICAgICAgICgpID0+IHJvdXRlICE9PSBudWxsLFxuICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBtYXRjaGluZyByb3V0ZSwgY2FsbCBnZXRUb2tlblNpbGVudGx5IGFuZCBhdHRhY2ggdGhlIHRva2VuIHRvIHRoZVxuICAgICAgICAgIC8vIG91dGdvaW5nIHJlcXVlc3RcbiAgICAgICAgICBvZihyb3V0ZSkucGlwZShcbiAgICAgICAgICAgIHBsdWNrKCd0b2tlbk9wdGlvbnMnKSxcbiAgICAgICAgICAgIGNvbmNhdE1hcDxHZXRUb2tlblNpbGVudGx5T3B0aW9ucywgT2JzZXJ2YWJsZTxzdHJpbmc+PihcbiAgICAgICAgICAgICAgKG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBY2Nlc3NUb2tlblNpbGVudGx5KG9wdGlvbnMpLnBpcGUoXG4gICAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYWxsb3dBbm9ueW1vdXMocm91dGUsIGVycikpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2YoJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU3RhdGUuc2V0RXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHN3aXRjaE1hcCgodG9rZW46IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAvLyBDbG9uZSB0aGUgcmVxdWVzdCBhbmQgYXR0YWNoIHRoZSBiZWFyZXIgdG9rZW5cbiAgICAgICAgICAgICAgY29uc3QgY2xvbmUgPSB0b2tlblxuICAgICAgICAgICAgICAgID8gcmVxLmNsb25lKHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMuc2V0KFxuICAgICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICBgQmVhcmVyICR7dG9rZW59YFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICA6IHJlcTtcblxuICAgICAgICAgICAgICByZXR1cm4gbmV4dC5oYW5kbGUoY2xvbmUpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgIC8vIElmIHRoZSBVUkkgYmVpbmcgY2FsbGVkIHdhcyBub3QgZm91bmQgaW4gb3VyIGh0dHBJbnRlcmNlcHRvciBjb25maWcsIHNpbXBseVxuICAgICAgICAgIC8vIHBhc3MgdGhlIHJlcXVlc3QgdGhyb3VnaCB3aXRob3V0IGF0dGFjaGluZyBhIHRva2VuXG4gICAgICAgICAgbmV4dC5oYW5kbGUocmVxKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEdXBsaWNhdGUgb2YgQXV0aFNlcnZpY2UuZ2V0QWNjZXNzVG9rZW5TaWxlbnRseSwgYnV0IHdpdGggYSBzbGlnaHRseSBkaWZmZXJlbnQgZXJyb3IgaGFuZGxpbmcuXG4gICAqIE9ubHkgdXNlZCBpbnRlcm5hbGx5IGluIHRoZSBpbnRlcmNlcHRvci5cbiAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIHRoZSB0b2tlbiBmZXRjaC5cbiAgICovXG4gIHByaXZhdGUgZ2V0QWNjZXNzVG9rZW5TaWxlbnRseShcbiAgICBvcHRpb25zPzogR2V0VG9rZW5TaWxlbnRseU9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gb2YodGhpcy5hdXRoMENsaWVudCkucGlwZShcbiAgICAgIGNvbmNhdE1hcCgoY2xpZW50KSA9PiBjbGllbnQuZ2V0VG9rZW5TaWxlbnRseShvcHRpb25zKSksXG4gICAgICB0YXAoKHRva2VuKSA9PiB0aGlzLmF1dGhTdGF0ZS5zZXRBY2Nlc3NUb2tlbih0b2tlbikpLFxuICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5hdXRoU3RhdGUucmVmcmVzaCgpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogU3RyaXBzIHRoZSBxdWVyeSBhbmQgZnJhZ21lbnQgZnJvbSB0aGUgZ2l2ZW4gdXJpXG4gICAqIEBwYXJhbSB1cmkgVGhlIHVyaSB0byByZW1vdmUgdGhlIHF1ZXJ5IGFuZCBmcmFnbWVudCBmcm9tXG4gICAqL1xuICBwcml2YXRlIHN0cmlwUXVlcnlGcm9tKHVyaTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodXJpLmluZGV4T2YoJz8nKSA+IC0xKSB7XG4gICAgICB1cmkgPSB1cmkuc3Vic3RyKDAsIHVyaS5pbmRleE9mKCc/JykpO1xuICAgIH1cblxuICAgIGlmICh1cmkuaW5kZXhPZignIycpID4gLTEpIHtcbiAgICAgIHVyaSA9IHVyaS5zdWJzdHIoMCwgdXJpLmluZGV4T2YoJyMnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVyaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCByb3V0ZSBjYW4gaGF2ZSBhbiBhY2Nlc3MgdG9rZW4gYXR0YWNoZWQgdG8gaXQsIGJhc2VkIG9uIG1hdGNoaW5nIHRoZSBIVFRQIHJlcXVlc3QgYWdhaW5zdFxuICAgKiB0aGUgaW50ZXJjZXB0b3Igcm91dGUgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIHJvdXRlIFRoZSByb3V0ZSB0byB0ZXN0XG4gICAqIEBwYXJhbSByZXF1ZXN0IFRoZSBIVFRQIHJlcXVlc3RcbiAgICovXG4gIHByaXZhdGUgY2FuQXR0YWNoVG9rZW4oXG4gICAgcm91dGU6IEFwaVJvdXRlRGVmaW5pdGlvbixcbiAgICByZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+XG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRlc3RQcmltaXRpdmUgPSAodmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlcXVlc3RQYXRoID0gdGhpcy5zdHJpcFF1ZXJ5RnJvbShyZXF1ZXN0LnVybCk7XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gcmVxdWVzdFBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBVUkwgZW5kcyB3aXRoIGFuIGFzdGVyaXNrLCBtYXRjaCB1c2luZyBzdGFydHNXaXRoLlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdmFsdWUuaW5kZXhPZignKicpID09PSB2YWx1ZS5sZW5ndGggLSAxICYmXG4gICAgICAgIHJlcXVlc3QudXJsLnN0YXJ0c1dpdGgodmFsdWUuc3Vic3RyKDAsIHZhbHVlLmxlbmd0aCAtIDEpKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgaWYgKGlzSHR0cEludGVyY2VwdG9yUm91dGVDb25maWcocm91dGUpKSB7XG4gICAgICBpZiAocm91dGUuaHR0cE1ldGhvZCAmJiByb3V0ZS5odHRwTWV0aG9kICE9PSByZXF1ZXN0Lm1ldGhvZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCFyb3V0ZS51cmkgJiYgIXJvdXRlLnVyaU1hdGNoZXIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdFaXRoZXIgYSB1cmkgb3IgdXJpTWF0Y2hlciBpcyByZXF1aXJlZCB3aGVuIGNvbmZpZ3VyaW5nIHRoZSBIVFRQIGludGVyY2VwdG9yLidcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJvdXRlLnVyaU1hdGNoZXJcbiAgICAgICAgPyByb3V0ZS51cmlNYXRjaGVyKHJlcXVlc3QudXJsKVxuICAgICAgICA6IHRlc3RQcmltaXRpdmUocm91dGUudXJpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVzdFByaW1pdGl2ZShyb3V0ZSk7XG4gIH1cblxuICAvKipcbiAgICogVHJpZXMgdG8gbWF0Y2ggYSByb3V0ZSBmcm9tIHRoZSBTREsgY29uZmlndXJhdGlvbiB0byB0aGUgSFRUUCByZXF1ZXN0LlxuICAgKiBJZiBhIG1hdGNoIGlzIGZvdW5kLCB0aGUgcm91dGUgY29uZmlndXJhdGlvbiBpcyByZXR1cm5lZC5cbiAgICogQHBhcmFtIHJlcXVlc3QgVGhlIEh0dHAgcmVxdWVzdFxuICAgKiBAcGFyYW0gY29uZmlnIEh0dHBJbnRlcmNlcHRvckNvbmZpZ1xuICAgKi9cbiAgcHJpdmF0ZSBmaW5kTWF0Y2hpbmdSb3V0ZShcbiAgICByZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LFxuICAgIGNvbmZpZzogSHR0cEludGVyY2VwdG9yQ29uZmlnXG4gICk6IE9ic2VydmFibGU8QXBpUm91dGVEZWZpbml0aW9uIHwgbnVsbD4ge1xuICAgIHJldHVybiBmcm9tKGNvbmZpZy5hbGxvd2VkTGlzdCkucGlwZShcbiAgICAgIGZpcnN0KChyb3V0ZSkgPT4gdGhpcy5jYW5BdHRhY2hUb2tlbihyb3V0ZSwgcmVxdWVzdCksIG51bGwpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYWxsb3dBbm9ueW1vdXMocm91dGU6IEFwaVJvdXRlRGVmaW5pdGlvbiB8IG51bGwsIGVycjogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgICEhcm91dGUgJiZcbiAgICAgIGlzSHR0cEludGVyY2VwdG9yUm91dGVDb25maWcocm91dGUpICYmXG4gICAgICAhIXJvdXRlLmFsbG93QW5vbnltb3VzICYmXG4gICAgICBbJ2xvZ2luX3JlcXVpcmVkJywgJ2NvbnNlbnRfcmVxdWlyZWQnXS5pbmNsdWRlcyhlcnIuZXJyb3IpXG4gICAgKTtcbiAgfVxufVxuIl19