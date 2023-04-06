import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../wallet.service';
@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css']
})
export class MetamaskComponent {
  public walletConnected: boolean = false;
  public metamask: boolean =false;
  public showFlag=false;
  public walletId: string = '';
  constructor(private router: Router, private walletService: WalletService) { }
  connectToWallet= async () => {
    this.metamask = await this.walletService.connectWallet();
    if(this.metamask == false)
    {
      this.showFlag=true;
    }
    else{
      this.showFlag=false;
    }
    this.checkWalletConnected();
  }

  checkWalletConnected = async () => {
    const accounts = await this.walletService.checkWalletConnected();
    console.log(accounts);
    if(accounts.length > 0){
      this.walletConnected = true;
      this.walletId = accounts[0];
      console.log(this.walletId);
      this.walletService.setAddress(this.walletId);
      this.router.navigateByUrl('/login', {replaceUrl: true});
    }
  }

  ngOnInit(): void {
    this.checkWalletConnected();
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
