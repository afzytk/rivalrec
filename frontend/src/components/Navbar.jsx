import sampleLogo from "../assets/sampleLogo.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <img src={sampleLogo} alt="RivalRec logo" className="h-12 w-12" />
      <div className="flex gap-8">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
      <Link
        to="/dashboard"
        className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2 font-bold text-white transition-all"
      >
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
