# 🎹 TipTap Editor Keyboard Shortcuts

This document provides a complete reference for all keyboard shortcuts available in the TipTap editor. These shortcuts help you work more efficiently without needing to use the mouse for common formatting tasks.

## 📝 Text Formatting

| Shortcut | Action | Description |
|----------|---------|-------------|
| `Ctrl + B` | **Bold** | Toggle bold formatting for selected text |
| `Ctrl + I` | **Italic** | Toggle italic formatting for selected text |
| `Ctrl + U` | **Underline** | Toggle underline formatting for selected text |
| `Ctrl + Shift + S` | **Strikethrough** | Toggle strikethrough formatting for selected text |
| `Ctrl + Shift + H` | **Highlight** | Toggle yellow highlight for selected text |

## 🏷️ Headings

| Shortcut | Action | Description |
|----------|---------|-------------|
| `Ctrl + Alt + 1` | **Heading 1** | Apply H1 heading to current line |
| `Ctrl + Alt + 2` | **Heading 2** | Apply H2 heading to current line |
| `Ctrl + Alt + 3` | **Heading 3** | Apply H3 heading to current line |

## 📋 Lists

| Shortcut | Action | Description |
|----------|---------|-------------|
| `Ctrl + Shift + 8` | **Bullet List** | Toggle bullet list for current line |
| `Ctrl + Shift + 7` | **Numbered List** | Toggle numbered list for current line |

## 🎯 Text Alignment

| Shortcut | Action | Description |
|----------|---------|-------------|
| `Ctrl + Shift + L` | **Align Left** | Align text to the left |
| `Ctrl + Shift + E` | **Align Center** | Center-align text |
| `Ctrl + Shift + R` | **Align Right** | Align text to the right |

## 🧱 Special Elements

| Shortcut | Action | Description |
|----------|---------|-------------|
| `Ctrl + Shift + Q` | **Blockquote** | Toggle blockquote formatting |
| `Ctrl + Shift + C` | **Code Block** | Toggle code block formatting |
| `Ctrl + Shift + -` | **Horizontal Rule** | Insert a horizontal line |

## 📊 Tables

| Shortcut | Action | Description |
|----------|---------|-------------|
| `Ctrl + Shift + T` | **Insert Table** | Insert a 3x3 table with header row |

## 🔄 History & Navigation

| Shortcut | Action | Description |
|----------|---------|-------------|
| `Ctrl + Z` | **Undo** | Undo the last action |
| `Ctrl + Y` | **Redo** | Redo the last undone action |

## 🛠️ Utility Shortcuts

| Shortcut | Action | Description |
|----------|---------|-------------|
| `Ctrl + Shift + Delete` | **Clear All** | Clear all editor content (with confirmation) |
| `Ctrl + Shift + S` | **Show Stats** | Display word and character count |

## 🖱️ Mouse Interactions

### Image Resizing
- **Click on image** to select and show resize handles
- **Drag corner handles** to resize images
- **Hold Shift** while dragging to maintain aspect ratio
- **Click reset button** to restore original image size

### Drag & Drop
- **Drag images** directly into the editor for instant upload
- **Drag text** to reorder content
- **Drag files** to the image dialog for upload

## 🎨 Formatting Tips

### Working with Selections
1. **Select text** before applying formatting
2. **Double-click** to select words
3. **Triple-click** to select paragraphs
4. **Ctrl + A** to select all content

### Efficient Workflow
1. Use **keyboard shortcuts** for common formatting
2. **Combine shortcuts** for complex formatting
3. Use **mouse** for precise positioning and image handling
4. **Undo/Redo** to experiment with different styles

## 🔧 Customization

### Adding New Shortcuts
The editor supports custom keyboard shortcuts. To add new ones:

```typescript
// Example: Add custom shortcut for text color
if (event.ctrlKey && event.shiftKey && event.key === 'K') {
  event.preventDefault();
  editor.chain().focus().setColor('#ff0000').run();
}
```

### Modifying Existing Shortcuts
Edit the `handleKeyDown` function in `TipTapEditor.tsx` to change default shortcuts:

```typescript
// Change Bold from Ctrl+B to Ctrl+Shift+B
if (event.ctrlKey && event.shiftKey && event.key === 'b') {
  event.preventDefault();
  editor.chain().focus().toggleBold().run();
}
```

## 📱 Mobile Support

### Touch Gestures
- **Tap and hold** on text to select
- **Pinch to zoom** for better editing on small screens
- **Swipe** to navigate between formatting options

### Mobile Shortcuts
- **Double-tap** to select words
- **Triple-tap** to select paragraphs
- **Long press** to access context menus

## 🚀 Performance Tips

### Efficient Editing
1. **Use shortcuts** instead of clicking toolbar buttons
2. **Batch operations** by selecting multiple elements
3. **Avoid excessive undo/redo** operations
4. **Use keyboard navigation** for faster content creation

### Memory Management
1. **Clear unused content** regularly
2. **Optimize images** before upload
3. **Use cleanup tools** for image management

## 🐛 Troubleshooting

### Common Issues

#### Shortcuts Not Working
- Ensure the editor is **focused**
- Check if **browser shortcuts** are conflicting
- Verify **keyboard layout** settings

#### Formatting Issues
- **Select text** before applying formatting
- Use **Undo** to revert unwanted changes
- Check **browser console** for errors

#### Performance Problems
- **Clear cache** if editor becomes slow
- **Restart browser** for memory issues
- **Check network** for image upload problems

## 📚 Additional Resources

### Documentation
- [TipTap Official Docs](https://tiptap.dev/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/)

### Support
- **GitHub Issues** for bug reports
- **Stack Overflow** for community help
- **TipTap Discord** for real-time support

---

## 🎯 Quick Reference Card

### Essential Shortcuts
```
Ctrl+B    → Bold
Ctrl+I    → Italic
Ctrl+U    → Underline
Ctrl+Z    → Undo
Ctrl+Y    → Redo
```

### Formatting
```
Ctrl+Alt+1/2/3  → Headings
Ctrl+Shift+8/7  → Lists
Ctrl+Shift+Q    → Blockquote
Ctrl+Shift+C    → Code Block
```

### Utilities
```
Ctrl+Shift+Delete → Clear All
Ctrl+Shift+S      → Show Stats
```

## 📊 Editor Interface

### Toolbar Layout
- **Left Side**: Formatting tools (Bold, Italic, Headings, Lists, etc.)
- **Right Side**: Word count display with 📊 icon
- **Center**: Spacing for balanced layout
- **Bottom**: Content area with focus ring

---

*Last updated: January 2025*  
*Editor Version: TipTap 2.x with React 18*
