import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  {
  path:'',
  component: HomeComponent,
  },
  {
    path:'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
