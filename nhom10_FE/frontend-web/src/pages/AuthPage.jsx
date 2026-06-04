import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../api/authApi";
import { getSocket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/auth/AuthForm";
import AuthSwitch from "../components/auth/AuthSwitch";
import { FaComments, FaLock, FaShieldAlt, FaUsers } from "react-icons/fa";
import "./AuthPage.css";

const initialForm = {
  email: "",
  password: "",
  username: "",
  fullName: "",
  phone: "",
  confirmPassword: "",
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(initialForm);

  const { user, setUser, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUpdate = (data) => {
      if (user && data.user._id === user._id) {
        setUser(data.user);
      }
    };

    socket.on("user_updated", handleUpdate);
    return () => socket.off("user_updated", handleUpdate);
  }, [user, setUser]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email khong duoc de trong";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email khong hop le";
    }

    if (!form.password) {
      newErrors.password = "Mat khau khong duoc de trong";
    } else if (form.password.length < 6) {
      newErrors.password = "Mat khau toi thieu 6 ky tu";
    }

    if (!isLogin) {
      if (!form.username) newErrors.username = "Username khong duoc de trong";

      if (!form.fullName) {
        newErrors.fullName = "Ten khong duoc de trong";
      } else if (!/^[a-zA-ZÀ-ỹ\s]{2,50}$/.test(form.fullName)) {
        newErrors.fullName = "Ten khong hop le";
      }

      if (form.phone && !/^(0|\+84)[0-9]{9}$/.test(form.phone)) {
        newErrors.phone = "So dien thoai khong hop le";
      }

      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Mat khau khong khop";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginAPI({
          email: form.email,
          password: form.password,
        });

        if (res.success) {
          login(res.user, res.token);
          alert("Dang nhap thanh cong!");
          const isAdmin = res.user?.role === "admin" || res.user?.isAdmin;
          const redirectTo = location.state?.from || (isAdmin ? "/admin" : "/");
          navigate(redirectTo, { replace: true });
        } else {
          setErrors({ general: res.message });
        }
      } else {
        const res = await registerAPI(form.email);

        if (res.success) {
          navigate("/otp", {
            state: {
              email: form.email,
              password: form.password,
              username: form.username,
              fullName: form.fullName,
              phone: form.phone,
            },
          });
        } else {
          setErrors({ general: res.message });
        }
      }
    } catch {
      setErrors({ general: "Khong the ket noi server" });
    } finally {
      setLoading(false);
    }
  };

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
              <div className="auth-brand-subtitle">Chat, nhom va AI tro ly</div>
            </div>
          </div>

          <div className="auth-hero">
            <h1>Ket noi moi cuoc tro chuyen trong mot noi.</h1>
            <p>
              Dang nhap de tiep tuc nhan tin, quan ly nhom chat va su dung tro ly AI
              trong khong gian lam viec gon gang.
            </p>
          </div>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <span><FaLock /></span>
              <div>
                <strong>Bao mat phien dang nhap</strong>
                <small>Dong bo realtime va bao ve tai khoan cua ban.</small>
              </div>
            </div>
            <div className="auth-feature">
              <span><FaUsers /></span>
              <div>
                <strong>Tro chuyen ca nhan va nhom</strong>
                <small>Theo doi tin moi, loi moi va cac nhom dang tham gia.</small>
              </div>
            </div>
            <div className="auth-feature">
              <span><FaShieldAlt /></span>
              <div>
                <strong>Quan tri ro rang</strong>
                <small>Luong admin tach rieng, de quan ly va kiem soat.</small>
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
            <h2>{isLogin ? "Dang nhap" : "Tao tai khoan"}</h2>
            <p>
              {isLogin
                ? "Chao mung tro lai. Nhap thong tin de tiep tuc."
                : "Dang ky bang email va xac thuc OTP de bat dau."}
            </p>
          </div>

          {errors.general && (
            <div className="auth-alert">
              {errors.general}
            </div>
          )}

          <AuthForm
            isLogin={isLogin}
            loading={loading}
            errors={errors}
            form={form}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
          />

          <AuthSwitch
            isLogin={isLogin}
            onSwitchMode={setIsLogin}
            onForgotPassword={() => navigate("/forgot-password")}
          />
        </section>
      </div>
    </div>
  );
}
