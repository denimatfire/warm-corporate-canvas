# 🎯 Simple TipTap Editor with Resizable Images

This is a clean, minimal implementation of TipTap editor with resizable images, exactly as planned.

## 🚀 Quick Start

1. **Visit the demo:** Navigate to `/simple-tiptap` in your browser
2. **Test resizing:** Click on any image to see the blue resize handle
3. **Resize:** Drag the handle to resize the image
4. **Add images:** Use the "Insert Test Image" button to add more images

## ✨ Features

- ✅ **Resizable Images** - Click image → blue handle appears → drag to resize
- ✅ **Width Persistence** - Resized width is saved in the editor content
- ✅ **Simple Interface** - Clean, minimal editor with just the essentials
- ✅ **Test Images** - Button to insert random test images for testing

## 🔧 How It Works

1. **Image Extension**: Extends TipTap's Image extension with width/height attributes
2. **React NodeView**: Custom React component renders each image with resize functionality
3. **Resize Handle**: Blue corner handle appears when image is selected
4. **Real-time Updates**: Width updates as you drag, persists in editor state

## 📁 Files

- `src/components/SimpleTipTapEditor.tsx` - The main editor component
- `src/pages/SimpleTipTapDemo.tsx` - Demo page
- Route: `/simple-tiptap`

## 🎮 Usage

```tsx
import SimpleTipTapEditor from './components/SimpleTipTapEditor';

function MyPage() {
  const [content, setContent] = useState('');
  
  return (
    <SimpleTipTapEditor
      value={content}
      onChange={setContent}
    />
  );
}
```

## 🧪 Testing

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:5173/simple-tiptap`
3. Click on the kitten image
4. Drag the blue handle to resize
5. Check the HTML output below to see width changes

## 🔍 What You Get

- **Click image** → Blue resize handle appears
- **Drag handle** → Image resizes, width updates in real-time
- **Saved width** → Width persists across editor reloads
- **Clean HTML** → Output shows updated width attributes

This implementation is exactly what was planned - simple, working, and focused on the core resizable image functionality.
