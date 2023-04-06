import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { MetamaskComponent } from './pages/metamask/metamask.component';
import { EmailSentComponent } from './pages/email-sent/email-sent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MintComponent } from './mint/mint.component';
import { HttpClientModule } from '@angular/common/http';
import { SetprofileComponent } from './setprofile/setprofile.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    AdminComponent,
    MetamaskComponent,
    EmailSentComponent,
    MintComponent,
    SetprofileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
