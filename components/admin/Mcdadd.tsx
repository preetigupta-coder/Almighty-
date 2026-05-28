"use client";
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import admin from 'firebase-admin';
const googleauthprovider = new GoogleAuthProvider();

export default function Mcdadd() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [match, setMatch] = useState(true);
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userref = doc(db, "admin", user.uid);
        const userDoc = await getDoc(userref);
        if (!userDoc.exists()) {
          router.push("/admin/signin");
        }
      } else {
        router.push("/admin/signin");
      }
    });
    if (password !== confirmPassword) {
      setMatch(false);
    } else {
      setMatch(true);
    }
  }, [confirmPassword]);

  const randomid = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const handler = async () => {
    if (match) {
      try {
        if(auth.currentUser === null) {
            toast.error("Access Denied");
            return;
            }
        // const userRecord = await admin.auth().createUser({
        //     email: email,
        //     password: password,
        //   });
        //   console.log('Successfully created new user:',= userRecord.uid);
  

        // // Save additional user data in Firestore
        const userId = randomid(20); // Get the UID from the created user
        await setDoc(doc(db, "mcd", userId), {
          email: email,
          password: password, // Note: It's best practice to avoid storing passwords in plain text
          id: userId,
        });

        toast.success("MCD enrolled");
        setEmail("");  // Reset email field
        setPassword("");  // Reset password field
        setConfirmPassword("");  // Reset confirm password field
        setMatch(true);
      } catch (error) {
        toast.error("Invalid Credentials");
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  const googleregister = async () => {
    toast.error("Access Denied");
    router.push('/admin/signin');
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Enroll MCD
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}  // Controlled input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}  // Controlled input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}  // Controlled input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                {!match && <p className="text-red-500 text-sm font-light">Passwords do not match</p>}
                <button
                  onClick={() => {
                    handler();
                  }}
                  type="button"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Create an account
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
