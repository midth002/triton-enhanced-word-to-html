import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Import the Prism.js theme you want

const CodeBlock = ({ content }) => {
  useEffect(() => {
    Prism.highlightAll(); // Trigger Prism.js syntax highlighting
  }, []);

  return (
    <pre
    className="language-html"
    ref={previewRef}
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      whiteSpace: "pre-wrap", // Ensures the code wraps properly
      wordWrap: "break-word", // Ensures long words wrap
    }}
  >
    <code className="language-html">{content}</code>
  </pre>
  );
};

export default CodeBlock;
