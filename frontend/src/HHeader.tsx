import { Link } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import './CSS/HHeader.css';

const HHeader = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="header">
      <div className="header-image">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault(); // Prevents React Router from handling navigation
            window.location.href = "/"; // Forces a full refresh
          }}
        >
          <img
            src="/logo.png"
            alt="Clickable image redirects back to landing page. Logo of the website"
          />
        </Link>
      </div>

      <div className="top-right-options">
        <Row>
          <Col>
            <div className="header-buttons">
              <Link to="/aboutus">
                <Button variant="">{t('header.about_us')}</Button>
              </Link>
              <Link to="/Contact">
                <Button variant="">{t('header.contact')}</Button>
              </Link>
              <Link to="/Login">
                <Button variant="">{t('header.login')}</Button>
              </Link>
              <Link to="/SignUp">
                <Button variant="danger">{t('header.try_now')}</Button>
              </Link>
              {/* Language Selector */}
              <select
                onChange={handleLanguageChange}
                value={i18n.language}
                className="language-selector"
              >
                <option value="en">🇬🇧 EN</option>
                <option value="tr">🇹🇷 TR</option>
              </select>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HHeader;
