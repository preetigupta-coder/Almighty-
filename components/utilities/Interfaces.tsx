
export interface UserData{
    id:string ;
    balance: number;
    name:string;
    email:string;
    password:string;
    phone_number:number;
    

}
export interface DealerData{
    id:string;
    email:string;
    password:string;
    balance:number;
    address:string;
    pincode:number;
    lng:string;
    lat:string;
    phone_number:number;
  
}
export interface MCDData{
    id:string;
    email:string;
    password:string;
    pincode:number;
    
}  
export interface trading{
    userid:string;
    dealerid:string;
    id:string;
    title:string;
    description:string;

    price:number;
    quantity:number;

    pincode:number;
    address:string;
    district:string; 
    state:string;
    createdAt: Date;

    status:'payment_done'|'pending';
}
export interface UserOrder{

    userid:string;
    id:string;
    voucherPrice:number;
    voucherName:string;
    time:Date;
    lat:string;
    long:string;
}
export interface Complaints{
    userid:string;
    id:string;

    title:string;
    description:string;

    imageurl:string[];

    lat:string;
    lng:string;
    pincode:number;
    location:string;

    status: 'pending' | 'resolved';

    time:Date;



}
export interface DealersOrder{
    dealerid:string;
    id:string;
    voucherPrice:number;
    voucherName:string;
    time:Date;
    lat:string;
    long:string;
}
export interface Post{
    id:string;
    userid:string;
    title:string;
    description:string;
    imageurl:string;
    createdAt:Date;
}
export interface AdminData{
    id:string;
    email:string;
    password:string;
    income:number;
}

