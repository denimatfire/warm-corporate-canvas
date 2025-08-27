import React, { useState } from 'react';
import TipTapEditor from '../components/TipTapEditor';

export default function TipTapDemo() {
  const [content, setContent] = useState(`
    <p>Try resizing this image 👇</p>
    <img src="https://placekitten.com/300/200" width="300" height="200" alt="Demo kitten" />
    <p>Click on the image above to see the resize handles appear. Drag the blue corners to resize!</p>
    <p>You can also:</p>
    <ul>
      <li>Hold Shift while resizing to maintain aspect ratio</li>
      <li>Use the reset button to restore original size</li>
      <li>Add more images using the image button in the toolbar</li>
    </ul>
  `);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TipTap Editor Demo</h1>
        <p className="text-gray-600">
          A modern rich text editor with resizable images, built with TipTap and React.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <TipTapEditor
          value={content}
          onChange={setContent}
          placeholder="Start writing your story..."
          className="w-full"
        />
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Rich Text Editing</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Bold, italic, underline, strikethrough</li>
              <li>• Headings (H1, H2, H3)</li>
              <li>• Bullet and numbered lists</li>
              <li>• Text alignment (left, center, right)</li>
              <li>• Code blocks and blockquotes</li>
              <li>• Tables with resizable columns</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Image Management</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Drag & drop image uploads</li>
              <li>• Image URL insertion</li>
              <li>• Resizable images with handles</li>
              <li>• Aspect ratio preservation (Shift+drag)</li>
              <li>• Original size reset</li>
              <li>• Alt text support</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">How to Use Resizable Images</h2>
        <ol className="text-sm text-blue-800 space-y-2">
          <li>1. <strong>Insert an image:</strong> Use the image button in the toolbar or drag & drop a file</li>
          <li>2. <strong>Select the image:</strong> Click on any image in the editor</li>
          <li>3. <strong>Resize:</strong> Drag the blue corner handles to resize</li>
          <li>4. <strong>Maintain aspect ratio:</strong> Hold Shift while dragging</li>
          <li>5. <strong>Reset size:</strong> Click the reset button (↗) to restore original dimensions</li>
        </ol>
      </div>
    </div>
  );
}
