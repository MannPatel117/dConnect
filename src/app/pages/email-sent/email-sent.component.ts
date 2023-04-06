import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { WalletService } from '../../wallet.service';
@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.css']
})
export class EmailSentComponent implements OnInit {

  constructor(private router: Router, private walletService: WalletService,  private authService: AuthService,private auth: Auth,) { }
  ngOnInit(): void {
    const user= this.auth.currentUser;
    this.authService.sendEmailForVerification(user);
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
  routeToHomePage()
  {
    this.router.navigateByUrl('/home', {replaceUrl: true});
  }
}

