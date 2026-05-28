import Complaint from '@/Components/Mcd/Complaint'
import Navbar from "@/Components/Mcd/Navbar";
import Footer from "@/Components/Mcd/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Complaint /> 
      <Footer />   
    </div>
  )
}

