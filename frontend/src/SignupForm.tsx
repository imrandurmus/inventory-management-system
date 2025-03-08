import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStore, FaTruck, FaIndustry, FaShoppingCart } from "react-icons/fa";
import "./SignupFormstyle.css"; 
import confetti from "canvas-confetti";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const handleConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.98 },
  });
};

type Industry = {
  id: string;
  label: string;
  icon: JSX.Element;
};

const industries: Industry[] = [
  { id: "retail", label: "Retail", icon: <FaStore /> },
  { id: "online", label: "Online Storefront", icon: <FaShoppingCart /> },
  { id: "shipping", label: "Shipping & Transportation", icon: <FaTruck /> },
  { id: "manufacturing", label: "Manufacturing", icon: <FaIndustry /> },
];

type IndustrySelectionProps = {
  onSelect: (id: string) => void;
  selectedIndustry: string | null;
};

const IndustrySelection = ({ onSelect, selectedIndustry }: IndustrySelectionProps) => {
  return (
    <div className="industry-selection mt-3">
      <h5 className="text-center text-white">Select Your Industry</h5>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        {industries.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`btn industry-btn d-flex align-items-center gap-2 px-3 py-2 ${selectedIndustry === id ? "selected" : ""}`}
            onClick={() => onSelect(id)}
          >
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
  );
};

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  accountType: string;
  companyName: string;
  companyAddress: string;
  industry: string;
  termsAccepted: boolean;
};

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    accountType: "",
    companyName: "",
    companyAddress: "",
    industry: "",
    termsAccepted: false
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleIndustrySelect = (industry: string) => {
    setFormData(prev => ({ ...prev, industry }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    handleConfetti();
  };

  useEffect(() => {
    const requiredFields = [
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.phone,
      formData.companyName,
      formData.companyAddress,
      formData.industry,
    ];

    const allFieldsFilled = requiredFields.every(field => field.trim() !== "");
    const passwordsMatch = formData.password === formData.confirmPassword;
    setIsFormValid(allFieldsFilled && passwordsMatch && formData.termsAccepted);
  }, [formData]);

  return (
    <div className="bgcontainer">
      <div className="card shadow p-4 text-white">
        <h3 className="SignUpHeader">Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {[
              { label: "Email", type: "email", name: "email" },
              { label: "Password", type: "password", name: "password" },
              { label: "Confirm Password", type: "password", name: "confirmPassword" },
              { label: "Phone Number", type: "tel", name: "phone" },
              { label: "Company Name", type: "text", name: "companyName" },
              { label: "Company Address", type: "text", name: "companyAddress" }
            ].map(({ label, type, name }) => (
              <div className="input-container" key={name}>
                <label className="input-label">{label}</label>
                <input type={type} name={name} className="input-field" onChange={handleInputChange} />
              </div>
            ))}
          </div>
          <div className="header">
                <div className="header-image">
                    <Link to="/">
                    <img src="/Draft_logo.png" alt="Clickable image redirects back to landing page. Logo of the website, a pink outline of a box" />
                    </Link>
                </div>
            </div>
          <IndustrySelection onSelect={handleIndustrySelect} selectedIndustry={formData.industry} />

          <div className="form-check terms-container">
            <input type="checkbox" name="termsAccepted" className="form-check-input" onChange={handleInputChange} />
            <label className="form-check-label">
              I accept the{" "}
              <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
                Terms and Conditions
              </a>
            </label>
          </div>
          <Button type="submit" disabled={!isFormValid} className="SignUpbt">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
