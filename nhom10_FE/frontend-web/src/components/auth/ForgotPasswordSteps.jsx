import OtpInputs from "./OtpInputs";

export default function ForgotPasswordSteps({
  step,
  loading,
  email,
  setEmail,
  otp,
  inputsRef,
  newPassword,
  setNewPassword,
  confirm,
  setConfirm,
  onSendOtp,
  onVerifyOtp,
  onResetPassword,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
}) {
  if (step === 1) {
    return (
      <div className="auth-form">
        <input
          className="auth-input"
          placeholder="Nhap email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="auth-submit" onClick={onSendOtp} disabled={loading}>
          {loading ? "Dang gui..." : "Gui OTP"}
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="auth-form">
        <p className="auth-helper-text">Nhap OTP da gui toi email</p>
        <OtpInputs
          otp={otp}
          inputsRef={inputsRef}
          onChange={onOtpChange}
          onKeyDown={onOtpKeyDown}
          onPaste={onOtpPaste}
          className="auth-otp-box"
        />
        <button className="auth-submit" onClick={onVerifyOtp} disabled={loading}>
          {loading ? "Dang xac thuc..." : "Xac nhan OTP"}
        </button>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <input
        type="password"
        className="auth-input"
        placeholder="Mat khau moi"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        className="auth-input"
        placeholder="Xac nhan mat khau"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button className="auth-submit" onClick={onResetPassword} disabled={loading}>
        {loading ? "Dang xu ly..." : "Doi mat khau"}
      </button>
    </div>
  );
}
