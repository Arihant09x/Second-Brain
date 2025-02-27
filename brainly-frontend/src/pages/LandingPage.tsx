import { BrainICon } from "../components/Icons/BrainIcon";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { LoginArrowIcon } from "../components/Icons/LoginArrow";
import SignupIcon from "../components/Icons/SignupIcon";
import image2 from "../assets/freepik__a-futuristic-workspace-where-a-person-quickly-writ__75547.png";
import image1 from "../assets/image1.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/image6.jpg";
import { FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-0 w-full px-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center md:flex-row md:items-center md:gap-2">
          <BrainICon />
          <h1 className="text-3xl font-bold">Second Brain</h1>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 mb-10 md:mb-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/signup")}
            text="Sign Up"
            startIcon={<SignupIcon />}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/signin")}
            text="Log In"
            startIcon={<LoginArrowIcon />}
          />
        </div>
      </div>

      <div className="text-center mt-36">
        <h2 className="text-4xl font-bold mb-4 mt-5">
          Welcome to Second Brain
        </h2>
        <p className="text-lg mb-8">
          Second Brain is your personal knowledge management system. Capture,
          organize, and share your thoughts and ideas seamlessly.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {[image1, image2, image3, image4, image5, image6].map((img, index) => {
          const titles = [
            "Capture Your Ideas",
            "Organize Efficiently",
            "Share with Others",
            "Access Anywhere",
            "Secure and Private",
            "Collaborate Easily",
          ];
          const descriptions = [
            "Easily capture your thoughts and ideas in one place.",
            "Keep your notes organized and easily accessible.",
            "Share your knowledge and collaborate with others.",
            "Access your notes from any device, anywhere.",
            "Your data is secure and private with us.",
            "Work together with your team seamlessly.",
          ];
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 hover:scale-105 transition-all duration-200"
            >
              <img
                src={img}
                alt={titles[index]}
                className="w-full h-56 object-cover rounded"
              />
              <h3 className="text-xl font-bold mt-4">{titles[index]}</h3>
              <p className="mt-2 text-gray-600">{descriptions[index]}</p>
            </div>
          );
        })}
      </div>

      <footer className="w-full bg-[#5046e4] text-white mt-10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-bold mb-4">About Us</h4>
              <p>
                Second Brain is a personal knowledge management system designed
                to help you capture, organize, and share your thoughts and ideas
                seamlessly.
              </p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <p>Email: arihantc677@gmail.com</p>
              <p>Phone: </p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/ArihantChougul6"
                  target="_blank"
                  className="hover:text-gray-400"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.instagram.com/arihant_09x_/?igsh=MXE3Nng1YzFxNjgxdA%3D%3D#"
                  target="_blank"
                  className="hover:text-gray-400"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.linkedin.com/in/arihant-chougule-50082a33a/?trk=opento_sprofile_details"
                  target="_blank"
                  className="hover:text-gray-400"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <a href="#" className="text-sm hover:text-gray-400">
              Privacy Policy
            </a>
            <span className="mx-2">|</span>
            <a href="#" className="text-sm hover:text-gray-400">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
