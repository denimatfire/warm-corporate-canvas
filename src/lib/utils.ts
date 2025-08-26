import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts plain text content into properly formatted HTML
 * Handles line breaks, headings, lists, and basic formatting
 */
export function formatArticleContent(content: string): string {
  if (!content) return '';
  
  return content
    // Convert double line breaks to paragraph breaks
    .split('\n\n')
    .map(paragraph => {
      if (!paragraph.trim()) return '';
      
      // Handle headings (lines starting with #)
      if (paragraph.trim().startsWith('#')) {
        const level = paragraph.match(/^#+/)?.[0].length || 1;
        const text = paragraph.replace(/^#+\s*/, '');
        return `<h${Math.min(level, 6)}>${text}</h${Math.min(level, 6)}>`;
      }
      
      // Handle lists (lines starting with - or *)
      if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
        const items = paragraph.split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
          .map(item => `<li>${item.replace(/^[-*]\s*/, '')}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      
      // Handle numbered lists (lines starting with numbers)
      if (/^\d+\./.test(paragraph.trim())) {
        const items = paragraph.split('\n')
          .filter(line => /^\d+\./.test(line.trim()))
          .map(item => `<li>${item.replace(/^\d+\.\s*/, '')}</li>`)
          .join('');
        return `<ol>${items}</ol>`;
      }
      
      // Handle bold text (**text**)
      let formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle italic text (*text*)
      formattedParagraph = formattedParagraph.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Handle code blocks (text wrapped in backticks)
      formattedParagraph = formattedParagraph.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      // Convert single line breaks to <br> tags
      formattedParagraph = formattedParagraph.replace(/\n/g, '<br>');
      
      return `<p>${formattedParagraph}</p>`;
    })
    .join('');
}
