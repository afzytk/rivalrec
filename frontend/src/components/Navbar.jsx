import sampleLogo from "../assets/sampleLogo.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4">
      <img src={sampleLogo} alt="RivalRec logo" className="w-12 h-12" />
      <div className="flex gap-8">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>

      <Link
        to="/dashboard"
        className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold transition-all"
      >
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
