"use client";
 
import React, { useEffect, useState } from 'react';
import Navbar from '@/Components/Mcd/Navbar'; // Import Navbar
import Footer from '@/Components/Mcd/Footer'; // Import Footer

import app, { auth, db } from "@/firebase/config"; // Import Firebase config
import { collection, getDocs, getFirestore } from 'firebase/firestore'; // Import Firestore
import { useRouter } from "next/navigation"; // Import Next.js router
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase auth

import { useRef } from 'react';

const firestore = getFirestore(app);
 
const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]); // State to store posts
  const router = useRouter();
 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(firestore, 'post');
        const data = await getDocs(postsRef);
        const userRecord = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
 
        const formatUserPosts = (rawPosts: any[]): any[] => {
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
                }) : 'N/A',
              userId: user.id
            }))
          );
          return combinedPosts;
        };
 
        const combinedPostsArray = formatUserPosts(userRecord);
 
        // Sort posts by creation date (most recent first)
        combinedPostsArray.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
 
        // Get the three most recent posts
        setPosts(combinedPostsArray.slice(0, 3));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
 
    fetchPosts();
  }, []);
 
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar />
 
      {/* Hero Section */}
      <HeroSection />
 
      {/* Features Section */}
      <FeaturesSection />
 
      {/* Community Posts Section */}
      <CommunityPosts posts={posts} />
 
      {/* Testimonials Section */}
      <TestimonialsSection />
 
      <AboutSection />
 
      {/* FAQ Section */}
      <FAQSection />
 
      
 
      {/* Footer */}
      <Footer />
    </div>
  );
};
 
const HeroSection: React.FC = () => {
  const images = [
    'https://static.vecteezy.com/system/resources/previews/035/879/360/original/garbage-dump-with-rubbish-bin-for-recycling-in-park-different-types-of-waste-trash-laying-on-the-street-illustration-in-flat-style-vector.jpg',
    'https://static.vecteezy.com/system/resources/previews/007/637/240/original/people-cleaning-garbage-on-beach-area-free-vector.jpg',
    'https://png.pngtree.com/png-clipart/20230824/original/pngtree-waste-management-concept-activist-people-picture-image_8422764.png',
    'https://previews.123rf.com/images/surfupvector/surfupvector2009/surfupvector200900152/154889265-trash-pickup-worker-cleaning-dustbin-at-truck-man-carrying-trash-in-plastic-bag-flat-vector.jpg',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
 
  // Function to handle next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
 
  // Function to handle previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
 
  // Automatically change images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 2000);
 
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);
 
  return (
    <section className="relative bg-cover bg-center h-[70vh] flex items-center justify-center">
      {/* Image background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ 
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center' 
        }}
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
 
      {/* Hero Text */}
      <div className="relative text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">Join Us in Keeping Our City Clean</h1>
        <p className="text-xl text-white mb-6">Make your city a better place with smart garbage detection technology.</p>
        <button
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          onClick={() => window.location.href = '/mcd/complaint'}
        >
          User Registered Complaints
        </button>
      </div>
 
 
      
 
      {/* Dots to show the current image */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-gray-400'} transition-colors duration-300`}
          />
        ))}
      </div>
    </section>
  );
};
 
// Features Section Component with Hover Effects
const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🚀", title: "Fast Detection", description: "AI-driven fast and accurate garbage and potholes detection." },
            { icon: "🎁", title: "Voucher Redemption", description: "Redeem your points for exciting rewards and discounts." },
            { icon: "♻️", title: "Sell Scrap", description: "Turn your waste into rewards! Sell scrap and earn points to redeem for exciting vouchers." }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-200 hover:scale-105">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
 
