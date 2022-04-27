(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@auth0/auth0-spa-js'), require('rxjs'), require('rxjs/operators'), require('@angular/router'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@auth0/auth0-angular', ['exports', '@angular/core', '@auth0/auth0-spa-js', 'rxjs', 'rxjs/operators', '@angular/router', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.auth0 = global.auth0 || {}, global.auth0['auth0-angular'] = {}), global.ng.core, global.auth0SpaJs, global.rxjs, global.rxjs.operators, global.ng.router, global.ng.common));
}(this, (function (exports, i0, auth0SpaJs, rxjs, operators, router, i1) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var i1__namespace = /*#__PURE__*/_interopNamespace(i1);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var useragent = { name: '@auth0/auth0-angular', version: '1.9.0' };

    var Auth0ClientFactory = /** @class */ (function () {
        function Auth0ClientFactory() {
        }
        Auth0ClientFactory.createClient = function (configFactory) {
            var config = configFactory.get();
            if (!config) {
                throw new Error('Configuration must be specified either through AuthModule.forRoot or through AuthClientConfig.set');
            }
            var redirectUri = config.redirectUri, clientId = config.clientId, maxAge = config.maxAge, httpInterceptor = config.httpInterceptor, rest = __rest(config, ["redirectUri", "clientId", "maxAge", "httpInterceptor"]);
            return new auth0SpaJs.Auth0Client(Object.assign(Object.assign({ redirect_uri: redirectUri || window.location.origin, client_id: clientId, max_age: maxAge }, rest), { auth0Client: {
                    name: useragent.name,
                    version: useragent.version,
                } }));
        };
        return Auth0ClientFactory;
    }());
    var Auth0ClientService = new i0.InjectionToken('auth0.client');

    var AbstractNavigator = /** @class */ (function () {
        function AbstractNavigator(location, injector) {
            this.location = location;
            try {
                this.router = injector.get(router.Router);
            }
            catch (_a) { }
        }
        /**
         * Navigates to the specified url. The router will be used if one is available, otherwise it falls back
         * to `window.history.replaceState`.
         * @param url The url to navigate to
         */
        AbstractNavigator.prototype.navigateByUrl = function (url) {
            if (this.router) {
                this.router.navigateByUrl(url);
                return;
            }
            this.location.replaceState(url);
        };
        return AbstractNavigator;
    }());
    AbstractNavigator.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AbstractNavigator_Factory() { return new AbstractNavigator(i0__namespace.ɵɵinject(i1__namespace.Location), i0__namespace.ɵɵinject(i0__namespace.INJECTOR)); }, token: AbstractNavigator, providedIn: "root" });
    AbstractNavigator.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    AbstractNavigator.ctorParameters = function () { return [
        { type: i1.Location },
        { type: i0.Injector }
    ]; };

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
    var AuthClientConfig = /** @class */ (function () {
        function AuthClientConfig(config) {
            if (config) {
                this.set(config);
            }
        }
        /**
         * Sets configuration to be read by other consumers of the service (see usage notes)
         * @param config The configuration to set
         */
        AuthClientConfig.prototype.set = function (config) {
            this.config = config;
        };
        /**
         * Gets the config that has been set by other consumers of the service
         */
        AuthClientConfig.prototype.get = function () {
            return this.config;
        };
        return AuthClientConfig;
    }());
    AuthClientConfig.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AuthClientConfig_Factory() { return new AuthClientConfig(i0__namespace.ɵɵinject(AuthConfigService, 8)); }, token: AuthClientConfig, providedIn: "root" });
    AuthClientConfig.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];
    AuthClientConfig.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [AuthConfigService,] }] }
    ]; };
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
    var AuthConfigService = new i0.InjectionToken('auth0-angular.config');

    /**
     * Tracks the Authentication State for the SDK
     */
    var AuthState = /** @class */ (function () {
        function AuthState(auth0Client) {
            var _this = this;
            this.auth0Client = auth0Client;
            this.isLoadingSubject$ = new rxjs.BehaviorSubject(true);
            this.refresh$ = new rxjs.Subject();
            this.accessToken$ = new rxjs.ReplaySubject(1);
            this.errorSubject$ = new rxjs.ReplaySubject(1);
            /**
             * Emits boolean values indicating the loading state of the SDK.
             */
            this.isLoading$ = this.isLoadingSubject$.asObservable();
            /**
             * Trigger used to pull User information from the Auth0Client.
             * Triggers when the access token has changed.
             */
            this.accessTokenTrigger$ = this.accessToken$.pipe(operators.scan(function (acc, current) {
                return {
                    previous: acc.current,
                    current: current,
                };
            }, { current: null, previous: null }), operators.filter(function (_a) {
                var previous = _a.previous, current = _a.current;
                return previous !== current;
            }));
            /**
             * Trigger used to pull User information from the Auth0Client.
             * Triggers when an event occurs that needs to retrigger the User Profile information.
             * Events: Login, Access Token change and Logout
             */
            this.isAuthenticatedTrigger$ = this.isLoading$.pipe(operators.filter(function (loading) { return !loading; }), operators.distinctUntilChanged(), operators.switchMap(function () {
                // To track the value of isAuthenticated over time, we need to merge:
                //  - the current value
                //  - the value whenever the access token changes. (this should always be true of there is an access token
                //    but it is safer to pass this through this.auth0Client.isAuthenticated() nevertheless)
                //  - the value whenever refreshState$ emits
                return rxjs.merge(rxjs.defer(function () { return _this.auth0Client.isAuthenticated(); }), _this.accessTokenTrigger$.pipe(operators.mergeMap(function () { return _this.auth0Client.isAuthenticated(); })), _this.refresh$.pipe(operators.mergeMap(function () { return _this.auth0Client.isAuthenticated(); })));
            }));
            /**
             * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
             * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
             */
            this.isAuthenticated$ = this.isAuthenticatedTrigger$.pipe(operators.distinctUntilChanged(), operators.shareReplay(1));
            /**
             * Emits details about the authenticated user, or null if not authenticated.
             */
            this.user$ = this.isAuthenticatedTrigger$.pipe(operators.concatMap(function (authenticated) { return authenticated ? _this.auth0Client.getUser() : rxjs.of(null); }));
            /**
             * Emits ID token claims when authenticated, or null if not authenticated.
             */
            this.idTokenClaims$ = this.isAuthenticatedTrigger$.pipe(operators.concatMap(function (authenticated) { return authenticated ? _this.auth0Client.getIdTokenClaims() : rxjs.of(null); }));
            /**
             * Emits errors that occur during login, or when checking for an active session on startup.
             */
            this.error$ = this.errorSubject$.asObservable();
        }
        /**
         * Update the isLoading state using the provided value
         * @param isLoading The new value for isLoading
         */
        AuthState.prototype.setIsLoading = function (isLoading) {
            this.isLoadingSubject$.next(isLoading);
        };
        /**
         * Refresh the state to ensure the `isAuthenticated`, `user$` and `idTokenClaims$`
         * reflect the most up-to-date values from  Auth0Client.
         */
        AuthState.prototype.refresh = function () {
            this.refresh$.next();
        };
        /**
         * Update the access token, doing so will also refresh the state.
         * @param accessToken The new Access Token
         */
        AuthState.prototype.setAccessToken = function (accessToken) {
            this.accessToken$.next(accessToken);
        };
        /**
         * Emits the error in the `error$` observable.
         * @param error The new error
         */
        AuthState.prototype.setError = function (error) {
            this.errorSubject$.next(error);
        };
        return AuthState;
    }());
    AuthState.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AuthState_Factory() { return new AuthState(i0__namespace.ɵɵinject(Auth0ClientService)); }, token: AuthState, providedIn: "root" });
    AuthState.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];
    AuthState.ctorParameters = function () { return [
        { type: auth0SpaJs.Auth0Client, decorators: [{ type: i0.Inject, args: [Auth0ClientService,] }] }
    ]; };

    var AuthService = /** @class */ (function () {
        function AuthService(auth0Client, configFactory, navigator, authState) {
            var _this = this;
            this.auth0Client = auth0Client;
            this.configFactory = configFactory;
            this.navigator = navigator;
            this.authState = authState;
            this.appStateSubject$ = new rxjs.ReplaySubject(1);
            // https://stackoverflow.com/a/41177163
            this.ngUnsubscribe$ = new rxjs.Subject();
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
            var checkSessionOrCallback$ = function (isCallback) { return rxjs.iif(function () { return isCallback; }, _this.handleRedirectCallback(), rxjs.defer(function () { return _this.auth0Client.checkSession(); })); };
            this.shouldHandleCallback()
                .pipe(operators.switchMap(function (isCallback) { return checkSessionOrCallback$(isCallback).pipe(operators.catchError(function (error) {
                var config = _this.configFactory.get();
                _this.authState.setError(error);
                _this.navigator.navigateByUrl(config.errorPath || '/');
                return rxjs.of(undefined);
            })); }), operators.tap(function () {
                _this.authState.setIsLoading(false);
            }), operators.takeUntil(this.ngUnsubscribe$))
                .subscribe();
        }
        /**
         * Called when the service is destroyed
         */
        AuthService.prototype.ngOnDestroy = function () {
            // https://stackoverflow.com/a/41177163
            this.ngUnsubscribe$.next();
            this.ngUnsubscribe$.complete();
        };
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
        AuthService.prototype.loginWithRedirect = function (options) {
            return rxjs.from(this.auth0Client.loginWithRedirect(options));
        };
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
        AuthService.prototype.loginWithPopup = function (options, config) {
            var _this = this;
            return rxjs.from(this.auth0Client.loginWithPopup(options, config).then(function () {
                _this.authState.refresh();
            }));
        };
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
        AuthService.prototype.logout = function (options) {
            var _this = this;
            var logout = this.auth0Client.logout(options) || rxjs.of(null);
            rxjs.from(logout).subscribe(function () {
                if (options === null || options === void 0 ? void 0 : options.localOnly) {
                    _this.authState.refresh();
                }
            });
        };
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
        AuthService.prototype.getAccessTokenSilently = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return rxjs.of(this.auth0Client).pipe(operators.concatMap(function (client) { return options.detailedResponse === true
                ? client.getTokenSilently(Object.assign(Object.assign({}, options), { detailedResponse: true }))
                : client.getTokenSilently(options); }), operators.tap(function (token) { return _this.authState.setAccessToken(typeof token === 'string' ? token : token.access_token); }), operators.catchError(function (error) {
                _this.authState.setError(error);
                _this.authState.refresh();
                return rxjs.throwError(error);
            }));
        };
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
        AuthService.prototype.getAccessTokenWithPopup = function (options) {
            var _this = this;
            return rxjs.of(this.auth0Client).pipe(operators.concatMap(function (client) { return client.getTokenWithPopup(options); }), operators.tap(function (token) { return _this.authState.setAccessToken(token); }), operators.catchError(function (error) {
                _this.authState.setError(error);
                _this.authState.refresh();
                return rxjs.throwError(error);
            }));
        };
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
        AuthService.prototype.getUser = function (options) {
            var _this = this;
            return rxjs.defer(function () { return _this.auth0Client.getUser(options); });
        };
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
        AuthService.prototype.getIdTokenClaims = function (options) {
            var _this = this;
            return rxjs.defer(function () { return _this.auth0Client.getIdTokenClaims(options); });
        };
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
        AuthService.prototype.handleRedirectCallback = function (url) {
            var _this = this;
            return rxjs.defer(function () { return _this.auth0Client.handleRedirectCallback(url); }).pipe(operators.withLatestFrom(this.authState.isLoading$), operators.tap(function (_b) {
                var _c = __read(_b, 2), result = _c[0], isLoading = _c[1];
                var _a;
                if (!isLoading) {
                    _this.authState.refresh();
                }
                var appState = result === null || result === void 0 ? void 0 : result.appState;
                var target = (_a = appState === null || appState === void 0 ? void 0 : appState.target) !== null && _a !== void 0 ? _a : '/';
                if (appState) {
                    _this.appStateSubject$.next(appState);
                }
                _this.navigator.navigateByUrl(target);
            }), operators.map(function (_b) {
                var _c = __read(_b, 1), result = _c[0];
                return result;
            }));
        };
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
        AuthService.prototype.buildAuthorizeUrl = function (options) {
            var _this = this;
            return rxjs.defer(function () { return _this.auth0Client.buildAuthorizeUrl(options); });
        };
        /**
         * ```js
         * buildLogoutUrl().subscribe(url => ...)
         * ```
         * Builds a URL to the logout endpoint.
         *
         * @param options The options used to configure the parameters that appear in the logout endpoint URL.
         * @returns a URL to the logout endpoint using the parameters provided as arguments.
         */
        AuthService.prototype.buildLogoutUrl = function (options) {
            return rxjs.of(this.auth0Client.buildLogoutUrl(options));
        };
        AuthService.prototype.shouldHandleCallback = function () {
            var _this = this;
            return rxjs.of(location.search).pipe(operators.map(function (search) {
                return ((search.includes('code=') || search.includes('error=')) &&
                    search.includes('state=') &&
                    !_this.configFactory.get().skipRedirectCallback);
            }));
        };
        return AuthService;
    }());
    AuthService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AuthService_Factory() { return new AuthService(i0__namespace.ɵɵinject(Auth0ClientService), i0__namespace.ɵɵinject(AuthClientConfig), i0__namespace.ɵɵinject(AbstractNavigator), i0__namespace.ɵɵinject(AuthState)); }, token: AuthService, providedIn: "root" });
    AuthService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    AuthService.ctorParameters = function () { return [
        { type: auth0SpaJs.Auth0Client, decorators: [{ type: i0.Inject, args: [Auth0ClientService,] }] },
        { type: AuthClientConfig },
        { type: AbstractNavigator },
        { type: AuthState }
    ]; };

    var AuthGuard = /** @class */ (function () {
        function AuthGuard(auth) {
            this.auth = auth;
        }
        AuthGuard.prototype.canLoad = function (route, segments) {
            return this.auth.isAuthenticated$.pipe(operators.take(1));
        };
        AuthGuard.prototype.canActivate = function (next, state) {
            return this.redirectIfUnauthenticated(state);
        };
        AuthGuard.prototype.canActivateChild = function (childRoute, state) {
            return this.redirectIfUnauthenticated(state);
        };
        AuthGuard.prototype.redirectIfUnauthenticated = function (state) {
            var _this = this;
            return this.auth.isAuthenticated$.pipe(operators.tap(function (loggedIn) {
                if (!loggedIn) {
                    _this.auth.loginWithRedirect({
                        appState: { target: state.url },
                    });
                }
            }));
        };
        return AuthGuard;
    }());
    AuthGuard.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AuthGuard_Factory() { return new AuthGuard(i0__namespace.ɵɵinject(AuthService)); }, token: AuthGuard, providedIn: "root" });
    AuthGuard.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    AuthGuard.ctorParameters = function () { return [
        { type: AuthService }
    ]; };

    var AuthModule = /** @class */ (function () {
        function AuthModule() {
        }
        /**
         * Initialize the authentication module system. Configuration can either be specified here,
         * or by calling AuthClientConfig.set (perhaps from an APP_INITIALIZER factory function).
         * @param config The optional configuration for the SDK.
         */
        AuthModule.forRoot = function (config) {
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
        };
        return AuthModule;
    }());
    AuthModule.decorators = [
        { type: i0.NgModule }
    ];

    var AuthHttpInterceptor = /** @class */ (function () {
        function AuthHttpInterceptor(configFactory, auth0Client, authState) {
            this.configFactory = configFactory;
            this.auth0Client = auth0Client;
            this.authState = authState;
        }
        AuthHttpInterceptor.prototype.intercept = function (req, next) {
            var _this = this;
            var _a;
            var config = this.configFactory.get();
            if (!((_a = config.httpInterceptor) === null || _a === void 0 ? void 0 : _a.allowedList)) {
                return next.handle(req);
            }
            return this.findMatchingRoute(req, config.httpInterceptor).pipe(operators.concatMap(function (route) { return rxjs.iif(
            // Check if a route was matched
            function () { return route !== null; }, 
            // If we have a matching route, call getTokenSilently and attach the token to the
            // outgoing request
            rxjs.of(route).pipe(operators.pluck('tokenOptions'), operators.concatMap(function (options) {
                return _this.getAccessTokenSilently(options).pipe(operators.catchError(function (err) {
                    if (_this.allowAnonymous(route, err)) {
                        return rxjs.of('');
                    }
                    _this.authState.setError(err);
                    return rxjs.throwError(err);
                }));
            }), operators.switchMap(function (token) {
                // Clone the request and attach the bearer token
                var clone = token
                    ? req.clone({
                        headers: req.headers.set('Authorization', "Bearer " + token),
                    })
                    : req;
                return next.handle(clone);
            })), 
            // If the URI being called was not found in our httpInterceptor config, simply
            // pass the request through without attaching a token
            next.handle(req)); }));
        };
        /**
         * Duplicate of AuthService.getAccessTokenSilently, but with a slightly different error handling.
         * Only used internally in the interceptor.
         * @param options The options for configuring the token fetch.
         */
        AuthHttpInterceptor.prototype.getAccessTokenSilently = function (options) {
            var _this = this;
            return rxjs.of(this.auth0Client).pipe(operators.concatMap(function (client) { return client.getTokenSilently(options); }), operators.tap(function (token) { return _this.authState.setAccessToken(token); }), operators.catchError(function (error) {
                _this.authState.refresh();
                return rxjs.throwError(error);
            }));
        };
        /**
         * Strips the query and fragment from the given uri
         * @param uri The uri to remove the query and fragment from
         */
        AuthHttpInterceptor.prototype.stripQueryFrom = function (uri) {
            if (uri.indexOf('?') > -1) {
                uri = uri.substr(0, uri.indexOf('?'));
            }
            if (uri.indexOf('#') > -1) {
                uri = uri.substr(0, uri.indexOf('#'));
            }
            return uri;
        };
        /**
         * Determines whether the specified route can have an access token attached to it, based on matching the HTTP request against
         * the interceptor route configuration.
         * @param route The route to test
         * @param request The HTTP request
         */
        AuthHttpInterceptor.prototype.canAttachToken = function (route, request) {
            var _this = this;
            var testPrimitive = function (value) {
                if (!value) {
                    return false;
                }
                var requestPath = _this.stripQueryFrom(request.url);
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
        };
        /**
         * Tries to match a route from the SDK configuration to the HTTP request.
         * If a match is found, the route configuration is returned.
         * @param request The Http request
         * @param config HttpInterceptorConfig
         */
        AuthHttpInterceptor.prototype.findMatchingRoute = function (request, config) {
            var _this = this;
            return rxjs.from(config.allowedList).pipe(operators.first(function (route) { return _this.canAttachToken(route, request); }, null));
        };
        AuthHttpInterceptor.prototype.allowAnonymous = function (route, err) {
            return (!!route &&
                isHttpInterceptorRouteConfig(route) &&
                !!route.allowAnonymous &&
                ['login_required', 'consent_required'].includes(err.error));
        };
        return AuthHttpInterceptor;
    }());
    AuthHttpInterceptor.decorators = [
        { type: i0.Injectable }
    ];
    AuthHttpInterceptor.ctorParameters = function () { return [
        { type: AuthClientConfig },
        { type: auth0SpaJs.Auth0Client, decorators: [{ type: i0.Inject, args: [Auth0ClientService,] }] },
        { type: AuthState }
    ]; };

    /*
     * Public API Surface of auth0-angular
     */

    /**
     * Generated bundle index. Do not edit.
     */

    Object.defineProperty(exports, 'InMemoryCache', {
        enumerable: true,
        get: function () {
            return auth0SpaJs.InMemoryCache;
        }
    });
    Object.defineProperty(exports, 'LocalStorageCache', {
        enumerable: true,
        get: function () {
            return auth0SpaJs.LocalStorageCache;
        }
    });
    Object.defineProperty(exports, 'User', {
        enumerable: true,
        get: function () {
            return auth0SpaJs.User;
        }
    });
    exports.Auth0ClientFactory = Auth0ClientFactory;
    exports.Auth0ClientService = Auth0ClientService;
    exports.AuthClientConfig = AuthClientConfig;
    exports.AuthConfigService = AuthConfigService;
    exports.AuthGuard = AuthGuard;
    exports.AuthHttpInterceptor = AuthHttpInterceptor;
    exports.AuthModule = AuthModule;
    exports.AuthService = AuthService;
    exports.AuthState = AuthState;
    exports.isHttpInterceptorRouteConfig = isHttpInterceptorRouteConfig;
    exports.ɵa = AbstractNavigator;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=auth0-auth0-angular.umd.js.map
