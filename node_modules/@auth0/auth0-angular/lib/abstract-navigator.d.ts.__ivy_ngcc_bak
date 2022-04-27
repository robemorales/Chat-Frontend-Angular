import { Injector } from '@angular/core';
import { Location } from '@angular/common';
export declare class AbstractNavigator {
    private location;
    private readonly router?;
    constructor(location: Location, injector: Injector);
    /**
     * Navigates to the specified url. The router will be used if one is available, otherwise it falls back
     * to `window.history.replaceState`.
     * @param url The url to navigate to
     */
    navigateByUrl(url: string): void;
}
