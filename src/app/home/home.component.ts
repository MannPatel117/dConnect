import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import Web3 from 'web3';
import { ContractService } from '../contract.service';
import { AbiItem } from 'web3-utils';
import data from '../../dConnect.json'
import { pinatatoIPFS } from '../pinata.service';
declare let window: any
type Posts = Array<{ post_id: number; post_ownAdd: string; post_url: string; post_name:string; post_description: string; post_like:number; post_exits:boolean; owner_name:string; owner_profile: string}>;
let metamask: any
if (typeof window !== 'undefined') {
  metamask = window.ethereum
  console.log(metamask);
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  web3: any;
  
  private webb3: Web3;
  constructor(private router: Router, private authService: AuthService, 
    private walletService: WalletService, private contractSerivce: ContractService) {
    const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
    const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
    if (window.ethereum) {
      this.webb3 = new Web3(window.ethereum);
      window.ethereum.enable();
    } else {
      console.warn('Please install MetaMask to use this application!');
    }
  }
  
  post : Posts = [];
  public address: string = "";
  fixedurl="https://gateway.pinata.cloud/ipfs/";
  userObj: any;
  tempUser:any;
  postObj:any;
  postsObj: any;
  public name: string = "";
  public followers=0;
  followArr:any[];
  unfollowArr:any[];
  public following=0;
  public url: string;
  public like:any[];
  public dislike:any[];
  posts_ids: any;
  temppost_id:any;
  currentUser:string;
  tempurl:string;
  tempname:string;
  slicedurl:string;
  setName:string;
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
    console.log(this.address);
    this.authService.getUserById(this.address).subscribe(res =>{
      this.setName=res['name'];
    });
    this.post=[];
    this.fetchUser(this.address);

  }
  
  async createNewUser(){
    
  try {
    const contract = new this.webb3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
    const accounts = await this.webb3.eth.getAccounts();
    const result = await contract.methods.createUser(this.setName,this.address).send({ from: this.currentUser});
    console.log(result);
    this.ngOnInit();

  } catch (error: any) {
    console.log(error)
  }
  }
  async fetchUser(curr_address:string) {
    // get the current account from the provider (e.g., MetaMask)
    const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
    const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
    // call the smart contract method
      this.userObj = await myContract.methods.getUser(curr_address).call();
      if(this.userObj[0]=="")

      {
        console.log("Udawoidnawoidtriggered")
        this.createNewUser();
      }
      console.log(this.userObj);
      this.name=this.userObj[0];
      this.currentUser=this.userObj.userAddress;
      this.followers=this.userObj.followers.length;
      this.followArr=this.userObj.following;
      this.unfollowArr=this.userObj.unfollowing;
      this.followers=(this.followers)-(this.userObj.unfollowers.length);
      this.following=this.userObj.following.length;
      this.following=(this.following)-(this.userObj.unfollowing.length);
      this.like=this.userObj.likeIds;
      this.dislike=this.userObj.dislikeIds;
      this.url=this.userObj.profile_link;
      this.posts_ids=this.userObj.postIds;
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
      this.postObj = await myContract.methods.getUsers().call();
      console.log(this.postObj)
      this.fetchPosts();
  }
  postss: any[];
  dataa:any;
  async fetchPosts(){
    this.postObj = this.postObj.filter(
      (element: any, i: any) => i === this.postObj.indexOf(element)
    );
    
    for(let i=0;i<this.postObj.length;i++)
    {
      if(this.postObj[i]==this.currentUser) {
        console.log(this.posts_ids);
        continue;
      } 
      else{
        const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
        const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
        this.userObj = await myContract.methods.getUser(this.postObj[i]).call();
        console.log(this.userObj);
        this.temppost_id= this.userObj.postIds;
        for(let j=0;j<this.temppost_id.length;j++)
        { 
          console.log(this.temppost_id[j]);
          this.posts_ids=this.posts_ids.concat(this.temppost_id[j]);
        }
      }
    }
    
    for(let m=0;m<this.posts_ids.length;m++)
    {
      this.tempUser="";
        const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
        const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
        this.postsObj = await myContract.methods.getPost(this.posts_ids[m]).call();
        console.log("This is post obj",this.postsObj);
        this.userObj = await myContract.methods.getUser(this.postsObj[1]).call();
        console.log("This is user obj",this.userObj);
        this.tempname = this.userObj[0];
        this.tempurl=this.userObj[2]
        if(this.tempurl == "")
        {
        this.tempurl="https://i.ibb.co/3csvHtd/Screenshot-2023-04-02-at-6-32-1.png";
        }
        else{
          this.slicedurl=this.tempurl;
          this.slicedurl=this.slicedurl.slice(7);
          this.slicedurl=this.fixedurl.concat(this.slicedurl);
          this.dataa= await pinatatoIPFS(this.slicedurl);
          this.dataa=this.dataa.slice(7);
          this.dataa=this.fixedurl.concat(this.dataa);
          this.tempurl=this.dataa;
        }
        this.slicedurl=this.postsObj[2];
        this.slicedurl=this.slicedurl.slice(7);
        this.slicedurl=this.fixedurl.concat(this.slicedurl);
        console.log(this.slicedurl);
        this.dataa= await pinatatoIPFS(this.slicedurl);
        console.log(this.dataa);
        this.dataa=this.dataa.slice(7);
        this.dataa=this.fixedurl.concat(this.dataa);
        console.log(this.dataa)
        this.post.push({ post_id: this.postsObj[0], post_ownAdd: this.postsObj[1], post_url: this.dataa, post_name:this.postsObj[3], post_description: this.postsObj[4], post_like:this.postsObj[5], post_exits:this.postsObj[6],owner_name:this.tempname, owner_profile: this.tempurl});
    }
    console.log("Posts", this.post);
  }
  public async navigateToSection(section: string) {
    await this.router.navigateByUrl('/');
    window.location.hash = '';
    window.location.hash = section;
}
count_like=0;
count_dislike=0;
checklike(id:number){
  this.count_like=0;
  this.count_dislike=0;
  if(this.like.length == 0){
    return false;
  }
  else{
    for(let i=0;i<this.like.length;i++)
    {
      if(this.like[i]==id)
      {
        this.count_like++;
      }
    }
    for(let i=0;i<this.dislike.length;i++)
    {
      if(this.dislike[i]==id)
      {
        this.count_dislike++;
      }
    }
    if(this.count_like==this.count_dislike)
    {
      return false;
    }
    else{
      return true;
    }
  }
}
checkowner(id:number){
  for(let n=0;n<this.post.length;n++)
  {
    if(this.post[n].post_id==id)
  {
    if(this.post[n].post_ownAdd == this.currentUser){
      return true;
      
    }
  }
  }
  
  
  return false;
}
  routeToHome()
  {
    this.router.navigateByUrl('/main', {replaceUrl: true});
  }
  routeToMint()
  {
    this.router.navigateByUrl('/mint');
  }
  
  async likePost(idd:number){
   

    //   const accounts = await this.web3.eth.getAccounts();
    // const contract = await getEthereumContract()
  //   const transactionParameters = {
  //     to: '0x33c159887E8B4c79747a0F7869f47fAa3366A7b6',
  //     from: this.currentUser,
  //     data: await contract.likePost(this.currentUser, idd),
  // }
  try {
    const contract = new this.webb3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
    const accounts = await this.webb3.eth.getAccounts();
    const result = await contract.methods.likePost(this.currentUser, idd).send({ from: this.currentUser});
    console.log(result);
    this.ngOnInit();
    // await metamask.request({
     
    //   method: 'eth_sendTransaction',
    //   params: [transactionParameters],
    // });
  } 
  catch (error: any) {
    console.log("YOYOYOYOOYO")
    console.log(error)
  }
  }
  async unlikePost(idd:number){
    try {
      const contract = new this.webb3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
      const accounts = await this.webb3.eth.getAccounts();
      const result = await contract.methods.disLikePost(this.currentUser, idd).send({ from: this.currentUser});
      console.log(result);
      this.ngOnInit();
    } catch (error: any) {
      console.log(error)
    }
  }
  
  async deletePost(idd:number){
  try {
    const contract = new this.webb3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
    const accounts = await this.webb3.eth.getAccounts();
    const result = await contract.methods.deletePost(idd).send({ from: this.currentUser});
    console.log(result);
    this.ngOnInit();
  } catch (error: any) {
    console.log(error)
  }
  }
  followCount=0;
  unfollowCount=0;
  checkfollow(owner_address:string)
  {
    if(owner_address == this.currentUser)
    {
      return false;
    }
    this.followCount=0;
    this.unfollowCount=0;
    console.log(this.followArr);
    console.log(this.unfollowArr)
    for(let i=0; i<this.followArr.length;i++)
    {
      if(this.followArr[i]==owner_address)
      {
        
        this.followCount++;
      } 
    }
    for(let i=0; i<this.unfollowArr.length;i++)
    {
      if(this.unfollowArr[i]==owner_address)
      {
        this.unfollowCount++;
      } 
    }
    if(this.followCount==this.unfollowCount)
    {
      console.log("chek,",this.followCount,"  ", this.unfollowCount)
      return true;
    }
    else{
      return false;
    }
  }
  checkunfollow(owner_address:string)
  {
    if(owner_address == this.currentUser)
    {
      return false;
    }
    this.followCount=0;
    this.unfollowCount=0;
    for(let i=0; i<this.followArr.length;i++)
    {
      if(this.followArr[i]==owner_address)
      {
        this.followCount++;
      } 
    }
    for(let i=0; i<this.unfollowArr.length;i++)
    {
      if(this.unfollowArr[i]==owner_address)
      {
        this.unfollowCount++;
      } 
    }
    if(this.followCount!=this.unfollowCount)
    {
      return true;
    }
    else{
      return false;
    }
  }

  async follow(owner_address:string){
  try {
    const contract = new this.webb3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
    const accounts = await this.webb3.eth.getAccounts();
    const result = await contract.methods.followUser(this.currentUser, owner_address).send({ from: this.currentUser});
    console.log(result);
    this.ngOnInit();
  } catch (error: any) {
    console.log(error)
  }
  }
  async unfollow(owner_address:string){
  try {
    const contract = new this.webb3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress);
    const accounts = await this.webb3.eth.getAccounts();
    const result = await contract.methods.unfollowUser(this.currentUser, owner_address).send({ from: this.currentUser});
    console.log(result);
    this.ngOnInit();
  } catch (error: any) {
    console.log(error)
  }
  }
  routeToProfile(){
    this.router.navigateByUrl('/set-profile');
  }
}
