import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AnimatedNumbers from "react-animated-numbers";
import { useInView } from "react-intersection-observer";
import WBGHeader from "./WBGHeader";
import "./CSS/LearnMore.css";

const LearnMore = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);
  const statsRef = useRef(null);
  const [animateStats, setAnimateStats] = useState(false);

  // Intersection Observer for stats section
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

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // UseInView for animating sections on scroll
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: testimonialRef, inView: testimonialInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="learn-more-page">
      {/* Header Section */}
      <WBGHeader />

      {/* Hero Section */}
      <Container fluid className="hero-section" ref={heroRef}>
        <Row className={`align-items-center ${heroInView ? "fade-in" : ""}`}>
          <Col md={6} className="hero-text">
            <h1 className="hero-title">Take Control of Your Inventory</h1>
            <p className="hero-subtitle">
              Discover how our easy-to-use inventory management platform helps you optimize stock, reduce waste, and boost sales.
            </p>
            <Button variant="primary" size="lg" href="#features" className="hero-btn">
              Learn More
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <Container id="features" className="feature-section" ref={featuresRef}>
        <h2 className={`section-title-F ${featuresInView ? "fade-in" : ""}`}>Features</h2>
        <Row>
          {[
            {
              title: "Stock Tracking",
              description: "Track your inventory in real-time and make data-driven decisions for your business.",
            },
            {
              title: "Organization",
              description: "Easily organize and accurately to manage stock with minimal errors.",
            },
            {
              title: "Reports & Analytics",
              description: "Get detailed reports and analytics to gain insights into your business performance.",
            },
          ].map((feature, index) => (
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
      <Container className="testimonial-section">
        <h2 className={`section-title-W ${testimonialInView ? "fade-in" : ""}`}>What Our Users Say</h2>
        <Row>
          {[
            {
              quote: "This platform made inventory management so much easier. I highly recommend for businesses of any size.",
              name: "David Wallace",
              title: "CEO, Sabre International Corp.",
            },
            {
              quote: "An incredibly powerful tool that saves us hours of manual work each week. It integrates perfectly with our system.",
              name: "Jan Levinson",
              title: "VP of Northeast Sales, Dunder Mifflin",
            },
          ].map((testimonial, index) => (
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
              <h2 className="stats-title">
                Craftsmanship.
                <br /> Our Craft. Your Passion.
              </h2>
              <Row className="mt-4">
                {[
                  { value: 110, suffix: "M+", label: "Global Users" },
                  { value: 80, suffix: "+", label: "Countries Served" },
                  { value: 18, suffix: "K+", label: "Employees Worldwide" },
                  { value: 22, suffix: "+", label: "Years in Business" },
                  { value: 100, suffix: "%", label: "The Solution" },
                ].map((stat, index) => (
                  <Col xs={6} md={4} key={index} className="mb-4">
                    <div className="stat-item">
                      <h3 className="stat-number">
                        <AnimatedNumbers
                          includeComma
                          animateToNumber={animateStats ? stat.value : 0}
                          locale="en-US"
                          configs={() => ({
                            mass: 1,
                            tension: 230,
                            friction: 140,
                          })}
                        />
                        {stat.suffix}
                      </h3>
                      <p className="stat-label">{stat.label}</p>
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
            <h2>Ready to Boost Your Business?</h2>
            <Button variant="primary" size="lg" href="/signup" className="cta-btn">
              Get Started
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LearnMore;