'use client';

import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export function MathRenderer({ content, className = '', inline = false }: MathRendererProps) {
  if (!content) return null;

  // Split string into text and KaTeX chunks
  // Matches $$block math$$ or $inline math$
  const parseContent = (text: string) => {
    // Replace \n with line breaks outside of math blocks
    const parts: React.ReactNode[] = [];
    // Regex for $$...$$ and $...$
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // Push preceding plain text
      if (match.index > lastIndex) {
        const plainText = text.substring(lastIndex, match.index);
        parts.push(renderPlainText(plainText, `text-${lastIndex}`));
      }

      const rawFormula = match[0];
      const isBlock = rawFormula.startsWith('$$') && rawFormula.endsWith('$$');
      const formula = isBlock
        ? rawFormula.slice(2, -2).trim()
        : rawFormula.slice(1, -1).trim();

      try {
        const html = katex.renderToString(formula, {
          displayMode: isBlock || !inline && isBlock,
          throwOnError: false,
          output: 'htmlAndMathml',
        });

        parts.push(
          <span
            key={`math-${match.index}`}
            className={isBlock ? 'block my-3 overflow-x-auto py-1 text-center' : 'inline-block px-1 align-baseline'}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        parts.push(
          <code key={`err-${match.index}`} className="text-red-500 bg-red-50 px-1 py-0.5 rounded text-xs">
            {rawFormula}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    // Remaining text
    if (lastIndex < text.length) {
      parts.push(renderPlainText(text.substring(lastIndex), `text-${lastIndex}`));
    }

    return parts;
  };

  const renderPlainText = (str: string, keyPrefix: string) => {
    // Handle basic formatting like bold, italics, line breaks
    const lines = str.split('\n');
    return (
      <span key={keyPrefix} className="whitespace-pre-line">
        {lines.map((line, i) => {
          // Check for bold **text**
          const boldRegex = /\*\*(.*?)\*\*/g;
          let lastIdx = 0;
          const lineParts: React.ReactNode[] = [];
          let bMatch: RegExpExecArray | null;

          while ((bMatch = boldRegex.exec(line)) !== null) {
            if (bMatch.index > lastIdx) {
              lineParts.push(line.substring(lastIdx, bMatch.index));
            }
            lineParts.push(
              <strong key={`b-${i}-${bMatch.index}`} className="font-semibold text-slate-900">
                {bMatch[1]}
              </strong>
            );
            lastIdx = boldRegex.lastIndex;
          }
          if (lastIdx < line.length) {
            lineParts.push(line.substring(lastIdx));
          }

          return (
            <React.Fragment key={`line-${i}`}>
              {lineParts}
              {i < lines.length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </span>
    );
  };

  return <div className={`katex-wrapper leading-relaxed ${className}`}>{parseContent(content)}</div>;
}

export default MathRenderer;
