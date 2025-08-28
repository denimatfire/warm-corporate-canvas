import { Image } from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ResizableImageComponent from './ResizableImage';

export const ResizableImage = Image.extend({
  name: 'resizableImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 400,
        parseHTML: element => {
          const width = element.getAttribute('width');
          return width ? parseInt(width, 10) : 400;
        },
        renderHTML: attributes => {
          return {
            width: attributes.width || 400,
          };
        },
      },
      height: {
        default: 300,
        parseHTML: element => {
          const height = element.getAttribute('height');
          return height ? parseInt(height, 10) : 300;
        },
        renderHTML: attributes => {
          return {
            height: attributes.height || 300,
          };
        },
      },
      dataPath: {
        default: null,
        parseHTML: element => {
          return element.getAttribute('data-path');
        },
        renderHTML: attributes => {
          if (!attributes.dataPath) {
            return {};
          }
          return {
            'data-path': attributes.dataPath,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setImage: (options) => ({ commands, chain }) => {
        try {
          return chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        } catch (error) {
          console.warn('Error setting image:', error);
          // Fallback to simple image insertion
          return commands.insertContent(`<img src="${options.src}" alt="${options.alt || ''}" />`);
        }
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },
});

export default ResizableImage;
