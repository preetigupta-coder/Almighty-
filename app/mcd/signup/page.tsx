import SignUp from '@/Components/Mcd/SignUp'
import Navbar from "@/Components/Mcd/Navbar";
import Footer from "@/Components/Mcd/Footer";


export default function Home(){
  return (
    <div>
      <Navbar />
      <SignUp />
      <Footer/>   
    </div>
  )
}