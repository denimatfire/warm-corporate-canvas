import React, { useState } from 'react';
import SimpleTipTapEditor from '../components/SimpleTipTapEditor';

export default function SimpleTipTapDemo() {
  const [content, setContent] = useState('');

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Simple TipTap Editor</h1>
        <p className="text-gray-600">
          Basic rich text editor with resizable images - exactly as planned.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <SimpleTipTapEditor
          value={content}
          onChange={setContent}
        />
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">How to Use</h2>
        <ol className="text-sm text-blue-800 space-y-2">
          <li>1. <strong>Click on the image</strong> to see the blue resize handle appear</li>
          <li>2. <strong>Drag the handle</strong> to resize the image</li>
          <li>3. <strong>Width updates</strong> in real-time and persists</li>
        </ol>
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">HTML Output</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {content || '<p>No content yet...</p>'}
        </pre>
      </div>
    </div>
  );
}
