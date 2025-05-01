interface TagFilterBarProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const TagFilterBar = ({ availableTags, selectedTags, onTagToggle }: TagFilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      {availableTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagToggle(tag)}
          className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${
              selectedTags.includes(tag)
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
            }
            transition-colors duration-200
          `}
        >
          {tag}
          <span className="ml-1 text-xs">
            {selectedTags.includes(tag) ? '×' : '+'}
          </span>
        </button>
      ))}
      {availableTags.length === 0 && (
        <p className="text-gray-500 text-sm">No tags available</p>
      )}
    </div>
  );
};

export default TagFilterBar; 