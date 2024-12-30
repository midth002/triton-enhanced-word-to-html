'use client';

import React, { useState, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Import a Prism-like theme
import { toast, ToastContainer } from "react-toastify";
import { cleanHTML } from "./utils"; // Adjust the path to your cleanHTML utility
import { prettifyHTML } from "./prettifyHTML";

export default function Home() {
  const [content, setContent] = useState(""); // State for cleaned HTML content
  const editorRef = useRef(null); // Reference for the contentEditable editor

  // Function to handle text formatting
  const formatText = (command) => {
    document.execCommand(command, false, null); // Executes formatting commands
    editorRef.current.focus(); // Refocus the editor after formatting
  };

  // Handle input in the editor
  const handleInput = (e) => {
    const rawHtml = e.currentTarget.innerHTML; // Get raw HTML from the editor
    const cleanedHtml = cleanHTML(rawHtml); // Clean the HTML using cleanHTML
   const prettyHtml = prettifyHTML(cleanedHtml); // Prettify the HTML
   setContent(prettyHtml); // Update the state with cleaned HTML
  };

  // Handle Copy to Clipboard
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        toast.success("HTML code copied to clipboard!", { autoClose: 2000 });
      });
    } else {
      toast.error("Clipboard API not supported in your browser.", { autoClose: 2000 });
    }
  };

  // Enable Ctrl+A to select the HTML preview
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="app-container mx-auto box-border">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Header */}
      <header className="app-header">
        <h1>Enhanced WordHTML Editor</h1>
      </header>

      {/* Main Content */}
      <div className="editor-preview-container columns-2">
        {/* Editor */}
        <div
          ref={editorRef}
          className="wysiwyg-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "20px",
          }}
        ></div>

        {/* HTML Code Preview with Syntax Highlighting */}
        <div className="html-preview">
          <h2>HTML Code Preview</h2>
          <button onClick={handleCopy} style={{ marginBottom: "10px" }}>
            Copy HTML
          </button>
          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            customStyle={{
              border: "1px solid #ccc",
              padding: "10px",
              whiteSpace: "pre-wrap", // Ensures the code wraps properly
              wordWrap: "break-word", // Ensures long words wrap
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 Triton WordHTML</p>
      </footer>
    </div>
  );
}
