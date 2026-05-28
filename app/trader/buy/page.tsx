import Buy from "@/Components/trader/Buy";
import Navbar from "@/Components/trader/Navbar";
import Footer from "@/Components/trader/Footer";
import { Toaster } from "react-hot-toast";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Buy />
      <Footer/> 
      <Toaster />
    </div>
  )
}