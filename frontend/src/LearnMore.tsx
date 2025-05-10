import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AnimatedNumbers from "react-animated-numbers";
import { useInView } from "react-intersection-observer";
import WBGHeader from "./WBGHeader";
import './CSS/LearnMore.css';
import { useTranslation } from "react-i18next";

const LearnMore = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const statsRef = useRef(null);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimateStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: testimonialRef, inView: testimonialInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // Load translated arrays
  const features = t("learn.features.items", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  const testimonials = t("learn.testimonial.items", { returnObjects: true }) as {
    quote: string;
    name: string;
    title: string;
  }[];

  const stats = t("learn.stats.items", { returnObjects: true }) as {
    label: string;
  }[];

  return (
    <div className="learn-more-page">
      <WBGHeader />

      {/* Hero Section */}
      <Container fluid className="hero-section" ref={heroRef}>
        <Row className={`align-items-center ${heroInView ? "fade-in" : ""}`}>
          <Col md={6} className="hero-text">
            <h1 className="hero-title">{t("learn.hero.title")}</h1>
            <p className="hero-subtitle">{t("learn.hero.subtitle")}</p>
            <Button variant="primary" size="lg" href="#features" className="hero-btn">
              {t("learn.hero.button")}
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <Container id="features" className="feature-section" ref={featuresRef}>
        <h2 className={`section-title-F ${featuresInView ? "fade-in" : ""}`}>{t("learn.features.title")}</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={4} key={index} className={`feature-item ${featuresInView ? "fade-in" : ""}`} style={{ transitionDelay: `${index * 0.2}s` }}>
              <div className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Testimonial Section */}
      <Container className="testimonial-section" ref={testimonialRef}>
        <h2 className={`section-title-W ${testimonialInView ? "fade-in" : ""}`}>{t("learn.testimonial.title")}</h2>
        <Row>
          {testimonials.map((testimonial, index) => (
            <Col md={6} key={index} className={`testimonial-item ${testimonialInView ? "fade-in" : ""}`} style={{ transitionDelay: `${index * 0.2}s` }}>
              <div className="testimonial-card">
                <p className="quote">"{testimonial.quote}"</p>
                <h4>{testimonial.name}</h4>
                <p className="title">{testimonial.title}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Stats Section */}
      <div className="stats-section" ref={statsRef}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="stats-title">{t("learn.stats.title")}</h2>
              <Row className="mt-4">
                {[110, 80, 18, 22, 100].map((value, index) => (
                  <Col xs={6} md={4} key={index} className="mb-4">
                    <div className="stat-item">
                      <h3 className="stat-number">
                        <AnimatedNumbers
                          includeComma
                          animateToNumber={animateStats ? value : 0}
                          locale="en-US"
                          configs={() => ({
                            mass: 1,
                            tension: 230,
                            friction: 140,
                          })}
                        />
                        {index === 0 ? "M+" : index === 4 ? "%" : "+"}
                      </h3>
                      <p className="stat-label">{stats[index]?.label}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={6} className="stats-image">
              <img src="/OurCraftYP.jpg" alt="Decorative" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <Container className="cta-section" ref={ctaRef}>
        <Row>
          <Col className={`text-center ${ctaInView ? "fade-in" : ""}`}>
            <h2>{t("learn.cta.title")}</h2>
            <Button variant="primary" size="lg" href="/signup" className="cta-btn">
              {t("learn.cta.button")}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LearnMore;
