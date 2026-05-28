import React from 'react';
 
const ComingSoon: React.FC = () => {
  const technologies = [
    {
      name: 'NGO Collaboration',
      description:
        'NGOs can partner with SUDHAAR to organize sustainability events clean-up drives, recycling programs, and workshops where users can actively participate and earn rewards for their involvement.',
      icon: 'https://cdn-icons-png.flaticon.com/512/5153/5153006.png',
    },
    {
      name: 'Aadhaar Authentication for Login',
      description:
        'Integrating Aadhaar authentication as a login option on our platform to provide users with a secure and seamless login experience.',
      icon: 'https://cdn-icons-png.flaticon.com/512/10828/10828847.png', 
    },
    
    {
      name: 'Eco-Friendly Product Partnerships',
      description:
        'Partner with companies that sell eco-friendly products (such as reusable bags, composting kits, or electric scooters).',
      icon: 'https://cdn-icons-png.flaticon.com/512/4909/4909025.png',
    },
    {
      name: 'AI-Powered Insights',
      description:
        'Tailored eco-tips on waste reduction, energy efficiency, and recycling, empowering users to make sustainable choices effortlessly.',
      icon: 'https://cdn-icons-png.flaticon.com/512/12394/12394750.png',
    },
  ];
 
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Exciting Technologies Coming Soon!
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-6 shadow-lg transition duration-300 hover:scale-105 text-center"
          >
            <img className="text-6xl h-20 mb-4" src={`${tech.icon}`}/>
            <h2 className="text-xl font-bold">{tech.name}</h2>
            <p className="text-center text-sm mt-2">{tech.description}</p>
          </div>
        ))}
      </div>
 
      <div className="mt-12 text-center">
        <p className="text-white text-lg">Stay tuned for more updates!</p>
        <p className="text-gray-400 mt-2">We are working hard to bring these technologies to you.</p>
      </div>
    </div>
  );
};
 
export default ComingSoon;
 
