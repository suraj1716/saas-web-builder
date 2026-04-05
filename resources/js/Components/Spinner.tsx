import React from "react";

type SpinnerProps = {
  size?: number;
  color?: string;
  text?: string;
  vertical?: boolean;
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 48, color = "#fff", text, vertical = true }) => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: vertical ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          width: size,
          height: size,
          border: `${Math.floor(size / 8)}px solid ${color}33`,
          borderTopColor: color,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      {text && <span style={{ color }}>{text}</span>}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};