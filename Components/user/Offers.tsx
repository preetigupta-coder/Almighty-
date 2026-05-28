"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const OffersPage: React.FC = () => {
  const router = useRouter();
  const [walletBalance,setwalletBalance] = useState<number>(0); // Available balance
  const [userId,setuserId]=useState<string>("");
  
  const initialOffers = [
    { name: "50% Off on Electronics", price: 5000, deadline: "2024-09-30" },
    { name: "Buy 1 Get 1 Free on Apparel", price: 300, deadline: "2024-10-01" },
    { name: "₹200 Cashback on Orders Above ₹1000", price: 200, deadline: "2024-09-30" },
    { name: "Free Shipping on Orders Above ₹500", price: 0, deadline: "2024-09-29" },
  ];

  useEffect(()=>{
    onAuthStateChanged(auth,async (user)=>{
      if(user){
        setuserId(user.uid);
        const data=doc(db,"users",user.uid);
        const userSnap = await getDoc(data);
        if(userSnap.exists()){
          setwalletBalance(userSnap.data().balance);
        }
      }else{
        router.push("/user/signin");
      }
    });


    // console.log(data);
  },[]);

  const [offers, setOffers] = useState(initialOffers.sort((a, b) => a.price - b.price)); // Sorted by price
  const [searchQuery, setSearchQuery] = useState('');

  // Filter offers based on search query
  const filteredOffers = offers.filter(offer => offer.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleVoucherClick = (name: string, price: number) => {
    if (price <= walletBalance) {
      // Pass voucher name and price to the transaction page as query parameters
      router.push(`/user/transaction?voucherName=${encodeURIComponent(name)}&voucherPrice=${price}`);
    }
  };

  useEffect(()=>{
    onAuthStateChanged(auth,async (user)=>{
      if(user){
        setuserId(user.uid);
        const data=doc(db,"users",user.uid);
        const userSnap = await getDoc(data);
        if(userSnap.exists()){
          setwalletBalance(userSnap.data().balance);
        }
      }else{
        router.push("/user/signin");
      }
    });


    // console.log(data);
  },[]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl my-8 p-6 bg-white rounded-lg shadow-md">
        {/* Wallet Balance Section */}
        <div className="mb-6 p-4 bg-blue-500 text-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Available Wallet Balance</h2>
          <p className="text-2xl font-semibold">₹{walletBalance}</p>
        </div>

        {/* Search Offer Section */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search offers..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Vouchers Section with Larger Square Cards */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Available Vouchers</h3>

          {/* Scrollable container for vouchers */}
          <div className="max-h-96 overflow-y-scroll"
          style={{
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', // For Internet Explorer
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
              {filteredOffers.slice(0, 4).map((offer, index) => (
                <div
                  key={index}
                  className={`flex flex-col justify-between items-center p-6 bg-white rounded-lg shadow-md border h-64 w-64 ${
                    offer.price > walletBalance
                      ? 'border-gray-300 cursor-not-allowed bg-gray-100'
                      : 'border-gray-200 hover:border-blue-500 cursor-pointer'
                  }`}
                  onClick={() => offer.price <= walletBalance && handleVoucherClick(offer.name, offer.price)}
                >
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900">{offer.name}</h4>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-600">Valid until {offer.deadline}</p>
                    <p
                      className={`text-lg font-bold mt-4 ${
                        offer.price > walletBalance ? 'text-gray-500' : 'text-blue-500'
                      }`}
                    >
                      ₹{offer.price === 0 ? 'Free' : offer.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
  div::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
  }
`}</style>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
