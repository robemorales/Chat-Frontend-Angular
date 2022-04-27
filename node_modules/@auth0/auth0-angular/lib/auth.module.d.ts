import { ModuleWithProviders } from '@angular/core';
import { AuthConfig } from './auth.config';
import * as ɵngcc0 from '@angular/core';
export declare class AuthModule {
    /**
     * Initialize the authentication module system. Configuration can either be specified here,
     * or by calling AuthClientConfig.set (perhaps from an APP_INITIALIZER factory function).
     * @param config The optional configuration for the SDK.
     */
    static forRoot(config?: AuthConfig): ModuleWithProviders<AuthModule>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<AuthModule, never>;
    static ɵmod: ɵngcc0.ɵɵNgModuleDeclaration<AuthModule, never, never, never>;
    static ɵinj: ɵngcc0.ɵɵInjectorDeclaration<AuthModule>;
}

//# sourceMappingURL=auth.module.d.ts.map