"use client";
import { useState } from 'react';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const templateParams = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
    };

    try {
      const response = await emailjs.send('service_r8lthks', 'template_j4n102h', templateParams, 'QrK1DlzU_Ho0BMgKD');
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
      });
    } catch (err) {
      toast.error('Failed to send message. Please try again later.');
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-16 items-center relative overflow-hidden p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-3xl max-w-6xl mx-auto bg-white mt-6 mb-6 font-[sans-serif]">
        <div>
          <h2 className="text-gray-800 text-3xl font-bold">Get In Touch</h2>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            Have a specific inquiry or looking to explore new opportunities? Our experienced team is ready to engage with you.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mt-8">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                required
              />

              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone No."
                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                required
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write Message"
                className="px-2 pt-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-8 flex items-center justify-center text-sm w-full rounded-md px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                fill="#fff"
                className="mr-2"
                viewBox="0 0 548.244 548.244"
              >
                <path
                  fillRule="evenodd"
                  d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
                  clipRule="evenodd"
                />
              </svg>
              Send Message
            </button>
          </form>

          <ul className="mt-4 flex flex-wrap justify-center gap-6">
            {/* Add your contact details here */}
          </ul>
        </div>
        <div className="z-10 relative h-full max-md:min-h-[350px]">
          <iframe
            src="https://maps.google.com/maps?q=NSUT%20Dwarka&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="left-0 top-0 h-full w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
