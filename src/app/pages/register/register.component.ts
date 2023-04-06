import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../../wallet.service';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{
  public address: String= "";
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, 
    private walletService: WalletService)
  { }
  credentials: FormGroup;
  
  
   get name(){
    return this.credentials.get('name');
  }
  get email(){
    return this.credentials.get('email')
  }
  get password(){
    return this.credentials.get('password');
  }
  checkWalletConnected = async () => {
    const accounts = await this.walletService.checkWalletConnected();
    if(accounts == false){
      this.router.navigateByUrl('/metamask', {replaceUrl: true});
    }
  }
  async register(){
    
    const user = await this.authService.register(this.credentials.value, this.address);
    if(user)
    {
      this.router.navigateByUrl('/email-sent', {replaceUrl: true});
    }
    else
    {
      console.log("Error"); 
    }
  }
  ngOnInit(): void {
    this.credentials = this.fb.group({
      name: ['',[Validators.required, Validators.nullValidator]],
      email: ['',[Validators.required, Validators.email]],
      // email: ['',[Validators.required, Validators.email,this.emailDomain]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.checkWalletConnected();
    this.address=this.walletService.address;
  }
  // emailDomain(control: AbstractControl): {[key: string]:any}| null {
  //   const email: string=control.value;
  //   const domain = email.substring(email.lastIndexOf('@')+1);
  //   if(domain.toLowerCase() === 'nmims.edu.in')
  //   {
  //     return null;
  //   }
  //   else 
  //   {
  //     return { 'emailDomain': true};
  //   }
  // }
  routeToLogin(){
    this.router.navigateByUrl('/login');
  }

  fetchName(){
    
  }
  public async navigateToSection(section: string) {
    await this.router.navigateByUrl('/');
    window.location.hash = '';
    window.location.hash = section;
}
  routeToHome()
  {
    this.router.navigateByUrl('/main', {replaceUrl: true});
  }
}
