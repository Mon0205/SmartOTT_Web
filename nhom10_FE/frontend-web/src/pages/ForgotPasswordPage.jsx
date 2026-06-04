import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forgotPasswordAPI,
  resetPasswordAPI,
  verifyResetOtpAPI,
} from "../api/authApi";
import ForgotPasswordSteps from "../components/auth/ForgotPasswordSteps";
import { FaArrowLeft, FaComments, FaEnvelope, FaKey, FaLock, FaShieldAlt } from "react-icons/fa";
import "./AuthPage.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const inputsRef = useRef([]);

  const handleSendOtp = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await forgotPasswordAPI(email);
      if (res.success) {
        alert("OTP da gui!");
        setStep(2);
      } else {
        alert(res.message);
      }
    } catch {
      alert("Loi server!");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key !== "Backspace") return;

    if (otp[index]) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(data)) return;

    setOtp(data.split(""));
    inputsRef.current[5]?.focus();
  };

  const handleVerifyOtp = async () => {
    if (loading) return;

    const otpCode = otp.join("");
    if (otpCode.length !== 6) return alert("Nhap du 6 so OTP!");

    setLoading(true);

    try {
      const res = await verifyResetOtpAPI({ email, otp: otpCode });
      if (res.success) {
        alert("OTP hop le");
        setStep(3);
      } else {
        alert(res.message);
      }
    } catch {
      alert("Loi verify OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (loading) return;
    if (newPassword !== confirm) return alert("Mat khau khong khop!");

    setLoading(true);

    try {
      const res = await resetPasswordAPI({
        email,
        otp: otp.join(""),
        newPassword,
      });

      if (res.success) {
        alert("Doi mat khau thanh cong!");
        navigate("/login", { replace: true });
      } else {
        alert(res.message);
      }
    } catch {
      alert("Loi reset password!");
    } finally {
      setLoading(false);
    }
  };

  const stepTitle =
    step === 1 ? "Khoi phuc mat khau" : step === 2 ? "Xac thuc OTP" : "Tao mat khau moi";
  const stepDescription =
    step === 1
      ? "Nhap email da dang ky de nhan ma OTP dat lai mat khau."
      : step === 2
      ? "Kiem tra email va nhap ma OTP gom 6 chu so."
      : "Dat mat khau moi de bao ve tai khoan cua ban.";

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand-panel">
          <div className="auth-brand">
            <div className="auth-logo">
              <FaComments />
            </div>
            <div>
              <div className="auth-brand-name">ConnectHub</div>
              <div className="auth-brand-subtitle">Bao ve tai khoan cua ban</div>
            </div>
          </div>

          <div className="auth-hero">
            <h1>Lay lai quyen truy cap mot cach an toan.</h1>
            <p>
              Quy trinh OTP giup xac minh dung email truoc khi cho phep dat lai
              mat khau moi.
            </p>
          </div>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <span><FaEnvelope /></span>
              <div>
                <strong>Gui ma qua email</strong>
                <small>Ma OTP chi gui den email da dang ky tai khoan.</small>
              </div>
            </div>
            <div className="auth-feature">
              <span><FaKey /></span>
              <div>
                <strong>Xac thuc tung buoc</strong>
                <small>Nhap OTP truoc khi duoc tao mat khau moi.</small>
              </div>
            </div>
            <div className="auth-feature">
              <span><FaShieldAlt /></span>
              <div>
                <strong>Hoan tat nhanh gon</strong>
                <small>Sau khi doi mat khau, ban quay lai dang nhap ngay.</small>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <div className="auth-mobile-brand">
              <div className="auth-logo small">
                <FaComments />
              </div>
              <span>ConnectHub</span>
            </div>

            <button className="auth-back-button" onClick={() => navigate("/login", { replace: true })}>
              <FaArrowLeft />
              Dang nhap
            </button>

            <div className="auth-step-icon">
              <FaLock />
            </div>

            <h2>{stepTitle}</h2>
            <p>{stepDescription}</p>
          </div>

          <div className="auth-stepper" aria-label="Tien trinh khoi phuc mat khau">
            {[1, 2, 3].map((item) => (
              <span key={item} className={item <= step ? "active" : ""} />
            ))}
          </div>

          <ForgotPasswordSteps
            step={step}
            loading={loading}
            email={email}
            setEmail={setEmail}
            otp={otp}
            inputsRef={inputsRef}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirm={confirm}
            setConfirm={setConfirm}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
            onResetPassword={handleResetPassword}
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onOtpPaste={handleOtpPaste}
          />
        </section>
      </div>
    </div>
  );
}
