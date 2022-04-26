import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing-components';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { AuthenticationButtonComponent } from './components/authentication-button/authentication-button.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginMainComponent } from './screen/login-main/login-main.component';
import { NavbarComponent } from './screen/navbar/navbar.component';
import { FooterComponent } from './screen/footer/footer.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginButtonComponent,
    LogoutButtonComponent,
    AuthenticationButtonComponent,
    ProfileComponent,
    LoginMainComponent,
    NavbarComponent,
    FooterComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AuthModule.forRoot({
      ...env.auth,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent,LoginMainComponent]

})
export class AppModule { }


