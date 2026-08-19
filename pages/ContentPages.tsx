
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DOMPurify from 'dompurify';
import { GALLERY_ALBUMS, TEAM_MEMBERS, IMPACT_STATS, IMPACT_STORIES, BLOG_POSTS, RAZORPAY_KEY_ID, FOUNDATION_OBJECTIVES, FOUNDATION_OBJECTIVES_NOTE } from '../constants';
import { Mail, Phone, MapPin, Heart, BookOpen, Shield, Sprout, Activity, Users, Globe, Zap, HandHeart, CircleCheck, ChevronRight, X, ZoomIn, Calendar, FileCheck, Award, TrendingUp, ArrowRight, UserPlus, Star, Clock, Check, Building2, Briefcase, Newspaper, Search, Stethoscope, GraduationCap, Tent, Landmark, Sun, Brain, Loader2, Palette, Scale, Droplet, Mountain, Sparkles, Handshake, Target, ArrowUpRight, Quote, Hash, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ChevronDown, FileText, CircleHelp, Anchor, Accessibility, CreditCard, Lock, Plus, Minus, HeartHandshake } from 'lucide-react';
import { Album, BlogPost, ImpactStory, MissionGroup, MissionCause } from '../types';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import * as LucideIcons from 'lucide-react';
import SEO from '../components/SEO';

// Reusable Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-scale-in">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Improved Page Layout with Hero Support ---
interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  theme?: 'blue' | 'beige' | 'white';
  heroImage?: string;
  heroOverlay?: number;
  // Optional overrides for the <title>/meta description Google sees — falls
  // back to the visible hero title/subtitle when not given, so every page
  // gets at least a unique, real <title> instead of the one generic title
  // every route used to share.
  seoTitle?: string;
  seoDescription?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children, theme = 'white', heroImage, heroOverlay = 60, seoTitle, seoDescription }) => (
  <div className={`min-h-screen ${theme === 'beige' ? 'bg-[#EFEBE0]' : 'bg-brand-light'}`}>
    <SEO
      title={`${seoTitle || title} | Bennu Rising International Foundation`}
      description={seoDescription || subtitle}
    />
    {/* Hero Section */}
    <div className="relative w-full">
        <div className="pt-32 pb-12 px-4 text-center max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif-heading font-extrabold text-brand-blue mb-4 drop-shadow-sm">{title}</h1>
            {subtitle && <p className="text-lg lg:text-xl text-gray-600 font-medium max-w-4xl mx-auto">{subtitle}</p>}
            <div className="w-32 h-2 bg-gradient-to-r from-brand-blue to-brand-green mx-auto mt-6 rounded-full shadow-inner"></div>
        </div>
    </div>
    
    {/* Content */}
    <div className="container mx-auto px-4 pb-24">
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  </div>
);

// --- LEGAL PAGES (Dynamic) ---

// Dynamic Helper
const useLegalContent = (key: string, defaultContent: string) => {
    const [content, setContent] = useState<string | null>(null);
    useEffect(() => {
        if (isSupabaseConfigured()) {
            supabase.from('system_settings').select('value').eq('key', key).single().then(({data}) => {
                if(data && data.value) setContent(data.value);
            });
        }
    }, [key]);
    return content || defaultContent;
};

const LegalLayout = ({ title, date, children }: { title: string, date: string, children?: React.ReactNode }) => (
    <div className="min-h-screen bg-brand-light pt-32 pb-20 px-4">
        <SEO title={`${title} | Bennu Rising International Foundation`} />
        <div className="max-w-4xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-skeuo-raised border border-white">
            <h1 className="text-4xl font-serif-heading font-bold text-brand-blue mb-4">{title}</h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-12">Last Updated: {date}</p>
            <div className="prose prose-blue max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600">
                {children}
            </div>
        </div>
    </div>
);

export const PrivacyPage = () => {
    const defaultText = `
        <p>Bennu Rising International Foundation ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Bennu Rising International Foundation.</p>
        <p>This Privacy Policy applies to our website, and its associated subdomains (collectively, our "Service") alongside our application, Bennu Rising International Foundation. By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.</p>
        
        <h3>Definitions and key terms</h3>
        <p>To help explain things as clearly as possible in this Privacy Policy, every time any of these terms are referenced, are strictly defined as:</p>
        <ul class="list-disc pl-5 mb-4">
        <li><strong>Cookie:</strong> small amount of data generated by a website and saved by your web browser.</li>
        <li><strong>Company:</strong> when this policy mentions "Company," "we," "us," or "our," it refers to Bennu Rising International Foundation that is responsible for your information under this Privacy Policy.</li>
        <li><strong>Country:</strong> where Bennu Rising International Foundation or the owners/founders of Bennu Rising International Foundation are based, in this case is India.</li>
        <li><strong>Customer:</strong> refers to the company, organization or person that signs up to use the Bennu Rising International Foundation Service to manage the relationships with your consumers or service users.</li>
        <li><strong>Device:</strong> any internet connected device such as a phone, tablet, computer or any other device that can be used to visit Bennu Rising International Foundation and use the services.</li>
        <li><strong>IP address:</strong> Every device connected to the Internet is assigned a number known as an Internet protocol (IP) address.</li>
        <li><strong>Personnel:</strong> refers to those individuals who are employed by Bennu Rising International Foundation or are under contract to perform a service on behalf of one of the parties.</li>
        <li><strong>Personal Data:</strong> any information that directly, indirectly, or in connection with other information allows for the identification or identifiability of a natural person.</li>
        <li><strong>Service:</strong> refers to the service provided by Bennu Rising International Foundation.</li>
        <li><strong>Third-party service:</strong> refers to advertisers, contest sponsors, promotional and marketing partners.</li>
        <li><strong>Website:</strong> Bennu Rising International Foundation's site.</li>
        <li><strong>You:</strong> a person or entity that is registered with Bennu Rising International Foundation to use the Services.</li>
        </ul>

        <h3>What Information Do We Collect?</h3>
        <p>We collect information from you when you visit our website, register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form.</p>
        <ul class="list-disc pl-5 mb-4">
        <li>Name / Username</li>
        <li>Phone Numbers</li>
        <li>Email Addresses</li>
        </ul>

        <h3>How Do We Use The Information We Collect?</h3>
        <p>Any of the information we collect from you may be used in one of the following ways:</p>
        <ul class="list-disc pl-5 mb-4">
        <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
        <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)</li>
        <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
        <li>To process transactions</li>
        <li>To administer a contest, promotion, survey or other site feature</li>
        <li>To send periodic emails</li>
        </ul>

        <h3>When does Bennu Rising International Foundation use end user information from third parties?</h3>
        <p>Bennu Rising International Foundation will collect End User Data necessary to provide the Bennu Rising International Foundation services to our customers.</p>
        <p>End users may voluntarily provide us with information they have made available on social media websites. If you provide us with any such information, we may collect publicly available information from the social media websites you have indicated. You can control how much of your information social media websites make public by visiting these websites and changing your privacy settings.</p>

        <h3>When does Bennu Rising International Foundation use customer information from third parties?</h3>
        <p>We receive some information from the third parties when you contact us. For example, when you submit your email address to us to show interest in becoming a Bennu Rising International Foundation customer, we receive information from a third party that provides automated fraud detection services to Bennu Rising International Foundation. We also occasionally collect information that is made publicly available on social media websites.</p>

        <h3>Do we share the information we collect with third parties?</h3>
        <p>We may share the information that we collect, both personal and non-personal, with third parties such as advertisers, contest sponsors, promotional and marketing partners, and others who provide our content or whose products or services we think may interest you. We may also share it with our current and future affiliated companies and business partners.</p>
        <p>We may engage trusted third party service providers to perform functions and provide services to us, such as hosting and maintaining our servers and the website, database storage and management, e-mail management, storage marketing, credit card processing, customer service and fulfilling orders for products and services you may purchase through the website. We will likely share your personal information, and possibly some non-personal information, with these third parties to enable them to perform these services for us and for you.</p>

        <h3>Where and when is information collected from customers and end users?</h3>
        <p>Bennu Rising International Foundation will collect personal information that you submit to us. We may also receive personal information about you from third parties as described above.</p>

        <h3>How Do We Use Your Email Address?</h3>
        <p>By submitting your email address on this website, you agree to receive emails from us. You can cancel your participation in any of these email lists at any time by clicking on the opt-out link or other unsubscribe option that is included in the respective email.</p>

        <h3>How Long Do We Keep Your Information?</h3>
        <p>We keep your information only so long as we need it to provide Bennu Rising International Foundation to you and fulfill the purposes described in this policy.</p>

        <h3>How Do We Protect Your Information?</h3>
        <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server.</p>

        <h3>Could my information be transferred to other countries?</h3>
        <p>Bennu Rising International Foundation is incorporated in India. Information collected via our website, through direct interactions with you, or from use of our help services may be transferred from time to time to our offices or personnel, or to third parties, located throughout the world.</p>

        <h3>Is the information collected through the Bennu Rising International Foundation Service secure?</h3>
        <p>We take precautions to protect the security of your information. We have physical, electronic, and managerial procedures to help safeguard, prevent unauthorized access, maintain data security, and correctly use your information.</p>

        <h3>Can I update or correct my information?</h3>
        <p>The rights you have to request updates or corrections to the information Bennu Rising International Foundation collects depend on your relationship with Bennu Rising International Foundation. Personnel may update or correct their information as detailed in our internal company employment policies.</p>

        <h3>Changes To Our Privacy Policy</h3>
        <p>We may change our Service and policies, and we may need to make changes to this Privacy Policy so that they accurately reflect our Service and policies. Unless otherwise required by law, we will notify you (for example, through our Service) before we make changes to this Privacy Policy and give you an opportunity to review them before they go into effect.</p>

        <h3>Contact Us</h3>
        <p>Don't hesitate to contact us if you have any questions.<br/>
        Via Email: contact@bennurising.org</p>
    `;
    const content = useLegalContent('privacy_policy', defaultText);

    return (
        <LegalLayout title="Privacy Policy" date="January 1, 2024">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
        </LegalLayout>
    );
};

