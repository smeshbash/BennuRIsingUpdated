

import { DonationTier, DonationFund, ImpactStory, NavItem, Album, TeamMember, ImpactStat, BlogPost, Testimonial, SocialLink } from "./types";

// Read from .env (VITE_RAZORPAY_KEY_ID) so this always matches whatever key the
// backend used to create the order. No hardcoded fallback: if the env var is
// missing, this stays empty and the checkout call fails loudly instead of
// silently opening with a stale/wrong key.
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
if (!RAZORPAY_KEY_ID) {
  console.error('[Razorpay] VITE_RAZORPAY_KEY_ID is not set. Add it to your .env file and restart the dev server.');
}
// No static RAZORPAY_PLAN_ID anymore — /api/create-subscription creates a Razorpay
// Plan on the fly matching each donor's exact chosen amount (see server.ts), since a
// single fixed Plan can't represent the ₹1000 / ₹2500 / ₹5000 / custom options here.

export const DONATION_TIERS: DonationTier[] = [
  { amount: 1000, label: "Support a Student's Education Kit" },
  { amount: 2500, label: "Sponsor a Therapy Session" },
  { amount: 5000, label: "Aid a fallen Soldier's Family" },
];

export const DONATION_FUNDS: DonationFund[] = [
  { id: 'general', name: 'General Fund (Where Needed Most)' },
  { id: 'armed_forces', name: 'Armed Forces & Police Welfare' },
  { id: 'mental_health', name: 'Mental Health & Rehab Centers' },
  { id: 'tribal_edu', name: 'Tribal Education & Girl Child' },
  { id: 'medical', name: 'Medical Aid (Cancer/Thalassemia/Autism)' },
  { id: 'disaster', name: 'Disaster Relief & Environment' },
];

export const NAV_ITEMS: NavItem[] = [
  { 
    label: "Home", 
    path: "/",
    subsections: [
      { label: "Spirit of Bennu", hash: "spirit-section" },
      { label: "Our Impact", hash: "impact-section" },
      { label: "Programs", hash: "programs-section" }
    ]
  },
  { 
    label: "About Us", 
    path: "/about",
    subsections: [
      { label: "Our Story", hash: "our-story" },
      { label: "Objectives", hash: "objectives" },
      { label: "Leadership", hash: "leadership" }
    ]
  },
  { 
    label: "Our Work", 
    path: "/work",
    subsections: [
      { label: "Focus Areas", hash: "focus-areas" },
      { label: "Initiatives", hash: "initiatives" }
    ]
  },
  { 
    label: "Impact", 
    path: "/impact",
    subsections: [
      { label: "Statistics", hash: "statistics" },
      { label: "Success Stories", hash: "stories" }
    ]
  },
  { 
    label: "Blog", 
    path: "/blog"
  },
  { 
    label: "Volunteer", 
    path: "/volunteer",
    subsections: [
      { label: "Why Volunteer?", hash: "why-volunteer" },
      { label: "Sign Up", hash: "signup" }
    ]
  },
  { 
    label: "Internship", 
    path: "/internship",
    subsections: [
      { label: "Program Overview", hash: "overview" },
      { label: "Apply Now", hash: "apply" }
    ]
  },
  { 
    label: "Gallery", 
    path: "/gallery"
  },
  { 
    label: "Partners", 
    path: "/partners",
    subsections: [
      { label: "Our Partners", hash: "our-partners" },
      { label: "Get Involved", hash: "get-involved" }
    ]
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
    { platform: 'facebook', url: '#' },
    { platform: 'twitter', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'youtube', url: '#' }
];

export const IMPACT_STORIES: ImpactStory[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop",
    title: "Freedom from Addiction",
    description: "After 5 years of struggle, Rahul completed our holistic drug rehabilitation program combining medication with Yoga and meditation.",
    author: "Dr. Anjali, Clinical Psychologist",
    location: "Rehab Center, Dehradun"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1628135899320-b4b02534f593?q=80&w=800&auto=format&fit=crop",
    title: "Standing with Our Heroes",
    description: "We provided prosthetic support and vocational upskilling to 20 wounded paramilitary soldiers to help them reintegrate into civilian life.",
    author: "Col. Singh (Retd), Project Lead",
    location: "New Delhi"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    title: "Roots of Wisdom",
    description: "In the tribal belts of Bastar, 200 girls are now receiving value-based education that honors their indigenous culture while teaching modern skills.",
    author: "Priya, Field Educator",
    location: "Chhattisgarh"
  }
];

