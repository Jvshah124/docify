import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "linear-gradient(135deg, #0070f3, #00c6ff)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
          Welcome to Docify
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
          Generate modern CVs, invoices, and cover letters in seconds.
        </p>
        <Link href="/signup">
          <button style={{ fontSize: "1rem", padding: "14px 24px" }}>
            Get Started Free
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: "300px", textAlign: "center" }}>
          <h3>⚡ Fast</h3>
          <p>Instantly generate polished documents tailored to your needs.</p>
        </div>
        <div style={{ maxWidth: "300px", textAlign: "center" }}>
          <h3>🎨 Modern</h3>
          <p>Choose from sleek, ATS-friendly templates designed for today.</p>
        </div>
        <div style={{ maxWidth: "300px", textAlign: "center" }}>
          <h3>🔒 Secure</h3>
          <p>
            Your data is safe, and only paid users can download final files.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h2>Ready to create your first document?</h2>
        <Link href="/dashboard">
          <button
            style={{
              fontSize: "1rem",
              padding: "14px 24px",
              marginTop: "20px",
            }}
          >
            Try Docify Now
          </button>
        </Link>
      </section>
    </div>
  );
}
