import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanLoad, Route, UrlSegment, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
export declare class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
    private auth;
    constructor(auth: AuthService);
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean>;
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>;
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>;
    private redirectIfUnauthenticated;
}
