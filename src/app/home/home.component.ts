import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import Web3 from 'web3';
import { ContractService } from '../contract.service';
import { AbiItem } from 'web3-utils';
import { ethers } from 'ethers';
import data from '../../dConnect.json'
import { pinatatoIPFS } from '../pinata.service';
declare let window: any
type Posts = Array<{ post_id: number; post_ownAdd: string; post_url: string; post_name:string; post_description: string; post_like:number; post_exits:boolean; owner_name:string; owner_profile: string}>;
let metamask: any
if (typeof window !== 'undefined') {
  metamask = window.ethereum
  console.log(metamask);
}
const getEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(metamask)
  const signer =await provider.getSigner()
  const transactionContract = new ethers.Contract(
    '0xefD5c35D087d4aa2b0a3e40c57F8d30aB98FDc6c',
    data.abi,
    signer,
  )

  return transactionContract
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  web3: any;
  
  
  constructor(private router: Router, private authService: AuthService, 
    private walletService: WalletService, private contractSerivce: ContractService) {
    const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/1wE-_ZE0aQMG7acOdjTk1CfJbvz5irZh');
    const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
    
  }
  
  post : Posts = [];
  public address: string = "";
  fixedurl="https://gateway.pinata.cloud/ipfs/";
  userObj: any;
  tempUser:any;
  postObj:any;
  postsObj: any[];
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
    this.fetchUser(this.address);

  }
  
  async createNewUser(){
    const contract = await getEthereumContract()
    const transactionParameters = {
      to: '0xefD5c35D087d4aa2b0a3e40c57F8d30aB98FDc6c',
      from: this.address,
    data: await contract.createUser(this.setName,this.address),
  }
  try {
    await metamask.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    })

  } catch (error: any) {
    console.log(error)
  }
  }
  async fetchUser(curr_address:string) {
    // get the current account from the provider (e.g., MetaMask)
    const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/1wE-_ZE0aQMG7acOdjTk1CfJbvz5irZh');
    const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
    // call the smart contract method
      this.userObj = await myContract.methods.getUser(curr_address).call();
      if(this.userObj[0]=="")
      {
        this.createNewUser();
      }
      console.log(this.userObj);
      this.name=this.userObj[0];
      this.currentUser=this.userObj.userAddress;
      this.followers=this.userObj.followers.length;
      this.followArr=this.userObj.followers;
      this.unfollowArr=this.userObj.unfollowers;
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
        const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/1wE-_ZE0aQMG7acOdjTk1CfJbvz5irZh');
        const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
        this.userObj = await myContract.methods.getUser(this.postObj[i]).call();
        this.temppost_id= this.userObj.postIds;
        for(let j=0;j<this.temppost_id.length;j++)
        {
          this.posts_ids=this.posts_ids.push(this.temppost_id[j]);
        }
      }
    }
    
    for(let m=0;m<this.posts_ids.length;m++)
    {
        const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/1wE-_ZE0aQMG7acOdjTk1CfJbvz5irZh');
        const myContract = new web3.eth.Contract(this.contractSerivce.contractABI as AbiItem[], this.contractSerivce.contractAddress)
        this.postsObj = await myContract.methods.getPost(this.posts_ids[m]).call();
        this.userObj = await myContract.methods.getUser(this.postsObj[1]).call();
        this.tempname = this.userObj[0];
        this.tempurl=this.userObj.profile_link;
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
        this.post.push({ post_id: this.postsObj[0], post_ownAdd: this.postsObj[1], post_url: this.dataa, post_name:this.postsObj[3], post_description: this.postsObj[4], post_like:this.postsObj[5], post_exits:this.postsObj[6],owner_name:this.tempname, owner_profile: this.url});
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
  if(this.post[id].post_ownAdd == this.currentUser){
    return true;
  }
  else return false;
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
    const contract = await getEthereumContract()
    const transactionParameters = {
      to: '0xefD5c35D087d4aa2b0a3e40c57F8d30aB98FDc6c',
      from: this.currentUser,
      data: await contract.likePost(this.currentUser, idd),
  }
  try {
    await metamask.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  } 
  catch (error: any) {
    console.log(error)
  }
  }
  async unlikePost(idd:number){
    const contract = await getEthereumContract()
    const transactionParameters = {
      to: '0xefD5c35D087d4aa2b0a3e40c57F8d30aB98FDc6c',
      from: this.currentUser,
    data: await contract.disLikePost(this.currentUser, idd),
  }
  try {
    await metamask.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    this.ngOnInit();
  } catch (error: any) {
    console.log(error)
  }
  }
  async deletePost(idd:number){
    const contract = await getEthereumContract()
    const transactionParameters = {
      to: '0xefD5c35D087d4aa2b0a3e40c57F8d30aB98FDc6c',
      from: this.currentUser,
    data: await contract.deletePost(idd),
  }
  try {
    await metamask.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    this.fetchUser(this.currentUser);
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
    const contract = await getEthereumContract()
    const transactionParameters = {
      to: '0xefD5c35D087d4aa2b0a3e40c57F8d30aB98FDc6c',
      from: this.currentUser,
    data: await contract.followUser(this.currentUser, owner_address),
  }
  try {
    await metamask.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    this.fetchUser(this.currentUser);
  } catch (error: any) {
    console.log(error)
  }
  }
  async unfollow(owner_address:string){
    const contract = await getEthereumContract()
    const transactionParameters = {
      to: '0xefD5c35D087d4aa2b0a3e40c57F8d30aB98FDc6c',
      from: this.currentUser,
    data: await contract.unfollowUser(this.currentUser, owner_address),
  }
  try {
    await metamask.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    this.fetchUser(this.currentUser);
  } catch (error: any) {
    console.log(error)
  }
  }
  routeToProfile(){
    this.router.navigateByUrl('/set-profile');
  }
}
