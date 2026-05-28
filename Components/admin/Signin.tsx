"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const googleAuthProvider = new GoogleAuthProvider();

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "admin", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          router.push("/admin/profile");
        }
        console.log("User logged in");
      }else{
        console.log("User not logged in");
      }
    });
    // Cleanup subscription on unmount
  }, []);

  const handler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email,password);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/profile");
      toast.success("Admin Logged in");
      // const userId = res.user.uid;
      // console.log(userId);

      // const userDocRef = doc(db, "mcd", userId);
      // const userSnap = await getDoc(userDocRef);

      // if (userSnap.exists()) {
      //   router.push("/mcd/profile");
      //   toast.success("Successfully Logged in");
      // } else {
      //   await auth.signOut();
      //   router.push("/mcd/signin");
      //   toast.error("Access Denied");
      // }
    } catch (error) {
      toast.error("Login Failed");
      console.log(error);
    }
  };

  const googleRegister = async () => {
    toast.error("Access Denied");
    router.push('/admin/signin');
    // try {
    //   const res = await signInWithPopup(auth, googleAuthProvider);
    //   const userId = res.user.uid;

    //   const userDocRef = doc(db, "mcd", userId);
    //   const userSnap = await getDoc(userDocRef);

    //   if (userSnap.exists()) {
    //     router.push("/mcd/profile");
    //     toast.success("Successfully Logged in");
    //   } else {
    //     router.push("/mcd/signin");
    //     toast.error("Access Denied");
    //   }
    // } catch (error) {
    //   toast.error("Login Failed");
    //   console.log(error);
    // }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[80vh] lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Admin Login
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handler}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <div className='flex justify-center space-x-5'>
                  <button
                    onClick={() => router.push("/user/signin")}
                    type="button"
                    className="sm:w-44 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    User
                  </button>
                  <Link href="/mcd/signin">
                    <button
                      type="button"
                      className="w-full sm:w-44 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      MCD
                    </button>
                  </Link>
                </div>
                {/* <div className="space-x-6 flex justify-center mt-6">
                  <button onClick={googleRegister} type="button" className="border-none outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32px" className="inline" viewBox="0 0 512 512">
                      <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" data-original="#fbbd00" />
                      <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" data-original="#0f9d58" />
                      <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" data-original="#31aa52" />
                      <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" data-original="#3c79e6" />
                      <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" data-original="#cf2d48" />
                      <path fill="#eb4132" d="M325.477 139.131C305.13 126.989 281.367 120 256 120s-49.13 6.989-69.477 19.131L100.215 52.823C143.703 18.568 197.922 0 256 0v120c25.181 0 49.044 6.853 69.477 19.131z" data-original="#eb4132" />
                    </svg>
                  </button>

                  <button onClick={googleRegister} type="button" className="border-none outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32px" className="inline" viewBox="0 0 512 512">
                      <path fill="#1877f2" d="M512 256C512 114.616 397.384 0 256 0S0 114.616 0 256c0 128.13 93.223 234.395 214 252.92v-178.32h-64.599V256H214v-58.54c0-63.928 38.146-99.19 96.512-99.19 28.021 0 57.353 5 57.353 5v63.031h-32.309c-31.835 0-41.796 19.771-41.796 40.059V256h71.125l-11.367 74.6H294.76v178.32C415.555 490.395 512 384.13 512 256z" data-original="#1877f2" />
                      <path fill="#fff" d="M353.126 330.6 364.493 256H293.36v-49.64c0-20.288 9.961-40.059 41.795-40.059h32.309V103.27s-29.333-5-57.353-5c-58.366 0-96.512 35.262-96.512 99.19V256h-64.599v74.6h64.599v178.32a259.895 259.895 0 0 0 80 0V330.6z" data-original="#ffffff" />
                    </svg>
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
