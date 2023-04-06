import { Injectable } from '@angular/core';
import axios from 'axios'
export interface Metadata {
  name: string;
  description: string;
  image: string;
}
const key = "6bcd28eb2a0a6484a590";
const secret = "1ce3bad7613b42779d159856307aa2d52cd5757993e9a35079edfc7cd21ac527"
export const pinJSONToIPFS = async (json: any) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  return axios
    .post(url, json, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return response.data.IpfsHash
    })
    .catch(function (error) {
      console.log(error)
    })
}

export const pinFileToIPFS = async (file: string | Blob, pinataMetaData: any) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`

  let data = new FormData()

  data.append('file', file)
  data.append('pinataMetadata', JSON.stringify(pinataMetaData))

  return axios
    .post(url, data, {
      maxBodyLength: 1000000000000000000,
      headers: {
        'Content-Type': `multipart/form-data;`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return response.data.IpfsHash
    })
    .catch(function (error) {
      console.log(error)
    })
}

export const pinatatoIPFS = async (link:string) =>{
  try {
    const res = await axios.get(link, {
      headers: {
        'Accept': 'text/plain'
      }
    })
    return res.data.image;
  } catch (error) {
    console.log(error)
  }
  
}

@Injectable({
  providedIn: 'root'
})
export class PinataService {

  constructor() { }
   
 
  
  
  
}


