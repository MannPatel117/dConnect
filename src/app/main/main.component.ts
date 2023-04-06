import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  public walletConnected: boolean = false;
  public walletId: string = '';
  constructor(private router: Router, private walletService: WalletService) { }
  connectToWallet  = () => {
    this.walletService.connectWallet();
  }

  checkWalletConnected = async () => {
    const accounts = await this.walletService.checkWalletConnected();
    if(accounts.length > 0){
      this.walletConnected = true;
      this.walletId = accounts[0];
      console.log(this.walletId);
    }
  }

  ngOnInit(): void {
    this.checkWalletConnected();
  }
  routeToMetamask()
  {
    this.router.navigateByUrl('/metamask');
  }
  public navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
}
  routeToHome()
  {
    this.router.navigateByUrl('/', {replaceUrl: true});
  }
}
