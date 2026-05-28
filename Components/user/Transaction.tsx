"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';  // Import emailjs

const TransactionPage = () => {
  const searchParams = useSearchParams();
  const voucherName = searchParams.get('voucherName') || 'Unknown Voucher';
  const voucherPrice = parseInt(searchParams.get('voucherPrice') || '0');
  const [initialBalance, setInitialBalance] = useState(0);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>("");  
  const [balance, setBalance] = useState(initialBalance);
  const [finalBalance, setFinalBalance] = useState(initialBalance);
  const [redeemCode, setRedeemCode] = useState("");  // State to hold redeem code
  const [showPopup, setShowPopup] = useState(false);  // State to control popup visibility
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const fetchedBalance = userSnap.data().balance;
          setInitialBalance(fetchedBalance);
          setFinalBalance(fetchedBalance - voucherPrice);
          setBalance(fetchedBalance);
        }
      } else {
        router.push("/user/login");
      }
    });
  }, [router, voucherPrice]);

  // Function to generate random string
  function generateRandomString(length:number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Function to handle transaction completion
  const handleCompleteTransaction = () => {
    if (finalBalance >= 0) {
      toast.success('Transaction Successfully Completed!');

      // Generate the redeem code
      const code = generateRandomString(20);
      setRedeemCode(code);
      setShowPopup(true);  // Show the popup

      // Send email notification via emailjs
      sendEmailNotification(code);

    } else {
      toast.error('Insufficient Balance!');
    }
  };

  // Function to handle transaction
  const handleTransaction = async () => {
    const updatedBalance = balance - voucherPrice;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const currentBalance = Number(userSnap.data().balance) - voucherPrice;
      await updateDoc(userRef, {
        balance: currentBalance,
        orders: arrayUnion({
          time: new Date().toISOString(),
          voucherName: voucherName,
          voucherPrice: -voucherPrice
        })
      });
    }
    setBalance(updatedBalance);
    setFinalBalance(updatedBalance);
  };

  // Function to send email notification using emailjs
  const sendEmailNotification = (code:string) => {
    const emailParams = {
      user_email: userEmail,
      voucher_name: voucherName,
      voucher_price: voucherPrice,
      final_balance: finalBalance,
      Redeem_Code: code
    };
    console.log(code);
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
    if (!serviceId || !templateId || !userId) {
      console.warn('EmailJS not configured; skipping email notification.');
      return;
    }
    emailjs
      .send(serviceId, templateId, emailParams, userId)
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Complete Your Transaction</h1>

        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Voucher: {voucherName}</h2>
          <p className="text-sm text-gray-600">Price: ₹{voucherPrice}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-semibold text-gray-800">Available Balance: ₹{balance}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-semibold text-gray-800">
            Final Balance: ₹{finalBalance >= 0 ? finalBalance : 'Insufficient funds'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner text-gray-800">
          <p className="text-md">
            Final Balance Calculation: <span className="font-semibold">₹{balance}</span> - <span className="font-semibold">₹{voucherPrice}</span> = <span className="font-semibold">₹{balance - voucherPrice}</span>
          </p>
        </div>

        <button
          onClick={() => {
            handleTransaction();
            handleCompleteTransaction();
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-lg"
        >
          Complete Transaction
        </button>

        {/* Popup for Redeem Code */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
              <h2 className="text-lg font-bold">Your Redeem Code</h2>
              <p className="text-xl">{redeemCode}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(redeemCode);
                  toast.success('Redeem code copied to clipboard!');
                }}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Copy
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  router.push('/user/wallet');
                }}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
