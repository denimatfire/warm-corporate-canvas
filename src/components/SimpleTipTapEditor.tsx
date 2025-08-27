import React, { useState, useRef } from "react";
import { EditorContent, useEditor, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

// Extend Image with width/height + custom React NodeView
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "300",
        parseHTML: element => element.getAttribute("width"),
        renderHTML: attributes => {
          return { width: attributes.width }
        },
      },
      height: {
        default: "auto",
        parseHTML: element => element.getAttribute("height"),
        renderHTML: attributes => {
          return { height: attributes.height }
        },
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent)
  },
});

// React NodeView for resizable image
const ResizableImageComponent = (props: any) => {
  const { node, updateAttributes, selected } = props;
  const [isResizing, setIsResizing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = imgRef.current?.offsetWidth || 300;

    const doDrag = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      updateAttributes({ width: newWidth });
    };

    const stopDrag = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  return (
    <NodeViewWrapper className="relative inline-block group">
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt}
        width={node.attrs.width}
        height={node.attrs.height}
        className="rounded shadow"
      />
      {selected && (
        <span
          onMouseDown={startResize}
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize rounded"
        />
      )}
    </NodeViewWrapper>
  );
};

interface SimpleTipTapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function SimpleTipTapEditor({ value = "", onChange }: SimpleTipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, ResizableImage],
    content: value || `
      <p>Try resizing this image 👇</p>
      <img src="https://placekitten.com/300/200" width="300" />
    `,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const insertTestImage = () => {
    if (editor) {
      editor.chain().focus().setImage({ 
        src: "https://picsum.photos/400/300?random=" + Date.now(),
        alt: "Test image"
      }).run();
    }
  };

  return (
    <div className="border p-4 rounded">
      <div className="mb-4">
        <button
          onClick={insertTestImage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Insert Test Image
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
