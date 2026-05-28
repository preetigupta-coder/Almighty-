import Wallet from '@/Components/trader/Wallet'
import Navbar from "@/Components/trader/Navbar";
import Footer from "@/Components/trader/Footer";


export default function Home(){
  return (
    <div>
      <Navbar />
      <Wallet />
      <Footer/>   
    </div>
  )
}