export const TermsPage = () => {
    const defaultText = `
        <h3>General Terms</h3>
        <p>By accessing and placing an order with Bennu Rising International Foundation, you confirm that you are in agreement with and bound by the terms of service contained in the Terms &amp; Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Bennu Rising International Foundation. Under no circumstances shall Bennu Rising International Foundation team be liable for any direct, indirect, special, incidental or consequential damages, including, but not limited to, loss of data or profit, arising out of the use, or the inability to use, the materials on this site, even if Bennu Rising International Foundation team or an authorized representative has been advised of the possibility of such damages. If your use of materials from this site results in the need for servicing, repair or correction of equipment or data, you assume any costs thereof. Bennu Rising International Foundation will not be responsible for any outcome that may occur during the course of usage of our resources. We reserve the rights to change prices and revise the resources usage policy in any moment.</p>

        <h3>License</h3>
        <p>Bennu Rising International Foundation grants you a revocable, non-exclusive, non-transferable, limited license to download, install and use the website strictly in accordance with the terms of this Agreement. These Terms &amp; Conditions are a contract between you and Bennu Rising International Foundation (referred to in these Terms &amp; Conditions as "Bennu Rising International Foundation", "us", "we" or "our"), the provider of the website and the services accessible from the website.</p>

        <h3>Definitions and key terms</h3>
        <ul class="list-disc pl-5 mb-4">
        <li><strong>Cookie:</strong> small amount of data generated by a website and saved by your web browser.</li>
        <li><strong>Company:</strong> when this policy mentions "Company," "we," "us," or "our," it refers to Bennu Rising International Foundation.</li>
        <li><strong>Country:</strong> where Bennu Rising International Foundation or the owners/founders are based.</li>
        <li><strong>Device:</strong> any internet connected device that can be used to visit Bennu Rising International Foundation and use the services.</li>
        <li><strong>Service:</strong> refers to the service provided by Bennu Rising International Foundation.</li>
        <li><strong>Third-party service:</strong> refers to advertisers, contest sponsors, promotional and marketing partners.</li>
        <li><strong>Website:</strong> Bennu Rising International Foundation's site.</li>
        <li><strong>You:</strong> a person or entity that is registered with Bennu Rising International Foundation to use the Services.</li>
        </ul>

        <h3>Restrictions</h3>
        <p>You agree not to, and you will not permit others to:</p>
        <ul class="list-disc pl-5 mb-4">
        <li>License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the website.</li>
        <li>Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the website.</li>
        <li>Remove, alter or obscure any proprietary notice of Bennu Rising International Foundation or its affiliates.</li>
        </ul>

        <h3>Return and Refund Policy</h3>
        <p>Thanks for supporting Bennu Rising International Foundation. We want to make sure you have a rewarding experience while you’re exploring, evaluating, and supporting our cause. As with any experience, there are terms and conditions that apply to transactions at Bennu Rising International Foundation. The main thing to remember is that by placing an order or making a donation at Bennu Rising International Foundation, you agree to the terms along with Privacy Policy. If, for any reason, You are not completely satisfied with any good or service that we provide, don't hesitate to contact us and we will discuss any of the issues you are going through.</p>

        <h3>Your Suggestions</h3>
        <p>Any feedback, comments, ideas, improvements or suggestions (collectively, "Suggestions") provided by you to Bennu Rising International Foundation with respect to the website shall remain the sole and exclusive property of Bennu Rising International Foundation.</p>

        <h3>Your Consent</h3>
        <p>We've updated our Terms &amp; Conditions to provide you with complete transparency into what is being set when you visit our site and how it's being used. By using our website, registering an account, or making a donation, you hereby consent to our Terms &amp; Conditions.</p>

        <h3>Links to Other Websites</h3>
        <p>This Terms &amp; Conditions applies only to the Services. We are not responsible for the content, accuracy or opinions expressed in such websites, and such websites are not investigated, monitored or checked for accuracy or completeness by us.</p>

        <h3>Cookies</h3>
        <p>Bennu Rising International Foundation uses "Cookies" to identify the areas of our website that you have visited. We use Cookies to enhance the performance and functionality of our website but are non-essential to their use.</p>

        <h3>Changes To Our Terms &amp; Conditions</h3>
        <p>You acknowledge and agree that we may stop (permanently or temporarily) providing the Service. If we decide to change our Terms &amp; Conditions, we will post those changes on this page.</p>

        <h3>Modifications to Our website</h3>
        <p>Bennu Rising International Foundation reserves the right to modify, suspend or discontinue, temporarily or permanently, the website or any service to which it connects, with or without notice and without liability to you.</p>

        <h3>Updates to Our website</h3>
        <p>Bennu Rising International Foundation may from time to time provide enhancements or improvements to the features/ functionality of the website.</p>

        <h3>Third-Party Services</h3>
        <p>We may display, include or make available third-party content. You acknowledge and agree that Bennu Rising International Foundation shall not be responsible for any Third-Party Services.</p>

        <h3>Term and Termination</h3>
        <p>This Agreement shall remain in effect until terminated by you or Bennu Rising International Foundation. Bennu Rising International Foundation may, in its sole discretion, at any time and for any or no reason, suspend or terminate this Agreement with or without prior notice.</p>

        <h3>Copyright Infringement Notice</h3>
        <p>If you are a copyright owner or such owner’s agent and believe any material on our website constitutes an infringement on your copyright, please contact us.</p>

        <h3>Indemnification</h3>
        <p>You agree to indemnify and hold Bennu Rising International Foundation and its affiliates harmless from any claim or demand, due to or arising out of your use of the website.</p>

        <h3>No Warranties</h3>
        <p>The website is provided to you "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind.</p>

        <h3>Limitation of Liability</h3>
        <p>Notwithstanding any damages that you might incur, the entire liability of Bennu Rising International Foundation and any of its suppliers under any provision of this Agreement and your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by you for the website.</p>

        <h3>Severability</h3>
        <p>If any provision of this Agreement is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law.</p>

        <h3>Waiver</h3>
        <p>Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Agreement shall not effect a party's ability to exercise such right.</p>

        <h3>Amendments to this Agreement</h3>
        <p>Bennu Rising International Foundation reserves the right, at its sole discretion, to modify or replace this Agreement at any time.</p>

        <h3>Entire Agreement</h3>
        <p>The Agreement constitutes the entire agreement between you and Bennu Rising International Foundation regarding your use of the website.</p>

        <h3>Updates to Our Terms</h3>
        <p>We may change our Service and policies, and we may need to make changes to these Terms so that they accurately reflect our Service and policies.</p>

        <h3>Intellectual Property</h3>
        <p>The website and its entire contents are owned by Bennu Rising International Foundation, its licensors or other providers of such material and are protected by international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.</p>

        <h3>Agreement to Arbitrate</h3>
        <p>This section applies to any dispute EXCEPT IT DOESN’T INCLUDE A DISPUTE RELATING TO CLAIMS FOR INJUNCTIVE OR EQUITABLE RELIEF REGARDING THE ENFORCEMENT OR VALIDITY OF YOUR OR Bennu Rising International Foundation's INTELLECTUAL PROPERTY RIGHTS.</p>

        <h3>Notice of Dispute</h3>
        <p>In the event of a dispute, you or Bennu Rising International Foundation must give the other a Notice of Dispute. You must send any Notice of Dispute via email to: contact@bennurising.org.</p>

        <h3>Binding Arbitration</h3>
        <p>If you and Bennu Rising International Foundation don’t resolve any dispute by informal negotiation, any other effort to resolve the dispute will be conducted exclusively by binding arbitration.</p>

        <h3>Submissions and Privacy</h3>
        <p>In the event that you submit or post any ideas, creative suggestions, designs, photographs, information, advertisements, data or proposals, you expressly agree that such submissions will automatically be treated as non-confidential and non-proprietary.</p>

        <h3>Promotions</h3>
        <p>Bennu Rising International Foundation may, from time to time, include contests, promotions, sweepstakes, or other activities.</p>

        <h3>Typographical Errors</h3>
        <p>In the event a product and/or service is listed at an incorrect price or with incorrect information due to typographical error, we shall have the right to refuse or cancel any orders placed.</p>

        <h3>Miscellaneous</h3>
        <p>If for any reason a court of competent jurisdiction finds any provision or portion of these Terms &amp; Conditions to be unenforceable, the remainder of these Terms &amp; Conditions will continue in full force and effect.</p>

        <h3>Disclaimer</h3>
        <p>Bennu Rising International Foundation is not responsible for any content, code or any other imprecision. Bennu Rising International Foundation does not provide warranties or guarantees.</p>

        <h3>Contact Us</h3>
        <p>Don't hesitate to contact us if you have any questions.<br/>Via Email: contact@bennurising.org</p>
    `;
    const content = useLegalContent('terms_service', defaultText);

    return (
        <LegalLayout title="Terms of Service" date="January 1, 2024">
             <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
        </LegalLayout>
    );
};

export const RefundPage = () => {
    const defaultText = `
        <p>At Bennu Rising International Foundation, we are deeply committed to the well-being of our beneficiaries and ensuring transparency with our donors. Your generosity allows us to create meaningful change, and we strive to honor that trust. Below is our refund policy, which has been designed to address potential concerns in a fair and transparent manner.</p>

        <h3>Donation Refund Policy</h3>
        
        <h4>Eligibility for Refunds</h4>
        <ul class="list-disc pl-5 mb-4">
            <li>Refunds will be considered in cases of accidental donations, incorrect amounts, or duplicate transactions.</li>
            <li>Requests for refunds must be made within 7 days of the donation date.</li>
        </ul>

        <h4>Non-Refundable Cases</h4>
        <ul class="list-disc pl-5 mb-4">
            <li>Donations made through third-party platforms may be subject to the refund policies of those platforms.</li>
            <li>Donations that have already been allocated to project activities are non-refundable.</li>
        </ul>

        <h4>Process for Refunds</h4>
        <p>Refund requests must be submitted via email to contact@bennurising.org with the following details:</p>
        <ul class="list-disc pl-5 mb-4">
            <li>Donor’s full name.</li>
            <li>Date and amount of the donation.</li>
            <li>Transaction reference number.</li>
            <li>Reason for the refund request.</li>
        </ul>
        <p>We may require additional verification to process your request.</p>

        <h4>Processing Time</h4>
        <p>Once the refund request is approved, it may take 7-10 business days for the amount to reflect in your account, depending on your payment method.</p>

        <h4>Contact for Queries</h4>
        <p>For any questions or concerns about our refund policy, please reach out to our team at contact@bennurising.org.</p>

        <h3>Merchandise Return and Refund Policy</h3>
        <p>If you have purchased merchandise from Bennu Rising International Foundation, the following terms apply:</p>

        <h4>Returns</h4>
        <ul class="list-disc pl-5 mb-4">
            <li>Items can be returned within 15 days of receipt, provided they are unused, in their original condition, and accompanied by the purchase receipt.</li>
            <li>Return shipping costs will be borne by the customer unless the return is due to a defective or incorrect item being delivered.</li>
        </ul>

        <h4>Refunds</h4>
        <ul class="list-disc pl-5 mb-4">
            <li>Refunds for returned items will be processed within 7-10 business days after the returned product is received and inspected.</li>
            <li>Refunds will be issued to the original payment method.</li>
        </ul>

        <h4>Exchanges</h4>
        <p>Exchanges are allowed for items of equal or lesser value, subject to availability.</p>

        <h4>How to Initiate a Return or Exchange</h4>
        <p>To initiate a return or exchange, please contact us at contact@bennurising.org with your order details and reason for the return or exchange.</p>

        <h3>Shipping Policy</h3>
        <p>As Bennu Rising International Foundation primarily accepts donations to support our causes, shipping is not applicable in our operations. No physical goods are shipped to you.</p>

        <h3>Changes to this Policy</h3>
        <p>Bennu Rising International Foundation reserves the right to update or modify this refund policy at any time. Changes will be effective immediately upon posting on this page. We encourage you to review this page periodically to stay informed about our policies.</p>

        <p>Thank you for your trust and support in helping us make a difference!</p>
    `;
    const content = useLegalContent('refund_policy', defaultText);

    return (
        <LegalLayout title="Refund & Cancellation Policy" date="January 1, 2024">
             <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
        </LegalLayout>
    );
};


