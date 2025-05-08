import "./Footer.css";

import insta from "../../assets/svgs/insta.svg";
import linkedin from "../../assets/svgs/linkedin.svg";
import facebook from "../../assets/svgs/facebook.svg";
import X from "../../assets/svgs/X.svg";
import copyright from "../../assets/svgs/Copyright.svg";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <section className="footer-section-1">
          <a className="to-top" href="#">
            <h3>
              <span>C</span>RAFTED&nbsp;
              <span>N</span>EAR
            </h3>
          </a>
          <div className="socials">
            <h4>FOLLOW US</h4>
            <div className="socials-wrapper">
              <a href="#">
                <img src={insta} alt="insta" />
              </a>
              <a href="#">
                <img src={linkedin} alt="linkedin" />
              </a>
              <a href="#">
                <img src={facebook} alt="facebook" />
              </a>
              <a href="#">
                <img src={X} alt="X" />
              </a>
            </div>
          </div>
        </section>
        <section className="footer-section-2">
          <div className="footer-s2-wrapper">
            <div className="footer-links">
              <Link to="/aboutus">About Us</Link>
              <a
                href="mailto:sabiques1@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
            </div>
            <div className="footer-links">
              <Link to="/stores">Stores</Link>
              <Link to="/offers">Offers</Link>
            </div>
          </div>
          <div className="copyright">
            <img src={copyright} alt="c" />
            <p>2025 CRAFTED NEAR Inc. All Rights Reserved.</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Footer;
