

import React, { useState, useEffect } from 'react';
import DonationWidget from '../components/DonationWidget';
import { IMPACT_STORIES, TESTIMONIALS } from '../constants';
import { Testimonial, ImpactStory } from '../types';
import { CirclePlay, ArrowRight, Quote, Heart, Users, Globe, Leaf, Shield, CircleCheck, X, Activity, Brain, Stethoscope, Droplet, GraduationCap, Briefcase, Tent, HandHeart, Scale, Sun, Sparkles, Palette, Zap, Award, BookOpen, Smile, Star, Anchor, HeartHandshake, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getAllSystemSettings } from '../lib/systemSettingsCache';
import * as LucideIcons from 'lucide-react';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  
  // Dynamic Content State
  const [homeConfig, setHomeConfig] = useState({
      heroTitle: "Heal.\nEmpower.\nRise.",
      heroSubtitle: "Bennu Rising International Foundation is a holistic humanitarian force. Bennu: \"He who came into being by himself\"",
      heroBg: "",
      videoUrl: 'Ef6vpu3D9aw', 
      videoPoster: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600',
      slogan: "Lokah Samastha Sukhino Bhavantu",
      exploreBtn: "Explore Causes",
      pillars: [
        { icon: 'Brain', title: "Individual Transformation & Mental Health", color: "text-brand-red", desc: "Holistic healing through mental health support, emotional resilience, and dedicated addiction recovery programs." },
        { icon: 'Users', title: "Community Health & Development", color: "text-brand-blue", desc: "Empowering communities through basic needs, inclusion, specialized healthcare awareness, and sustainable empowerment." },
        { icon: 'Shield', title: "Disaster Response & Resilience", color: "text-brand-green", desc: "Focusing on emergency relief, psychological first aid, rehabilitation, and disaster preparedness." },
        { icon: 'FileText', title: "Research, Policy & Advocacy", color: "text-purple-600", desc: "Focusing on data collection, policy research, government engagement, and knowledge creation." }
      ],
      spiritTitle: "Rising From The Ashes",
      spiritLabel: "The Spirit of Bennu",
      spiritQuote: "Like the mythical Bennu bird, we believe that every human being has the capacity for rebirth. Whether it is a soldier recovering from a life-altering injury, or an individual battling addiction—we provide the wings to rise.",
      spiritBtn: "READ ORIGIN STORY",
      impactHeading: "Real Stories. Real Impact."
  });

  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
      if(isSupabaseConfigured()) {
          // Fetch Testimonials
          supabase.from('testimonials').select('*').neq('is_deleted', true).eq('approval_status', 'published').then(({data}) => {
              if(data) setTestimonials(data);
          });

          // Fetch Impact Stories (Limit to 3 for Home Page)
          supabase.from('impact_stories')
            .select('*')
            .neq('is_deleted', true)
            .eq('approval_status', 'published')
            .order('created_at', { ascending: false }) // Show newest first
            .limit(3)
            .then(({data}) => {
                if(data && data.length > 0) {
                    // Map DB fields to Frontend Type
                    const mappedStories: ImpactStory[] = data.map((s: any) => ({
                        id: s.id,
                        image: s.image_url || "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800",
                        title: s.title,
                        description: s.description,
                        author: s.author,
                        location: s.location
                    }));
                    setStories(mappedStories);
                }
            });
            
          // Fetch Content Settings
          getAllSystemSettings()
            .then((data) => {
              if (data) {
                  const val = (k: string) => data.find(d => d.key === k)?.value;

                  setHomeConfig(prev => {
                      const pillarsJson = val('home_pillars_json');
                      const spiritJson = val('home_spirit_section_json');
                      let newPillars = prev.pillars;
                      let newSpirit = { title: prev.spiritTitle, label: prev.spiritLabel, quote: prev.spiritQuote, btn: prev.spiritBtn };

                      if (pillarsJson) { try { newPillars = JSON.parse(pillarsJson); } catch(e){} }
                      if (spiritJson) { try { newSpirit = JSON.parse(spiritJson); } catch(e){} }

                      return {
                          ...prev,
                          heroTitle: val('home_hero_title') || prev.heroTitle,
                          heroSubtitle: val('home_hero_subtitle') || prev.heroSubtitle,
                          heroBg: val('home_hero_bg') || prev.heroBg,
                          videoUrl: val('home_video_url') || prev.videoUrl,
                          videoPoster: val('home_video_poster') || prev.videoPoster,
                          slogan: val('home_slogan') || prev.slogan,
                          exploreBtn: val('home_explore_btn') || prev.exploreBtn,
                          pillars: newPillars,
                          spiritTitle: newSpirit.title,
                          spiritLabel: newSpirit.label,
                          spiritQuote: newSpirit.quote,
                          spiritBtn: newSpirit.btn,
                          impactHeading: val('home_impact_heading') || prev.impactHeading
                      };
                  });
              }
          });
      }
  }, []);

  // Updated Renderer based on request: Vertical Reading Highlighting
  const renderHeroTitle = (title: string) => {
    // Split by newlines
    const lines = title.split(/\\n|\n/);

    return (
        <div className="flex flex-col items-center lg:items-start leading-tight w-full">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                const firstChar = trimmed.charAt(0);
                const rest = trimmed.slice(1);
                
                // Common style for plastic/gradient text (using bg-clip-text)
                const baseGradient = "bg-clip-text text-transparent bg-gradient-to-br drop-shadow-md pb-2 pr-2";
                
                // First Character Style (Red Plastic for 'HER')
                const firstCharStyle = `${baseGradient} from-blue-400 via-brand-blue to-red-900`;

                // Rest of Word Style (Specific per word)
                let restStyle = "";
                if (i === 0) { 
                    // Heal: Gradient Egg White (White/Silver/Cream)
                    // Highlighting in neomorphic plastic -> Strong shadows + gradient
                    restStyle = `${baseGradient} from-orange-400 via-orange-300 to-orange-500`;
                } else if (i === 1) { 
                    // Empower: Gradient Blue
                    restStyle = `${baseGradient} from-white via-gray-200 to-gray-100`;
                } else if (i === 2) { 
                    // Rise: Gradient Green
                    restStyle = `${baseGradient} from-green-300 via-brand-green to-green-800`;
                }

                return (
                    <span key={i} className="block w-full text-left">
                        <span className={firstCharStyle}>{firstChar}</span>
                        <span className={restStyle}>{rest}</span>
                    </span>
                );
            })}
        </div>
    );
  };

  const renderIcon = (iconName: string, className: string) => {
      // @ts-ignore
      const IconComponent = LucideIcons[iconName] || LucideIcons.CircleHelp;
      return <IconComponent className={className} />;
  };

  const placeholderWishes: Testimonial[] = [
      { name: "Lt Col Rishi Rajalekshmi, SM", role: "Advisory Board Member", content: "Best wishes to Bennu Rising International for their noble cause!" },
      { name: "Rajalakshmi Amma S", role: "Director", content: "May our foundation continue to bring light and hope to those in need." },
      { name: "Minnu Joshy IAS", role: "Advisory Board Member", content: "Wishing you great success in all your future endeavors empowering communities." },
      { name: "Prof. Dr. Judy Mary Kurian", role: "Director", content: "Best wishes to our foundation and may we find success in all your future endeavors." },
      { name: "Pallavi Rajesh", role: "Student", content: "I am so excited to join this powerful movement." }
  ];
  const displayTestimonials = testimonials.length >= 3 ? testimonials : placeholderWishes;

  // Duplicate testimonials for marquee loop
  const marqueeContent = [...displayTestimonials, ...displayTestimonials];

  const handlePlayClick = () => {
      if (homeConfig.videoUrl) {
          setShowVideoModal(true);
      } else {
          // Fallback behavior if no video is set in DB
          navigate('/about');
      }
  };

  return (
    <div className="bg-brand-light overflow-x-hidden">
      <SEO
        title="Bennu Rising International Foundation | NGO for Mental Health, Education & Disaster Relief in India"
        description="Bennu Rising International Foundation is an NGO working across India on mental health, addiction rehabilitation, tribal education, disaster relief, and welfare for armed forces families. Donate, volunteer, or partner with us."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "NGO",
          "name": "Bennu Rising International Foundation",
          "alternateName": "Bennu Rising",
          "url": window.location.origin,
          "logo": `${window.location.origin}/logo1.png`,
          "description": "Bennu Rising International Foundation is a non-profit dedicated to holistic healing, education, and social empowerment across India — covering mental health, addiction rehabilitation, tribal education, disaster relief, and welfare for armed forces families.",
          "slogan": "Lokah Samastha Sukhino Bhavantu",
          "areaServed": "India",
        }}
      />
      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
             <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                 <button onClick={() => setShowVideoModal(false)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors">
                     <X className="w-6 h-6" />
                 </button>
                 <iframe 
                    src={
                        homeConfig.videoUrl.includes('youtube.com/watch?v=') 
                            ? homeConfig.videoUrl.replace('watch?v=', 'embed/') + '&autoplay=1'
                            : homeConfig.videoUrl.includes('youtu.be/')
                                ? homeConfig.videoUrl.replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1'
                                : homeConfig.videoUrl + (homeConfig.videoUrl.includes('?') ? '&autoplay=1' : '?autoplay=1')
                    }
                    title="Bennu Rising Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                 ></iframe>
             </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Parallax-like feel */}
        <div className="absolute inset-0 z-0 bg-brand-blue">
            {homeConfig.heroBg && (
                <img 
                    src={homeConfig.heroBg} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                />
            )}
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/95 to-brand-light/40 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-light via-transparent to-transparent"></div>
        </div>

        {/* Decorative Blobs (Retained but subtle) */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0 mix-blend-multiply"></div>

        <div className="container mx-auto px-4 z-10 relative pt-20 pb-20 lg:pb-32">
          {/* Main Content Area */}
          <div className="max-w-6xl mx-auto relative z-10 pt-8 lg:pr-[350px]">
              <div className="flex flex-col items-center gap-8 lg:gap-12">
                  {/* Logo Column */}
                  <div className="flex justify-center lg:justify-end items-center relative flex-shrink-0 w-full">
                     <div className="absolute w-[200px] h-[200px] bg-white/40 blur-[50px] rounded-full scale-75 -z-10 animate-pulse right-0"></div>
                     <img src="/logo1.png" alt="Bennu Rising Logo" className="relative z-10 h-48 md:h-64 lg:h-72 w-auto drop-shadow-2xl animate-float filter contrast-110 object-contain mx-auto lg:mx-0 lg:ml-auto" referrerPolicy="no-referrer" />
                  </div>
                  
                  {/* Hero Text Column */}
                  <div className="space-y-8 animate-fade-in-up flex flex-col items-center lg:items-start text-left w-full max-w-2xl mx-auto">
                      <div className="inline-flex items-center bg-white/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2">
                         <span className="w-3 h-3 bg-brand-green rounded-full mr-3 shadow-inner animate-pulse flex-shrink-0"></span>
                         <span className="text-brand-blue font-bold text-xs uppercase tracking-wider text-shadow-sm">{homeConfig.slogan}</span>
                      </div>
                      
                      <div className="text-5xl lg:text-6xl xl:text-7xl font-serif-heading font-extrabold leading-tight text-brand-blue drop-shadow-sm w-full">
                        {renderHeroTitle(homeConfig.heroTitle)}
                      </div>
                      
                      <p className="relative text-lg lg:text-xl text-gray-700 w-full leading-relaxed font-medium drop-shadow-sm bg-white/30 p-8 lg:p-10 rounded-2xl backdrop-blur-sm border border-white/20 text-left">
                        <Quote className="absolute top-2 left-2 w-8 h-8 lg:w-12 lg:h-12 text-brand-blue/10" />
                        {homeConfig.heroSubtitle}
                        <Quote className="absolute bottom-2 right-2 w-8 h-8 lg:w-12 lg:h-12 text-brand-blue/10 rotate-180" />
                      </p>
                      
                      <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 w-full">
                         <button onClick={() => navigate('/work')} className="group bg-white text-brand-blue px-8 py-4 rounded-2xl font-bold hover:text-brand-red transition-all shadow-skeuo-raised hover:shadow-skeuo-sm active:shadow-skeuo-pressed active:scale-95 flex items-center border border-white/60">
                           {homeConfig.exploreBtn} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                  </div>
              </div>
          </div>
          {/* Widget placement with Floating Effect - Independent of main content */}
          <div className="mt-12 lg:mt-0 lg:absolute lg:top-20 lg:right-4 xl:right-12 z-20 flex justify-center w-full lg:w-auto animate-float">
             <DonationWidget className="shadow-2xl shadow-brand-blue/20" />
          </div>
        </div>
      </section>

      {/* Marquee Testimonials (Left to Right) */}
      <section className="py-8 bg-brand-blue overflow-hidden relative border-t-4 border-brand-green shadow-inner">
         <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-blue to-transparent z-10 pointer-events-none"></div>
         <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-blue to-transparent z-10 pointer-events-none"></div>
         
         <div className="flex w-max animate-marquee hover:pause">
            {marqueeContent.map((t, i) => (
                <div key={i} className="mx-6 w-96 bg-brand-blue/50 border border-white/10 p-6 rounded-xl backdrop-blur-sm flex flex-col justify-center">
                    <p className="text-white/90 italic font-serif text-lg mb-4">"{t.content || t.text}"</p>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center mr-3 border border-brand-green/50">
                            <Quote className="w-4 h-4 text-brand-green" />
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm">{t.name}</div>
                            <div className="text-brand-green text-xs uppercase tracking-wide">{t.role}</div>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </section>

      {/* Mission Pillars - Skeuomorphic Icons */}
      <section id="programs-section" className="py-24 bg-brand-light relative scroll-mt-24">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-brand-blue font-extrabold uppercase tracking-widest text-sm mb-4">Our Core Pillars</h2>
               <h3 className="text-4xl font-serif-heading font-bold text-gray-800 drop-shadow-sm">Holistic Action for a Better World</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {homeConfig.pillars.map((item: any, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => navigate(`/work#pillar-${idx + 1}`)}
                        className="bg-brand-light p-8 rounded-[2.5rem] shadow-skeuo-raised border border-white relative overflow-hidden group hover:shadow-skeuo-sm transition-all duration-300 flex flex-col items-start text-left cursor-pointer active:scale-95"
                    >
                        {/* Metal Screw Details */}
                        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-gray-300 shadow-skeuo-pressed"></div>
                        <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-gray-300 shadow-skeuo-pressed"></div>

                        <div className={`w-20 h-20 rounded-2xl bg-brand-light shadow-skeuo-raised border border-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 mb-6 ${item.color}`}>
                            {renderIcon(item.icon, "w-10 h-10 stroke-[2.5px]")}
                        </div>
                        
                        <h3 className={`font-bold text-xl ${item.color} font-serif-heading mb-4 leading-tight`}>{item.title}</h3>
                        <p className="text-gray-600 font-medium text-sm leading-relaxed flex-1">{item.desc}</p>
                        
                        {/* Decorative Bar */}
                        <div className="mt-8 h-3 w-full bg-brand-light shadow-skeuo-input rounded-full border border-white/50 overflow-hidden">
                            <div className={`h-full w-0 group-hover:w-full transition-all duration-1000 ease-out opacity-20 ${item.color.replace('text-', 'bg-')}`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Story Section / Video Section */}
      <section id="spirit-section" className="py-24 bg-[#E0E5EC] relative overflow-hidden scroll-mt-32 lg:scroll-mt-48">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div 
                className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-skeuo-raised border-8 border-brand-light p-2 bg-white"
                onClick={handlePlayClick}
             >
                <div className="overflow-hidden rounded-2xl relative">
                    <img 
                    src={homeConfig.videoPoster || null}
                    alt="Video Thumbnail" 
                    className="w-full h-auto transform transition duration-700 group-hover:scale-105 saturate-50 group-hover:saturate-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600';
                    }}
                    />
                    <div className="absolute inset-0 bg-brand-blue/20 flex items-center justify-center">
                        {/* Play Button Skeuomorphic */}
                        <div className="w-24 h-24 rounded-full bg-brand-light/20 backdrop-blur-sm shadow-glass flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                             <CirclePlay className="w-12 h-12 text-white drop-shadow-lg fill-current" />
                        </div>
                    </div>
                </div>
             </div>
             
             <div className="space-y-8 flex flex-col items-center md:items-start text-left">
               <span className="text-brand-red font-extrabold tracking-widest text-sm uppercase flex items-center shadow-sm">
                 <span className="w-12 h-1 bg-brand-red mr-4 rounded-full shadow-inner lg:block hidden"></span>
                 <span className="bg-red-50 px-3 py-1 rounded-full text-brand-red border border-red-100">{homeConfig.spiritLabel}</span>
               </span>
               <h2 className="text-4xl lg:text-5xl font-serif-heading font-bold text-brand-blue drop-shadow-md">
                 {homeConfig.spiritTitle}
               </h2>
               <div className="bg-brand-light p-8 rounded-3xl shadow-skeuo-input border border-white/50 relative overflow-hidden text-left">
                    <Quote className="absolute top-4 left-4 text-brand-blue/10 w-12 h-12" />
                    <p className="text-gray-600 leading-relaxed text-lg font-medium relative z-10">
                        {homeConfig.spiritQuote}
                    </p>
                    <Quote className="absolute bottom-4 right-4 text-brand-blue/10 w-12 h-12 rotate-180" />
               </div>
               <div className="pt-2">
                 <button onClick={() => navigate('/about')} className="text-brand-blue font-bold flex items-center group bg-brand-light px-8 py-4 rounded-2xl shadow-skeuo-raised hover:shadow-skeuo-pressed transition-all active:scale-95 border border-white">
                   {homeConfig.spiritBtn} <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Impact Stories Cards */}
      <section id="impact-section" className="py-24 bg-brand-light scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end text-left gap-6 mb-16">
            <div className="max-w-2xl">
                <h2 className="text-4xl font-serif-heading font-bold text-brand-blue mb-0 drop-shadow-sm">
                 {homeConfig.impactHeading}
                </h2>
            </div>
            <button onClick={() => navigate('/impact')} className="flex items-center justify-center text-brand-blue font-bold hover:text-brand-red transition px-6 py-3 rounded-xl shadow-skeuo-raised bg-brand-light hover:bg-white w-full md:w-auto">
                View All Stories <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {stories.map((story) => (
              <div key={story.id} className="bg-brand-light rounded-3xl shadow-skeuo-raised hover:shadow-2xl transition-all duration-500 border border-white p-4 group">
                <div className="relative h-64 overflow-hidden rounded-2xl mb-6 shadow-inner">
                  <img 
                    src={story.image || null} 
                    alt={story.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-brand-blue shadow-lg flex items-center">
                       <Globe className="w-3 h-3 mr-1" /> {story.location}
                  </div>
                </div>
                <div className="px-2 pb-4">
                  <h3 className="text-2xl font-bold text-brand-blue mb-3 font-serif-heading group-hover:text-brand-red transition-colors">{story.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm font-medium line-clamp-3">
                    {story.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 bg-gray-100 p-3 rounded-xl shadow-inner border border-white">
                    <CircleCheck className="w-4 h-4 text-brand-green mr-2" />
                    <span className="font-bold text-brand-dark uppercase tracking-wide mr-1">Verified:</span>
                    <span>{story.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
