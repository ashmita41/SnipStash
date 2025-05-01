import { useState, useEffect } from 'react';
import axios from 'axios';
import SnippetCard from '../components/SnippetCard';
import TagFilterBar from '../components/TagFilterBar';
import SearchBar from '../components/SearchBar';

interface Snippet {
  _id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
}

const SnippetList = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get all unique tags from snippets
  const availableTags = Array.from(
    new Set(snippets.flatMap((snippet) => snippet.tags))
  ).sort();

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/snippets');
        setSnippets(response.data);
        setFilteredSnippets(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch snippets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  useEffect(() => {
    let filtered = [...snippets];

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter((snippet) =>
        selectedTags.every((tag) => snippet.tags.includes(tag))
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(query) ||
          snippet.code.toLowerCase().includes(query) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredSnippets(filtered);
  }, [snippets, selectedTags, searchQuery]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="w-full sm:w-96">
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <TagFilterBar
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No snippets found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet._id}
              title={snippet.title}
              code={snippet.code}
              language={snippet.language}
              tags={snippet.tags}
              createdAt={snippet.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SnippetList; 