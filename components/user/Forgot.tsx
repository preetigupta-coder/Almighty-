"use client"
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Forgot(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [match , setMatch] = useState(false);
    const router = useRouter();

    const handler = async (e: any) => {
      e.preventDefault();
      
      if (match) {
        const usersRef = collection(db, "users"); 
        const q = query(usersRef, where("email", "==", email)); // Query based on email

        try {
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // If the user exists, update their password
            const userDocRef = querySnapshot.docs[0].ref;
            await updateDoc(userDocRef, {
              password: password, // Hash the password before storing
            });

            toast.success("Password Reset Successfully");
            router.push("/user/signin");
          } else {
            toast.error("User does not exist");
          }

        } catch (error) {
          toast.error("Password Reset Failed");
        }
      } else {
        toast.error("Passwords do not match");
      }
    }

    useEffect(() => {
      if (password === confirmPassword) {
        setMatch(true);
      } else {
        setMatch(false);
      }
    }, [password, confirmPassword]);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          router.push("/user/profile");
        }
      });
    }, []);

    return (
      <div>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Change Password
              </h2>
              <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required/>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                  <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                </div>
                {!match && <p className="text-red-500 text-sm font-bold">Passwords do not match</p>}
                <button onClick={handler} type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Reset password</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    )
}
