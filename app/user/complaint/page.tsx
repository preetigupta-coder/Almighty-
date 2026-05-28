import Complaint from '@/Components/user/Complaint'
import Navbar from "@/Components/user/Navbar";
import Footer from "@/Components/user/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Complaint /> 
      <Footer />   
    </div>
  )
}

