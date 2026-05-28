"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import app, { auth, db } from "@/firebase/config";
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
const firestore=getFirestore(app);
interface Post {
  imageUrl: string;
  title: string;
  description: string;
  createdAt: string; // or Date
  userId: string;
  username:string;
}
export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post|null>(null); // State for selected post
  const [posts, setPosts] = useState<Post[]>([]); // State to store posts
  const [userId,setuserId]=useState("");
  const router=useRouter();
  useEffect(() => {
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setuserId(user.uid);
      }else{
        router.push("/user/signin");
      }
    })
    const fetchPosts = async () => {
      try {
        // Reference to the 'post' collection
        const postsRef = collection(firestore, 'post');
        const data=await getDocs(postsRef);
      //   // Fetch the documents from the 'post' collection using getDocs
        // console.log(data.docs);
        const userRecord = data.docs.map((doc) => ({
          id: doc.id, // This includes the user's email as the ID
          ...doc.data(), // This spreads out the data fields (e.g., `data`)
      }));
      // console.log(userRecord);
      const formatUserPosts = (rawPosts: any[]): any[] => {
        // Combine all user posts into a single array
        const combinedPosts = rawPosts.flatMap(user => 
            user.userpost.map((post: any) => ({
                title: post.title,
                description: post.description,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt ? 
                    new Date(post.createdAt.seconds * 1000).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    }) : 'N/A', // Handle cases where createdAt might be missing
                userId: user.id,  // Optionally include the user ID for reference
            }))
        );
        // console.log('Combined posts:', combinedPosts);
    return combinedPosts;
};
    const combinedPostsArray = formatUserPosts(userRecord);
    setPosts(combinedPostsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    
    
    fetchPosts(); // Fetch posts when component mounts
}, []);

  const filteredPosts = posts.filter(
    (post) =>
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPostModal = (post:any) => {
    setSelectedPost(post);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex flex-col items-center">
      {/* Search Bar and Create Post Button */}
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Link href="/user/post">
        <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none">
          Create Post
        </button>
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {filteredPosts.map((post,index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => openPostModal(post)}
          >
            <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-contain" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-700 leading-tight mb-4 text-xl">{post.description}</p>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-gray-800 font-semibold">{"User"}</span>
                </div>
                <span className="text-gray-600">{post.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Post Details */}
      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={()=>{
                setSelectedPost(null);
              }}
            >
              &times;
            </button>
            <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-64 object-contain mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPost.title}</h2>
            <p className="text-gray-700 leading-tight mb-4">{selectedPost.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{selectedPost.createdAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
