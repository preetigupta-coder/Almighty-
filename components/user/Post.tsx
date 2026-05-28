"use client";
import Upload from '@/firebase/upload'; // Assuming this uploads the image to Firebase Storage
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config"; // Import Firestore instance
import { collection, doc, updateDoc, arrayUnion, setDoc, addDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { increment } from 'firebase/database';

export default function Post() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState("");
    const [imagePreview, setImagePreview] = useState<string|null>(null); // State to hold image preview URL
    const router = useRouter();

    // Handle image selection and preview
    const handleImageChange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
      }
    };

    // Handle image removal
    const handleImageRemove = () => {
      setImage(null);
      setImagePreview(null); // Remove image preview
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("Submitting post...");

        try {
            // Upload image to Firebase Storage and get the image URL
            console.log(image);
            const imageUrl = await Upload(image);

            // Reference to the user's posts document
            const userPostsRef = doc(db, 'post', userId);

            // Add the new post to the user's 'userpost' array
            await updateDoc(userPostsRef, {
              userpost: arrayUnion({
                title: title,
                description: description,
                imageUrl: imageUrl,
                createdAt: new Date(),
              })
            });
            
            
            // Show success message and redirect to the community page
            router.push("/user/community");
            toast.success("Post created successfully");

        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to create post");
        }
    };

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // Redirect to login page if user is not logged in
          router.push("/user/signin");
        }
      });

    }, []);

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Create a Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Post Title"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Post Description"
              rows={5}
              required
            />
          </div>

          {/* Image Upload Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              accept="image/*"
            />
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
