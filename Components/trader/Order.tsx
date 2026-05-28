"use client";
import { useEffect, useState } from "react";
import app, { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "../utilities/Loading";
 
const PastOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userid, setUserid] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const router = useRouter();
 
  const fetchPaidOrders = async (props: any) => {
    try {
      const dealerdoc = await getDoc(doc(db, "dealers", props));
      if (dealerdoc.exists()) {
        const dealerdata = dealerdoc.data();
        if (dealerdata) {
          const orders = dealerdata["trading"];
          setOrders(orders);
          console.log("Fetched orders:", orders);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };
 
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/trader/signin");
      } else {
        setUserid(user.uid);
        fetchPaidOrders(user.uid);
      }
    });
  }, []);
 
  const openImagePopup = (index: number) => {
    setCurrentIndex(index);
  };
 
  const closeImagePopup = () => {
    setSelectedOrder(null);
    setCurrentIndex(0);
  };
 
  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % selectedOrder.images.length;
    setCurrentIndex(nextIndex);
  };
 
  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + selectedOrder.images.length) %selectedOrder.images.length;
    setCurrentIndex(prevIndex);
  };

  const filteredOrders = orders.filter(
    (order) =>
      searchQuery === "" ||
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
 
  if (loading) {
    return <Loading />;
  }
 
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-900">Paid Orders</h2>

        <input
          type="text"
          placeholder="Search Paid Orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
 
        {filteredOrders.length === 0 ? (
          <p className="text-center text-sm sm:text-base">No paid orders available.</p>
        ) : (
          filteredOrders.map((order, orderIndex) => order.status === "payment_done" && (
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{order.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">Description: {order.description}</p>
              <p className="text-gray-600 text-sm sm:text-base">Quantity: {order.quantity}</p>
 
              {/* Display User Information */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold">User Information</h4>
                <p className="text-gray-600 text-sm sm:text-base"><strong>User Email:</strong> {order.useremail}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Posted On:</strong> {order.createdAt.toDate().toDateString()}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>User State:</strong> {order.state}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>User District:</strong> {order.district}</p>
                <p className="text-gray-600 mt-4 text-xl "><strong>Detailed Address:</strong> {order.useraddress}</p>
              </div>
 
              {/* Display Order Images */}
              <div className="flex space-x-2 mt-4 overflow-x-auto"
              style={{
                scrollbarWidth: 'none', // For Firefox
                msOverflowStyle: 'none', // For Internet Explorer
              }}>
                {order.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt="Order Image"
                    className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => {
                      openImagePopup(index)
                      setSelectedOrder(order)
                    }}
                  />
                ))}
              </div>
              <style jsx>{`
  div::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
  }
`}</style>
 
              {/* Display Order Status */}
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-sm sm:text-base"><strong>Status:</strong> {order.status}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Price:</strong> ₹{order.price}</p>
              </div>
            </div>
          ))
        )}
 
        {/* Image Popup */}
        {orders.map((order, orderIndex) => selectedOrder&&(selectedOrder.orderid==order.orderid) && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
                <img
                  src={order.images[currentIndex]}
                  alt="Selected Order"
                  className="w-full h-auto object-cover rounded-lg mb-4"
                />
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevImage}
                    className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
                  >
                    Previous
                  </button>
                  <button
                    onClick={closeImagePopup}
                    className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    Close
                  </button>
                  <button
                    onClick={nextImage}
                    className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ))}
        
      </div>
    </div>
  );
};
 
export default PastOrders;
 