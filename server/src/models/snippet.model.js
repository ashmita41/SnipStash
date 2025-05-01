const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'Bash', 'Java', 'C++', 'HTML', 'CSS', 'TypeScript', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Function to generate tags based on code content
snippetSchema.methods.generateTags = function() {
  const code = this.code.toLowerCase();
  const tags = new Set();

  // Loop-related tags
  if (code.includes('for') || code.includes('while')) {
    tags.add('loop');
  }

  // API-related tags
  if (code.includes('fetch') || code.includes('axios')) {
    tags.add('API');
  }

  // Error handling tags
  if (code.includes('try') || code.includes('catch')) {
    tags.add('error handling');
  }

  // Array operation tags
  if (code.includes('.map') || code.includes('.filter')) {
    tags.add('array ops');
  }

  // Debugging tags
  if (code.includes('console.log')) {
    tags.add('debugging');
  }

  return Array.from(tags);
};

// Pre-save middleware to auto-generate tags
snippetSchema.pre('save', function(next) {
  if (this.isModified('code')) {
    const generatedTags = this.generateTags();
    this.tags = [...new Set([...this.tags, ...generatedTags])];
  }
  next();
});

module.exports = mongoose.model('Snippet', snippetSchema); 