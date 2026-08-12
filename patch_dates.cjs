const fs = require('fs');
const file = 'pages/AdminPages.tsx';
let content = fs.readFileSync(file, 'utf8');

// For ImpactManager Story Edit
const impactAuthor = `            <input
              placeholder="Author"
              value={editingStory.author}`;
const impactDate = `            <input
              type="date"
              placeholder="Date"
              title="Date"
              value={editingStory.created_at ? new Date(editingStory.created_at).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setEditingStory({ ...editingStory, created_at: new Date(e.target.value).toISOString() })
              }
              className="w-full border p-2 rounded-lg"
            />
            <input
              placeholder="Author"
              value={editingStory.author}`;

content = content.replace(impactAuthor, impactDate);


// For BlogManager Edit
const blogAuthor = `            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Author"`;
const blogDate = `            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="Date"
                title="Date"
                value={editingPost.created_at ? new Date(editingPost.created_at).toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, created_at: new Date(e.target.value).toISOString() })
                }
                className="w-full border p-2 rounded-lg"
              />
              <input
                placeholder="Author"`;

content = content.replace(blogAuthor, blogDate);

fs.writeFileSync(file, content);
console.log("Patched dates!");