// Community Posts Section with Hover Effects
const CommunityPosts: React.FC<{ posts: any[] }> = ({ posts }) => {
  return (
    <section className="py-12 px-4 lg:px-16 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Latest from the Community</h2>
      <div className="max-w-2xl mx-auto h-96 overflow-y-auto bg-gray-100 p-6 rounded-md shadow-md">
        {posts.map((post, index) => (
          <div key={index} className="bg-white p-4 mb-4 rounded-md shadow hover:shadow-lg transition-shadow duration-200">
            <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold text-blue-600">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <span className="text-gray-500">{post.createdAt}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
 
// Testimonials Section Component
const TestimonialsSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const totalWidth = slider.scrollWidth / 2;
    let scrollAmount = 0;
    const speed = totalWidth/6; // Adjust the scroll speed
    const slideInterval = setInterval(() => {
      if (slider) {
        scrollAmount += speed;
        slider.scrollLeft += speed;

        // If the scroll reaches the end, reset it to the start seamlessly
        if (slider.scrollLeft >= totalWidth) {
          slider.scrollLeft = 0;
        }
      }
    }, 2000); // Adjust the interval for the speed

    return () => clearInterval(slideInterval); // Cleanup on unmount
  }, []);

  const testimonials = [
    { name: 'Nayan Jindal', feedback: 'Fantastic app! The city has never been cleaner.' },
    { name: 'Jai Bansal', feedback: 'Voucher in exchange of points are gamechanger.' },
    { name: 'Rohan Jhanwar', feedback: 'A game-changer for urban cleanliness—quick and easy to use!' },
    { name: 'Dhruv Tuteja', feedback: 'I’ve been able to redeem great offers, all thanks to the point system—truly innovative.' },
    { name: 'Pragati Verma', feedback: 'The app made reporting issues so simple, and results were immediate!' },
    { name: 'Shubham Didharia', feedback: 'Impressed by the speed and accuracy of garbage detection!' },
  ];

  // Clone the testimonials to make it appear endless
  const endlessTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">What Our Users Say</h2>
        <div
          ref={sliderRef}
          className="flex space-x-6 overflow-hidden py-4"
          style={{ scrollBehavior: 'smooth', whiteSpace: 'nowrap' }}
        >
          {endlessTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 min-w-[300px] md:min-w-[350px] max-w-[350px] rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-200 hover:scale-105 overflow-hidden"
            >
              <p className="text-xl text-gray-600 mb-4 break-words whitespace-normal">
                "{testimonial.feedback}"
              </p>
              <h3 className="text-lg font-bold text-gray-800">{testimonial.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
 
const AboutSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Text Section */}
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              About Us
            </h2>
            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              We are committed to making our cities cleaner and healthier using innovative
              technology. Our platform empowers citizens to report waste issues in real-time,
              and we work alongside local governments to ensure a swift response. Together, 
              we can create a more sustainable future for everyone.
            </p>
          </div>
 
          {/* Image Section */}
          <div className="mt-8 md:mt-0">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1531973576160-7125cd663d86"
                alt="About Us"
                width={600}
                height={400}
                className="object-cover w-full h-full transform transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
 
// FAQ Section Component with Functional Dropdown
const FAQSection: React.FC = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 lg:px-0">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};
 
// Enhanced FAQ Item Component with Hover and Click Functionality
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
 
  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white">
      <button
        className="w-full text-left p-4 text-gray-900 font-semibold focus:outline-none flex justify-between items-center transition duration-200 ease-in-out hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <svg
          className={`w-5 h-5 text-gray-700 transition-transform duration-300 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="p-4 text-gray-800 border-t border-gray-300">
          {answer}
        </div>
      </div>
    </div>
  );
};
 
// Sample Data for FAQ Section
const faqData = [
  { question: 'How does garbage and road detection work?', answer: 'We use AI and machine learning models to detect garbage and potholes on streets and notify the cleaning and repairing teams.' },
  { question: 'How can I participate in cleaning?', answer: 'You can join our volunteer program or report garbage through our complaint system.' },
  { question: 'What are the benefits of using this system?', answer: 'It helps in faster garbage disposal, cleaner streets, and a healthier environment.' },
  { question: 'How can I report a complaint?', answer: 'Simply click on the "Report a Complaint" button and fill out the necessary details.' },
];
 
export default Home;
 