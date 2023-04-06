import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification,  signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { docData, Firestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { collection, doc, getDocs, setDoc} from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, 
    private firestore: Firestore, 
    private router: Router)
  {

  }

  async register ({name,email,password}:any, address: String)  {
    try{
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const userDocRef = doc(this.firestore, `users/${address}`);
      setDoc(userDocRef, { name,email });
      return user;
    }
    catch(e)
    {
      return null;
    }
  }

  async login ({email,password}:any)
  {
    try{
      const user = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    }
    catch(e)
    {
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }

  getUserById(id: string){
    const userDocRef = doc(this.firestore, `users/${id}`);
    return docData(userDocRef, {idField: 'id'} );
  }

  sendEmailForVerification(user : any){
    sendEmailVerification(user).then((res:any)=>
    {
      
    },(err:any) =>{
      alert(err.message);
    });
  } 
}
