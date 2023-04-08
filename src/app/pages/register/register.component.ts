import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../../wallet.service';
import { AuthService } from 'src/app/auth.service';
import Web3 from 'web3';
import { ContractService } from '../../contract.service';
import { AbiItem } from 'web3-utils';
declare let window: any

let metamask: any
if (typeof window !== 'undefined') {
  metamask = window.ethereum
  console.log(metamask);
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{
  private webb3: Web3;
  public address: String= "";
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, 
    private walletService: WalletService, private contractSerivce: ContractService)
  {
    const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
    const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
    if (window.ethereum) {
      this.webb3 = new Web3(window.ethereum);
      window.ethereum.enable();
    } else {
      console.warn('Please install MetaMask to use this application!');
    }
   }
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
    console.log(this.credentials.get('name'));
    console.log(this.address);
    const user = await this.authService.register(this.credentials.value, this.address);
    
    if(user)
    {
      console.log("get in")
      const contract = new this.webb3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
      const accounts = await this.webb3.eth.getAccounts();
      const result = await contract.methods.createUser(this.credentials.get('name'),this.address).send({ from: this.address});
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
