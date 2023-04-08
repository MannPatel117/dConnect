import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { AuthService } from '../auth.service';
import { ContractService } from '../contract.service';
import { WalletService } from '../wallet.service';
import { pinJSONToIPFS } from '../pinata.service';
import { pinFileToIPFS } from '../pinata.service';
import { Metadata } from '../pinata.service';
import data from '../../dConnect.json';
import { pinatatoIPFS } from '../pinata.service';
declare let window: any

let metamask: any
if (typeof window !== 'undefined') {
  metamask = window.ethereum
  console.log(metamask);
}


@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})

export class MintComponent implements OnInit{
  private webb3: Web3;
  web3: any;
  name_post: string;
  description_post: string;
  public ethereum: any;
  constructor(private router: Router, private authService: AuthService,
    private walletService: WalletService, private contractSerivce: ContractService) {
    const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
    const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
      
  }
  public address: string = "";
  myobject: any;
  public namee: string = "";
  public followers=0;
  public following=0;
  public url: string;
  processing= false;
  tempurl:string;
  slicedurl:string;
  dataa:any;
  fixedurl="https://gateway.pinata.cloud/ipfs/";
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/main', { replaceUrl: true });
  }
  checkWalletConnected = async () => {
    const accounts = await this.walletService.checkWalletConnected();
    if (accounts.length <= 0) {
      this.router.navigateByUrl('/metamask', { replaceUrl: true });
    }
    this.address=accounts[0];
  }
  async ngOnInit() {
    await this.checkWalletConnected();
    this.fetchUser(this.address);
   
  }
  async fetchUser(curr_address:string) {
    // get the current account from the provider (e.g., MetaMask)
    const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
    const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
    // call the smart contract method
      this.myobject = await myContract.methods.getUser(curr_address).call();
      console.log(this.myobject);
      this.namee=this.myobject[0];
      this.followers=this.myobject.followers.length;
      this.followers=(this.followers)-(this.myobject.unfollowers.length);
      this.following=this.myobject.following.length;
      this.following=(this.following)-(this.myobject.unfollowing);
      this.url=this.myobject.profile_link;
      if(this.url == "")
      {
        this.url="https://i.ibb.co/3csvHtd/Screenshot-2023-04-02-at-6-32-1.png";
      }
      else{
        this.slicedurl=this.url;
        this.slicedurl=this.slicedurl.slice(7);
        this.slicedurl=this.fixedurl.concat(this.slicedurl);
        this.dataa= await pinatatoIPFS(this.slicedurl);
        this.dataa=this.dataa.slice(7);
        this.dataa=this.fixedurl.concat(this.dataa);
        this.url=this.dataa;
      }
  
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
  routeToMint()
  {
    this.router.navigateByUrl('/mint');
  }
  selectedFile: File | undefined;

  onFileSelected(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  this.selectedFile = inputElement.files?.[0];
}
  async mint(){
  this.processing=true;
  const pinataMetaData = {
    name: `${this.name_post} - ${this.description_post}`,
  }
  if(this.selectedFile == undefined) return alert('No File uploaded')
  const ipfsImageHash = await pinFileToIPFS(this.selectedFile, pinataMetaData)
  const imageMetaData: Metadata = {
    name: this.name_post,
    description: this.description_post,
    image: `ipfs://${ipfsImageHash}`,
  }
  const ipfsJsonHash = await pinJSONToIPFS(imageMetaData);
  console.log(ipfsJsonHash);
  
  this.mintNFT(ipfsJsonHash);
}
async mintNFT(ipfsJsonHash:string)
{
  
  try {
    const contract = new this.webb3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
    const accounts = await this.webb3.eth.getAccounts();
    const result = await contract.methods.mint(this.address, `ipfs://${ipfsJsonHash}`,this.name_post, this.description_post);
    console.log(result);
    this.router.navigateByUrl('/home', { replaceUrl: true });
  } catch (error: any) {
    console.log(error)
  }
}
routeToProfile(){
  this.router.navigateByUrl('/set-profile');
}

}
