'use client';

import { useState } from 'react';

export default function Home() {
  const [markdown, setMarkdown] = useState('');
  const [processedMarkdown, setProcessedMarkdown] = useState('');
  const [html, setHtml] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/process-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
      });

      if (!response.ok) {
        throw new Error('Error processing markdown');
      }

      const data = await response.json();
      setProcessedMarkdown(data.processedMarkdown);
      setHtml(data.html);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Markdown to HTML Converter
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="markdown"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Markdown:
            </label>
            <textarea
              id="markdown"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your markdown here..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Convert to HTML
          </button>
        </form>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Markdown */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Input Markdown
            </h2>
            <pre className="p-4 bg-gray-100 border rounded-lg overflow-auto">
              {markdown || 'Enter some Markdown to see it here.'}
            </pre>
          </div>

          {/* Processed Markdown */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Processed Markdown
            </h2>
            <pre className="p-4 bg-gray-100 border rounded-lg overflow-auto">
              {processedMarkdown || 'Processed Markdown will appear here.'}
            </pre>
          </div>

          {/* Converted HTML */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Converted HTML
            </h2>
            <div
              className="p-4 bg-gray-100 border rounded-lg overflow-auto"
              dangerouslySetInnerHTML={{
                __html: html || '<p>Converted HTML will appear here.</p>',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
