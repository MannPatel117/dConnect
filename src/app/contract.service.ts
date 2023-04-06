import { Injectable } from '@angular/core';
import data from '../dConnect.json'
@Injectable({
  providedIn: 'root'
})

export class ContractService {
  
  contractAddress= '0xefD5c35D087d4aa2b0a3e40c57F8d30aB98FDc6c';
  contractABI = data.abi;
}
