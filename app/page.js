'use client';

import { useState } from 'react';


export default function Home() {
    const [markdown, setMarkdown] = useState('');
    // const [processedMarkdown, setProcessedMarkdown] = useState('');
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
        // setProcessedMarkdown(data.processedMarkdown);
        setHtml(data.html);
        console.log(data.html);
      } catch (error) {
        console.error(error);
      }
    };

      // Copy the HTML content to clipboard
  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = html;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('HTML copied to clipboard!');
  };

  
    return (
      <div>
      <div className="min-h-screen bg-gray-100 py-10 ">
        <div className=" bg-white shadow-lg rounded-lg p-8 mx-auto container">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Markdown Processor
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
                rows="10"
                className="w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your markdown here..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Process Markdown
            </button>
          </form>
        
  
          {html && (
            <div className="mt-8">
            <div className="columns-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Generated HTML
              </h2>
              <button
                onClick={copyToClipboard}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Copy HTML
              </button>
              </div>
            
              <xmp
              id="html-output"
                className="p-4 bg-gray-100 border rounded-lg overflow-auto text-gray-600"
                dangerouslySetInnerHTML={{ __html: html }}
              />
           
            </div>
          )}
        </div>
        </div>
        </div>
    );
  }
  