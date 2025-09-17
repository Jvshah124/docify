// pages/dashboard.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("cv");
  const [promptText, setPromptText] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (user) fetchDocuments();
  }, [user]);

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setDocuments(data);
    }
  }

  async function handleGenerateDoc(e) {
    e.preventDefault();
    if (!title || !promptText) {
      setMessage("Title and prompt are required");
      return;
    }
    setMessage("Generating...");

    const resp = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, prompt: promptText }),
    });

    const data = await resp.json();

    if (data.error) {
      setMessage("Generation failed: " + data.error);
      return;
    }

    const generated = data.text || "";

    const { error } = await supabase.from("documents").insert({
      user_id: user.id,
      title,
      type,
      content: { text: generated },
    });

    if (error) {
      setMessage("Save error: " + error.message);
    } else {
      setMessage("Document generated and saved!");
      setTitle("");
      setPromptText("");
      fetchDocuments();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/signup";
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Please log in to view your dashboard.</h1>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h1>Welcome, {user.email}</h1>

      {/* Form to create a new document */}
      <form onSubmit={handleGenerateDoc} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
        <br />
        <br />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="cv">CV</option>
          <option value="invoice">Invoice</option>
          <option value="cover_letter">Cover Letter</option>
        </select>
        <br />
        <br />

        <textarea
          placeholder="Describe what should be included in this document..."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          style={{ width: "420px", height: "120px", padding: "8px" }}
        />
        <br />
        <br />

        <button type="submit">Generate with AI</button>
      </form>

      {message && <p style={{ marginTop: "12px" }}>{message}</p>}

      {/* Display saved documents */}
      <h2 style={{ marginTop: "40px" }}>Your Documents</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {documents.map((d) => (
          <li key={d.id} style={{ marginBottom: "20px" }}>
            <strong>{d.title}</strong> ({d.type}) —{" "}
            {new Date(d.created_at).toLocaleString()}
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "10px",
                background: "white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                textAlign: "left",
                maxWidth: "800px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: d.content?.text ?? "" }}
            />
            {/* Button to view full document */}
            <Link href={`/document/${d.id}`}>
              <button style={{ marginTop: "10px" }}>View Full Document</button>
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Log Out
      </button>
    </div>
  );
}
