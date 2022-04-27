import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthConfigService, AuthClientConfig } from './auth.config';
import { Auth0ClientService, Auth0ClientFactory } from './auth.client';
import { AuthGuard } from './auth.guard';
export class AuthModule {
    /**
     * Initialize the authentication module system. Configuration can either be specified here,
     * or by calling AuthClientConfig.set (perhaps from an APP_INITIALIZER factory function).
     * @param config The optional configuration for the SDK.
     */
    static forRoot(config) {
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
    }
}
AuthModule.decorators = [
    { type: NgModule }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hdXRoMC1hbmd1bGFyL3NyYy9saWIvYXV0aC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBYyxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUd6QyxNQUFNLE9BQU8sVUFBVTtJQUNyQjs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFtQjtRQUNoQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFO2dCQUNULFdBQVc7Z0JBQ1gsU0FBUztnQkFDVDtvQkFDRSxPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixRQUFRLEVBQUUsTUFBTTtpQkFDakI7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGtCQUFrQjtvQkFDM0IsVUFBVSxFQUFFLGtCQUFrQixDQUFDLFlBQVk7b0JBQzNDLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDO2lCQUN6QjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7OztZQXhCRixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXV0aENvbmZpZywgQXV0aENvbmZpZ1NlcnZpY2UsIEF1dGhDbGllbnRDb25maWcgfSBmcm9tICcuL2F1dGguY29uZmlnJztcbmltcG9ydCB7IEF1dGgwQ2xpZW50U2VydmljZSwgQXV0aDBDbGllbnRGYWN0b3J5IH0gZnJvbSAnLi9hdXRoLmNsaWVudCc7XG5pbXBvcnQgeyBBdXRoR3VhcmQgfSBmcm9tICcuL2F1dGguZ3VhcmQnO1xuXG5ATmdNb2R1bGUoKVxuZXhwb3J0IGNsYXNzIEF1dGhNb2R1bGUge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgYXV0aGVudGljYXRpb24gbW9kdWxlIHN5c3RlbS4gQ29uZmlndXJhdGlvbiBjYW4gZWl0aGVyIGJlIHNwZWNpZmllZCBoZXJlLFxuICAgKiBvciBieSBjYWxsaW5nIEF1dGhDbGllbnRDb25maWcuc2V0IChwZXJoYXBzIGZyb20gYW4gQVBQX0lOSVRJQUxJWkVSIGZhY3RvcnkgZnVuY3Rpb24pLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBvcHRpb25hbCBjb25maWd1cmF0aW9uIGZvciB0aGUgU0RLLlxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoY29uZmlnPzogQXV0aENvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8QXV0aE1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogQXV0aE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBBdXRoU2VydmljZSxcbiAgICAgICAgQXV0aEd1YXJkLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQXV0aENvbmZpZ1NlcnZpY2UsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEF1dGgwQ2xpZW50U2VydmljZSxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBBdXRoMENsaWVudEZhY3RvcnkuY3JlYXRlQ2xpZW50LFxuICAgICAgICAgIGRlcHM6IFtBdXRoQ2xpZW50Q29uZmlnXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxufVxuIl19