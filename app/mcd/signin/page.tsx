import Signin from '@/Components/Mcd/Signin'
import Navbar from "@/Components/Mcd/Navbar";
import Footer from "@/Components/Mcd/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Signin />
      <Footer/>   
    </div>
  )
}