import React, { useState } from 'react';
import TipTapEditor from '../components/TipTapEditor';

const TipTapDemo = () => {
  const [content, setContent] = useState('<h1>Welcome to TipTap Editor!</h1><p>This is a <strong>modern</strong> rich text editor that looks and feels like Medium.</p><h2>Features:</h2><ul><li>Rich text formatting</li><li>Headings and lists</li><li>Images and links</li><li>Tables and code blocks</li><li>Bubble and floating menus</li></ul>');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            TipTap Editor Demo
          </h1>
          <p className="text-gray-600 text-lg">
            Experience the new Medium-like editor with advanced features and a clean interface.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <TipTapEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing your story..."
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            HTML Output Preview
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
              {content}
            </pre>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Rendered Preview
          </h2>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default TipTapDemo;
