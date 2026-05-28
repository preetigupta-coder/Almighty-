import SignUp from '@/Components/trader/SignUp'
import Navbar from "@/Components/trader/Navbar";
import Footer from "@/Components/trader/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <SignUp />
      <Footer />   
    </div>
  )
}