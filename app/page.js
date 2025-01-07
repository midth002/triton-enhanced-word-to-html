'use client';

import React, { useState, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Import a Prism-like theme
import { toast, ToastContainer } from "react-toastify";
import { cleanHTML } from "./utils"; // Adjust the path to your cleanHTML utility
import { prettifyHTML } from "./prettifyHTML";
import { indentPrettifyHTML } from "./indentPrettifyHTML";
import companyLogo from '../public/triton.png';

export default function Home() {
  const [content, setContent] = useState(""); // State for cleaned HTML content
  const editorRef = useRef(null); // Reference for the contentEditable editor

  const [isIndented, setIndent] = useState(false);
  const placeholderText = "Enter Text Here...";



  const handleToggle = () => {
    setIndent(!isIndented); 
    // Update the Content Based on The Current State
    const rawHtml = editorRef.current.innerHTML;
    const cleanedHtml = cleanHTML(rawHtml);
    const prettyHtml = isIndented ? prettifyHTML(cleanedHtml) : indentPrettifyHTML(cleanedHtml) ;
    setContent(prettyHtml);
};


  // Function to handle text formatting
  const formatText = (command) => {
    document.execCommand(command, false, null); // Executes formatting commands
    editorRef.current.focus(); // Refocus the editor after formatting
  };

  // Handle input in the editor
  const handleInput = (e) => {
    const rawHtml = e.currentTarget.innerHTML; // Get raw HTML from the editor
    const cleanedHtml = cleanHTML(rawHtml); // Clean the HTML using cleanHTML
    let prettyHtml;
    if (isIndented) {
     prettyHtml = indentPrettifyHTML(cleanedHtml);
    }
    else {
      prettyHtml = prettifyHTML(cleanedHtml);
    }
    // Prettify the HTML
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
      <div className="editor-preview-container">
        <div>
        {/* Editor */}
        <div
          ref={editorRef}
          className="wysiwyg-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          style={{
            padding: "10px",
            border:"none"
          }}
          placeholder={placeholderText}
        ></div>
</div>
        {/* HTML Code Preview with Syntax Highlighting */}
        <div className="html-preview">
          <h2 className="font-bold text-large uppercase mb-1">HTML Code Preview</h2>
          <div className="button-wrapper">
          <button onClick={handleCopy} style={{ marginBottom: "10px" }} class="btn btn-primary">
            Copy HTML
          </button>
          <button onClick={handleToggle} style={{ marginBottom: "10px" }} class="btn btn-secondary">
           {isIndented ? "Compress HTML" : "Indent HTML"}
          </button>
          </div>
          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            className={`${!isIndented ? 'compress': ''}`}
            customStyle={{
              border: "1px solid #ccc",
              padding: "10px",
              whiteSpace: "initial", // Ensures the code wraps properly
              wordWrap: "break-word", // Ensures long words wrap
              
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="copyright">
        <p>&copy; {(new Date().getFullYear())} <img src="/triton.png" /> WordHTML</p>
        </div>
      </footer>
    </div>
  );
}
