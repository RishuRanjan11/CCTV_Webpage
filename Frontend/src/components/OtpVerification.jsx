import React, { useEffect, useRef, useState } from "react";
import "./OtpVerification.css"; // optional, for your own styles
import { useLocation, useNavigate } from "react-router-dom";
import { useOtpStore } from "../stores/useOtpStore";
import { useUserStore } from "../stores/useUserStore";

const OtpVerification = ({ onVerify }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const { state: formData } = useLocation();
  const { sendOtp, verifyOtp } = useOtpStore();
  const { signup } = useUserStore();

  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30); // countdown from 30

  // Countdown effect
  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0]; // Only one digit
    setOtp(newOtp);

    // Move to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newOtp = [...otp];
      if (otp[index]) {
        // Just clear current input
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 6 && !otp.includes("")) {
      verifyOtp({ email: formData.email, otp: otpCode }, () => {
        signup(formData);
      });
    } else {
      alert("Enter full 6-digit OTP");
    }
  };

  const handleResend = () => {
    alert("OTP Resent!");
    setOtp(new Array(6).fill(""));
    inputRefs.current[0]?.focus();
    sendOtp(formData.email);

    setResendDisabled(true);
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <p>Enter the 6-digit code sent to your registered email.</p>
      <div className="otp-inputs">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength="1"
            ref={(el) => (inputRefs.current[idx] = el)}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>
      <button className="otp-submit" onClick={handleSubmit}>
        Verify OTP
      </button>
      <button
        className="otp-resend"
        onClick={handleResend}
        disabled={resendDisabled}
      >
        {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
      </button>
    </div>
  );
};

export default OtpVerification;
