import Profile from '@/Components/trader/Profile'
import Navbar from "@/Components/trader/Navbar";
import Footer from "@/Components/trader/Footer";


export default function Home(){
  return (
    <div>
      <Navbar />
      <Profile />
      <Footer/>   
    </div>
  )
}