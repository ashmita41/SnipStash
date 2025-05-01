import { useState, useEffect } from 'react';
// Import Prism core and theme
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Import only the languages we need
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

interface SnippetCardProps {
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
}

const SnippetCard = ({ title, code, language, tags, createdAt }: SnippetCardProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Manually trigger Prism highlighting
    if (Prism) {
      Prism.highlightAll();
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Normalize language name for Prism
  const getNormalizedLanguage = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Java': 'java',
      'HTML': 'markup',
      'CSS': 'css',
    };
    return languageMap[lang] || 'javascript';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 bg-gray-900">
        <pre className="overflow-x-auto">
          <code className={`language-${getNormalizedLanguage(language)}`}>
            {code}
          </code>
        </pre>
      </div>
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
        Created: {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default SnippetCard; 