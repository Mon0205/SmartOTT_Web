export default function AuthSwitch({ isLogin, onSwitchMode, onForgotPassword }) {
  return (
    <div className="auth-switch">
      {isLogin ? (
        <div className="auth-switch-row">
          <button
            type="button"
            onClick={() => onSwitchMode(false)}
          >
            Dang ky
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={onForgotPassword}
          >
            Quen mat khau?
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onSwitchMode(true)}
        >
          Dang nhap
        </button>
      )}
    </div>
  );
}
