import Order from '@/Components/user/Order'
import Navbar from "@/Components/user/Navbar";
import Footer from "@/Components/user/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Order />   
      <Footer /> 
    </div>
  )
}