export const AboutPage: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [config, setConfig] = useState({
      heroTitle: "Who We Are",
      heroSubtitle: "Lokah Samastha Sukhino Bhavantu — May all beings everywhere be happy and free.",
      heroImage: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2000&auto=format&fit=crop",
      storyTitle: "The Spirit of the Bennu Bird",
      storyContent: "Bennu Rising International Foundation draws its name from the mythical Bennu bird—an ancient Egyptian deity associated with the sun, creation, and rebirth. Often depicted as a grey heron with a long beak and two-feathered crest, it was believed to be the ba (soul) of the sun god Ra, having created itself and initiated creation with its call. Representing resurrection and the annual Nile floods, it is closely associated with Osiris and considered the inspiration for the Greek phoenix, symbolizing immortality and self-regeneration. As the 'Lord of Jubilees', it signifies the periodic renewal of life. Just as the bird rises, we believe that every individual and community has the innate power to heal, rebuild, and soar. Founded in 2026, our organization bridges the gap between ancient wisdom and modern humanitarian aid. We don't just offer charity; we offer the tools for self-reliance.",
      storyImage: "",
      visionText: "To create a world where mental health, social dignity, and national integrity are not privileges, but fundamental rights accessible to the last person in the line.",
      leadershipTitle: "Our Leadership"
  });

  useEffect(() => {
      if(isSupabaseConfigured()) {
          supabase.from('team_members').select('*').neq('is_deleted', true).eq('approval_status', 'published').order('display_order').then(({data}) => {
              if(data && data.length > 0) setMembers(data.map((m:any) => ({ name: m.name, role: m.role, bio: m.bio, image: m.image_url || m.image })));
          });
          
          supabase.from('system_settings').select('*')
          .in('key', ['about_hero_title', 'about_hero_subtitle', 'about_hero_image', 'about_story_title', 'about_story_content', 'about_story_image', 'about_vision_text', 'about_leadership_title'])
          .then(({data}) => {
              if (data) {
                  const val = (k: string) => data.find(d => d.key === k)?.value;
                  setConfig(prev => ({
                      heroTitle: val('about_hero_title') || prev.heroTitle,
                      heroSubtitle: val('about_hero_subtitle') || prev.heroSubtitle,
                      heroImage: val('about_hero_image') || prev.heroImage,
                      storyTitle: val('about_story_title') || prev.storyTitle,
                      storyContent: val('about_story_content') || prev.storyContent,
                      storyImage: val('about_story_image') || prev.storyImage,
                      visionText: val('about_vision_text') || prev.visionText,
                      leadershipTitle: val('about_leadership_title') || prev.leadershipTitle
                  }));
              }
          });
      }
  }, []);

  return (
  <PageLayout
    title={config.heroTitle}
    subtitle={config.heroSubtitle}
    heroImage={config.heroImage}
    seoDescription="Learn about Bennu Rising International Foundation, an NGO working across India on mental health, addiction rehabilitation, tribal education, disaster relief, and welfare for armed forces families."
  >
    <div id="our-story" className="mb-24 scroll-mt-24 text-gray-700 text-lg leading-relaxed font-medium">
      <h3 className="text-3xl font-bold text-brand-blue font-serif-heading drop-shadow-sm mb-6">{config.storyTitle}</h3>
      <div className="clearfix">
          {/* Desktop/Tablet Floated Image - Hidden on mobile */}
          <div className="hidden md:block float-left w-1/2 lg:w-5/12 mr-8 mb-6 relative p-4 md:p-6 rounded-[2.5rem] bg-brand-light shadow-skeuo-raised border border-white">
             <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-[4/3] bg-white border-4 border-gray-100 flex items-center justify-center p-4 md:p-8">
                 <img src={config.storyImage || null} alt="The Spirit of Bennu" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
             </div>
          </div>
          
          <p className="mb-6 whitespace-pre-wrap text-left block">{config.storyContent}</p>
          
          {/* Mobile Image - Shown only on mobile, placed after the paragraph */}
          <div className="md:hidden w-full mb-8 mt-4 relative p-4 rounded-[2.5rem] bg-brand-light shadow-skeuo-raised border border-white">
             <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-[4/3] bg-white border-2 border-gray-100 flex items-center justify-center p-4">
                 <img src={config.storyImage || null} alt="The Spirit of Bennu" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
             </div>
          </div>
          
          <div className="bg-white/50 p-6 rounded-2xl shadow-skeuo-input border border-white/60 flex items-start mt-4 md:mt-8 clear-both md:clear-none">
             <Award className="w-10 h-10 text-brand-red mr-4 flex-shrink-0" />
             <div>
                  <h4 className="font-bold text-brand-blue text-lg">Our Vision</h4>
                  <p className="text-gray-600 text-sm">{config.visionText}</p>
             </div>
          </div>
      </div>
    </div>
    <div id="objectives" className="mb-24 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-4xl font-serif-heading font-bold text-brand-blue mb-6">Objectives of the Foundation</h3>
            <p className="text-gray-600 text-lg">Our comprehensive approach to holistic healing, empowerment, and sustainable development.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOUNDATION_OBJECTIVES.map((objective, idx) => {
                const icons = [Target, Heart, Shield, Sprout, Activity, Users, Globe, HandHeart, Sparkles, Scale];
                const Icon = icons[idx % icons.length];
                return (
                <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-red font-bold flex items-center justify-center text-lg mb-6 group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium flex-grow text-left">
                        {objective}
                    </p>
                </div>
                );
            })}
        </div>
        
        <div className="mt-12 bg-gradient-to-br from-brand-blue to-blue-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
                    <Award className="w-8 h-8 text-brand-light" />
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-2 text-white">Scope of Support</h4>
                    <p className="text-blue-100 text-sm md:text-base leading-relaxed italic">
                        {FOUNDATION_OBJECTIVES_NOTE}
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div id="leadership" className="mb-12 scroll-mt-24">
        <h3 className="text-3xl font-serif-heading font-bold text-center text-brand-blue mb-12">{config.leadershipTitle}</h3>
        <div className="space-y-12">
            {members.map((member, idx) => (
                <div key={idx} className="bg-brand-light rounded-[2.5rem] p-8 shadow-skeuo-raised border border-white group transition-all hover:shadow-skeuo-sm clearfix">
                    {/* Desktop Float Image */}
                    <div className={`hidden md:block w-1/3 max-w-sm ${idx % 2 !== 0 ? 'float-right ml-8' : 'float-left mr-8'} mb-4`}>
                        <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-square group-hover:scale-[1.02] transition-transform">
                            <img src={member.image || null} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                        <h4 className="text-3xl font-bold text-gray-800 mb-2">{member.name}</h4>
                        <span className="text-brand-red font-bold text-sm uppercase tracking-wider block mb-4">{member.role}</span>
                    </div>
                    
                    <p className="text-gray-700 text-lg leading-relaxed text-left block">{member.bio}</p>
                    
                    {/* Mobile Image */}
                    <div className="md:hidden w-full max-w-sm mx-auto mt-6">
                        <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-square group-hover:scale-[1.02] transition-transform">
                            <img src={member.image || null} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  </PageLayout>
  );
};

// --- Core Pillar Card Component ---
const PillarCard: React.FC<{ cause: MissionCause, group: MissionGroup, renderIcon: (icon: string, className: string) => React.ReactNode }> = ({ cause, group, renderIcon }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <motion.div 
            layout
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className="bg-brand-light p-6 rounded-3xl shadow-skeuo-raised border border-white hover:shadow-lg transition-shadow duration-300 group cursor-pointer flex flex-col relative overflow-hidden h-full"
        >
            <motion.div layout className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-brand-light shadow-skeuo-pressed border border-white/50 ${group.color}`}>
                    {renderIcon(cause.icon || 'Heart', "w-6 h-6")}
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`${group.color}`}
                >
                    <ChevronRight className="w-5 h-5" />
                </motion.div>
            </motion.div>
            
            <motion.h3 layout className="text-lg font-bold text-gray-800 mb-2 group-hover:text-brand-blue transition-colors leading-tight">
                {cause.title}
            </motion.h3>
            
            <motion.div layout className="overflow-hidden">
                <p className={`text-xs text-gray-500 font-medium leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                    {cause.desc || (cause as any).description}
                </p>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                    >
                        <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${group.color} flex items-center`}>
                            Mission Focused <ArrowRight className="ml-2 w-3 h-3" />
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Subtle internal glow on expand */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.05 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 pointer-events-none ${group.color.replace('text-', 'bg-')}`}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const WorkPage: React.FC = () => {
  const location = useLocation();
  const [groups, setGroups] = useState<MissionGroup[]>([]);
  const [causes, setCauses] = useState<MissionCause[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
      heroTitle: "Our Work",
      heroSubtitle: "A comprehensive ecosystem of care, spanning critical operational verticals.",
      heroImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2000&auto=format&fit=crop",
      methodologyTitle: "A Lifecycle of Transformation",
      methodologyDesc: "Our framework ensures that every intervention leads to sustainable independence through a structured 4-step journey.",
      methodologySteps: [
          { icon: 'Search', title: "Identify", desc: "Locating marginalized communities & assessing critical needs.", color: "text-brand-red", step: "01" },
          { icon: 'Heart', title: "Heal", desc: "Providing medical aid, trauma therapy, and de-addiction.", color: "text-brand-blue", step: "02" },
          { icon: 'GraduationCap', title: "Empower", desc: "Skill development, education, and vocational training.", color: "text-brand-green", step: "03" },
          { icon: 'Users', title: "Reintegrate", desc: "Restoring dignity and social standing within the community.", color: "text-purple-600", step: "04" }
      ],
      verticalsTitle: "Our Core Pillars",
      verticalsSubtitle: "Our Areas of Impact"
  });

  // Fallback Data
  const defaultGroups = [
    { id: 1, title: "Pillar 1 — Individual Transformation & Mental Health", description: "Focusing on mental health, emotional resilience, addiction recovery, and holistic healing.", color: "text-brand-red", icon: "Brain", display_order: 1 },
    { id: 2, title: "Pillar 2 — Community Health & Development", description: "Empowering communities through basic needs, inclusion, specialized healthcare awareness, and sustainable empowerment.", color: "text-brand-blue", icon: "Users", display_order: 2 },
    { id: 3, title: "Pillar 3 — Disaster Response & Resilience", description: "Focusing on emergency relief, psychological first aid, rehabilitation, and disaster preparedness.", color: "text-brand-green", icon: "Shield", display_order: 3 },
    { id: 4, title: "Pillar 4 — Research, Policy & Advocacy", description: "Focusing on data collection, policy research, government engagement, and knowledge creation.", color: "text-purple-600", icon: "FileText", display_order: 4 },
  ];

  const defaultCauses = [
    // Group 1
    { 
        id: 1, 
        group_id: 1, 
        title: "Substance Abuse & Rehabilitation", 
        desc: "To support in preventing substance abuse including narcotic and alcohol addiction and to provide rehabilitation, counselling and reintegration support to affected individuals and families.", 
        icon: "Activity" 
    },
    { 
        id: 2, 
        group_id: 1, 
        title: "Mental Health & Psychological Well-being", 
        desc: "To promote mental health, psychological well-being and emotional resilience through awareness programs, counselling services, research, community outreach and other supportive initiatives.", 
        icon: "Brain" 
    },
    { 
        id: 3, 
        group_id: 1, 
        title: "Psychosocial Support & Distress Recovery", 
        desc: "To facilitate psychosocial support systems and collective healing initiatives for individuals navigating mental, physical, or monetary distress, ensuring long-term emotional resilience.", 
        icon: "HeartHandshake" 
    },
    { 
        id: 4, 
        group_id: 1, 
        title: "Yoga, Meditation & Holistic Wellness", 
        desc: "To support / undertake all activities to promote yoga, meditation and holistic wellness practices for physical, mental and spiritual well-being. To encourage and undertake research, education, awareness and assistance relating to consciousness studies, meditation and human development.", 
        icon: "Sun" 
    },

    // Group 2
    { id: 5, group_id: 2, title: "Basic Needs & Healthcare", desc: "To support healthcare initiatives and provide assistance for basic living needs including food, shelter, healthcare and sanitation for poor, needy and vulnerable populations.", icon: "Building2" },
    { id: 6, group_id: 2, title: "Tribal & Marginalized Empowerment", desc: "To support / work, provide livelihood support and assist in all legal ways for the upliftment and empowerment of tribal communities and socially marginalized or stigmatized groups.", icon: "Mountain" },
    { id: 7, group_id: 2, title: "Disability Inclusion", desc: "To promote and support inclusion, empowerment, welfare of persons with disabilities.", icon: "Accessibility" },
    { id: 8, group_id: 2, title: "Heritage & Arts Preservation", desc: "To preserve, promote and support traditional arts, performing arts and cultural heritage. To support artists in these fields.", icon: "Palette" },
    { id: 9, group_id: 2, title: "Social Justice & Equality", desc: "To promote and assist in gender equality, social justice and equal opportunities in all sections of society and for all.", icon: "Scale" },
    { id: 10, group_id: 2, title: "Autism Support & Awareness", desc: "To create awareness regarding autism spectrum disorders and provide support in welfare, treatment and reintegration to affected individuals and their families.", icon: "Brain" },
    { id: 11, group_id: 2, title: "Thalassemia Welfare", desc: "To create awareness regarding thalassemia and support prevention, treatment and welfare initiatives for affected persons and support their families.", icon: "Droplet" },
    { id: 12, group_id: 2, title: "Cancer Support Services", desc: "To support, promote awareness regarding cancer, early detection and support services for patients and caregivers. To assist those in need.", icon: "Activity" },
    { id: 13, group_id: 2, title: "Skill Development & Livelihood", desc: "To support, promote skill development, vocational training and upskilling opportunities to enhance livelihood and employability in all sections of society and to all.", icon: "Briefcase" },
    { id: 14, group_id: 2, title: "Indigenous Knowledge", desc: "To support, promote research, documentation and awareness regarding traditional healing systems and indigenous medicinal knowledge.", icon: "BookOpen" },
    { id: 15, group_id: 2, title: "Environmental & Animal Welfare", desc: "To support, protect and promote welfare of animals and marine life and support biodiversity conservation.", icon: "Sprout" },
    { id: 16, group_id: 2, title: "Elderly Care & Dignity", desc: "To support the welfare, care and dignity of elderly persons including healthcare, companionship and livelihood support.", icon: "Heart" },
    { id: 17, group_id: 2, title: "Uniformed Forces Support", desc: "To support organisations and members of the Armed Forces, paramilitary forces and police services / uniformed forces. Support in rehabilitation of wounded personnel and assistance to families of fallen soldiers. Support both serving and retired.", icon: "Shield" },
    { id: 18, group_id: 2, title: "Sports & Talent Development", desc: "To support, promote and assist in games and sports or any such activities. To support individuals and organizations / institutions towards the same. Assist nation in finding, building and sustaining new talents and undertake activities for training the same.", icon: "Target" },
    { id: 19, group_id: 2, title: "Sustainable Development", desc: "To promote social welfare and sustainable development by undertaking all activities in the fields of healthcare, mental health, education, rehabilitation, community development, environmental protection, agriculture and empowerment of marginalized communities.", icon: "Globe" },

    // Group 3
    { id: 20, group_id: 3, title: "Emergency Relief", desc: "Providing food, medical aid, and immediate assistance.", icon: "Tent" },
    { id: 21, group_id: 3, title: "Psychological First Aid", desc: "Mental health support during crises.", icon: "HeartHandshake" },
    { id: 22, group_id: 3, title: "Rehabilitation & Livelihood", desc: "Helping communities rebuild and recover economically.", icon: "Briefcase" },
    { id: 23, group_id: 3, title: "Disaster Preparedness", desc: "Training communities for future resilience.", icon: "GraduationCap" },

    // Group 4
    { id: 24, group_id: 4, title: "Data Collection & Impact", desc: "Measuring and analyzing program outcomes.", icon: "TrendingUp" },
    { id: 25, group_id: 4, title: "Policy Research", desc: "Developing evidence-based recommendations.", icon: "Search" },
    { id: 26, group_id: 4, title: "Government Engagement", desc: "Collaborating with authorities for systemic change.", icon: "Landmark" },
    { id: 27, group_id: 4, title: "Training & Capacity Building", desc: "Empowering individuals and organizations.", icon: "Award" },
    { id: 28, group_id: 4, title: "Knowledge Creation", desc: "Publishing reports, studies, and educational materials.", icon: "BookOpen" },
  ];

  useEffect(() => {
      const fetchData = async () => {
          if (isSupabaseConfigured()) {
              const { data: gs } = await supabase.from('mission_groups').select('*').order('display_order');
              const { data: cs } = await supabase.from('mission_causes').select('*').neq('is_deleted', true).order('display_order');
              // Filter published causes on the client side to handle nulls gracefully
              const publishedCauses = cs ? cs.filter(c => !c.approval_status || c.approval_status === 'published') : [];
              
              if (gs && gs.length > 0) setGroups(gs); else setGroups(defaultGroups);
              if (publishedCauses.length > 0) setCauses(publishedCauses); else setCauses(defaultCauses);

              const { data: settings } = await supabase.from('system_settings').select('*')
                .in('key', ['work_hero_title', 'work_hero_subtitle', 'work_hero_image', 'work_methodology_title', 'work_methodology_desc', 'work_methodology_steps_json', 'work_verticals_title', 'work_verticals_subtitle']);
                
              if (settings) {
                  const val = (k: string) => settings.find(d => d.key === k)?.value;
                  const stepsJson = val('work_methodology_steps_json');
                  let newSteps = config.methodologySteps;
                  if (stepsJson) { try { newSteps = JSON.parse(stepsJson); } catch(e){} }

                  setConfig(prev => ({
                      ...prev,
                      heroTitle: val('work_hero_title') || prev.heroTitle,
                      heroSubtitle: val('work_hero_subtitle') || prev.heroSubtitle,
                      heroImage: val('work_hero_image') || prev.heroImage,
                      methodologyTitle: val('work_methodology_title') || prev.methodologyTitle,
                      methodologyDesc: val('work_methodology_desc') || prev.methodologyDesc,
                      verticalsTitle: val('work_verticals_title') || prev.verticalsTitle,
                      verticalsSubtitle: val('work_verticals_subtitle') || prev.verticalsSubtitle,
                      methodologySteps: newSteps
                  }));
              }
          } else {
              setGroups(defaultGroups);
              setCauses(defaultCauses);
          }
          setLoading(false);
      };
      fetchData();
  }, []);

  useEffect(() => {
    if (!loading && location.hash) {
      const scrollToHashElement = () => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      // Try multiple times to ensure it scrolls even if DOM painting is slightly delayed or slow
      setTimeout(scrollToHashElement, 100);
      setTimeout(scrollToHashElement, 500);
    }
  }, [loading, location.hash]);

  const renderIcon = (iconName: string, className: string) => {
      // @ts-ignore
      const IconComponent = LucideIcons[iconName] || LucideIcons.CircleHelp;
      return <IconComponent className={className} />;
  };

  return (
  <PageLayout
    title={config.heroTitle}
    subtitle={config.heroSubtitle}
    heroImage={config.heroImage}
    seoDescription="Explore the programs run by Bennu Rising International Foundation: addiction rehabilitation, mental health support, tribal education, disaster relief, and welfare for veterans and their families."
  >
    {/* 1. Lifecycle of Transformation */}
    <div className="mb-32 pt-8">
        <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-red tracking-widest uppercase mb-4 flex items-center justify-center gap-3">
                <span className="w-12 h-1 bg-brand-red rounded-full shadow-inner"></span> The Methodology <span className="w-12 h-1 bg-brand-red rounded-full shadow-inner"></span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-serif-heading font-bold text-brand-blue drop-shadow-sm">{config.methodologyTitle}</h3>
            <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                {config.methodologyDesc}
            </p>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
            {/* Engraved Connecting Line */}
            <div className="hidden md:block absolute top-16 left-[10%] right-[10%] h-4 bg-brand-light shadow-skeuo-pressed rounded-full border-b border-white/50 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {config.methodologySteps.map((step: any, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                        {/* Step Number Badge */}
                        <div className={`mb-4 bg-brand-light font-bold px-4 py-1 rounded-full shadow-skeuo-raised border border-white text-xs ${step.color}`}>{step.step}</div>
                        
                        {/* Raised Icon Button */}
                        <div className={`w-32 h-32 rounded-full bg-brand-light shadow-skeuo-raised border border-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105 active:shadow-skeuo-pressed active:scale-95`}>
                            <div className={`w-24 h-24 rounded-full bg-brand-light shadow-skeuo-pressed flex items-center justify-center`}>
                                {renderIcon(step.icon, `w-10 h-10 ${step.color} stroke-[2px]`)}
                            </div>
                        </div>
                        
                        <h4 className="text-2xl font-bold text-gray-800 mb-3 font-serif-heading">{step.title}</h4>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed px-2">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>

    {/* 2. Mission Areas - Dynamic */}
    <div className="relative py-12">
        <div className="text-center mb-16">
            <div className="inline-block bg-brand-light px-12 py-8 rounded-[3rem] shadow-skeuo-raised border border-white">
                <h2 className="text-4xl lg:text-5xl font-serif-heading font-bold text-brand-blue mb-2">{config.verticalsTitle}</h2>
                <p className="text-gray-500 text-xl font-medium">{config.verticalsSubtitle}</p>
            </div>
        </div>

        {loading ? (
            <div className="text-center p-20"><Loader2 className="animate-spin w-12 h-12 text-brand-blue mx-auto" /></div>
        ) : (
            <div className="space-y-20">
                {groups.map((group, idx) => (
                    <div 
                        key={group.id} 
                        id={`pillar-${idx + 1}`}
                        className="bg-brand-light p-8 md:p-12 rounded-[3.5rem] shadow-skeuo-raised border border-white relative overflow-hidden scroll-mt-32"
                    >
                        {/* Metal Screw Details */}
                        <div className="absolute top-8 left-8 w-4 h-4 rounded-full bg-gray-300 shadow-skeuo-pressed"></div>
                        <div className="absolute top-8 right-8 w-4 h-4 rounded-full bg-gray-300 shadow-skeuo-pressed"></div>

                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-10 pl-4 lg:pl-12 pt-4">
                            <div className={`w-24 h-24 rounded-3xl bg-brand-light shadow-skeuo-raised border border-white flex items-center justify-center flex-shrink-0 ${group.color}`}>
                                {renderIcon(group.icon, "w-12 h-12 stroke-[2px]")}
                            </div>
                            <div>
                                <h3 className={`font-bold text-3xl lg:text-4xl ${group.color} font-serif-heading mb-2`}>{group.title}</h3>
                                <p className="text-gray-600 font-medium text-lg max-w-2xl">{group.description}</p>
                            </div>
                        </div>

                        {/* Recessed Tray for Cards */}
                        <div className="bg-brand-light rounded-[2.5rem] p-8 md:p-10 shadow-skeuo-pressed border-b border-white/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                                {causes.filter(c => c.group_id === group.id).map((cause) => (
                                    <PillarCard 
                                        key={cause.id} 
                                        cause={cause} 
                                        group={group} 
                                        renderIcon={renderIcon} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>

    {/* Bottom CTA */}
    <div className="mt-24 text-center bg-brand-light p-12 rounded-[3rem] shadow-skeuo-raised border border-white relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif-heading font-bold text-brand-blue mb-8 drop-shadow-sm">Inspired to make a difference?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/donate" className="bg-brand-red text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-skeuo-raised hover:bg-white hover:text-brand-red active:shadow-skeuo-pressed active:scale-95 transition-all border-t border-white/20">Donate to a Cause</Link>
                <Link to="/volunteer" className="bg-brand-light text-brand-blue border border-white px-8 py-4 rounded-2xl font-bold text-lg shadow-skeuo-raised hover:shadow-skeuo-pressed active:scale-95 transition-all">Volunteer</Link>
                <Link to="/internship" className="bg-brand-light text-brand-blue border border-white px-8 py-4 rounded-2xl font-bold text-lg shadow-skeuo-raised hover:shadow-skeuo-pressed active:scale-95 transition-all">Internship</Link>
            </div>
        </div>
    </div>

  </PageLayout>
  );
};

// ... (Other Page Components like ImpactPage, BlogPage etc. remain same, just ensure they are exported correctly)
export const ImpactPage: React.FC = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [selectedStory, setSelectedStory] = useState<ImpactStory | null>(null);
    const [config, setConfig] = useState({
        heroTitle: "Impact Report",
        heroSubtitle: "Measuring the change we bring, one life at a time.",
        heroImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2000&auto=format&fit=crop"
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!isSupabaseConfigured()) return;
            try {
                const { data: dbStats } = await supabase.from('impact_stats').select('*').neq('is_deleted', true).eq('approval_status', 'published').order('display_order', { ascending: true });
                if (dbStats && dbStats.length > 0) setStats(dbStats);

                const { data: dbStories } = await supabase.from('impact_stories').select('*').neq('is_deleted', true).eq('approval_status', 'published').order('created_at', { ascending: false });
                if (dbStories && dbStories.length > 0) {
                    setStories(dbStories.map((s: any) => ({
                        id: s.id,
                        image: s.image_url || "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800",
                        title: s.title,
                        description: s.description,
                        author: s.author,
                        location: s.location
                    })));
                }

                // Dynamic Header
                const { data: settings } = await supabase.from('system_settings').select('*').in('key', ['impact_hero_title', 'impact_hero_subtitle', 'impact_hero_image']);
                if (settings) {
                    const val = (k: string) => settings.find(d => d.key === k)?.value;
                    setConfig(prev => ({
                        heroTitle: val('impact_hero_title') || prev.heroTitle,
                        heroSubtitle: val('impact_hero_subtitle') || prev.heroSubtitle,
                        heroImage: val('impact_hero_image') || prev.heroImage
                    }));
                }

            } catch (err) { console.error(err); } 
        };
        fetchData();
    }, []);

    if (selectedStory) {
        return (
            <PageLayout 
                title={selectedStory.title} 
                subtitle={`Impact Location: ${selectedStory.location || 'India'}`}
                heroImage={selectedStory.image}
                heroOverlay={50}
            >
                <div className="max-w-4xl mx-auto mt-8 relative z-10">
                    <button 
                        onClick={() => setSelectedStory(null)} 
                        className="mb-8 flex items-center text-sm font-bold text-gray-500 hover:text-brand-blue transition bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm w-fit"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Impact Stories
                    </button>

                    <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl border border-gray-100 animate-fade-in-up">
                        <div className="flex flex-wrap items-center justify-between mb-8 border-b border-gray-100 pb-6 gap-4">
                            <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-xl text-brand-green border border-green-100">
                                <CircleCheck className="w-5 h-5" />
                                <span className="font-bold text-sm">Verified Impact</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500 font-medium">
                                <Users className="w-4 h-4" />
                                <span>Reported by {selectedStory.author}</span>
                            </div>
                        </div>
                        
                        <div className="prose prose-lg prose-blue max-w-none font-serif text-gray-700 leading-loose whitespace-pre-line">
                            <p className="text-xl md:text-2xl font-bold text-brand-blue mb-6 leading-tight">{selectedStory.description}</p>
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title={config.heroTitle}
            subtitle={config.heroSubtitle}
            heroImage={config.heroImage}
            seoDescription="See the measurable impact of Bennu Rising International Foundation's work across India — lives touched, students educated, patients rehabilitated, and soldiers' families supported."
        >
            <div id="statistics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative scroll-mt-24">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-brand-light p-8 rounded-[2rem] shadow-skeuo-raised border border-white text-center hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 bg-brand-light rounded-2xl shadow-skeuo-pressed flex items-center justify-center text-brand-blue"><TrendingUp className="w-8 h-8" /></div>
                        <div className="text-4xl font-extrabold text-brand-blue mb-2 drop-shadow-sm">{stat.value}</div>
                        <div className="text-lg font-bold text-gray-800 mb-2">{stat.label}</div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.desc || (stat as any).description}</div>
                    </div>
                ))}
            </div>
            <h2 id="stories" className="text-3xl font-serif-heading font-bold text-brand-blue mb-12 text-center scroll-mt-24">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {stories.map((story) => (
                    <div 
                        key={story.id} 
                        onClick={() => setSelectedStory(story)}
                        className="bg-brand-light rounded-3xl p-4 shadow-skeuo-raised border border-white flex flex-col group hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
                    >
                        <div className="h-64 rounded-2xl overflow-hidden mb-6 shadow-skeuo-input relative bg-gray-200">
                             <img src={story.image || null} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-bold flex items-center"><MapPin className="w-3 h-3 mr-1 text-brand-green" /> {story.location}</div>
                        </div>
                        <div className="px-2 pb-4 flex-grow">
                            <h4 className="text-xl font-bold text-brand-blue mb-3 font-serif-heading group-hover:text-brand-red transition-colors">{story.title}</h4>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">{story.description}</p>
                        </div>
                        <div className="px-2 pt-4 border-t border-gray-200 mt-auto flex justify-between items-center">
                            <p className="text-xs font-bold text-brand-green uppercase tracking-wider flex items-center"><CircleCheck className="w-3 h-3 mr-1"/> Verified</p>
                            <span className="text-brand-blue text-xs font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">Read Story <ArrowRight className="w-3 h-3 ml-1"/></span>
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
};

export const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
    const [config, setConfig] = useState({ title: "Stories & Insights", subtitle: "Thought leadership, field updates, and voices from the community." });

    useEffect(() => {
        if(isSupabaseConfigured()) {
            supabase.from('blog_posts').select('*').neq('is_deleted', true).eq('approval_status', 'published').order('created_at', {ascending: false}).then(({data}) => {
                if(data && data.length > 0) {
                    setPosts(data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        excerpt: p.excerpt,
                        content: p.content,
                        author: p.author,
                        date: new Date(p.created_at).toLocaleDateString(),
                        image: p.image_url,
                        category: p.category
                    })));
                }
            });
            supabase.from('system_settings').select('*').in('key', ['blog_hero_title', 'blog_hero_subtitle']).then(({data}) => {
                if(data) {
                    const val = (k:string) => data.find(d => d.key === k)?.value;
                    setConfig(prev => ({ title: val('blog_hero_title') || prev.title, subtitle: val('blog_hero_subtitle') || prev.subtitle }));
                }
            });
        }
    }, []);

    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (readingPost) {
        return (
            <PageLayout
                title={readingPost.title}
                subtitle={`By ${readingPost.author} • ${readingPost.date}`}
                heroImage={readingPost.image}
                heroOverlay={40}
                seoDescription={readingPost.excerpt}
            >
                <div className="max-w-4xl mx-auto mt-8 relative z-10">
                    <button onClick={() => setReadingPost(null)} className="mb-8 flex items-center text-sm font-bold text-gray-500 hover:text-brand-blue transition bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
                    </button>
                    <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl border border-gray-100">
                        <div className="flex flex-wrap items-center justify-between mb-10 border-b border-gray-100 pb-6 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-brand-blue font-bold shadow-inner">
                                    {readingPost.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{readingPost.author}</p>
                                    <p className="text-xs text-gray-500 flex items-center"><Clock className="w-3 h-3 mr-1" /> {readingPost.date}</p>
                                </div>
                            </div>
                            <span className="bg-blue-50 text-brand-blue px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                {readingPost.category}
                            </span>
                        </div>
                        <article className="prose prose-lg prose-blue max-w-none font-serif text-gray-700 leading-loose">
                           <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(readingPost.content || '') }} />
                        </article>
                    </div>
                </div>
            </PageLayout>
        );
    }
    const featured = filteredPosts[0];
    const others = filteredPosts.slice(1);

    return (
        <PageLayout title={config.title} subtitle={config.subtitle} seoDescription="Stories, field updates, and insights from Bennu Rising International Foundation's work in mental health, education, rehabilitation, and disaster relief across India.">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-24 z-30">
                 <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                     {['All', ...Array.from(new Set(posts.map(post => post.category).filter(Boolean)))].map(cat => (
                         <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-brand-blue text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{cat}</button>
                     ))}
                 </div>
                 <div className="relative w-full md:w-64 mt-4 md:mt-0">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                     <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search articles..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm font-medium transition-all focus:bg-white" />
                 </div>
            </div>
            {featured && (
                <div onClick={() => setReadingPost(featured)} className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-20 group cursor-pointer border-4 border-white transform transition-all hover:scale-[1.01]">
                    <div className="absolute inset-0">
                        <img src={featured.image || null} alt="Featured" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/40 to-transparent"></div>
                    </div>
                    <div className="relative z-10 p-10 md:p-16 flex flex-col justify-end min-h-[500px] text-white">
                        <span className="bg-brand-red text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start mb-4 shadow-lg border border-white/20">Featured Story</span>
                        <h2 className="text-4xl md:text-5xl font-serif-heading font-bold mb-4 leading-tight drop-shadow-md group-hover:underline decoration-brand-green decoration-4 underline-offset-8">{featured.title}</h2>
                        <p className="text-lg text-blue-100 max-w-2xl mb-8 line-clamp-2">{featured.excerpt}</p>
                        <div className="flex items-center text-sm font-bold">
                            <div className="w-10 h-10 rounded-full bg-white text-brand-blue flex items-center justify-center mr-3 shadow-lg"><UserPlus className="w-5 h-5" /></div>
                            <span>{featured.author}</span>
                            <span className="mx-3 text-blue-300">•</span>
                            <span>{featured.date}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {others.map((post) => (
                    <article key={post.id} onClick={() => setReadingPost(post)} className="bg-brand-light rounded-3xl p-5 shadow-skeuo-raised border border-white hover:shadow-2xl transition-all duration-300 group flex flex-col cursor-pointer hover:-translate-y-1">
                        <div className="relative h-56 rounded-2xl overflow-hidden mb-6 shadow-skeuo-input bg-gray-200">
                            <img src={post.image || null} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute top-4 left-4 bg-brand-light/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-brand-blue shadow-lg">{post.category}</div>
                        </div>
                        <div className="flex-grow px-2">
                            <div className="flex items-center text-xs text-gray-400 mb-3 font-medium"><Calendar className="w-3 h-3 mr-1" /> {post.date}</div>
                            <h3 className="text-xl font-bold text-brand-blue mb-3 font-serif-heading leading-tight group-hover:text-brand-red transition-colors">{post.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
                        </div>
                        <div className="px-2 pt-4 border-t border-gray-200 mt-auto flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">By {post.author}</span>
                            <button className="text-brand-blue group-hover:text-brand-red font-bold text-sm flex items-center transition">Read More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></button>
                        </div>
                    </article>
                ))}
            </div>
        </PageLayout>
    );
};

// Bumped whenever the terms text below materially changes, so
// terms_version recorded against older applications stays meaningful.
const VOLUNTEER_TERMS_VERSION = 'v1';

export const VolunteerSignupPage: React.FC = () => {
    const location = useLocation();
    const initialEmail = location.state?.email || '';
    const initialInterest = location.state?.interest || 'Teaching & Education';
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [paymentError, setPaymentError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState('');

    // Split amounts
    const MANDATORY_FEE = 101;
    const [optionalDonation, setOptionalDonation] = useState<number | ''>('');
    const totalAmount = MANDATORY_FEE + (Number(optionalDonation) || 0);

    const [razorpayKey, setRazorpayKey] = useState(RAZORPAY_KEY_ID);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: initialEmail, phone: '', interest: initialInterest });
    const [config, setConfig] = useState({
        heroTitle: "Day One Impact",
        heroSubtitle: "Don't just wait for change. Be the change. Today.",
        heroImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2000&auto=format&fit=crop",
        quote: "Service to others is the rent you pay for your room here on earth.",
        formTitle: "Start Your Journey",
        successTitle: "You're In!",
        successMsg: `Thank you for stepping up, {name}. Our volunteer coordinator will reach out to you within 24 hours.`
    });

    useEffect(() => {
        if(isSupabaseConfigured()) {
            supabase.from('system_settings').select('*').in('key', [
                'volsignup_hero_title', 'volsignup_hero_subtitle', 'volsignup_hero_image', 
                'volsignup_quote', 'volsignup_form_title', 'volsignup_success_title', 'volsignup_success_msg',
                'razorpay_key_id'
            ])
            .then(({data}) => {
                if(data) {
                    const val = (k:string) => data.find(d => d.key === k)?.value;
                    setConfig(prev => ({
                        heroTitle: val('volsignup_hero_title') || prev.heroTitle,
                        heroSubtitle: val('volsignup_hero_subtitle') || prev.heroSubtitle,
                        heroImage: val('volsignup_hero_image') || prev.heroImage,
                        quote: val('volsignup_quote') || prev.quote,
                        formTitle: val('volsignup_form_title') || prev.formTitle,
                        successTitle: val('volsignup_success_title') || prev.successTitle,
                        successMsg: val('volsignup_success_msg') || prev.successMsg,
                    }));
                    const key = val('razorpay_key_id');
                    if (key) setRazorpayKey(key);
                }
            });
        }
    }, []);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    // Payment recording now happens exclusively server-side: the Razorpay
    // webhook (server.ts, payment.captured handler) verifies the payment and
    // writes both the donations row and the volunteer_applications row using
    // `notes` returned by Razorpay itself, not client-submitted data. This
    // function only reflects success in the UI once /api/verify-payment has
    // confirmed the signature — it never writes to Supabase directly.
    const handleFinalSubmit = async () => {
        setLoading(false); setSubmitted(true); window.scrollTo(0,0);
    };

    const initiatePayment = async () => {
        if (!termsAccepted) {
            setTermsError('Please read and accept the Terms & Conditions to continue.');
            return;
        }
        setTermsError('');
        setLoading(true);
        setPaymentError('');
        try {
            // 1. Create order on backend (server-side amount, not client-trusted)
            const orderRes = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount })
            });
            const orderData = await orderRes.json();
            if (!orderData.order_id) throw new Error("Failed to create order: " + JSON.stringify(orderData));

            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                name: "Bennu Rising Intl. Foundation",
                description: `Volunteer Registration Fee`,
                image: "/logo1.png",
                order_id: orderData.order_id,
                notes: {
                    signup_type: 'volunteer',
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    interest: formData.interest,
                    // Recorded server-side against the application row so
                    // there's a timestamped record of acceptance — the
                    // certificate/recognition clauses in these terms are
                    // conditions the org may need to point back to later.
                    terms_accepted: 'true',
                    terms_accepted_at: new Date().toISOString(),
                    terms_version: VOLUNTEER_TERMS_VERSION
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#003F7F" },
                handler: async function (response: any) {
                    try {
                        // 2. Verify signature on backend before showing success
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        if (verifyRes.ok) {
                            await handleFinalSubmit();
                        } else {
                            setPaymentError("Payment verification failed. If money was deducted, it will be auto-refunded or please contact us.");
                            setLoading(false);
                        }
                    } catch (e) {
                        setPaymentError("Payment verification error. Please contact us if money was deducted.");
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: () => setLoading(false)
                }
            };

            // @ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setPaymentError(response?.error?.description || response?.error?.reason || "Payment failed");
                setLoading(false);
            });
            rzp.open();
        } catch (err) {
            console.error(err);
            setPaymentError("Failed to initialize payment. Please try again.");
            setLoading(false);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Input Validation
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length > 15) return;
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === 'firstName' || name === 'lastName') {
             const textValue = value.replace(/[^a-zA-Z\s\-\']/g, '');
             setFormData(prev => ({ ...prev, [name]: textValue }));
             return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const quickAdd = (amt: number) => {
        const current = Number(optionalDonation) || 0;
        setOptionalDonation(current + amt);
    };

    if (submitted) {
        return (
            <PageLayout title="Welcome to the Family" subtitle="Your journey of impact begins now.">
                <div className="max-w-xl mx-auto text-center py-12">
                    <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-float"><Check className="w-12 h-12 text-white" /></div>
                    <h2 className="text-3xl font-bold text-brand-blue mb-4">{config.successTitle}</h2>
                    <p className="text-gray-600 mb-8 text-lg">{config.successMsg.replace('{name}', formData.firstName)}</p>
                    <button onClick={() => { setSubmitted(false); setStep(1); }} className="text-brand-blue font-bold underline">Submit another application</button>
                </div>
            </PageLayout>
        );
    }
    return (
        <PageLayout title={config.heroTitle} subtitle={config.heroSubtitle} heroImage={config.heroImage} seoDescription="Sign up to volunteer with Bennu Rising International Foundation. Join our community supporting mental health, education, rehabilitation, and disaster relief programs across India.">
            <div className="grid md:grid-cols-2 gap-16 items-start">
                <div className="space-y-8 animate-fade-in">
                    <div className="bg-brand-blue text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col h-full justify-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="relative z-10">
                            <Quote className="w-12 h-12 text-brand-green mb-6 opacity-50" />
                            <h3 className="text-2xl lg:text-3xl font-serif-heading font-bold mb-6 relative z-10 leading-tight">"{config.quote}"</h3>
                            <p className="text-blue-100 mb-8 leading-relaxed relative z-10 text-lg">Every day you wait is a day a child goes without a mentor, or a veteran navigates rehab alone. Join a community of over 500 changemakers.</p>
                        </div>

                        {/* New Benefits Section */}
                        <div className="relative z-10 mt-8 pt-8 border-t border-white/10">
                            <h4 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-6 shadow-black drop-shadow-sm">Why Join Us?</h4>
                            <ul className="space-y-5">
                                <li className="flex items-start group">
                                    <div className="p-2.5 bg-white/10 rounded-xl mr-4 group-hover:bg-white/20 transition-all shadow-inner border border-white/5">
                                        <Award className="w-5 h-5 text-brand-green" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-white block text-base group-hover:text-brand-green transition-colors">Certificate of Service</span>
                                        <span className="text-xs text-blue-200 font-medium">Official recognition (though impact matters most)</span>
                                    </div>
                                </li>
                                <li className="flex items-start group">
                                    <div className="p-2.5 bg-white/10 rounded-xl mr-4 group-hover:bg-white/20 transition-all shadow-inner border border-white/5">
                                        <Users className="w-5 h-5 text-brand-green" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-white block text-base group-hover:text-brand-green transition-colors">Networking</span>
                                        <span className="text-xs text-blue-200 font-medium">Connect with 500+ like-minded changemakers</span>
                                    </div>
                                </li>
                                <li className="flex items-start group">
                                    <div className="p-2.5 bg-white/10 rounded-xl mr-4 group-hover:bg-white/20 transition-all shadow-inner border border-white/5">
                                        <Sparkles className="w-5 h-5 text-brand-green" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-white block text-base group-hover:text-brand-green transition-colors">Hone Skills</span>
                                        <span className="text-xs text-blue-200 font-medium">Develop leadership, empathy & management skills</span>
                                    </div>
                                </li>
                                <li className="flex items-start group">
                                    <div className="p-2.5 bg-white/10 rounded-xl mr-4 group-hover:bg-white/20 transition-all shadow-inner border border-white/5">
                                        <Heart className="w-5 h-5 text-brand-green" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-white block text-base group-hover:text-brand-green transition-colors">Joy of Giving Back</span>
                                        <span className="text-xs text-blue-200 font-medium">Experience the profound happiness of service</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="bg-brand-light p-8 lg:p-10 rounded-[2.5rem] shadow-skeuo-raised border border-white relative animate-fade-in-up">
                    <h3 className="text-3xl font-serif-heading font-bold text-brand-blue mb-8">{config.formTitle}</h3>
                    
                    {step === 1 && (
                        <form onSubmit={handleDetailsSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">First Name</label><input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-gray-800 font-medium" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Last Name</label><input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-gray-800 font-medium" /></div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Email</label><input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-gray-800 font-medium" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Phone</label><input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-gray-800 font-medium" /></div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Area of Interest</label>
                                <select name="interest" value={formData.interest} onChange={handleChange} className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-gray-800 font-medium cursor-pointer">
                                    {![
                                        'Teaching & Education', 'Vocational Training', 'Mental Health & Rehab', 
                                        'Medical Aid', 'Tribal Welfare', 'Disability Support', 'Armed Forces Welfare',
                                        'Environment & Relief', 'Arts & Culture', 'Event Organization', 'Fundraising/Admin'
                                    ].includes(initialInterest) && (
                                        <option value={initialInterest}>{initialInterest}</option>
                                    )}
                                    <option>Teaching & Education</option>
                                    <option>Vocational Training</option>
                                    <option>Mental Health & Rehab</option>
                                    <option>Medical Aid</option>
                                    <option>Tribal Welfare</option>
                                    <option>Disability Support</option>
                                    <option>Armed Forces Welfare</option>
                                    <option>Environment & Relief</option>
                                    <option>Arts & Culture</option>
                                    <option>Event Organization</option>
                                    <option>Fundraising/Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-brand-blue to-blue-800 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center text-lg uppercase tracking-wider group">Proceed to Contribution <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></button>
                            <p className="text-xs text-gray-500 font-medium text-center mt-4 bg-blue-50 p-2 rounded-lg border border-blue-100">Note: A mandatory ₹101 registration fee is charged. You can also contribute more.</p>
                        </form>
                    )}

                    {step === 2 && (
                         <div className="space-y-8 animate-fade-in">
                            <button onClick={() => setStep(1)} className="flex items-center text-xs font-bold text-gray-500 hover:text-brand-blue uppercase tracking-wider"><ArrowLeft className="w-3 h-3 mr-1" /> Edit Details</button>
                            
                            <div className="text-center">
                                <div className="w-20 h-20 bg-brand-light rounded-full mx-auto flex items-center justify-center shadow-skeuo-raised mb-4 border border-white">
                                    <CreditCard className="w-8 h-8 text-brand-blue" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Registration Contribution</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">A mandatory fee of ₹101 helps process your application. You can optionally add a donation.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-100 space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <div className="flex items-center">
                                        <div className="bg-brand-red text-white p-1 rounded mr-3 shadow-sm"><Lock className="w-3 h-3" /></div>
                                        <span className="text-sm font-bold text-gray-600 uppercase">Mandatory Fee</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-800">₹{MANDATORY_FEE}</span>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Optional Extra Donation</label>
                                    <div className="relative mb-3">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">₹</span>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            value={optionalDonation} 
                                            onChange={(e) => setOptionalDonation(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                                            placeholder="0"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 shadow-inner outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-gray-800 font-bold text-lg" 
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        {[50, 100, 500].map(amt => (
                                            <button 
                                                key={amt} 
                                                onClick={() => quickAdd(amt)}
                                                className="flex-1 py-2 rounded-lg bg-gray-50 hover:bg-brand-blue hover:text-white text-xs font-bold text-gray-500 transition shadow-sm border border-gray-100"
                                            >
                                                + ₹{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between items-center text-brand-blue border-t border-gray-100 mt-4">
                                    <span className="text-sm font-bold uppercase">Total Payable</span>
                                    <span className="text-3xl font-serif-heading font-extrabold">₹{totalAmount}</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-inner border border-gray-100 p-5">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Terms & Conditions</h4>
                                <div className="max-h-40 overflow-y-auto text-xs text-gray-600 leading-relaxed space-y-3 pr-2 border border-gray-100 rounded-xl p-3 bg-gray-50">
                                    <p>By submitting this application, you confirm that the information you've provided is accurate, and you agree to abide by Bennu Rising International Foundation's code of conduct and the directions of program coordinators during your engagement. Volunteering with the Foundation does not create any employment, agency, or contractual work relationship. The ₹101 registration fee is non-refundable, and the Foundation may modify its programs, schedules, or these terms at any time. Personal information you provide is used solely to process your application and coordinate volunteer activities, consistent with our <Link to="/privacy" className="text-brand-blue underline">Privacy Policy</Link>. The Foundation may suspend or terminate a volunteer's status at its discretion for violation of these terms or its code of conduct.</p>
                                    <p><strong className="text-gray-800">Certificate & recognition eligibility.</strong> A Certificate of Service or other recognition is not automatically granted upon payment of the registration fee. It is awarded at the sole discretion of Bennu Rising International Foundation, and is conditional on: (a) active and consistent participation in activities organized by the Foundation throughout your volunteer term; (b) meeting any fundraising goals or targets communicated to you; (c) meeting any other mandatory goals, milestones, or requirements the Foundation sets now or may set in the future; and (d) maintaining standards of conduct, character, and professionalism throughout your engagement. The Foundation reserves the right to withhold or revoke a certificate or recognition where these criteria are not met, or for conduct inconsistent with the Foundation's values.</p>
                                    <p>See our full <Link to="/terms" className="text-brand-blue underline">Terms of Service</Link> for additional details.</p>
                                </div>
                                <label className="flex items-start gap-3 mt-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => { setTermsAccepted(e.target.checked); if (e.target.checked) setTermsError(''); }}
                                        className="mt-1 w-4 h-4 accent-brand-blue flex-shrink-0"
                                    />
                                    <span className="text-xs text-gray-600 font-medium">I have read and agree to the Terms & Conditions above, including the certificate and recognition eligibility criteria.</span>
                                </label>
                                {termsError && <p className="text-xs text-red-600 font-medium mt-2">{termsError}</p>}
                            </div>

                            {paymentError && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded shadow-sm text-sm font-medium">
                                    {paymentError}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button onClick={initiatePayment} disabled={loading} className="flex-1 bg-gradient-to-r from-brand-green to-[#43a047] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center disabled:opacity-70 text-lg uppercase tracking-wider">
                                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : `Pay ₹${totalAmount} & Join`}
                                </button>
                            </div>

                            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wide flex justify-center items-center"><Lock className="w-3 h-3 mr-1" /> Secure Payment</p>
                         </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export const VolunteerPage: React.FC = () => {
    const renderIcon = (iconName: string, className: string) => {
      // @ts-ignore
      const IconComponent = LucideIcons[iconName] || LucideIcons.CircleHelp;
      return <IconComponent className={className} />;
    };

    const [selectedRole, setSelectedRole] = useState<any | null>(null);

    const [config, setConfig] = useState({
        heroTitle: "Join Our Family",
        heroSubtitle: "Be the change you wish to see. Volunteer with Bennu Rising Foundation.",
        heroImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2000&auto=format&fit=crop",
        reasons: [
            { icon: 'Heart', title: "Find Purpose", desc: "Experience the profound joy that comes from selfless service to those in need." },
            { icon: 'Users', title: "Build Community", desc: "Connect with like-minded changemakers and build lifelong friendships." },
            { icon: 'Star', title: "Gain Skills", desc: "Learn leadership, event management, and social work skills on the ground." }
        ],
        rolesTitle: "Ways You Can Help",
        roles: [
            { icon: 'GraduationCap', title: "Educators & Mentors", desc: "Teach English, Math, or vocational skills to tribal children and women.", type: 'volunteer', fullDescription: '' },
            { icon: 'Stethoscope', title: "Medical Professionals", desc: "Doctors and nurses needed for our rural health camps.", type: 'volunteer', fullDescription: '' }
        ],
        ctaTitle: "Ready to wear the cape?",
        ctaSubtitle: "Join a movement that doesn't just talk about change, but creates it every single day.",
        ctaBtn: "Become a Volunteer"
    });

    useEffect(() => {
        if(isSupabaseConfigured()) {
            supabase.from('system_settings').select('*')
            .in('key', ['vol_hero_title', 'vol_hero_subtitle', 'vol_hero_image', 'vol_reasons_json', 'vol_roles_title', 'vol_roles_json', 'vol_cta_title', 'vol_cta_subtitle', 'vol_cta_btn'])
            .then(({data}) => {
                if(data) {
                    const val = (k:string) => data.find(d => d.key === k)?.value;
                    const rJson = val('vol_reasons_json');
                    const rolesJson = val('vol_roles_json');
                    let newReasons = config.reasons;
                    let newRoles = config.roles;
                    if(rJson) { try { newReasons = JSON.parse(rJson); } catch(e){} }
                    if(rolesJson) { try { newRoles = JSON.parse(rolesJson); } catch(e){} }

                    setConfig(prev => ({
                        ...prev,
                        heroTitle: val('vol_hero_title') || prev.heroTitle,
                        heroSubtitle: val('vol_hero_subtitle') || prev.heroSubtitle,
                        heroImage: val('vol_hero_image') || prev.heroImage,
                        reasons: newReasons,
                        rolesTitle: val('vol_roles_title') || prev.rolesTitle,
                        roles: newRoles,
                        ctaTitle: val('vol_cta_title') || prev.ctaTitle,
                        ctaSubtitle: val('vol_cta_subtitle') || prev.ctaSubtitle,
                        ctaBtn: val('vol_cta_btn') || prev.ctaBtn
                    }));
                }
            });
        }
    }, []);

    return (
    <PageLayout
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        heroImage={config.heroImage}
        seoDescription="Volunteer with Bennu Rising International Foundation and make a real difference in mental health, education, disaster relief, and community welfare programs across India."
    >
        <div id="why-volunteer" className="grid md:grid-cols-3 gap-8 mb-24 relative z-30 scroll-mt-24">
            {config.reasons.map((item, idx) => (
                <div key={idx} className="bg-brand-light p-8 rounded-[2.5rem] shadow-skeuo-raised border border-white text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 mx-auto bg-brand-light rounded-full flex items-center justify-center shadow-skeuo-pressed mb-6 text-brand-blue border border-white/50">
                        {renderIcon(item.icon, "w-10 h-10")}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium text-sm">{item.desc}</p>
                </div>
            ))}
        </div>
        <div className="mb-24">
            <h2 className="text-3xl font-serif-heading font-bold text-brand-blue text-center mb-12">{config.rolesTitle}</h2>
            <div className="grid md:grid-cols-2 gap-10">
                {config.roles.map((role: any, idx) => (
                    <div key={idx} onClick={() => setSelectedRole(role)} className="bg-brand-light p-8 rounded-[2.5rem] shadow-skeuo-raised border border-white flex items-start gap-6 hover:scale-[1.01] transition-transform cursor-pointer">
                        <div className="bg-brand-light p-4 rounded-2xl text-brand-blue shadow-skeuo-pressed border border-white/50">
                            {renderIcon(role.icon, "w-8 h-8")}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-gray-800">{role.title}</h3>
                                {role.type && (
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${role.type === 'internship' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                        {role.type}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-4 font-medium text-sm">{role.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div id="signup" className="bg-brand-blue rounded-[3rem] p-12 text-center relative overflow-hidden shadow-skeuo-raised border border-white/20 scroll-mt-24">
             <div className="relative z-10">
                 <h2 className="text-3xl lg:text-4xl font-serif-heading font-bold text-white mb-6">{config.ctaTitle}</h2>
                 <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto font-medium">{config.ctaSubtitle}</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                     <Link to="/volunteer-signup" state={{ type: 'volunteer' }} className="inline-block bg-brand-light text-brand-blue px-10 py-5 rounded-2xl font-bold text-lg shadow-skeuo-raised hover:shadow-skeuo-pressed active:scale-95 transition-all uppercase tracking-wide border border-white">
                         {config.ctaBtn}
                     </Link>
                     <Link to="/volunteer-portal" className="inline-block bg-transparent text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-skeuo-raised hover:shadow-skeuo-pressed active:scale-95 transition-all uppercase tracking-wide border border-white/50 hover:bg-white/10">
                         Volunteer Portal
                     </Link>
                 </div>
             </div>
        </div>

        <Modal isOpen={!!selectedRole} onClose={() => setSelectedRole(null)} title={selectedRole?.title}>
            {selectedRole && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-green-100 text-green-700">
                            {selectedRole.type || 'volunteer'}
                        </span>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Overview</h4>
                        <p className="text-gray-600">{selectedRole.desc}</p>
                    </div>

                    {selectedRole.fullDescription && (
                        <div>
                            <h4 className="font-bold text-gray-800 mb-2">Expectations & Details</h4>
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{selectedRole.fullDescription}</p>
                        </div>
                    )}
                    
                    <div className="pt-6 border-t border-gray-100">
                        <Link 
                            to="/volunteer-signup" 
                            state={{ type: selectedRole.type || 'volunteer', interest: selectedRole.title }}
                            className="block w-full text-center bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all uppercase tracking-wide"
                        >
                            Apply Now
                        </Link>
                    </div>
                </div>
            )}
        </Modal>
    </PageLayout>
    );
};

export const GalleryPage: React.FC = () => {
    const [activeAlbum, setActiveAlbum] = useState<any | null>(null);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [albums, setAlbums] = useState<any[]>([]);
    const [config, setConfig] = useState({ title: "Gallery of Hope", subtitle: "Glimpses of our collective healing efforts across the nation." });

    useEffect(() => {
        const fetchGallery = async () => {
             if (isSupabaseConfigured()) {
                 const { data: dbAlbums } = await supabase.from('gallery_albums').select('*').neq('is_deleted', true).eq('approval_status', 'published');
                 if (dbAlbums && dbAlbums.length > 0) {
                     const fullAlbums = await Promise.all(dbAlbums.map(async (a: any) => {
                         const { data: imgs } = await supabase.from('gallery_images').select('image_url').neq('is_deleted', true).eq('album_id', a.id);
                         const images = imgs?.map(i => i.image_url) || [];
                         return { id: a.id, title: a.title, cover: a.cover_url, count: images.length, images };
                     }));
                     setAlbums(fullAlbums);
                 }
                 const { data: settings } = await supabase.from('system_settings').select('*').in('key', ['gallery_hero_title', 'gallery_hero_subtitle']);
                 if (settings) {
                     const val = (k:string) => settings.find(d => d.key === k)?.value;
                     setConfig(prev => ({ title: val('gallery_hero_title') || prev.title, subtitle: val('gallery_hero_subtitle') || prev.subtitle }));
                 }
             }
        };
        fetchGallery();
    }, []);

    return (
        <PageLayout title={config.title} subtitle={config.subtitle} seoDescription="Photos from Bennu Rising International Foundation's programs across India — health and healing, social empowerment, tribal education, disaster relief, and our volunteer community.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {albums.map((album) => (
                    <div key={album.id} onClick={() => setActiveAlbum(album)} className="group cursor-pointer bg-brand-light p-4 rounded-3xl shadow-skeuo-raised hover:shadow-2xl transition-all duration-300 border border-white relative">
                        <div className="absolute -top-3 left-6 bg-brand-blue text-white text-xs font-bold px-4 py-1 rounded-t-lg shadow-sm z-0">{album.count} Photos</div>
                        <div className="relative z-10 h-64 overflow-hidden rounded-2xl shadow-skeuo-input bg-gray-200">
                            <img src={album.cover || null} alt={album.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-50 group-hover:saturate-100" />
                        </div>
                        <div className="mt-6 px-2 flex justify-between items-center"><h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-blue transition-colors">{album.title}</h3></div>
                    </div>
                ))}
            </div>
            {activeAlbum && (
                <div className="fixed inset-0 z-50 bg-brand-light/95 backdrop-blur-xl overflow-y-auto animate-fade-in">
                    <div className="container mx-auto px-4 py-12">
                        <div className="flex justify-between items-center mb-10 sticky top-4 z-20 bg-brand-light/80 p-4 rounded-2xl shadow-skeuo-sm border border-white/50 backdrop-blur">
                            <div><h2 className="text-2xl font-bold text-brand-blue">{activeAlbum.title}</h2></div>
                            <button onClick={() => setActiveAlbum(null)} className="p-3 rounded-full bg-brand-light shadow-skeuo-raised hover:shadow-skeuo-pressed text-brand-red transition-all"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                             {activeAlbum.images.map((img: string, idx: number) => (<div key={idx} onClick={() => setFullscreenImage(img)} className="break-inside-avoid rounded-2xl overflow-hidden bg-white p-2 shadow-skeuo-sm hover:shadow-lg transition-all cursor-zoom-in"><img src={img || null} alt="" className="w-full rounded-xl" /></div>))}
                        </div>
                    </div>
                </div>
            )}
            {fullscreenImage && (
                <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setFullscreenImage(null)}>
                    <img src={fullscreenImage || null} alt="Full View" className="max-h-[90vh] max-w-[95vw] rounded-lg shadow-2xl object-contain animate-fade-in-up" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </PageLayout>
    );
};

export const InternshipPage: React.FC = () => {
    return (
        <PageLayout title="Internship Program" subtitle="Launch your career with purpose." heroImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop" seoDescription="Apply for an internship with Bennu Rising International Foundation. Gain hands-on nonprofit experience in mental health, education, rehabilitation, and community development across India.">
            <div className="max-w-5xl mx-auto py-16 px-4">
                <div id="overview" className="text-center mb-16 scroll-mt-24">
                    <h2 className="text-3xl font-bold text-brand-blue mb-4">Why Intern With Us?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Our internship program is designed for ambitious students and recent graduates who want to gain hands-on experience in the non-profit sector.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"><Briefcase className="w-8 h-8"/></div>
                        <h3 className="font-bold text-xl mb-3">Real Projects</h3>
                        <p className="text-gray-600 text-sm">Work on initiatives that directly impact communities, not just coffee runs.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><Award className="w-8 h-8"/></div>
                        <h3 className="font-bold text-xl mb-3">Mentorship</h3>
                        <p className="text-gray-600 text-sm">Get guided by industry veterans and experienced social workers.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"><FileText className="w-8 h-8"/></div>
                        <h3 className="font-bold text-xl mb-3">Certification</h3>
                        <p className="text-gray-600 text-sm">Receive a formal certificate and letter of recommendation upon completion.</p>
                    </div>
                </div>

                <div id="apply" className="bg-gray-900 text-white rounded-3xl p-12 text-center relative overflow-hidden scroll-mt-24">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full mb-6 relative z-10"><Clock className="w-3.5 h-3.5" /> Applications Paused — Coming Soon</span>
                    <h2 className="text-3xl font-bold mb-6 relative z-10">We're redesigning our internship program.</h2>
                    <p className="mb-8 max-w-xl mx-auto text-gray-400 relative z-10">New applications aren't open yet — check back soon. Already have an active application? Use the portal below.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
                        <Link to="/internship-portal" className="inline-block bg-transparent border border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">Internship Portal</Link>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

// Full application + payment flow, kept intact and unrouted while the
// internship program is paused — App.tsx currently points /internship-signup
// at InternshipComingSoonPage below instead of this component. Re-point the
// route back here whenever the program reopens; nothing in this component
// needs to change to bring it back.
export const InternshipSignupPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Split amounts
    const MANDATORY_FEE = 101;
    const [optionalDonation, setOptionalDonation] = useState<number | ''>('');
    const totalAmount = MANDATORY_FEE + (Number(optionalDonation) || 0);

    const [razorpayKey, setRazorpayKey] = useState(RAZORPAY_KEY_ID);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', interest: 'Operations & Management', university: '', major: '' });
    const [paymentError, setPaymentError] = useState('');

    useEffect(() => {
        const fetchKey = async () => {
            const { data } = await supabase.from('system_settings').select('value').eq('key', 'razorpay_key_id').single();
            if (data?.value) setRazorpayKey(data.value);
        };
        fetchKey();
    }, []);

    // Application record is written server-side by the Razorpay webhook
    // (server.ts, payment.captured handler) once it independently verifies
    // the payment — this only flips the UI to "submitted" after
    // /api/verify-payment confirms the signature.
    const saveApplication = async () => {
        setLoading(false); setSubmitted(true); window.scrollTo(0,0);
    };

    const handlePaymentAndSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPaymentError('');

        if (totalAmount > 0) {
            try {
                // 1. Create order on backend (server-side amount)
                const orderRes = await fetch('/api/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: totalAmount })
                });
                const orderData = await orderRes.json();
                if (!orderData.order_id) throw new Error("Failed to create order: " + JSON.stringify(orderData));

                const options = {
                    key: razorpayKey,
                    amount: orderData.amount,
                    currency: orderData.currency || "INR",
                    name: "Bennu Rising Intl. Foundation",
                    description: `Internship Application Fee`,
                    image: "/logo1.png",
                    order_id: orderData.order_id,
                    notes: {
                        signup_type: 'internship',
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        interest: formData.interest + ` (Univ: ${formData.university}, Major: ${formData.major})`
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: { color: "#1e3a8a" },
                    handler: async function (response: any) {
                        try {
                            // 2. Verify signature on backend before showing success
                            const verifyRes = await fetch('/api/verify-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });
                            if (verifyRes.ok) {
                                await saveApplication();
                            } else {
                                setPaymentError("Payment verification failed. If money was deducted, it will be auto-refunded or please contact us.");
                                setLoading(false);
                            }
                        } catch (e) {
                            setPaymentError("Payment verification error. Please contact us if money was deducted.");
                            setLoading(false);
                        }
                    },
                    modal: {
                        ondismiss: function() {
                            setLoading(false);
                        }
                    }
                };
                // @ts-ignore
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    setPaymentError(response?.error?.description || response?.error?.reason || "Payment failed");
                    setLoading(false);
                });
                rzp.open();
            } catch (err) {
                console.error(err);
                setPaymentError("Failed to initialize payment. Please try again.");
                setLoading(false);
            }
        } else {
            await saveApplication();
        }
    };

    if (submitted) {
        return (
            <PageLayout title="Application Received" subtitle="Your journey begins here." theme="beige">
                <div className="max-w-xl mx-auto text-center py-12">
                    <div className="w-24 h-24 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-float"><Check className="w-12 h-12 text-white" /></div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                    <p className="text-gray-600 mb-8 text-lg">Thank you for applying, {formData.firstName}. Our internship coordinator will review your profile and reach out soon.</p>
                    <button onClick={() => { setSubmitted(false); setStep(1); }} className="text-brand-blue font-bold underline">Submit another application</button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Internship Application" subtitle="Take the first step towards a meaningful career." theme="beige" seoDescription="Apply for an internship with Bennu Rising International Foundation and gain hands-on nonprofit experience across mental health, education, and community development programs in India.">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-20">
                <div className="bg-gray-900 p-8 text-white text-center">
                    <h2 className="text-2xl font-bold mb-2">Internship Application Form</h2>
                    <p className="text-gray-400 text-sm">Please fill out all required fields accurately.</p>
                </div>

                <div className="p-8 md:p-12">
                    <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handlePaymentAndSubmit} className="space-y-6">
                        {step === 1 ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                                        <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" placeholder="Jane" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                                        <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" placeholder="jane@university.edu" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">University / College</label>
                                        <input value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" placeholder="e.g. Delhi University" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Major / Field of Study</label>
                                        <input value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" placeholder="e.g. Social Work, Business" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Area of Interest *</label>
                                    <select required value={formData.interest} onChange={e => setFormData({...formData, interest: e.target.value})} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all bg-white">
                                        <option>Operations & Management</option>
                                        <option>Marketing & Communications</option>
                                        <option>Field Research & Data Analysis</option>
                                        <option>Fundraising & Partnerships</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-black transition-all flex items-center justify-center">
                                    Continue to Next Step <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <h3 className="font-bold text-brand-blue mb-2 flex items-center"><Shield className="w-5 h-5 mr-2" /> Application Fee</h3>
                                    <p className="text-sm text-blue-800 mb-4">To process your application and ensure commitment, we require a nominal, non-refundable application fee.</p>

                                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-blue-100 mb-4">
                                        <span className="font-bold text-gray-700">Base Fee</span>
                                        <span className="font-bold text-brand-blue">₹{MANDATORY_FEE}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Optional Donation (₹)</label>
                                        <p className="text-xs text-gray-500 mb-2">Support our ongoing projects with an additional contribution.</p>
                                        <input
                                            type="number"
                                            min="0"
                                            value={optionalDonation}
                                            onChange={e => setOptionalDonation(e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xl font-bold border-t pt-6">
                                    <span>Total Amount</span>
                                    <span className="text-brand-blue text-3xl">₹{totalAmount}</span>
                                </div>

                                {paymentError && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded shadow-sm text-sm font-medium">
                                        {paymentError}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
                                        Back
                                    </button>
                                    <button type="submit" disabled={loading} className="flex-1 bg-brand-blue text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-70">
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `Pay ₹${totalAmount} & Submit`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </PageLayout>
    );
};

// NEW gate page — /internship-signup is rerouted to this component (see
// App.tsx) instead of InternshipSignupPage while applications are paused.
// Swap the route back to InternshipSignupPage whenever the program reopens.
export const InternshipComingSoonPage: React.FC = () => {
    return (
        <PageLayout title="Internship Program" subtitle="Applications are currently paused." theme="beige" seoDescription="Bennu Rising International Foundation's internship program is coming soon. Check back soon or explore our volunteer program in the meantime.">
            <div className="max-w-xl mx-auto text-center py-16">
                <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Clock className="w-12 h-12 text-brand-blue" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
                <p className="text-gray-600 mb-8 text-lg">We're currently redesigning our internship program and aren't accepting new applications right now. Check back soon — in the meantime, our volunteer program is open and a great way to get involved.</p>
                <Link to="/volunteer-signup" className="inline-block bg-brand-blue text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">Explore Volunteering</Link>
            </div>
        </PageLayout>
    );
};

export const PartnersPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ contact: '', organization: '', email: '', phone: '', type: 'Corporate CSR Partnership', message: '' });
    const [partners, setPartners] = useState<any[]>([]);

    const renderIcon = (iconName: string, className: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[iconName] || LucideIcons.CircleHelp;
        return <IconComponent className={className} />;
    };

    const [config, setConfig] = useState({
        heroTitle: "Strategic Partnerships",
        heroSubtitle: "Collaborate with us to amplify impact and build a better nation.",
        heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop",
        benefits: [
            { icon: 'Handshake', title: "Aligned Values", desc: "Partner with an organization that shares your commitment to ethical nation-building.", color: "text-brand-blue" },
            { icon: 'Target', title: "Measurable Impact", desc: "Receive detailed impact reports and data analytics for your CSR filings.", color: "text-brand-green" },
            { icon: 'Globe', title: "Scalable Reach", desc: "Access our network across 12 states to deploy large-scale initiatives.", color: "text-brand-red" }
        ],
        proposalTitle: "Let's Build Together",
        proposalText: "Bennu Rising Foundation actively seeks partnerships with Corporations (CSR), Educational Institutions, and Government bodies. Whether it is sponsoring a rehab center or adopting a village, we have the framework to execute your vision."
    });

    useEffect(() => {
        if(isSupabaseConfigured()) {
            supabase.from('system_settings').select('*')
            .in('key', ['partner_hero_title', 'partner_hero_subtitle', 'partner_hero_image', 'partner_benefits_json', 'partner_proposal_title', 'partner_proposal_text'])
            .then(({data}) => {
                if(data) {
                    const val = (k:string) => data.find(d => d.key === k)?.value;
                    const bJson = val('partner_benefits_json');
                    let newBenefits = config.benefits;
                    if(bJson) { try { newBenefits = JSON.parse(bJson); } catch(e){} }

                    setConfig(prev => ({
                        heroTitle: val('partner_hero_title') || prev.heroTitle,
                        heroSubtitle: val('partner_hero_subtitle') || prev.heroSubtitle,
                        heroImage: val('partner_hero_image') || prev.heroImage,
                        benefits: newBenefits,
                        proposalTitle: val('partner_proposal_title') || prev.proposalTitle,
                        proposalText: val('partner_proposal_text') || prev.proposalText
                    }));
                }
            });

            // Fetch showcased partners
            supabase.from('partnership_inquiries')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: true })
                .then(({data}) => {
                    if (data) setPartners(data);
                });
        }
    }, []);

    const handlePartnerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isSupabaseConfigured()) {
            try {
                await supabase.from('partnership_inquiries').insert({
                    contact_name: form.contact,
                    organization: form.organization,
                    email: form.email,
                    phone: form.phone,
                    inquiry_type: form.type,
                    message: form.message
                });
            } catch(e) { console.error(e) }
        } else { await new Promise(r => setTimeout(r, 1000)); }
        setLoading(false); setSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Input Validation
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length > 15) return;
            setForm(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === 'contact') {
             const textValue = value.replace(/[^a-zA-Z\s\-\']/g, '');
             setForm(prev => ({ ...prev, [name]: textValue }));
             return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PageLayout
            title={config.heroTitle}
            subtitle={config.heroSubtitle}
            heroImage={config.heroImage}
            seoDescription="Partner with Bennu Rising International Foundation. Explore corporate CSR partnerships and collaboration opportunities supporting mental health, education, and disaster relief in India."
        >
            
            {partners.length > 0 && (
                <div id="showcased-partners" className="relative z-30 mt-8 mb-20">
                    <div className="flex justify-center mb-10">
                        <div className="bg-white text-brand-blue px-8 py-3 rounded-full font-bold shadow-skeuo-raised border border-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                            <span className="uppercase tracking-widest text-xs">Our Valued Partners</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-center">
                        {partners.map(p => (
                            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md transition">
                                {p.logo_url ? (
                                    <img src={p.logo_url} alt={p.organization} className="w-20 h-20 object-contain" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-blue font-bold text-xl shadow-inner">
                                        {p.organization.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm leading-tight">{p.organization}</h4>
                                    {p.message && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div id="our-partners" className="relative z-30 mt-8 mb-20 scroll-mt-24">
                 <div className="flex justify-center mb-10">
                    <div className="bg-white text-brand-blue px-8 py-3 rounded-full font-bold shadow-skeuo-raised border border-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                        <span className="uppercase tracking-widest text-xs">Why Partner With Us?</span>
                    </div>
                 </div>
                 
                 <div className="grid md:grid-cols-3 gap-8">
                     {config.benefits.map((item: any, idx) => (
                         <div key={idx} className="bg-brand-light p-8 rounded-[2rem] shadow-skeuo-raised border border-white text-center hover:-translate-y-1 transition-transform duration-300">
                            <div className={`w-20 h-20 mx-auto rounded-full bg-brand-light shadow-skeuo-pressed flex items-center justify-center mb-6 ${item.color}`}>
                                {renderIcon(item.icon, "w-10 h-10 stroke-[1.5px]")}
                            </div>
                            <h3 className="font-serif-heading font-bold text-xl mb-3 text-gray-800">{item.title}</h3>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                         </div>
                     ))}
                </div>
            </div>

            <div id="get-involved" className="grid md:grid-cols-2 gap-12 lg:gap-20 scroll-mt-24">
                <div className="bg-brand-light rounded-[3rem] p-10 shadow-skeuo-raised border border-white h-full flex flex-col justify-center">
                    <h3 className="text-4xl font-serif-heading font-bold text-brand-blue mb-4 drop-shadow-sm">{config.proposalTitle}</h3>
                    <p className="text-gray-600 font-medium leading-relaxed text-lg mb-10">{config.proposalText}</p>
                </div>
                <div className="bg-brand-light rounded-[3rem] p-10 shadow-skeuo-raised border border-white relative">
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-6 shadow-skeuo-raised border border-white"><Check className="w-12 h-12 text-brand-green" /></div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">Proposal Received</h3>
                            <p className="text-gray-500 mb-8 font-medium">Our partnerships team will review your inquiry and get back to you within 48 hours.</p>
                            <button onClick={() => setSubmitted(false)} className="text-brand-blue font-bold underline hover:text-brand-red transition">Send another inquiry</button>
                        </div>
                    ) : (
                        <form onSubmit={handlePartnerSubmit} className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-2 h-8 bg-brand-blue mr-3 rounded-full shadow-inner"></span>
                                Submit Proposal
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Contact Name</label>
                                    <input required name="contact" value={form.contact} onChange={handleChange} type="text" className="w-full p-4 rounded-2xl bg-brand-light shadow-skeuo-input border-transparent outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700 placeholder-gray-400" placeholder="Full Name" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Organization</label>
                                    <input required name="organization" value={form.organization} onChange={handleChange} type="text" className="w-full p-4 rounded-2xl bg-brand-light shadow-skeuo-input border-transparent outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700 placeholder-gray-400" placeholder="Company Name" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Official Email</label>
                                    <input required name="email" value={form.email} onChange={handleChange} type="email" className="w-full p-4 rounded-2xl bg-brand-light shadow-skeuo-input border-transparent outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700 placeholder-gray-400" placeholder="email@company.com" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} type="text" className="w-full p-4 rounded-2xl bg-brand-light shadow-skeuo-input border-transparent outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700 placeholder-gray-400" placeholder="+91..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Type of Partnership</label>
                                <div className="relative">
                                    <select name="type" value={form.type} onChange={handleChange} className="w-full p-4 rounded-2xl bg-brand-light shadow-skeuo-input border-transparent outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700 cursor-pointer appearance-none">
                                        <option>Corporate CSR Partnership</option>
                                        <option>Institutional Collaboration</option>
                                        <option>Media / Press Inquiry</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Brief Proposal</label>
                                <textarea required name="message" value={form.message} onChange={handleChange} rows={4} className="w-full p-4 rounded-2xl bg-brand-light shadow-skeuo-input border-transparent outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700 placeholder-gray-400 resize-none" placeholder="Tell us about your vision..."></textarea>
                            </div>
                            <button disabled={loading} className="w-full bg-brand-blue text-white font-bold py-5 rounded-2xl shadow-skeuo-raised hover:shadow-lg active:shadow-skeuo-pressed active:scale-[0.98] transition-all uppercase tracking-wide disabled:opacity-70 flex justify-center items-center border-t border-white/20">
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Initiate Partnership"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

