import { useState } from "react";
import { FaUserCircle, FaUsers } from "react-icons/fa";

export default function ChatAvatar({
  src,
  type = "user",
  size = 40,
  className = "",
  style = {},
  title = "",
  alt = "",
}) {
  const [failed, setFailed] = useState(false);
  const cleanSrc = src && String(src).trim();
  const showImage = cleanSrc && !failed;
  const Icon = type === "group" ? FaUsers : FaUserCircle;
  const bg = type === "group" ? "#e7f1ff" : "#f1f3f5";
  const color = type === "group" ? "#0d6efd" : "#6c757d";

  if (showImage) {
    return (
      <img
        src={cleanSrc}
        alt={alt}
        title={title}
        className={`rounded-circle flex-shrink-0 ${className}`}
        width={size}
        height={size}
        style={{ objectFit: "cover", ...style }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      title={title}
      className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, color, ...style }}
    >
      <Icon size={Math.round(size * 0.56)} />
    </div>
  );
}
