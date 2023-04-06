import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { WalletService } from '../../wallet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public address: string= "";
  credentials: FormGroup;
  
  constructor(private router: Router, private walletService: WalletService,private fb: FormBuilder, 
    private rf: ReactiveFormsModule,    private authService: AuthService,) { }

    get password(){
      return this.credentials.get('password');
    }
   
 
  checkWalletConnected = async () => {
    const accounts = await this.walletService.checkWalletConnected();
    this.address=accounts;
    console.log(this.address)
    if(accounts.length <= 0){
      this.router.navigateByUrl('/metamask', {replaceUrl: true});
    }
    this.authService.getUserById(this.address).subscribe(res =>{
      this.eemail=res['email'];
    });
  }
  eemail="";
  async ngOnInit(): Promise<void> {
    this.checkWalletConnected();
   
  

    this.credentials = this.fb.group({
      email:[''],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    
    
  }
  async login(){
    this.credentials.value.email=this.eemail;
    const user = await this.authService.login(this.credentials.value);
    const verifiedUser=user?.user.emailVerified;
      if(user)
      {
          this.router.navigateByUrl('/home', {replaceUrl: true});
      }
      else
      {
        alert("Invalid Credentials");
      }
    }
  routeToRegister(){
    this.router.navigateByUrl('/register');
  }
  public async navigateToSection(section: string) {
    await this.router.navigateByUrl('/');
    window.location.hash = '';
    window.location.hash = section;
}
  routeToHome()
  {
    this.router.navigateByUrl('/', {replaceUrl: true});
  }
}
