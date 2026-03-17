"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}>
          <div style={{ textAlign: "center", padding: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937", marginBottom: "16px" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Failed to load the page. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: "12px 24px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
