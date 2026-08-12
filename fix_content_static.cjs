const fs = require('fs');

const contentPagesFile = 'pages/ContentPages.tsx';
let content = fs.readFileSync(contentPagesFile, 'utf8');

// Replace state initializations
content = content.replace('useState(TEAM_MEMBERS)', 'useState<any[]>([])');
content = content.replace('useState(IMPACT_STATS)', 'useState<any[]>([])');
content = content.replace('useState(IMPACT_STORIES)', 'useState<any[]>([])');
content = content.replace('useState<BlogPost[]>(BLOG_POSTS)', 'useState<BlogPost[]>([])');
content = content.replace('useState<any[]>(GALLERY_ALBUMS)', 'useState<any[]>([])');

fs.writeFileSync(contentPagesFile, content);
console.log('Fixed ContentPages.tsx');

const homeFile = 'pages/Home.tsx';
let homeContent = fs.readFileSync(homeFile, 'utf8');

homeContent = homeContent.replace('useState<ImpactStory[]>(IMPACT_STORIES)', 'useState<ImpactStory[]>([])');

// Remove placeholderWishes logic
// The logic currently looks like:
/*
  const placeholderWishes: Testimonial[] = [
      { name: "Lt Col Rishi Rajalekshmi, SM", role: "Advisory Board Member", content: "Best wishes to Bennu Rising International for their noble cause!" },
      { name: "Rajalakshmi Amma S", role: "Director", content: "May our foundation continue to bring light and hope to those in need." },
      { name: "Minnu Joshy IAS", role: "Advisory Board Member", content: "Wishing you great success in all your future endeavors empowering communities." },
      { name: "Prof. Dr. Judy Mary Kurian", role: "Director", content: "Best wishes to our foundation and may we find success in all your future endeavors." },
      { name: "Pallavi Rajesh", role: "Student", content: "I am so excited to join this powerful movement." }
  ];
  const displayTestimonials = testimonials.length >= 3 ? testimonials : placeholderWishes;
*/

// Let's use regex to replace it
homeContent = homeContent.replace(/const placeholderWishes[\s\S]*?const displayTestimonials = .*?;/, 'const displayTestimonials = testimonials;');

fs.writeFileSync(homeFile, homeContent);
console.log('Fixed Home.tsx');

