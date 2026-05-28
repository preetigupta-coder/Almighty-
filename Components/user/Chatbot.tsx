import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function Chatbot() {
  const [userMessage, setUserMessage] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      type: 'incoming', 
      message: 'Hi there 👋 How can I help you today?', 
      suggestions: ['Lodge a Complaint', 'View Past Complaints', 'Open Wallet', 'Contact Us', 'Sell Scrap', 'Scrap Orders'] 
    },
  ]);

  const chatInputRef = useRef(null);
  const chatboxRef = useRef<HTMLUListElement | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const chatbox = chatboxRef.current;
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight ?? 0;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (userMessage.trim() === '') return;
    addMessage(userMessage, 'outgoing');
    setUserMessage('');
    setTimeout(() => {
      addMessage('Thinking...', 'incoming');
      generateResponse();
    }, 600);
  };

  const addMessage = (message: string, type: string, suggestions: string[] = []) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type, message, suggestions },
    ]);
  };

  const generateResponse = async () => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${userMessage}. Please provide a brief response.` }] }],
      }),
    };

    try {
      const res = await fetch(API_URL, requestOptions);
      const data = await res.json();
      const responseMessage = data.candidates[0].content.parts[0].text;

      const suggestions = generateSuggestions(responseMessage);
      updateLastMessage(responseMessage, suggestions);
    } catch (error) {
      updateLastMessage('Oops! Something went wrong. Please try again later.', [], true);
    }
  };

  const generateSuggestions = (responseMessage: string) => {
    if (responseMessage.toLowerCase().includes('help')) {
      return ['Lodge a Complaint', 'View Past Complaints', 'Open Wallet', 'Contact Us', 'Sell Scrap', 'Scrap Orders'];
    }
    if (responseMessage.toLowerCase().includes('complaint')) {
      return ['Lodge a Complaint', 'View Past Complaints'];
    }
    return [];
  };

  const updateLastMessage = (message: string, suggestions: string[] = [], isError: boolean = false) => {
    setChatMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      lastMessage.message = message;
      lastMessage.suggestions = suggestions;
      return [...prevMessages];
    });
  };

  const fetchWalletDetails = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { balance, orders } = userSnap.data();
      const sortedTransactions = orders
        ? orders.sort((a: { time: string | Date }, b: { time: string | Date }) => 
            new Date(b.time).getTime() - new Date(a.time).getTime()
          ).slice(0, 3)
        : [];

      return { balance, transactions: sortedTransactions };
    }
    return { balance: 0, transactions: [] };
  };

  const fetchComplaints = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { complaint } = userSnap.data();
      return complaint || [];
    }
    return [];
  };

  const fetchOrderDetails = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { trading } = userSnap.data();
      const sortedOrders = trading
        ? trading.sort((a: { time: string | Date }, b: { time: string | Date }) => 
            new Date(b.time).getTime() - new Date(a.time).getTime()
          ).slice(0, 3)
        : [];

      return sortedOrders;
    }
    return [];
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type: 'incoming', message: `You selected "${suggestion}"`, suggestions: [] }
    ]);

    setTimeout(async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/user/signin');
        return;
      }

      const userId = user.uid;

      if (suggestion === 'Lodge a Complaint') {
        router.push('/user/complaint');
      } else if (suggestion === 'Open Wallet') {
        const { balance, transactions } = await fetchWalletDetails(userId);
        

        const walletMessage:any = (
          <div>
            <div>Available Coins: {balance}</div>
            <div>Latest Transactions:</div>
            {transactions.length > 0 ? (
              transactions.map((t: any, index: number) => (
                <div key={index} className="mb-2">
                  {`${t.time.substring(0, 10)} - ${t.voucherName}: ${t.voucherPrice}`}
                </div>
              ))
            ) : (
              <div>No recent transactions.</div>
            )}
          </div>
        );


        addMessage(walletMessage, 'incoming');
      } else if (suggestion === 'Contact Us') {
        router.push('/user/contact');
      } else if (suggestion === 'View Past Complaints') {
        const complaints = await fetchComplaints(userId);
        const complaintsMessage = complaints.length
          ? complaints.map((c: any) => 
              <div key={c.title} className="mb-2">
                {`Title: ${c.title}`}<br />
                {`Status: ${c.status}`}<br />
                {`Description: ${c.description}`}
              </div>
            )
          : <div>You have no registered complaints.</div>;
        addMessage(complaintsMessage, 'incoming');
      } else if (suggestion === 'Sell Scrap') {
        router.push('/user/sell');
      } else if (suggestion === 'Scrap Orders') {
        const orders = await fetchOrderDetails(userId);
        const ordersMessage:any = (
          <div>
            {orders.length > 0 ? (
              orders.map((o: any, index: number) => (
                <div key={index} className="mb-2">
                  {`Title: ${o.title}`}<br />
                  {`Status: ${o.status}`}<br />
                  {`Description: ${o.description}`}<br />
                  {`Price: ₹${o.price}`}
                </div>
              ))
            ) : (
              <div>You have no recent scrap orders.</div>
            )}
          </div>
        );
        addMessage(ordersMessage, 'incoming');
      } else {
        addMessage(`You selected "${suggestion}"`, 'incoming', generateSuggestions(''));
      }
    }, 600);
  };

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };

  return (
    <>
      <Head>
        <title>Modern Chatbot UI</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      </Head>

      {/* Chatbot toggle button */}
      <button
        onClick={toggleChatbot}
        className="fixed right-4 bottom-4 p-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-xl hover:scale-105 transition-transform ease-in-out duration-300 flex items-center justify-center overflow-hidden"
      >
        <img 
          src="/4.png" 
          alt="Sudhaar Mitar"
          className="w-20 h-20 transform translate-y-2 rounded-full object-contain"
        />
      </button>

      {/* Chatbot container */}
      {showChatbot && (
        <div className="fixed right-4 bottom-20 w-80 md:w-80 lg:w-96 bg-white rounded-xl shadow-2xl overflow-hidden transition-transform transform scale-100 opacity-100">
          <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center rounded-t-xl shadow-sm">
            <h2 className="font-semibold">Sudhaar Mitra</h2>
            <button onClick={toggleChatbot} className="text-xl">&times;</button>
          </header>
          <ul ref={chatboxRef} className="h-72 md:h-80 lg:h-80 overflow-y-auto p-4 space-y-2">
            {chatMessages.map((msg, index) => (
              <li key={index} className={`flex ${msg.type === 'incoming' ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-2 min-w-48 rounded-lg ${msg.type === 'incoming' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                  {msg.message}
                  {msg.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap">
                      {msg.suggestions.map((suggestion, index) => (
                        <button 
                          key={index} 
                          className="bg-blue-600 text-white rounded-lg px-2 py-1 mr-2 mb-2 hover:bg-blue-700"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex p-4 justify-center gap-2">
            <input
              type="text"
              ref={chatInputRef}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="border rounded-lg flex-grow p-2"
              placeholder="Type Hi or Ask any General Query"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white rounded-lg px-3"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}