export const FOUNDATION_OBJECTIVES = [
  "To support in preventing substance abuse including narcotic and alcohol addiction and to provide rehabilitation, counselling and reintegration support to affected individuals and families.",
  "To promote mental health, psychological well-being and emotional resilience through awareness programs, counselling services, research, community outreach and other supportive initiatives.",
  "To facilitate community wellness, collective healing initiatives and psychosocial support systems for individuals and communities in mental, physical or monetary distress.",
  "To promote education, especially for the girl child, including value-based education, life-skills development and access to quality learning opportunities and to undertake programs for the development and empowerment of women and children.",
  "To support healthcare initiatives and provide assistance for basic living needs including food, shelter, healthcare and sanitation for poor, needy and vulnerable populations.",
  "To support/ undertake all activities to promote yoga, meditation and holistic wellness practices for physical, mental and spiritual well-being. To encourage and undertake research, education, awareness and assistance relating to consciousness studies, meditation and human development.",
  "To support / work, provide lively hood support and assist in all legal ways for the upliftment and empowerment of tribal communities and socially marginalized or stigmatized groups.",
  "To support / undertake activities relating to disaster preparedness, disaster management, environmental protection and ecological sustainability. Support deserving individuals or organizations for research or studies in India or abroad.",
  "To promote and support inclusion, empowerment, welfare, of persons with disabilities.",
  "To preserve, promote and support traditional arts, performing arts and cultural heritage. To support artists in these fields.",
  "To promote and assist in gender equality, social justice and equal opportunities in all sections of society and for all.",
  "To create awareness regarding autism spectrum disorders and provide support in welfare, treatment and reintegration to affected individuals and their families.",
  "To create awareness regarding thalassemia and support prevention, treatment and welfare initiatives for affected persons and support their families.",
  "To support, promote awareness regarding cancer, early detection and support services for patients and caregivers. To assist those in need.",
  "To assist, support partnership, collaborate towards achieving all the 17 Sustainable Development Goals adopted by the United Nations. To continue assist and support, collaborate, partnership in any such resolution even after 2030 which is having similar intentions by UN or similar agencies.",
  "To support, promote skill development, vocational training and upskilling opportunities to enhance livelihood and employability in all sections of society and to all.",
  "To support, promote research, documentation and awareness regarding traditional healing systems and indigenous medicinal knowledge.",
  "To support, protect and promote welfare of animals and marine life and support biodiversity conservation.",
  "To support the welfare, care and dignity of elderly persons including healthcare, companionship and livelihood support.",
  "To support organisations and members of the Armed Forces, paramilitary forces and police services / uniformed forces. Support in rehabilitation of wounded personnel and assistance to families of fallen soldiers. Support both serving and retired.",
  "To support, promote and assist in games and sports or any such activities. To support individuals and organizations / institutions towards the same. Assist nation in finding, building and sustaining new talents and undertake activities for training the same.",
  "To provide legal support to any deserving individual or organisation / similar institution in any of the goals undertaken by the NGO.",
  "To promote social welfare and sustainable development by undertaking all activities in the fields of healthcare, mental health, education, rehabilitation, community development, environmental protection, agriculture and empowerment of marginalized communities."
];

export const FOUNDATION_OBJECTIVES_NOTE = "All 'support / assistance / prevent/ promote' - terms used in objectives of ngo will include monetary, physical, mental, psychological or sociological support. This will also include funding for research, studies, promotion, legal assistance, medical assistance, welfare activities towards the same.";

export const TESTIMONIALS: Testimonial[] = [
    { name: "Savitri Devi", role: "Beneficiary", text: "Bennu Rising Foundation gave my son a second chance at life through their Thalassemia support." },
    { name: "Maj. Vikram Singh", role: "Donor", text: "As a veteran, seeing their work for disabled soldiers deeply moves me. Jai Hind." },
    { name: "Anita Roy", role: "Volunteer", text: "Teaching tribal girls in Chhattisgarh has been the most fulfilling experience of my life." },
    { name: "Rahul K.", role: "Rehab Graduate", text: "Yoga and counseling saved me from drugs. I am clean for 2 years now." },
    { name: "Dr. Sharma", role: "Partner", text: "Their holistic approach to mental health is exactly what India and the world needs right now." },
    { name: "Priya Menon", role: "Student", text: "The scholarship helped me finish my engineering degree. Forever grateful." },
];

