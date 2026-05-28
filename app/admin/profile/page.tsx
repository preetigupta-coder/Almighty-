import Navbar from "@/Components/admin/Navbar";
import Footer from "@/Components/user/Footer";
import Profile from "@/Components/admin/Profile";
export default function Home(){
  return (
    <div>
      <Navbar />  
      <Profile/>
      <Footer /> 
    </div>
  )
}

