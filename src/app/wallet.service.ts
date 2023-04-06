import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class WalletService {
  public ethereum: any;
  public address:String = "";
  constructor() {
    
    const {ethereum} = <any>window
    this.ethereum = ethereum

   }
   
   public connectWallet = async ():Promise<boolean>  => {
    try{
      if(!this.ethereum){
        return false
      } 
      else
      {
        const accounts = await this.ethereum.request({method: 'eth_requestAccounts'});
        return true
      }
      
    }
    catch(e){
      
       throw new Error("No ethereum object found");
       
    }
  }

  public setAddress(wallet: String): void
  {
      this.address=wallet;
  }

  public checkWalletConnected = async () => {
    try{
      if(!this.ethereum) return false;
      const accounts = await this.ethereum.request({method: 'eth_accounts'});
      return accounts;
    }
    catch(e){
      throw new Error("No ethereum object found");
    }
  }
  public disconnectWallet = async () => {
    this.ethereum.disconnect();
  }

}
