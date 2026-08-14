import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone, ArrowRight, Lock, Loader2, Check, Linkedin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, SOCIAL_LINKS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getAllSystemSettings } from '../lib/systemSettingsCache';
import { SocialLink } from '../types';
import { VisitorCountBar } from './VisitorCountBar';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Dynamic Config
  const [navItems, setNavItems] = useState(NAV_ITEMS);
  const [contact, setContact] = useState({ 
      address: '', 
      phone: '', 
      email: '' 
  });
  const [slogan, setSlogan] = useState('"Lokah Samastha Sukhino Bhavantu". We are dedicated to the holistic upliftment of society, fostering mental health, education, and collective healing for a sustainable future.');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(SOCIAL_LINKS);
  
  const [textConfig, setTextConfig] = useState({
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      stayUpdated: 'Stay Updated',
      newsletterText: 'Join our newsletter to receive stories of hope, impact reports, and volunteer opportunities.',
      subscribeBtn: 'SUBSCRIBE',
      copyright: '© ' + new Date().getFullYear() + ' Bennu Rising International Foundation. All rights reserved.'
  });

  useEffect(() => {
    if (isSupabaseConfigured()) {
        getAllSystemSettings().then((data) => {
            if (data) {
                const map: any = {};
                data.forEach(d => map[d.key] = d.value);
                if(map.nav_structure) {
                    try { setNavItems(JSON.parse(map.nav_structure)); } catch(e) {}
                }
                if(map.social_links_json) {
                    try { setSocialLinks(JSON.parse(map.social_links_json)); } catch(e) {}
                }
                if(map.footer_text_config_json) {
                    try { setTextConfig(prev => ({...prev, ...JSON.parse(map.footer_text_config_json)})); } catch(e) {}
                }
                setContact({
                    address: map.contact_address || contact.address,
                    phone: map.contact_phone || contact.phone,
                    email: map.contact_email || contact.email
                });
                if(map.footer_slogan) setSlogan(map.footer_slogan);
            }
        });
    }
  }, []);

  const handleJoinClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus('idle');

    if (isSupabaseConfigured()) {
        try {
            const { error } = await supabase.from('newsletter_subscribers').insert({ email });
            if (error) {
                // Ignore unique constraint errors (already subscribed)
                if (error.code !== '23505') throw error;
            }
            setStatus('success');
            setEmail('');
        } catch (err) {
            console.error("Newsletter Subscription Error:", err);
            setStatus('error');
        }
    } else {
        // Simulation mode
        await new Promise(r => setTimeout(r, 1000));
        setStatus('success');
        setEmail('');
    }
    
    setLoading(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
        if (status === 'success') setStatus('idle');
    }, 5000);
  };

  const getSocialIcon = (platform: string) => {
      switch(platform) {
          case 'facebook': return <Facebook className="w-5 h-5 text-blue-300 hover:text-brand-green cursor-pointer transition" />;
          case 'twitter': return <Twitter className="w-5 h-5 text-blue-300 hover:text-brand-green cursor-pointer transition" />;
          case 'instagram': return <Instagram className="w-5 h-5 text-blue-300 hover:text-brand-green cursor-pointer transition" />;
          case 'youtube': return <Youtube className="w-5 h-5 text-blue-300 hover:text-brand-green cursor-pointer transition" />;
          case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-300 hover:text-brand-green cursor-pointer transition" />;
          default: return <ArrowRight className="w-5 h-5" />;
      }
  };

  return (
    <footer className="bg-brand-blue text-white pt-16 pb-8 border-t-4 border-brand-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: About / Logo */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6 bg-white/90 p-4 rounded-xl inline-block">
                <img 
                  src="/logo1.png" 
                  alt="Bennu Rising International Foundation" 
                  className="h-20 w-auto object-contain"
                />
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              {slogan}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}>
                      {getSocialIcon(link.platform)}
                  </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-brand-green">{textConfig.quickLinks}</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-blue-100">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/portal" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Contributor Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-brand-green">{textConfig.contactUs}</h4>
            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 flex-shrink-0 text-brand-green" />
                <span className="whitespace-pre-line">{contact.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 text-brand-green" />
                <span>{contact.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0 text-brand-green" />
                <span>{contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-brand-green">{textConfig.stayUpdated}</h4>
            <p className="text-sm text-blue-100 mb-4 font-medium">
              {textConfig.newsletterText}
            </p>
            <form onSubmit={handleJoinClick} className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'success'}
                className="bg-brand-blue border border-blue-500 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-green w-full placeholder-blue-300 shadow-inner disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={loading || status === 'success'}
                className={`bg-brand-green text-brand-blue px-4 py-3 rounded font-bold hover:bg-white hover:text-brand-blue transition shadow-lg flex items-center justify-center group ${status === 'success' ? 'bg-white text-brand-blue' : ''}`}
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                    status === 'success' ? <><Check className="mr-2 w-5 h-5" /> Subscribed!</> : <>{textConfig.subscribeBtn} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
              {status === 'error' && <p className="text-xs text-red-300">Something went wrong. Try again.</p>}
            </form>
          </div>
        </div>
        
        <div className="relative py-2">
          <VisitorCountBar />
          <img 
            src="/infinity.png" 
            alt="Infinity" 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-10 object-contain mix-blend-screen pointer-events-none"
            style={{ 
              filter: "invert(1) sepia(1) saturate(6) hue-rotate(-10deg) brightness(1.2) contrast(1.2)",
              opacity: 0.9 
            }}
            aria-hidden="true"
          />
        </div>
        
        <div className="border-t border-blue-800 pt-8 text-center flex flex-col md:flex-row justify-between items-center text-blue-300 gap-4">
          <p className="text-xs">{textConfig.copyright}</p>
          <div className="flex space-x-6 text-xs font-medium">
              <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link to="/refund" className="hover:text-white transition">Refund Policy</Link>
          </div>
          <Link to="/admin" className="text-blue-800 hover:text-blue-500 transition p-2" title="Admin Login">
            <Lock className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;