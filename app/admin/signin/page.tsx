import Navbar from "@/Components/admin/Navbar";
import Signin from "@/Components/admin/Signin";
import Footer from "@/Components/user/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Signin />
      <Footer /> 
    </div>
  )
}

