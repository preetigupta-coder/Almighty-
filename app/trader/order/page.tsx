import Order from "@/Components/trader/Order";
import Navbar from "@/Components/trader/Navbar";
import Footer from "@/Components/trader/Footer";


export default function Home(){
  return (
    <div>
      <Navbar />
      <Order />
      <Footer/>   
    </div>
  )
}