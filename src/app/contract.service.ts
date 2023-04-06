import { Injectable } from '@angular/core';
import data from '../dConnect.json'
@Injectable({
  providedIn: 'root'
})

export class ContractService {
  
  contractAddress= '0x33c159887E8B4c79747a0F7869f47fAa3366A7b6';
  contractABI = data.abi;
}