export const GALLERY_ALBUMS: Album[] = [
  {
    id: 'health',
    title: 'Health & Healing',
    cover: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop',
    count: 12,
    images: [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200',
      'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=1200',
      'https://images.unsplash.com/photo-1584448377757-ef4c5c8bd037?q=80&w=1200',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200',
    ]
  },
  {
    id: 'social',
    title: 'Social Empowerment',
    cover: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop',
    count: 8,
    images: [
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200',
    ]
  },
  {
    id: 'nation',
    title: 'Nation Building',
    cover: 'https://images.unsplash.com/photo-1625575840632-1e96720d4187?q=80&w=800&auto=format&fit=crop',
    count: 15,
    images: [
      'https://images.unsplash.com/photo-1625575840632-1e96720d4187?q=80&w=1200',
      'https://images.unsplash.com/photo-1628135899320-b4b02534f593?q=80&w=1200',
      'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=1200',
    ]
  },
  {
    id: 'env',
    title: 'Environment & Relief',
    cover: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop',
    count: 10,
    images: [
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200',
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1200',
    ]
  },
  {
    id: 'edu',
    title: 'Education & Culture',
    cover: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    count: 20,
    images: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200',
    ]
  },
  {
    id: 'vol',
    title: 'Volunteer Community',
    cover: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&auto=format&fit=crop',
    count: 35,
    images: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200',
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200',
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200'
    ]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Dr. Aruna Rao",
    role: "Founder & Chairperson",
    bio: "A clinical psychologist with 30+ years of experience in trauma healing and social rehabilitation.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Col. Vikram Singh (Retd)",
    role: "Director of Operations",
    bio: "Led multiple humanitarian missions in conflict zones. Now spearheading our veteran welfare programs.",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Lakshmi Nair",
    role: "Head of Education",
    bio: "Former principal dedicated to bringing modern education to the remotest tribal villages of India and abroad.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop"
  }
];

export const IMPACT_STATS: ImpactStat[] = [
  { label: "Lives Touched", value: "50,000+", desc: "Across 12 states in India and abroad" },
  { label: "Students Educated", value: "12,500", desc: "In tribal & rural belts" },
  { label: "Patients Rehabbed", value: "3,200", desc: "Drug-free & mental wellness" },
  { label: "Warriors Supported", value: "850", desc: "Paramilitary & Army Welfare" }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "The Science of Yoga in Drug Rehabilitation",
    excerpt: "How ancient breathing techniques and asanas are helping patients manage withdrawal symptoms and mental cravings more effectively than medication alone.",
    content: `
      <p>Addiction is often a disease of disconnection—from one's body, community, and purpose. While modern medicine addresses the chemical dependencies of addiction, the psychological and spiritual voids often remain unfilled. This is where the ancient science of Yoga offers a transformative bridge.</p>
      
      <h3>The Physiology of Breath</h3>
      <p>Our rehabilitation centers in Dehradun have integrated Pranayama (breath control) into the daily routine of recovering patients. Scientific studies suggest that controlled breathing stimulates the Vagus nerve, activating the parasympathetic nervous system. This "rest and digest" state is crucial for individuals whose nervous systems have been ravaged by substance abuse.</p>
      
      <p>When a patient feels a craving, their heart rate spikes, and anxiety sets in. By practicing <em>Nadi Shodhana</em> (alternate nostril breathing), they can physically lower their cortisol levels within minutes, providing a tool for self-regulation that doesn't require a pill.</p>
      
      <h3>Reclaiming the Body</h3>
      <p>Trauma often lives in the body. Asanas (postures) help release stored tension. For many of our youth, performing a simple <em>Surya Namaskar</em> (Sun Salutation) is the first time in years they have treated their bodies with respect rather than abuse. This shift in relationship with oneself is often the turning point in long-term recovery.</p>
      
      <p>At Bennu Rising Foundation, we believe in a future where healthcare is holistic. By combining clinical psychology with yogic science, we aren't just treating addiction; we are rebuilding whole human beings.</p>
    `,
    author: "Dr. Anjali Verma",
    date: "Mar 15, 2024",
    image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop",
    category: "Health"
  },
  {
    id: 2,
    title: "Empowering Tribal Women: A Firsthand Account",
    excerpt: "Journey into the heart of Bastar where a group of women are reviving lost traditional arts to create sustainable livelihoods.",
    content: `
      <p>The road to Jagdalpur is lined with dense Sal forests, a landscape that holds centuries of indigenous wisdom. Here, in the heart of Bastar, a quiet revolution is taking place—led entirely by women.</p>
      
      <h3>The Lost Art of Dhokra</h3>
      <p>Dhokra, the ancient art of lost-wax metal casting, dates back to the Mohenjo-daro civilization. However, in recent decades, plastic and mass-produced goods have threatened to erase this heritage. The women of the Muria tribe, once relegated to household chores, decided to change this narrative.</p>
      
      <p>With seed funding from Bennu Rising Foundation, a cooperative of 40 women set up a community workshop. They didn't just want to make trinkets; they wanted to create art that told their stories. Today, their intricate bronze figures of tribal deities and nature spirits are finding homes in living rooms across Mumbai and Delhi.</p>
      
      <h3>Economic Independence</h3>
      <p>"Before, I had to ask my husband for money to buy medicine," says Sunita, the cooperative lead. "Now, I pay my daughter's school fees." This economic shift has altered the social fabric of the village. Women are now decision-makers, their voices carry weight in the village council, and the art form that defines their culture is thriving once again.</p>
      
      <p>This is what we mean by 'Empowerment'. It is not given; it is cultivated from the roots up.</p>
    `,
    author: "Priya Menon",
    date: "Mar 02, 2024",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop",
    category: "Social Impact"
  },
  {
    id: 3,
    title: "Why We Must Honor Our Fallen Heroes",
    excerpt: "It is not enough to just remember them on Republic Day. Here is how our community is stepping up to support the families left behind.",
    content: `
      <p>Freedom is not free. It is paid for in installments by the brave men and women standing guard at our borders. But what happens when a soldier pays the ultimate price? The flag is folded, the gun salute is fired, and eventually, the news cameras leave. That is when the real battle begins for the family left behind.</p>
      
      <h3>Beyond the Check</h3>
      <p>Financial compensation from the government is essential, but it cannot fix a broken heart or fill the void of a father figure. At Bennu Rising Foundation, our 'Veer Nari' program focuses on holistic support for war widows.</p>
      
      <p>We recently organized a vocational training camp for 30 wives of fallen CRPF personnel. The goal was not just employment, but community. "I thought I was alone in my grief," shared Mrs. Devi, whose husband was martyred in Pulwama. "Here, I found sisters who understand exactly what it feels like when the phone doesn't ring at 8 PM anymore."</p>
      
      <h3>Education for the Next Generation</h3>
      <p>We have also pledged to sponsor the higher education of 50 children of martyrs this year. We believe that the best way to honor a hero is to ensure their children have the future they fought to protect.</p>
      
      <p>Supporting our armed forces is not just a duty; it is a privilege. Jai Hind.</p>
    `,
    author: "Col. Vikram Singh",
    date: "Feb 20, 2024",
    image: "https://images.unsplash.com/photo-1628135899320-b4b02534f593?q=80&w=800&auto=format&fit=crop",
    category: "Nation Building"
  }
];

