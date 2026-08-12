import React from 'react';
import { Download, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export interface CertificateTemplate {
    id: string;
    name: string;
    body: string;
    signature_url: string;
    background_url: string;
    text_color: string;
    logo_url: string;
    signatory_name?: string;
    signatory_title?: string;
    signature2_url?: string;
    signatory2_name?: string;
    signatory2_title?: string;
    layout?: 'sidebar-orange' | 'sidebar-yellow' | 'border-orange';
    hide_base_elements?: boolean;
}

export const DEFAULT_CERT_TEMPLATES: CertificateTemplate[] = [
    {
        id: 'intern',
        name: 'Certificate of Internship',
        body: 'For the successful completion of the Volunteer Internship Project with Bennu Rising International Foundation – demonstrating leadership, commitment and impact.',
        signature_url: '',
        background_url: '',
        text_color: '#1f2937',
        logo_url: '/logo.png',
        layout: 'sidebar-orange'
    },
    {
        id: 'volunteership',
        name: 'Certificate of Volunteership',
        body: 'For their dedicated service, selfless effort and meaningful contribution as a Volunteer with the Bennu Rising International Foundation.',
        signature_url: '',
        background_url: '',
        text_color: '#1f2937',
        logo_url: '/logo.png',
        layout: 'sidebar-orange'
    },
    {
        id: 'appreciation',
        name: 'Certificate of Appreciation',
        body: 'For their dedicated service, selfless effort and meaningful contribution with the Bennu Rising International Foundation.',
        signature_url: '',
        background_url: '',
        text_color: '#1f2937',
        logo_url: '/logo.png',
        layout: 'sidebar-yellow'
    },
    {
        id: 'appreciation_alt',
        name: 'Certificate of Appreciation (Border Style)',
        body: 'For their dedicated service, selfless efforts and valuable contribution with Bennu Rising International Foundation.',
        signature_url: '',
        background_url: '',
        text_color: '#1f2937',
        logo_url: '/logo.png',
        layout: 'border-orange'
    }
];

export const CertificateViewer = ({ template, user, issueDate, onClose }: { template: CertificateTemplate, user: any, issueDate: string, onClose: () => void }) => {
    
    const parsedBody = template.body
        .replace(/{{name}}/g, `${user?.first_name || 'Name'} ${user?.last_name || ''}`)
        .replace(/{{date}}/g, new Date(issueDate).toLocaleDateString())
        .replace(/{{role}}/g, user?.application_type || 'Volunteer');

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:p-0 print:bg-white animate-fade-in print-wrapper">
            <div className="w-full max-w-5xl bg-white shadow-2xl relative rounded-xl overflow-hidden print:shadow-none print:rounded-none">
                <div className="absolute top-4 right-4 flex gap-2 z-[10000] print:hidden">
                    <button onClick={handlePrint} className="bg-brand-blue text-white px-4 py-2 font-bold rounded-lg shadow hover:bg-blue-700 flex items-center cursor-pointer pointer-events-auto">
                        <Download className="w-4 h-4 mr-2" /> Download / Print
                    </button>
                    <button onClick={onClose} className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-900 shadow cursor-pointer pointer-events-auto">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <div className="relative aspect-[1.414/1] w-full max-w-full mx-auto print:w-screen print:h-screen print:aspect-auto bg-white" style={{ color: template.text_color || '#1f2937' }}>
                    
                    {/* Background Layer */}
                    {template.background_url && (
                        <img src={template.background_url} alt="Certificate Background" className="absolute inset-0 w-full h-full object-cover print:object-contain z-0" crossOrigin="anonymous" />
                    )}
                    
                    {!template.hide_base_elements && !template.background_url && (
                        template.layout === 'sidebar-orange' || template.layout === 'sidebar-yellow' ? (
                            <div className="absolute inset-0 bg-white z-0 overflow-hidden shadow-inner">
                                {/* Thin bracket frame on the right side */}
                                <div className={`absolute top-8 right-8 bottom-8 w-32 border-t-[4px] border-r-[4px] border-b-[4px] ${template.layout === 'sidebar-yellow' ? 'border-[#FFE264]' : 'border-[#EB6324]'} opacity-80 pointer-events-none`}>
                                    {/* Corner boxes */}
                                    <div className={`absolute top-[-10px] right-[-10px] w-6 h-6 border-[4px] ${template.layout === 'sidebar-yellow' ? 'border-[#FFE264]' : 'border-[#EB6324]'} bg-white`}></div>
                                    <div className={`absolute bottom-[-10px] right-[-10px] w-6 h-6 border-[4px] ${template.layout === 'sidebar-yellow' ? 'border-[#FFE264]' : 'border-[#EB6324]'} bg-white`}></div>
                                </div>
                                
                                <div className={`absolute left-8 top-8 bottom-8 w-[28%] ${template.layout === 'sidebar-yellow' ? 'bg-[#FFE264]' : 'bg-[#FFA864]'} z-0`}>
                                    <div className={`absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay`}></div>
                                    {/* Vertical Ribbon */}
                                    <div className={`absolute left-1/2 -translate-x-1/2 top-0 h-[45%] w-16 ${template.layout === 'sidebar-yellow' ? 'bg-[#E5CB5A]' : 'bg-[#EB6324]'} shadow-md border-l-[4px] border-r-[4px] border-white/40`}></div>
                                    {/* Hanging Seal */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-[45%] -mt-16 w-36 h-36 rounded-full flex items-center justify-center shadow-2xl z-10"
                                        style={{ 
                                            clipPath: 'polygon(50% 0%, 61% 5%, 72% 0%, 78% 10%, 89% 8%, 91% 19%, 100% 21%, 98% 32%, 100% 43%, 94% 52%, 98% 62%, 90% 70%, 89% 81%, 78% 85%, 73% 96%, 62% 93%, 50% 100%, 38% 93%, 27% 96%, 22% 85%, 11% 81%, 10% 70%, 2% 62%, 6% 52%, 0% 43%, 2% 32%, 0% 21%, 9% 19%, 11% 8%, 22% 10%, 28% 0%, 39% 5%)',
                                            background: template.id === 'volunteership' ? 'radial-gradient(ellipse farthest-corner at right bottom, #FFFFFF 0%, #E0E0E0 8%, #999999 30%, #808080 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #F5F5F5 8%, #CCCCCC 25%, #666666 62.5%, #666666 100%)' 
                                                : template.id === 'appreciation' ? 'radial-gradient(ellipse farthest-corner at right bottom, #FFAA77 0%, #FF8844 8%, #B35900 30%, #994D00 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFDDD5 8%, #E67300 25%, #663300 62.5%, #663300 100%)'
                                                : 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)'
                                        }}>
                                    </div>
                                </div>
                            </div>
                        ) : template.layout === 'border-orange' ? (
                            <div className="absolute inset-0 bg-white z-0 p-8 sm:p-12 print:p-8">
                                <div className="w-full h-full border-[18px] border-[#E85D22] relative bg-white flex flex-col items-center">
                                    {/* Inner double blue border */}
                                    <div className="absolute inset-4 border-[3px] border-double border-[#1E3A8A] z-10 pointer-events-none opacity-80"></div>
                                    <div className="absolute inset-5 border border-dashed border-[#1E3A8A] z-10 pointer-events-none opacity-60"></div>
    
                                    {/* Corners Layer for modern look matching the mock */}
                                    {/* Top Left */}
                                    <div className="absolute top-0 left-0 z-20">
                                        <div className="absolute top-0 left-0 w-[5rem] h-[1.2rem] bg-[#1E3A8A]"></div>
                                        <div className="absolute top-0 left-0 w-[1.2rem] h-[5rem] bg-[#1E3A8A]"></div>
                                        <div className="absolute top-[1.2rem] left-[1.2rem] w-[2.5rem] h-[1.2rem] bg-[#E85D22]"></div>
                                        <div className="absolute top-[1.2rem] left-[1.2rem] w-[1.2rem] h-[2.5rem] bg-[#E85D22]"></div>
                                        <div className="absolute top-[2.4rem] left-[2.4rem] w-[1.2rem] h-[1.2rem] bg-[#1E3A8A]"></div>
                                    </div>
                                    {/* Top Right */}
                                    <div className="absolute top-0 right-0 z-20">
                                        <div className="absolute top-0 right-0 w-[5rem] h-[1.2rem] bg-[#1E3A8A]"></div>
                                        <div className="absolute top-0 right-0 w-[1.2rem] h-[5rem] bg-[#1E3A8A]"></div>
                                        <div className="absolute top-[1.2rem] right-[1.2rem] w-[2.5rem] h-[1.2rem] bg-[#E85D22]"></div>
                                        <div className="absolute top-[1.2rem] right-[1.2rem] w-[1.2rem] h-[2.5rem] bg-[#E85D22]"></div>
                                        <div className="absolute top-[2.4rem] right-[2.4rem] w-[1.2rem] h-[1.2rem] bg-[#1E3A8A]"></div>
                                    </div>
                                    {/* Bottom Left */}
                                    <div className="absolute bottom-0 left-0 z-20">
                                        <div className="absolute bottom-0 left-0 w-[5rem] h-[1.2rem] bg-[#1E3A8A]"></div>
                                        <div className="absolute bottom-0 left-0 w-[1.2rem] h-[5rem] bg-[#1E3A8A]"></div>
                                        <div className="absolute bottom-[1.2rem] left-[1.2rem] w-[2.5rem] h-[1.2rem] bg-[#E85D22]"></div>
                                        <div className="absolute bottom-[1.2rem] left-[1.2rem] w-[1.2rem] h-[2.5rem] bg-[#E85D22]"></div>
                                        <div className="absolute bottom-[2.4rem] left-[2.4rem] w-[1.2rem] h-[1.2rem] bg-[#1E3A8A]"></div>
                                    </div>
                                    {/* Bottom Right */}
                                    <div className="absolute bottom-0 right-0 z-20">
                                        <div className="absolute bottom-0 right-0 w-[5rem] h-[1.2rem] bg-[#1E3A8A]"></div>
                                        <div className="absolute bottom-0 right-0 w-[1.2rem] h-[5rem] bg-[#1E3A8A]"></div>
                                        <div className="absolute bottom-[1.2rem] right-[1.2rem] w-[2.5rem] h-[1.2rem] bg-[#E85D22]"></div>
                                        <div className="absolute bottom-[1.2rem] right-[1.2rem] w-[1.2rem] h-[2.5rem] bg-[#E85D22]"></div>
                                        <div className="absolute bottom-[2.4rem] right-[2.4rem] w-[1.2rem] h-[1.2rem] bg-[#1E3A8A]"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 border-[16px] border-double border-gray-300 bg-slate-50 z-0"></div>
                        )
                    )}
                    
                    {/* Content Layer */}
                    <div className="relative z-10 w-full h-full flex">
                        {template.layout === 'sidebar-orange' || template.layout === 'sidebar-yellow' ? (
                            <>
                                {/* Spacer for sidebar */}
                                <div className="w-[32%] h-full flex-shrink-0 relative z-20"></div>
                                {/* Main Content Right */}
                                <div className="w-[68%] h-full flex flex-col pt-16 pr-20 pb-16 pl-12 text-left relative z-20">
                                    <div className="flex justify-between items-start w-full mb-10">
                                        <div className="flex flex-col pt-4 w-full">
                                            {!template.hide_base_elements && (
                                                <>
                                                    <h1 className="text-[3.2rem] md:text-[3.5rem] text-[#1E3A8A] leading-none mb-1 tracking-tight" style={{ fontWeight: 800 }}>CERTIFICATE</h1>
                                                    <h2 className={`text-[1.8rem] md:text-[2rem] ${template.layout === 'sidebar-yellow' ? 'text-[#D97706]' : 'text-[#EB6324]'} uppercase font-bold tracking-wide break-words pr-2`}>
                                                        {template.name.toUpperCase().replace('CERTIFICATE OF ', 'OF ').replace('CERTIFICATE ', 'OF ')}
                                                    </h2>
                                                </>
                                            )}
                                        </div>
                                        {(!template.hide_base_elements && template.logo_url) && (
                                            <div className="flex-shrink-0 relative top-[-1rem]">
                                                <img src={template.logo_url} alt="Logo" className="w-[120px] h-[120px] object-contain" crossOrigin="anonymous" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {!template.hide_base_elements && <p className="text-xl font-bold mb-6 text-black tracking-wide">This certificate is awarded to</p>}
                                    
                                    <h2 className={`text-6xl md:text-7xl ${template.hide_base_elements ? 'mt-[16rem]' : ''} mb-8 text-[#1E3A8A] border-b border-gray-400 pb-2 w-full max-w-[80%]`} style={{ fontFamily: '"Great Vibes", "Dancing Script", cursive' }}>
                                        {user?.first_name} {user?.last_name}
                                    </h2>
                                    
                                    <div className="text-[1.1rem] md:text-[1.15rem] leading-relaxed mb-8 font-semibold text-gray-900 max-w-[90%]">
                                        {parsedBody}
                                    </div>

                                    <div className="w-full max-w-[80%] flex justify-between items-end mt-auto">
                                        <div className="text-center w-48">
                                            {template.signature_url ? (
                                                <img src={template.signature_url} alt="Signature" className="h-[60px] object-contain mx-auto mix-blend-multiply" crossOrigin="anonymous" />
                                            ) : (
                                                <div className="h-[40px] w-full"></div>
                                            )}
                                            <div className="border-t-[2px] border-black pt-2 font-bold text-black text-xs md:text-sm uppercase tracking-wide">
                                                {template.signatory_name || "Authorized"}<br/>
                                                <span className="opacity-75 tracking-tight font-medium text-xs">{template.signatory_title || "Signature"}</span>
                                            </div>
                                        </div>
                                        <div className="text-center w-48">
                                            {template.signature2_url ? (
                                                <img src={template.signature2_url} alt="Signature 2" className="h-[60px] object-contain mx-auto mix-blend-multiply" crossOrigin="anonymous" />
                                            ) : (
                                                <div className="h-[40px] w-full"></div>
                                            )}
                                            <div className="border-t-[2px] border-black pt-2 font-bold text-black text-xs md:text-sm uppercase tracking-wide">
                                                {template.signatory2_name || "Authorized"}<br/>
                                                <span className="opacity-75 tracking-tight font-medium text-xs">{template.signatory2_title || "Signature"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : template.layout === 'border-orange' ? (
                            <div className="w-full h-full flex flex-col items-center justify-start pt-16 pb-16 px-24 text-center z-20 relative">
                                <div className="w-full flex items-center justify-between mb-10 relative">
                                    <div className="flex-1 flex justify-start pt-4">
                                        {(!template.hide_base_elements && template.logo_url) && (
                                            <img src={template.logo_url} alt="Logo" className="w-[120px] md:w-[140px] object-contain" crossOrigin="anonymous" />
                                        )}
                                    </div>
                                    
                                    {!template.hide_base_elements && (
                                        <div className="flex-[2] text-center px-2">
                                            <h1 className="text-[3.2rem] md:text-[4.2rem] font-sans text-[#1E3A8A] font-[900] tracking-normal leading-none mb-1">CERTIFICATE</h1>
                                            <h2 className="text-[1.5rem] md:text-[1.8rem] text-[#1E3A8A] font-light uppercase tracking-widest mt-0">
                                                {template.name.toUpperCase().replace('CERTIFICATE OF ', 'OF ').replace('CERTIFICATE ', 'OF ')}
                                            </h2>
                                        </div>
                                    )}
                                    
                                    <div className="flex-1"></div>
                                </div>
                                
                                {!template.hide_base_elements && (
                                    <p className="text-[1.2rem] md:text-[1.3rem] font-medium mt-6 mb-2 text-gray-800 tracking-wide">This certificate is proudly presented to</p>
                                )}
                                
                                <h2 className={`text-[4.8rem] md:text-[5.8rem] ${template.hide_base_elements ? 'mt-[18rem]' : 'mt-2'} mb-6 text-[#555] font-light`} style={{ fontFamily: '"Great Vibes", "Dancing Script", cursive', lineHeight: 1.1 }}>
                                    {user?.first_name} {user?.last_name}
                                </h2>
                                
                                <div className="text-[1.05rem] md:text-[1.15rem] leading-relaxed mb-12 text-gray-800 max-w-[80%] font-medium mx-auto">
                                    {parsedBody}
                                </div>

                                {/* Seal and Signatures row */}
                                <div className="absolute bottom-[3.5rem] left-0 right-0 w-full flex justify-between items-end px-[9.5rem] h-40">
                                    {/* Left Signature */}
                                    <div className="flex flex-col items-center relative w-44 pt-10">
                                        <div className="absolute top-[10px] w-full text-[#1E3A8A] left-4 opacity-100 flex justify-center">
                                            {template.signature_url ? (
                                                <img src={template.signature_url} alt="Signature" className="h-[50px] object-contain mix-blend-multiply" crossOrigin="anonymous" />
                                            ) : (
                                                <span className="font-serif italic text-3xl leading-none" style={{fontFamily: '"Great Vibes", cursive'}}>Signature</span>
                                            )}
                                        </div>
                                        {template.hide_base_elements ? <div className="mt-8"/> : <div className="w-full h-[2px] bg-[#1E3A8A] mt-8"></div>}
                                        {template.hide_base_elements ? null : <span className="text-sm font-bold pt-2 tracking-widest text-[#1E3A8A]">{template.signatory_name || "XXXXX"}</span>}
                                        {template.hide_base_elements ? null : (template.signatory_title && <span className="text-[10px] uppercase font-bold tracking-wider text-[#1E3A8A] opacity-70">{template.signatory_title}</span>)}
                                    </div>
                                    
                                    {/* Gold Seal - Removed per user request */}
                                    <div className="relative w-36 h-36 mx-8 flex-shrink-0 p-8 flex items-center justify-center">
                                        {/* Empty filler if seal is in the image, so layout stays spaced */}
                                    </div>
                                    
                                    {/* Right Signature */}
                                    <div className="flex flex-col items-center relative w-44 pt-10">
                                        <div className="absolute top-[10px] w-full text-[#1E3A8A] left-4 opacity-100 flex justify-center">
                                            {template.signature2_url ? (
                                                <img src={template.signature2_url} alt="Signature 2" className="h-[50px] object-contain mix-blend-multiply" crossOrigin="anonymous" />
                                            ) : (
                                                <span className="font-serif italic text-3xl leading-none" style={{fontFamily: '"Great Vibes", cursive'}}>Signature</span>
                                            )}
                                        </div>
                                        {template.hide_base_elements ? <div className="mt-8"/> : <div className="w-full h-[2px] bg-[#1E3A8A] mt-8"></div>}
                                        {template.hide_base_elements ? null : <span className="text-sm font-bold pt-2 tracking-widest text-[#1E3A8A]">{template.signatory2_name || "XXXXX"}</span>}
                                        {template.hide_base_elements ? null : (template.signatory2_title && <span className="text-[10px] uppercase font-bold tracking-wider text-[#1E3A8A] opacity-70">{template.signatory2_title}</span>)}
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div className="w-full h-full flex flex-col justify-center items-center text-center p-12 md:p-24 z-20">
                                {(!template.hide_base_elements && template.logo_url) && (
                                    <img src={template.logo_url} alt="Logo" className="w-24 h-24 mb-6 object-contain" crossOrigin="anonymous" />
                                )}
                                
                                {!template.hide_base_elements && (
                                    <>
                                        <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-widest mb-2 opacity-90">{template.name || 'Certificate'}</h1>
                                        <hr className="w-32 border-t-2 border-current opacity-40 mb-12" />
                                    </>
                                )}
                                
                                {!template.hide_base_elements && (
                                    <p className="text-lg md:text-xl italic opacity-80 mb-6">This certificate is awarded to</p>
                                )}
                                
                                <h2 className={`text-5xl md:text-6xl font-bold font-serif mb-8 text-brand-blue ${template.hide_base_elements ? 'mt-24' : ''}`} style={{ color: template.text_color }}>
                                    {user?.first_name} {user?.last_name}
                                </h2>
                                
                                <div className="max-w-3xl text-lg md:text-2xl leading-relaxed whitespace-pre-wrap opacity-90 mb-16 font-serif">
                                    {parsedBody}
                                </div>

                                <div className="w-full flex justify-between items-end mt-auto px-12 md:px-24">
                                    <div className="text-center">
                                        <div className="border-b-2 border-current w-48 mb-2 pb-1 text-xl font-bold">
                                            {new Date(issueDate).toLocaleDateString()}
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-widest opacity-70">Date Issued</span>
                                    </div>
                                    
                                    <div className="text-center">
                                        {template.signature_url ? (
                                            <img src={template.signature_url} alt="Signature" className="h-16 mb-2 object-contain mx-auto mix-blend-multiply" crossOrigin="anonymous" />
                                        ) : (
                                            <div className="h-16 border-b-2 border-current w-48 mb-2 border-transparent"></div>
                                        )}
                                        <div className={!template.signature_url && !template.hide_base_elements ? "border-t-2 border-current w-48 pt-1" : ""}>
                                            {!template.hide_base_elements && (
                                                <>
                                                    <span className="text-sm font-bold uppercase tracking-widest opacity-90 block">{template.signatory_name || "Authorized Signature"}</span>
                                                    {template.signatory_title && <span className="text-xs uppercase tracking-widest opacity-70 block">{template.signatory_title}</span>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                @media print {
                    @page { size: landscape; margin: 0; }
                    html, body { height: 100%; width: 100%; margin: 0; padding: 0; background: white; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: hidden; }
                    body * { visibility: hidden; }
                    .print-wrapper, .print-wrapper * { visibility: visible; }
                    .print-wrapper { position: fixed; inset: 0; width: 100vw; height: 100vh; margin: 0; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; background: white; z-index: 99999; border: none; box-shadow: none; }
                    
                    /* Reset max-w and constraints for print to fill page comfortably */
                    .print-wrapper > div { max-width: none !important; width: 100% !important; height: 100% !important; border-radius: 0 !important; }
                    
                    /* Make font sizes strictly controlled in print to prevent cutoff and overflow */
                    .print-wrapper .text-5xl { font-size: 3rem !important; line-height: 1.2 !important; }
                    .print-wrapper .md\\:text-6xl { font-size: 4rem !important; line-height: 1.1 !important; }
                    .print-wrapper .text-lg { font-size: 1.25rem !important; }
                    .print-wrapper .md\\:text-2xl { font-size: 1.75rem !important; line-height: 1.4 !important; font-weight: normal !important; mb-8 !important; }
                    .print-wrapper .p-12, .print-wrapper .md\\:p-24 { padding: 3rem !important; }
                    .print-wrapper img.absolute { object-fit: cover !important; }
                }
            `}</style>
        </div>
    );
};
