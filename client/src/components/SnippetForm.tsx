import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SUPPORTED_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'HTML',
  'CSS',
  'SQL',
  'Bash',
  'JSON',
];

const generateTags = (code: string, language: string): string[] => {
  const tags = new Set<string>();
  tags.add(language.toLowerCase());

  // Add common programming concepts as tags
  const concepts = {
    function: /\b(function|def|void)\b/,
    class: /\b(class)\b/,
    loop: /\b(for|while|do)\b/,
    condition: /\b(if|else|switch|case)\b/,
    api: /(api|fetch|axios|http)/i,
    async: /(async|await|promise|then)/i,
    database: /(database|db|sql|query)/i,
    array: /(\[\]|array|list)/i,
    object: /(\{\}|object|dict)/i,
  };

  Object.entries(concepts).forEach(([concept, pattern]) => {
    if (pattern.test(code)) {
      tags.add(concept);
    }
  });

  return Array.from(tags);
};

const SnippetForm = () => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const tags = generateTags(code, language);
      
      console.log('Creating snippet:', { title, code, language, tags });
      await api.snippets.create({
        title,
        code,
        language,
        tags,
      });

      navigate('/snippets');
    } catch (err: any) {
      console.error('Error creating snippet:', err);
      setError(err.response?.data?.message || 'Failed to create snippet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter a descriptive title"
        />
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Code
        </label>
        <textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono"
          placeholder="Paste your code here"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Snippet'}
        </button>
      </div>
    </form>
  );
};

export default SnippetForm; 