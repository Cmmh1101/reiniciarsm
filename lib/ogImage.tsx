// Shared JSX for the site's default Open Graph / Twitter Card image (rendered via next/og's
// ImageResponse in app/(site)/opengraph-image.tsx and twitter-image.tsx). No custom font files
// are loaded — Satori falls back to a generic serif/sans-serif, which keeps rendering simple
// and avoids a network fetch to Google Fonts on every image request.
export function brandOgImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EDE6D8",
        padding: "80px",
      }}
    >
      <div style={{ width: 120, height: 6, backgroundColor: "#C9A227", marginBottom: 48 }} />
      <div
        style={{
          fontSize: 76,
          fontFamily: "serif",
          fontWeight: 700,
          color: "#14192B",
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Reiniciar Sin Mapa
      </div>
      <div
        style={{
          fontSize: 34,
          fontFamily: "sans-serif",
          color: "#BE5A34",
          marginTop: 32,
          letterSpacing: 2,
        }}
      >
        NEXT YOU™ — CARLA MONTAÑO
      </div>
    </div>
  );
}
