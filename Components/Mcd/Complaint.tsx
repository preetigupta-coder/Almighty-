"use client";
import app, { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "emailjs-com";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const firestore = getFirestore(app);

interface Complaint {
  id: string;
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  status: "active" | "resolved";
  createdAt: string; // Date string
  userID: string;
  user: string;
  imageurl: string[];
}

const ReceivedComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const router = useRouter();

  // Fetch complaints from Firestore
  const fetchPosts = async () => {
    try {
      const postsRef = collection(firestore, "users");
      const data = await getDocs(postsRef);

      const userRecord = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const formatUserPosts = (rawPosts: any[]): any[] => {
        const combinedPosts = rawPosts.flatMap((user) => {
          if (user.complaint && user.complaint.length > 0) {
            return user.complaint.map((post: any) => ({
              id: post.id,
              title: post.title,
              description: post.description,
              location: post.location,
              lat: post.lat,
              lng: post.lng,
              status: post.status,
              createdAt: post.time,
              userID: user.id,
              user: user.email,
              imageurl: post.imageurl,
            }));
          }
          return [];
        });

        // Sort posts by createdAt field, most recent first
        return combinedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      };

      const combinedPostsArray = formatUserPosts(userRecord);
      setComplaints(combinedPostsArray);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Send email notification using EmailJS
  const sendEmail = (userEmail: string, complaintTitle: string, complaintDescription: string) => {
    const templateParams = {
      to_email: userEmail,
      complaint_title: complaintTitle,
    };

    emailjs.send("service_wnx2w9e", "template_v0rtbra", templateParams, "ZpB1pNgDUa6B2o-2f")
      .then(
        (result) => console.log("Email sent successfully:", result.text),
        (error) => console.error("Error sending email:", error.text)
      );
  };

  // Mark a complaint as resolved or pending
  const markAsCompleted = async (props: any) => {
    try {
      const userRef = doc(db, "users", props.userid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const complaints = userData.complaint || [];

        const updatedComplaints = complaints.map((complaint: any) => {
          if (complaint.id === props.complaintid) {
            sendEmail(userData.email, complaint.title, complaint.description);
            return { ...complaint, status: complaint.status === "resolved" ? "active" : "resolved" };
          }
          return complaint;
        });

        await updateDoc(userRef, { complaint: updatedComplaints });
        fetchPosts();
      } else {
        console.log("User not found.");
      }
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  // Open map modal
  const openMapModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsMapModalOpen(true);
    setIsImageModalOpen(false);
  };

  // Open image modal
  const openImageModal = (complaint: Complaint, index: number) => {
    setSelectedComplaint(complaint);
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
    setIsMapModalOpen(false);
  };

  // Close image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedComplaint(null);
  };

  // Close map modal
  const closeMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedComplaint(null);
  };

  // Handle image navigation
  const handleImageNavigation = (direction: "left" | "right") => {
    if (selectedComplaint) {
      const totalImages = selectedComplaint.imageurl.length;
      if (direction === "left") {
        setSelectedImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
      } else {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
      }
    }
  };

  // Monitor auth state and fetch complaints on component mount
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/mcd/signin");
      }
    });
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Received Complaints</h1>

      <div className="w-full max-w-3xl space-y-6">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6"
          >
            <div className="w-full sm:w-1/3 relative">
              {complaint.imageurl && complaint.imageurl.length > 0 ? (
                <>
                  <img
                    src={(complaint.id==selectedComplaint?.id)?complaint.imageurl[selectedImageIndex]:complaint.imageurl[0]}
                    alt={complaint.title}
                    className="w-full h-40 object-cover rounded-lg"
                    onClick={() => openImageModal(complaint, 0)}
                  />
                  {complaint.imageurl.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint)
                          setSelectedImageIndex((prevIndex) => (prevIndex - 1 + complaint.imageurl.length) % complaint.imageurl.length)
                        }}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                      >
                        <ArrowBackIosIcon />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint)
                          setSelectedImageIndex((prevIndex) => (prevIndex + 1) % complaint.imageurl.length)
                        }
                        }
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                      >
                        <ArrowForwardIosIcon />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <p>No images to display</p>
              )}
            </div>

            <div className="w-full sm:w-2/3 sm:pl-6 mt-4 sm:mt-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{complaint.title}</h2>
              <p className="text-gray-600 mt-2">Description: {complaint.description}</p>
              <p className="text-gray-600 mt-2">Location: {complaint.location}</p>
              <p className="text-gray-600 mt-1">User: {complaint.user}</p>
              <p className="text-gray-600 mt-1">Posted At: {complaint.createdAt ? complaint.createdAt.substring(0, 10) : <></>}</p>

              <div className="flex justify-between flex-col sm:flex-row">
                <div className="flex flex-col sm:flex-row sm:items-center mt-4 text-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {complaint.status === "active" ? (
                    <button
                      onClick={() =>
                        markAsCompleted({
                          userid: complaint.userID,
                          complaintid: complaint.id,
                        })
                      }
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                    >
                      Pending
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        markAsCompleted({
                          userid: complaint.userID,
                          complaintid: complaint.id,
                        })
                      }
                      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md"
                    >
                      Resolved
                    </button>
                  )}

                  <button
                    onClick={() => {
                      openMapModal(complaint)
                    }}
                    className="hidden sm:block bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    <LocationOnIcon className="text-blue-800" />
                  </button>
                </div>

                <div className="hidden sm:block sm:items-center mt-4 text-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <button className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-800">
                    <span className="material-icons">Block User</span>
                  </button>
                </div>

                <div className="flex gap-2 sm:hidden mt-2 space-x-0">
                  <button
                    onClick={() => openMapModal(complaint)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    <LocationOnIcon className="text-blue-800" />
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-800">
                    <span className="material-icons">Block User</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Map */}
      {selectedComplaint && isMapModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl p-6 pt-4 relative">
            <button
              onClick={closeMapModal}
              className="absolute top-4 right-6 text-gray-600 hover:text-gray-800"
            >
              <CancelIcon className="text-red-600" />
            </button>
            <h2 className="text-lg font-semibold md:text-xl mb-4 max-w-[90%]">
              Location: {selectedComplaint.location}
            </h2>

            {/* Embedded Google Maps iframe using lat and lng */}
            <iframe
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${selectedComplaint.lat},${selectedComplaint.lng}&z=14&output=embed`}
            ></iframe>
          </div>
        </div>
      )}

      {/* Modal for Image */}
      {isImageModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg p-4 relative">
            <button
              type="button"
              onClick={()=>{
                closeImageModal();
                setSelectedComplaint(null);
              }}
              className="w-full text-right text-gray-600 hover:text-gray-800"
            >
              <CancelIcon className="text-red-600" />
            </button>
            <div className="relative flex items-center">
              {selectedComplaint.imageurl.length > 1 && (
                <button
                  onClick={() => handleImageNavigation("left")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                >
                  <ArrowBackIosIcon />
                </button>
              )}
              <img
                src={selectedComplaint.imageurl[selectedImageIndex]}
                alt={selectedComplaint.title}
                className="w-full h-80 object-contain rounded-lg"
              />
              {selectedComplaint.imageurl.length > 1 && (
                <button
                  onClick={() => handleImageNavigation("right")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                >
                  <ArrowForwardIosIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedComplaints;

