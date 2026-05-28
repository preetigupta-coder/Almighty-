
import { onAuthStateChanged } from 'firebase/auth';
import { auth ,db} from '@/firebase/config';
import { getDoc ,doc, addDoc,query, collection, getDocs, where, updateDoc,increment} from 'firebase/firestore';

//interfaces
import { UserData,DealerData,MCDData,trading,UserOrder,Complaints,DealersOrder,Post ,AdminData} from './Interfaces';

//AUTH
export const isLogin = (): Promise<boolean> => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
};

//USER
export const isUserExist= async (email: string): Promise<boolean> => {
    try{
      const q= query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }catch(error){
        console.error("Error fetching user data:", error);
        throw error;
    }
}
export const getUserData = async (email: string): Promise<UserData[]> => {
    try{
        const q= query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const UserData =  querySnapshot.docs.map(doc => ({
          id:doc.id,
          balance:doc.data().balance,
          name:doc.data().name,
          email: doc.data().email,
          password:doc.data().password,
          phone_number:doc.data().phone_number
        }));
        return UserData;
    }catch(error){
        console.error("Error fetching user data:", error);
        throw error;
    }
}

//Dealer
export const isDealerExist= async (email: string): Promise<boolean> => {
    try{
      const q= query(collection(db, 'dealers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }catch(error){
        console.error("Error fetching dealer data:", error);
        throw error;
    }
}
export const getDealerData = async (email: string): Promise<DealerData[]> => {
    try{
      const q= query(collection(db, 'dealers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      const DealerData = querySnapshot.docs.map(doc => ({
          id:doc.id,
          email:doc.data().email,
          password:doc.data().password,
          balance:doc.data().balance,
          address:doc.data().address,
          pincode:doc.data().pincode,
          lng:doc.data().lng,
          lat:doc.data().lat,
          phone_number:doc.data().phone_number
      }));
      return DealerData;
    }catch(error){
        console.error("Error fetching dealer data:", error);
        throw error;
    }

}


//MCD
export const isMCDExist= async (email: string): Promise<boolean> => {
    try{
      const q= query(collection(db, 'mcd'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }catch(error){
        console.error("Error fetching mcd data:", error);
        throw error;
    }

}
export const getMCDData = async (email: string): Promise<MCDData[]> => {
   try{
    const q= query(collection(db, 'mcd'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    const MCDData = querySnapshot.docs.map(doc => ({
        id:doc.id,
        email:doc.data().email,
        password:doc.data().password,
        pincode:doc.data().pincode
    }));
    return MCDData;
   }catch(error){
    console.error("Error fetching mcd data:", error);
    throw error;
   }

}
export const MCDregister=async(mcd:MCDData):Promise<void>=>{
    try{
        await addDoc(collection(db, 'mcd'), mcd);
    }catch(error){
        console.error("Error adding mcd data:", error);
        throw error;
    }
}

//orders
export const getuserallorders=async(userid:string):Promise<UserOrder[]>=>{
    try{
        const q= query(collection(db, 'orders'), where('userid', '==', userid));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({
            userid:doc.data().userid,
            id:doc.id,
            voucherPrice:doc.data().voucherPrice,
            voucherName:doc.data().voucherName,
            time:doc.data().time,
            lat:doc.data().lat,
            long:doc.data().long
        }));
        return orders;
    }catch(error){
        console.error("Error fetching user orders:", error);
        throw error;
    }
}
export const adduserorder=async(order:UserOrder):Promise<void>=>{
    try{
        await addDoc(collection(db, 'orders'), order);
    }catch(error){
        console.error("Error adding user order:", error);
        throw error;
    }
}

//dealer orders
export const getdealerallorders = async (dealerid: string): Promise<DealersOrder[]> => {
    try {
      const q = query(collection(db, 'dealer_orders'), where('dealerid', '==', dealerid));
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        dealerid:doc.data().dealerid,
        id:doc.id,
        voucherPrice:doc.data().voucherPrice,
        voucherName:doc.data().voucherName,
        time:doc.data().time,
        lat:doc.data().lat,
        long:doc.data().long
      }));
      return orders;
    } catch (error) {
      console.error("Error fetching dealer orders:", error);
      throw error; 
    }
};
export const adddealerorder=async(order:DealersOrder):Promise<void>=>{
  try{
      await addDoc(collection(db, 'dealer_orders'), order);
  }catch(error){
      console.error("Error adding user order:", error);
      throw error;
  }
}

//complaints
export const getallcomplaints=async(pincode:string):Promise<Complaints[]>=>{
    try{
        const q= query(collection(db, 'complaints'), where('pincode', '==', pincode));
        const querySnapshot = await getDocs(q);
        const complaints = querySnapshot.docs.map(doc => ({
            userid:doc.data().userid,
            id:doc.id,
            title:doc.data().title,
            description:doc.data().description,
            imageurl:doc.data().imageurl,
            lat:doc.data().lat,
            lng:doc.data().lng,
            pincode:doc.data().pincode,
            location:doc.data().location,
            status:doc.data().status,
            time:doc.data().time
        }));
        return complaints;
    }catch(error){
        console.error("Error fetching complaints:", error);
        throw error;
    }
}
export const addcomplaint=async(complaint:Complaints):Promise<void>=>{
    try{
        await addDoc(collection(db, 'complaint'), complaint);
    }catch(error){
        console.error("Error adding complaints:", error);
        throw error;
    }
}
export const changecomplaintstatus=async(id:string,status:string):Promise<void>=>{
    try{
        const q= query(collection(db, 'complaint'), where('id', '==',id));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.map(async(doc) => {
            await updateDoc(doc.ref, {
                status:status
            });
        });
    }catch(error){
        console.error("Error updating complaints:", error);
        throw error;
    }
}
export const changecomplainttiming=async(id:string,time:Date):Promise<void>=>{
    try{
        const q= query(collection(db, 'complaint'), where('id', '==',id));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.map(async(doc) => {
            await updateDoc(doc.ref, {
                time:time
            });
        });
    }catch(error){
        console.error("Error updating complaints:", error);
        throw error;
    }
}
//trading
export const getUsertradingdetails=async(userid:string):Promise<trading[]>=>{
    try{
        const q= query(collection(db, 'trading'), where('userid', '==', userid));
        const querySnapshot = await getDocs(q);
        const trading_details = querySnapshot.docs.map(doc => ({
            id:doc.id,
            userid:doc.data().userid,
            dealerid:doc.data().dealerid,
            title:doc.data().title,
            description:doc.data().description,
            price:doc.data().price,
            quantity:doc.data().quantity,
            pincode:doc.data().pincode,
            address:doc.data().address,
            district:doc.data().district,
            state:doc.data().state,
            createdAt:doc.data().createdAt,
            status:doc.data().status
            
        }));
        return trading_details;
    }catch(error){
        console.error("Error fetching trading details:", error);
        throw error;
    }
}
export const getDealertradingdetails=async(dealerid:string):Promise<trading[]>=>{
    try{
        const q= query(collection(db, 'trading'), where('dealerid', '==', dealerid));
        const querySnapshot = await getDocs(q);
        const trading_details = querySnapshot.docs.map(doc => ({
            id:doc.id,
            userid:doc.data().userid,
            dealerid:doc.data().dealerid,
            title:doc.data().title,
            description:doc.data().description,
            price:doc.data().price,
            quantity:doc.data().quantity,
            pincode:doc.data().pincode,
            address:doc.data().address,
            district:doc.data().district,
            state:doc.data().state,
            createdAt:doc.data().createdAt,
            status:doc.data().status
        }));
        return trading_details;
    }catch(error){
        console.error("Error fetching trading details:", error);
        throw error;
    }
}
export const addtrading=async(trading:trading):Promise<void>=>{
    try{
        await addDoc(collection(db, 'trading'), trading);
        await adminincomeincrease(trading.price*0.1);
    }catch(error){
        console.error("Error adding trading details:", error);
        throw error;
    }
}
export const updatetrading=async(id:string,dealerid:string):Promise<void>=>{
    try{
        const q= query(collection(db, 'trading'), where('id', '==',id));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.map(async(doc) => {
            await updateDoc(doc.ref, {
                dealerid:dealerid,
                status:'payment_done'
            });
        });
    }catch(error){
        console.error("Error updating trading details:", error);
        throw error;
    }
}
//post 
export const getallposts=async():Promise<Post[]>=>{
    try{
        const q= query(collection(db, 'post'));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
            id:doc.id,
            userid:doc.data().userid,
            title:doc.data().title,
            description:doc.data().description,
            imageurl:doc.data().imageurl,
            createdAt:doc.data().createdAt
        }));
        return posts;
    }catch(error){
        console.error("Error fetching posts:", error);
        throw error;
    }
}
export const addpost=async(post:Post):Promise<void>=>{
    try{
        await addDoc(collection(db, 'post'), post);
    }catch(error){
        console.error("Error adding post:", error);
        throw error;
    }
}

//admin
export const adminincomeincrease=async(amount:number):Promise<void>=>{
    try{
        const q= query(collection(db, 'admin'), where('email', '==',"team64bits@gmail.com"));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.map(async(doc) => {
            await updateDoc(doc.ref, {
                amount:increment(amount)
            });
        });
    }catch(error){
        console.error("Error updating admin income:", error);
        throw error;
    }
}
export const adminexist=async(email:string,password:string):Promise<boolean>=>{
    try{
        const q= query(collection(db, 'admin'), where('email', '==',email),where('password','==',password));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    }catch(error){
        console.error("Error fetching admin data:", error);
        throw error;
    }
}
export const getadmindetails=async():Promise<AdminData[]>=>{
    try{
        const q= query(collection(db, 'admin'), where('email', '==',"team64bits@gmail.com"));
        const querySnapshot = await getDocs(q);
        const admin = querySnapshot.docs.map(doc => ({
            id:doc.id,
            email:doc.data().email,
            income:doc.data().income,
            password:doc.data().password
        }));
        return admin;
    }catch(error){

        console.error("Error fetching admin data:", error);
        throw error;
    }
  }
