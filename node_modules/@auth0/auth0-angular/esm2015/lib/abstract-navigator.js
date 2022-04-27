import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class AbstractNavigator {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtbmF2aWdhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYXV0aDAtYW5ndWxhci9zcmMvbGliL2Fic3RyYWN0LW5hdmlnYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFLM0MsTUFBTSxPQUFPLGlCQUFpQjtJQUc1QixZQUFvQixRQUFrQixFQUFFLFFBQWtCO1FBQXRDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDcEMsSUFBSTtZQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNwQztRQUFDLFdBQU0sR0FBRTtJQUNaLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYSxDQUFDLEdBQVc7UUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFL0IsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7OztZQXpCRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7OztZQUpRLFFBQVE7WUFGSSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBBYnN0cmFjdE5hdmlnYXRvciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyPzogUm91dGVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5yb3V0ZXIgPSBpbmplY3Rvci5nZXQoUm91dGVyKTtcbiAgICB9IGNhdGNoIHt9XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIHRvIHRoZSBzcGVjaWZpZWQgdXJsLiBUaGUgcm91dGVyIHdpbGwgYmUgdXNlZCBpZiBvbmUgaXMgYXZhaWxhYmxlLCBvdGhlcndpc2UgaXQgZmFsbHMgYmFja1xuICAgKiB0byBgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlYC5cbiAgICogQHBhcmFtIHVybCBUaGUgdXJsIHRvIG5hdmlnYXRlIHRvXG4gICAqL1xuICBuYXZpZ2F0ZUJ5VXJsKHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucm91dGVyKSB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVybCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxvY2F0aW9uLnJlcGxhY2VTdGF0ZSh1cmwpO1xuICB9XG59XG4iXX0=