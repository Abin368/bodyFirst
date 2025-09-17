import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="text-white font-bold text-lg">
          BodyFirst
        </div>

        {/* Links */}
        <div className="flex gap-4 text-white text-sm">
          <a href="/about" className="hover:text-gray-400 transition">About</a>
          <a href="/contact" className="hover:text-gray-400 transition">Contact</a>
          <a href="/privacy" className="hover:text-gray-400 transition">Privacy Policy</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-3 text-white">
          <a href="#" className="hover:text-gray-400 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-400 transition"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-400 transition"><FaInstagram /></a>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center text-white text-xs mt-4 pb-2 mb-3">
        &copy; {new Date().getFullYear()} BodyFirst. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
