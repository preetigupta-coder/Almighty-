import Signin from '@/Components/trader/Signin'
import Navbar from "@/Components/trader/Navbar";
import Footer from "@/Components/trader/Footer";


export default function Home(){
  return (
    <div>
      <Navbar />
  
      <Signin />  
      <Footer /> 
    </div>
  )
}