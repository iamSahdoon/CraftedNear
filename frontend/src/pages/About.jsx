import "./CSS/About.css";

import HeroSection from "../components/hero-text/HeroSection";
import Navbar1 from "../components/navbar/Navbar1";

import mission from "../assets/svgs/misiion.svg";
import vision from "../assets/svgs/vision.svg";
import impact from "../assets/svgs/impact.svg";
import gamifi from "../assets/svgs/gamification.svg";
import missionPhoto from "../assets/images/about/mission.jpg";
import visionPhoto from "../assets/images/about/vision.jpg";
import pointsIcon from "../assets/images/about/points.png";
import leaderboardIcon from "../assets/images/about/leaderboard.png";
import loyaltyIcon from "../assets/images/about/loyalty.png";
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
        {/* Wide screens: the designed panels (lazy, so phones skip them) */}
        <div className="img-svgs-about">
          <img
            className="img-about"
            src={mission}
            alt="mission"
            width="1522"
            height="670"
            loading="lazy"
          />
          <img
            className="img-about"
            src={vision}
            alt="vision"
            width="1522"
            height="670"
            loading="lazy"
          />
          <img
            className="a-last-img-about"
            src={impact}
            alt="impact"
            width="1516"
            height="480"
            loading="lazy"
          />
          <img
            className="last-img-about"
            src={gamifi}
            alt="gamification"
            width="1516"
            height="342"
            loading="lazy"
          />
        </div>
        {/* Narrow screens: the same content as readable text */}
        <div className="about-blocks">
          <section className="about-card">
            <img
              className="about-card-photo"
              src={missionPhoto}
              alt=""
              loading="lazy"
            />
            <div className="about-card-body">
              <h2 className="about-card-title">
                <em>OUR</em> MISSION
              </h2>
              <p className="about-text">
                “At CraftedNear, is to empower local businesses by providing
                them with a digital presence and tools to connect with nearby
                customers. We aim to create a vibrant community where customers
                can discover and support exceptional local sellers, fostering
                growth and meaningful interactions through innovation, trust,
                and accessibility.”
              </p>
            </div>
          </section>
          <section className="about-card">
            <img
              className="about-card-photo"
              src={visionPhoto}
              alt=""
              loading="lazy"
            />
            <div className="about-card-body">
              <h2 className="about-card-title">
                <em>OUR</em> VISION
              </h2>
              <p className="about-text">
                “Is to redefine local commerce by creating a platform where
                technology bridges the gap between sellers and customers. We
                aspire to become the go-to platform for discovering local
                businesses, promoting sustainable growth, and enhancing customer
                experiences through gamification, seamless interactions, and a
                user-centric design.”
              </p>
            </div>
          </section>
          <section className="about-table">
            <h2 className="about-table-title">IMPACT</h2>
            <dl className="about-impact">
              <div>
                <dt>FOR SELLERS</dt>
                <dd className="about-text">
                  We provide tools to increase visibility, boost customer trust,
                  and grow your business through customer engagement and
                  promotions.
                </dd>
              </div>
              <div>
                <dt>FOR CUSTOMERS</dt>
                <dd className="about-text">
                  Discover high-quality products from local sellers while
                  enjoying an engaging shopping experience.
                </dd>
              </div>
              <div>
                <dt>FOR COMMUNITIES</dt>
                <dd className="about-text">
                  Supporting local businesses fosters community growth and
                  sustainability.
                </dd>
              </div>
            </dl>
          </section>
          <section className="about-table">
            <h2 className="about-table-title">GAMIFICATION</h2>
            <ul className="about-gamification">
              <li>
                <img src={pointsIcon} alt="" loading="lazy" />
                <p className="about-text">
                  Earn points for reviewing sellers, favoriting shops, and
                  interacting with storefronts.
                </p>
              </li>
              <li>
                <img src={leaderboardIcon} alt="" loading="lazy" />
                <p className="about-text">
                  Compete on leaderboards to unlock exclusive rewards and
                  special offers.
                </p>
              </li>
              <li>
                <img src={loyaltyIcon} alt="" loading="lazy" />
                <p className="about-text">
                  Foster loyalty through engaging gamified experiences that bring
                  sellers and customers closer.
                </p>
              </li>
            </ul>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
