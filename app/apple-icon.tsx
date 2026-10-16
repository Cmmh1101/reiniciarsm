import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#14192B",
          color: "#C9A227",
          fontFamily: "serif",
          fontWeight: 700,
          fontSize: 92,
        }}
      >
        CM
      </div>
    ),
    { ...size }
  );
}
