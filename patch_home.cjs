const fs = require('fs');
const file = 'pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = "const displayTestimonials = testimonials;";
const fallback = `const placeholderWishes: Testimonial[] = [
      { name: "Lt Col Rishi Rajalekshmi, SM", role: "Advisory Board Member", content: "Best wishes to Bennu Rising International for their noble cause!" },
      { name: "Rajalakshmi Amma S", role: "Director", content: "May our foundation continue to bring light and hope to those in need." },
      { name: "Minnu Joshy IAS", role: "Advisory Board Member", content: "Wishing you great success in all your future endeavors empowering communities." },
      { name: "Prof. Dr. Judy Mary Kurian", role: "Director", content: "Best wishes to our foundation and may we find success in all your future endeavors." },
      { name: "Pallavi Rajesh", role: "Student", content: "I am so excited to join this powerful movement." }
  ];
  const displayTestimonials = testimonials.length >= 3 ? testimonials : placeholderWishes;`;

content = content.replace(target, fallback);
fs.writeFileSync(file, content);
console.log("Patched Home.tsx");
