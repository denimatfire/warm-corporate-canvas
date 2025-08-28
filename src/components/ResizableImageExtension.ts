import { Image } from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import React from 'react';

export const ResizableImage = Image.extend({
  name: 'resizableImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => {
          const width = element.getAttribute('width');
          return width ? parseInt(width, 10) : null;
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const height = element.getAttribute('height');
          return height ? parseInt(height, 10) : null;
        },
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
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
    return ({ node, getPos, editor, updateAttributes }) => {
      try {
        // Create a more native-like DOM structure
        const dom = document.createElement('span');
        dom.className = 'resizable-image-node';
        dom.style.display = 'inline-block';
        dom.style.verticalAlign = 'baseline';
        dom.style.lineHeight = '1';

        // Create the React component wrapper
        const ReactComponent = () => {
          try {
            const { default: ResizableImage } = require('./ResizableImage');
            return React.createElement(ResizableImage, {
              node,
              getPos,
              editor,
              updateAttributes,
            });
          } catch (error) {
            console.warn('Error creating React component:', error);
            // Fallback to simple image if React component fails
            return React.createElement('img', {
              src: node.attrs.src,
              alt: node.attrs.alt || '',
              width: node.attrs.width,
              height: node.attrs.height,
              style: { 
                maxWidth: '100%', 
                height: 'auto',
                display: 'block',
                margin: '0.5em 0'
              }
            });
          }
        };

        // Render the React component using React 18+ createRoot
        const { createRoot } = require('react-dom/client');
        const root = createRoot(dom);
        root.render(React.createElement(ReactComponent));

        return {
          dom,
          destroy: () => {
            try {
              root.unmount();
            } catch (error) {
              console.warn('Error unmounting React component:', error);
            }
          },
          update: (updatedNode) => {
            try {
              if (updatedNode.type !== this.type) {
                return false;
              }
              // Re-render the component with updated node
              root.render(React.createElement(ReactComponent));
              return true;
            } catch (error) {
              console.warn('Error updating React component:', error);
              return false;
            }
          },
          // Better integration with ProseMirror
          ignoreMutation: () => true, // Ignore DOM mutations to prevent interference
          selectNode: () => {
            // Ensure proper selection handling
            return true;
          },
          // Prevent event interference
          stopEvent: () => false,
          // Ensure proper positioning
          getPos: () => getPos(),
        };
      } catch (error) {
        console.error('Error creating NodeView:', error);
        // Fallback to simple image
        const fallbackDom = document.createElement('span');
        fallbackDom.className = 'resizable-image-fallback';
        fallbackDom.innerHTML = `<img src="${node.attrs.src}" alt="${node.attrs.alt || ''}" style="max-width: 100%; height: auto; display: block; margin: 0.5em 0;" />`;
        
        return {
          dom: fallbackDom,
          destroy: () => {},
          update: () => false,
        };
      }
    };
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
