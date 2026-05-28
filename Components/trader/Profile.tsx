"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import Link from "next/link";
const Profile: React.FC = () => {
  const [userID, setUserID] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchDetails = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserID(user.uid);
          setUserEmail(user.email);
        } else {
          router.push("/trader/signin");
        }
      });
    };
    fetchDetails();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full mt-10 max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          {/* Profile Photo */}
          <div className="w-24 h-24 mb-6">
            <img
              src="/2.webp" // Replace with your photo path
              alt="Profile Photo"
              className="w-full h-full rounded-full object-cover border-4 border-blue-500"
            />
          </div>

          

          {/* Profile Information */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">DEALER</h1>
            <p className="text-sm text-gray-600">{userEmail}</p>
            
          </div>
          {/* Action Buttons */}
          <div className="mt-6 space-y-4 w-full">
            <Link href="/trader/wallet">
              <button
                type="button"
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              >
                Wallet
              </button>
            </Link>
            <Link href="/trader/order">
              <button
                type="button"
                className="w-full bg-blue-500 text-white mt-4 py-2 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              >
                Order
              </button>
            </Link>
          </div>
        
              <button
                onClick={() => auth.signOut()}
                type="button"
                className="w-full bg-slate-500 text-white mt-4 py-2 rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                Logout
              </button>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
