"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/config";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore"; // Firestore functions
import { toast, Toaster } from "react-hot-toast"; // For toaster message
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../utilities/Loading";

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [userid, setUserid] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserid(user.uid);
          try {
            const userdata = doc(db, "users", user.uid);
            const usersnap = await getDoc(userdata);
            if (usersnap) {
              const data = usersnap.data();
              if (data) {
                setOrders(data["trading"]);
              }
            }
          } catch (error) {
            console.error("Error fetching orders: ", error);
            toast.error("Error fetching orders");
          }
        } else {
          router.push("/signin");
        }
        setLoading(false);
      });
    };
    fetchDetails();
  }, []);

  const openImagePopup = (index: number, order: any) => {
    setCurrentIndex(index);
    setSelectedOrder(order);
  };

  const closeImagePopup = () => {
    setSelectedOrder(null);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    if (selectedOrder) {
      const nextIndex = (currentIndex + 1) % selectedOrder.images.length;
      setCurrentIndex(nextIndex);
    }
  };

  const prevImage = () => {
    if (selectedOrder) {
      const prevIndex = (currentIndex - 1 + selectedOrder.images.length) % selectedOrder.images.length;
      setCurrentIndex(prevIndex);
    }
  };

  // Handle Accept or Reject Offer
  const handleResponse = async (orderId: string, status: "accepted" | "rejected") => {
    try {
      
      const updatedtrading:any=orders.map((order) =>{
        if(order.id===orderId){
          return {...order,status};
        }
        return order;
      });
      setOrders(updatedtrading);
      const orderRef = doc(db, "users", userid);
      if(status==="accepted"){
        await updateDoc(orderRef, {
          trading: updatedtrading,
        });
        const dealerref=doc(db,"dealers",updatedtrading[0].dealerid);
        const dealerdoc=await getDoc(dealerref);
        await updateDoc(dealerref,{
          trading:arrayUnion(updatedtrading[0])
        });
      }else{
        await updateDoc(orderRef, {
          trading: updatedtrading,
          dealerid: "",
        });
      }
      console.log("Order updated successfully!");
      toast.success(`Offer ${status === "accepted" ? "accepted" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Error updating order: ", error);
      toast.error("Error updating the order");
    }
  };

  // Filter orders based on the search query
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
      <Toaster /> {/* Toaster component for displaying notifications */}
      <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Your Orders</h2>

        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {filteredOrders.length === 0 ? (
          <p className="text-center">No orders available.</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg shadow space-y-4">
              <h3 className="text-xl font-bold">{order.title}</h3>
              <p>{order.description}</p>
              <p>Quantity: {order.quantity}</p>

              {/* Horizontal scroll for images */}
              <div className="flex space-x-2 mt-4 overflow-x-auto"
                style={{
                  scrollbarWidth: 'none', // For Firefox
                  msOverflowStyle: 'none', // For Internet Explorer
                }}>
                {order.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={order.title}
                    className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => openImagePopup(index, order)}
                  />
                ))}
              </div>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
                }
              `}</style>

{order.status === "pending" ? (
                <p className="text-yellow-500 font-semibold">Waiting for Dealer Offer</p>
              ) : order.status === "offer_made" ? (
                <div className="space-y-4">
                  <p className="text-green-500 font-semibold">
                    Dealer's Offer: ₹{order.price}
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleResponse(order.id, "accepted")}
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={() => handleResponse(order.id, "rejected")}
                      className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-600"
                    >
                      Reject Offer
                    </button>
                  </div>
                </div>
              ) : order.status === "accepted" ? (
                <p className="text-green-500 font-semibold">Offer Accepted</p>
              ) : order.status === "rejected" ? (
                <p className="text-red-500 font-semibold">Offer Rejected</p>
              ) : order.status === "payment_done" ? (
                <p className="text-green-500 font-semibold flex flex-col">Payment Done. <span className="text-sm">Now dealer will collect scrap from your house</span> </p>):null}
            </div>
          ))
        )}

        {/* Image Popup */}
        {selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
              <img
                src={selectedOrder.images[currentIndex]}
                alt="Selected Order"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <div className="flex justify-between items-center">
                <button
                  onClick={prevImage}
                  className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={closeImagePopup}
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Close
                </button>
                <button
                  onClick={nextImage}
                  className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
