// pages/document/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DocumentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDoc();

    async function fetchDoc() {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setDoc(data);
      setLoading(false);
    }
  }, [id]);

  if (loading)
    return <p style={{ textAlign: "center", padding: "50px" }}>Loading...</p>;
  if (!doc)
    return (
      <p style={{ textAlign: "center", padding: "50px" }}>
        Document not found.
      </p>
    );

  async function handleDownload() {
    const resp = await fetch("/api/download-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: doc.content?.text, title: doc.title }),
    });

    if (!resp.ok) {
      alert("Failed to download PDF");
      return;
    }

    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title || "document"}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{doc.title}</h1>
      <p>
        <em>
          {doc.type} — {new Date(doc.created_at).toLocaleString()}
        </em>
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          background: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
        dangerouslySetInnerHTML={{ __html: doc.content?.text ?? "" }}
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => router.back()}>Back</button>
        <button onClick={handleDownload} style={{ marginLeft: "10px" }}>
          Download as PDF
        </button>
      </div>
    </div>
  );
}
