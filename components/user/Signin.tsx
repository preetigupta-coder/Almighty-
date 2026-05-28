"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import {toast} from 'react-toastify';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
const googleauth=new GoogleAuthProvider();
export default function Signin(){
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const signinusingemail=async(e:any)=>{
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(auth,email,password);
      router.push('/user/profile');
    }catch(error){
      try {
        // Fetch all the documents from the "mcd" collection
        const mcdCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(mcdCollectionRef);
        let userFound = false;
        // Loop through all documents and check if the email matches
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.email === email) {
            userFound = true;
            if (userData.password === password) {
              createUserWithEmailAndPassword(auth, email, password).then(()=>{
                toast.success('Login Successful');
                router.push('/user/profile');
              })
            } else {
              toast.error('Invalid Credentials');
            }
          }
        });
        if (!userFound) {
          toast.error('User not found');
        }
      } catch (error) {
        toast.error('Error fetching user data');
        console.error(error);
      }
    }
  }
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        router.push("/user/profile");
      }
    })
  },[]);
  const signinwithgoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleauth);
      const userId = res.user.uid;
  
      // Check if user already exists
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
  
      if (!userSnap.exists()) {
        // User does not exist, create the user document
        await setDoc(userDocRef, {
          email: res.user.email,
          password: "", // Store empty password or remove if not needed
          id: userId,
          orders: [],
          complaint: [],
          trading: [],
          balance: 0,
        });
  
        await setDoc(doc(db, "post", userId), {
          userpost: [],
        });
      }
  
      toast.success("Successfully Logged in");
      router.push("/user/profile");
    } catch (error) {
      toast.error("Login Failed");
      console.log(error);
    }
  };
    return (
      <div>
        <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input onChange={(e)=>setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required/>
                  </div>
                  <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input onChange={(e)=>setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required/>
                          </div>
                          <div className="ml-3 text-sm">
                            <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <Link href="/user/forgot">
                      <button className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</button>
                  </Link>
                  </div>
                  <button onClick={signinusingemail} type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  <div className='flex justify-center space-x-5'>
                  <button
                  onClick={()=>{
                    router.push("/mcd/signin");
                  }}
      type="submit"
      className="sm:w-44 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
    >
      MCD
    </button>
  
  <Link href="/trader/signin">
    <button
      type="submit"
      className="w-full sm:w-44 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
    >
      DEALER
    </button>
  </Link>
  </div>
                  <div className="space-x-6 flex justify-center mt-6">
              <button onClick={signinwithgoogle} type="button" className="border-none outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
              </button>

            
          </div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? 
                      <Link href="/user/signup">
                      <button className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</button>
                  </Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>

      </div>
    )
  }