import SignUp from '@/Components/user/SignUp'
import Navbar from "@/Components/user/Navbar";
import Footer from "@/Components/user/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <SignUp />  
      <Footer />  
    </div>
  )
}