export const WINGS_PILLARS = [
  {
    id: "pillar_1",
    name: "Individual Transformation & Mental Health",
    wings: [
      { id: "wing_1", name: "Wing 1: Substance Abuse Prevention & Rehabilitation" },
      { id: "wing_2", name: "Wing 2: Mental Health & Psychological Well-being" },
      { id: "wing_3", name: "Wing 3: Community Wellness & Psychosocial Support" },
      { id: "wing_4", name: "Wing 4: Yoga, Meditation & Consciousness Studies" },
      { id: "wing_7", name: "Wing 7: Disability Inclusion & Accessibility" },
      { id: "wing_10", name: "Wing 10: Autism Awareness & Support" },
      { id: "wing_11", name: "Wing 11: Thalassemia Prevention & Patient Support" },
      { id: "wing_12", name: "Wing 12: Cancer Awareness & Patient Care" }
    ]
  },
  {
    id: "pillar_2",
    name: "Community Health & Development",
    wings: [
      { id: "wing_5", name: "Wing 5: Healthcare & Basic Human Needs Support" },
      { id: "wing_6", name: "Wing 6: Tribal Welfare & Indigenous Community Empowerment" },
      { id: "wing_8", name: "Wing 8: Arts, Culture & Heritage Preservation" },
      { id: "wing_9", name: "Wing 9: Gender Equality & Social Justice" },
      { id: "wing_13", name: "Wing 13: Skill Development & Livelihood Enhancement" },
      { id: "wing_16", name: "Wing 16: Senior Citizens Welfare & Dignity" },
      { id: "wing_17", name: "Wing 17: Armed Forces, Veterans & Uniformed Services Welfare" },
      { id: "wing_18", name: "Wing 18: Sports Development & Talent Promotion" },
      { id: "wing_19", name: "Wing 19: Social Welfare & Sustainable Development" },
      { id: "wing_21", name: "Wing 21: Education & Girl Child Empowerment" },
      { id: "wing_22", name: "Wing 22: Women & Child Development" }
    ]
  },
  {
    id: "pillar_3",
    name: "Disaster Response & Resilience",
    wings: [
      { id: "wing_15", name: "Wing 15: Animal Welfare & Marine Conservation" },
      { id: "wing_20", name: "Wing 20: Disaster Preparedness, Relief & Resilience" }
    ]
  },
  {
    id: "pillar_4",
    name: "Research, Policy & Advocacy",
    wings: [
      { id: "wing_14", name: "Wing 14: Traditional Healing & Indigenous Medicine Research" },
      { id: "wing_23", name: "Wing 23: Sustainable Development Goals (SDG) Partnership" },
      { id: "wing_24", name: "Wing 24: Legal Aid, Advocacy & Justice Support" },
      { id: "wing_25", name: "Wing 25: Research, Policy, Documentation & Publications" }
    ]
  }
];
