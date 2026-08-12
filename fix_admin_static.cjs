const fs = require('fs');

const adminFile = 'pages/AdminPages.tsx';
let content = fs.readFileSync(adminFile, 'utf8');

content = content.replace('setStats(IMPACT_STATS);', 'setStats([]);');
content = content.replace('setStories(IMPACT_STORIES);', 'setStories([]);');
content = content.replace('} else setPosts(BLOG_POSTS);', '} else setPosts([]);');
content = content.replace('} else setAlbums(GALLERY_ALBUMS);', '} else setAlbums([]);');
content = content.replace('} else setMembers(TEAM_MEMBERS);', '} else setMembers([]);');

fs.writeFileSync(adminFile, content);
console.log('Fixed AdminPages.tsx');
