"use client"
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
interface Transaction {
  time: string;
}
const Wallet: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [userId, setUserId] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<number | null>(null);
  const router = useRouter();
  const [coin, setCoin] = useState(0);
  const [transactions, setTransactions] = useState([]); 
  
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const fetchedBalance = userSnap.data().balance;
          const fetchedTransactions = userSnap.data().orders || [];
          setCoin(fetchedBalance);

          // Sort transactions by time (most recent first) and slice to get the last 3 transactions
          const sortedTransactions = fetchedTransactions.sort((a: { time: string | Date }, b: { time: string | Date }) => new Date(b.time).getTime() - new Date(a.time).getTime());
          setTransactions(sortedTransactions);
        }
      } else {
        router.push("/user/login");
      }
    });
  }, [router]);

  const handleCoinClick = (coin: number) => {
    setSelectedCoin(coin);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Wallet</h2>

        {/* Coins Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Available Coins</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="bg-blue-500 text-white flex justify-center p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-600"
              onClick={() => handleCoinClick(coin)}
            >
              <p className="text-lg font-bold">{coin}</p>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Past Transactions</h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-y-scroll" style={{ maxHeight: '16rem' }}>
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction:any, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.time.substring(0, 10)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.voucherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.voucherPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Popup */}
        {showPopup && selectedCoin && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Details for {selectedCoin}</h4>
              <p className="text-gray-700 mb-4">Details and statistics about {selectedCoin} would go here.</p>
              <button
                type="button"
                onClick={handleClosePopup}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
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

export default Wallet;
