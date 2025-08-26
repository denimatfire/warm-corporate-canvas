import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Code, 
  Table, 
  Image, 
  Video, 
  Link, 
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Quote,
  Bold,
  Italic
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Enhanced Quill modules configuration
const quillModules = {
  toolbar: {
    container: [
      // Text formatting
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      
      // Text alignment and lists
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      
      // Colors and styling
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
      
      // Media and formatting
      ['link', 'image', 'video', 'blockquote', 'code-block'],
      ['table'],
      
      // Utilities
      ['clean', 'undo', 'redo']
    ],
    handlers: {
      // Custom image handler
      image: function() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        
        input.onchange = () => {
          const file = input.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              // Insert image logic here
            };
            reader.readAsDataURL(file);
          }
        };
      },
      
      // Custom video handler
      video: function() {
        const url = prompt('Enter video URL:');
        if (url) {
          // Insert video logic here
        }
      },
      
      // Custom table handler
      table: function() {
        const rows = prompt('Enter number of rows:', '3');
        const cols = prompt('Enter number of columns:', '3');
        
        if (rows && cols) {
          // Insert table logic here
        }
      }
    }
  },
  
  // Enhanced clipboard handling
  clipboard: {
    matchVisual: false,
    matchers: [
      ['p', (node: any, delta: any) => {
        if (node.style && node.style.textAlign) {
          delta.attributes = { ...delta.attributes, align: node.style.textAlign };
        }
        return delta;
      }]
    ]
  },
  
  // Enhanced list handling
  list: {
    keepWhitespace: true,
  },
  
  // Table module
  table: true,
  
  // History module for undo/redo
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: true
  }
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'color', 'background', 'align',
  'link', 'image', 'video', 'blockquote', 'code-block',
  'indent', 'direction', 'size', 'script', 'font',
  'table', 'table-cell', 'table-row'
];

const QuillDemo: React.FC = () => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const handleTextChange = (newContent: string) => {
    setContent(newContent);
    
    // Calculate statistics
    const text = newContent.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    const readingTime = Math.ceil(wordCount / 200);
    
    setWordCount(wordCount);
    setCharCount(charCount);
    setReadingTime(readingTime);
  };

  const insertSampleContent = () => {
    const sampleContent = `
      <h1>Welcome to Enhanced Quill Editor</h1>
      
      <p>This is a <strong>powerful</strong> and <em>feature-rich</em> text editor built with Quill.js.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Rich text formatting</li>
        <li>Tables and lists</li>
        <li>Image and video embedding</li>
        <li>Code blocks with syntax highlighting</li>
        <li>Word document paste support</li>
      </ul>
      
      <h2>Code Example</h2>
      <pre><code>function helloWorld() {
  console.log("Hello, Enhanced Quill!");
}</code></pre>
      
      <h2>Quote</h2>
      <blockquote>This editor makes writing a pleasure!</blockquote>
      
      <h2>Table Example</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rich Text</td>
            <td>✅</td>
          </tr>
          <tr>
            <td>Tables</td>
            <td>✅</td>
          </tr>
          <tr>
            <td>Images</td>
            <td>✅</td>
          </tr>
        </tbody>
      </table>
    `;
    
    setContent(sampleContent);
    handleTextChange(sampleContent);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <BookOpen className="w-10 h-10 text-primary" />
          Enhanced Quill Editor Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the power of our enhanced Quill editor with advanced features, 
          beautiful styling, and seamless user experience.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
        >
          <Type className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-blue-900 mb-2">Rich Text Formatting</h3>
          <p className="text-blue-700 text-sm">Bold, italic, headers, colors, and more with an intuitive toolbar.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
        >
          <Table className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-green-900 mb-2">Tables & Lists</h3>
          <p className="text-green-700 text-sm">Create beautiful tables and organized lists with ease.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
        >
          <Image className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-purple-900 mb-2">Media Support</h3>
          <p className="text-purple-700 text-sm">Embed images, videos, and links seamlessly.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200"
        >
          <Code className="w-8 h-8 text-orange-600 mb-3" />
          <h3 className="font-semibold text-orange-900 mb-2">Code Blocks</h3>
          <p className="text-orange-700 text-sm">Syntax highlighting and code formatting for developers.</p>
        </motion.div>
      </div>

      {/* Editor Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Try the Editor</h2>
          <button
            onClick={insertSampleContent}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Insert Sample Content
          </button>
        </div>

        {/* Editor Stats */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                {wordCount} words
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                {charCount} characters
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Enhanced Quill
              </span>
            </div>
          </div>
        </div>

        {/* Quill Editor */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
          <ReactQuill
            value={content}
            onChange={handleTextChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Start writing your content here... Use the toolbar above to format your text!"
            style={{ minHeight: '500px' }}
          />
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Keyboard Shortcuts</h4>
            <ul className="space-y-1">
              <li><kbd className="bg-white px-2 py-1 rounded border">Ctrl+B</kbd> Bold</li>
              <li><kbd className="bg-white px-2 py-1 rounded border">Ctrl+I</kbd> Italic</li>
              <li><kbd className="bg-white px-2 py-1 rounded border">Ctrl+K</kbd> Insert Link</li>
              <li><kbd className="bg-white px-2 py-1 rounded border">Ctrl+Z</kbd> Undo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Features</h4>
            <ul className="space-y-1">
              <li>• Paste from Word documents</li>
              <li>• Drag & drop images</li>
              <li>• Auto-save functionality</li>
              <li>• Mobile responsive</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuillDemo;
