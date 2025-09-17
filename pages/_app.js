import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <header style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
        <h2>Docify</h2>
      </header>
      <main style={{ padding: "20px" }}>
        <Component {...pageProps} />
      </main>
      <footer
        style={{
          padding: "20px",
          borderTop: "1px solid #ddd",
          marginTop: "40px",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} Docify. All rights reserved.
      </footer>
    </div>
  );
}
