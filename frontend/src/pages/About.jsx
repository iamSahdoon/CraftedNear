import "./CSS/About.css";

import HeroSection from "../components/hero-text/HeroSection";
import Navbar1 from "../components/navbar/Navbar1";

import mission from "../assets/svgs/misiion.svg";
import vision from "../assets/svgs/vision.svg";
import impact from "../assets/svgs/impact.svg";
import gamifi from "../assets/svgs/gamification.svg";
import Footer from "../components/footer/Footer";

const About = () => {
  return (
    <>
      <div className="about-container">
        <Navbar1 />
        <HeroSection herotext={"ABOUT US"} />
        <div className="about-description">
          <p>
            “CraftedNear is a unique online platform dedicated to bridging the
            gap between local sellers and customers. Whether you are a seller
            looking to showcase your products or a customer searching for
            exceptional local shops, CraftedNear offers a seamless experience
            tailored to meet your needs. Our platform is built with a commitment
            to promoting small businesses and making local discoveries
            effortless.”
          </p>
        </div>
        <div className="img-svgs-about">
          <img className="img-about" src={mission} alt="mission" />
          <img className="img-about" src={vision} alt="vision" />
          <img className="a-last-img-about" src={impact} alt="impact" />
          <img className="last-img-about" src={gamifi} alt="gamification" />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
