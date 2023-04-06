import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate} from '@angular/fire/auth-guard';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MetamaskComponent } from './pages/metamask/metamask.component';
import { EmailSentComponent } from './pages/email-sent/email-sent.component';
import { MintComponent } from './mint/mint.component';
import { SetprofileComponent } from './setprofile/setprofile.component';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);


const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'login', component: LoginComponent,
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'register', component: RegisterComponent,
    ...canActivate(redirectLoggedInToHome)
  },

  {
    path: 'main', component: MainComponent,
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'admin', component: AdminComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'metamask', component: MetamaskComponent,
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'email-sent', component: EmailSentComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'mint', component: MintComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'set-profile', component: SetprofileComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
