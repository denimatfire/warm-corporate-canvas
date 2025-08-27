import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillTest: React.FC = () => {
  const [content, setContent] = useState('');

  // Simple Quill configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'link', 'image'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Simple Quill Editor Test</h1>
        <p className="text-muted-foreground">Basic text editor with essential formatting tools</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Start writing here..."
          style={{ minHeight: '300px' }}
        />
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Content Preview:</h3>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default QuillTest;
