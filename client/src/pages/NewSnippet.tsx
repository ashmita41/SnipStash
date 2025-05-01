import SnippetForm from '../components/SnippetForm';

const NewSnippet = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Snippet</h1>
      <SnippetForm />
    </div>
  );
};

export default NewSnippet; 