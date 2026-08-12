import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash, Edit, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { CertificateViewer, CertificateTemplate, DEFAULT_CERT_TEMPLATES } from './CertificateViewer';

export const CertificateTemplateManager = () => {
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<CertificateTemplate | null>(null);
    const [uploadingImage, setUploadingImage] = useState<Record<string, boolean>>({});

    const handleImageUpload = async (id: string, field: keyof CertificateTemplate, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage((prev) => ({ ...prev, [`${id}_${field}`]: true }));

        const fileExt = file.name.split('.').pop();
        const fileName = `${id}_${field}_${Math.random()}.${fileExt}`;
        const filePath = `certificates/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
            
            updateTemplate(id, field, publicUrl as string);
        }
        
        setUploadingImage((prev) => ({ ...prev, [`${id}_${field}`]: false }));
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            const { data } = await supabase.from('system_settings').select('value').eq('key', 'certificate_templates').single();
            if (data?.value) {
                try {
                    const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
                    if (Array.isArray(parsed)) {
                        setTemplates(parsed);
                    } else {
                        setTemplates(DEFAULT_CERT_TEMPLATES);
                    }
                } catch {
                    setTemplates(DEFAULT_CERT_TEMPLATES);
                }
            } else {
                setTemplates(DEFAULT_CERT_TEMPLATES);
            }
            setLoading(false);
        };
        fetchTemplates();
    }, []);

    const saveTemplates = async () => {
        setSaving(true);
        const { error } = await supabase.from('system_settings').upsert({ key: 'certificate_templates', value: templates });
        if (error) alert("Failed to save templates.");
        else alert("Templates saved successfully.");
        setSaving(false);
        setEditingId(null);
    };

    const resetToDefaults = async () => {
        if (!confirm("Are you sure you want to revert to the default certificate templates? This will overwrite your custom changes but custom backgrounds won't be deleted from storage.")) return;
        setTemplates(DEFAULT_CERT_TEMPLATES);
        setSaving(true);
        const { error } = await supabase.from('system_settings').upsert({ key: 'certificate_templates', value: DEFAULT_CERT_TEMPLATES });
        if (error) alert("Failed to save default templates.");
        else alert("Templates reset successfully.");
        setSaving(false);
        setEditingId(null);
    };

    const addTemplate = () => {
        const newId = 'custom_' + Math.random().toString(36).substring(2, 9);
        setTemplates([...templates, {
            id: newId,
            name: 'New Certificate Template',
            body: 'This certificate is presented to {{name}}...',
            signature_url: '',
            background_url: '',
            text_color: '#1f2937',
            logo_url: ''
        }]);
        setEditingId(newId);
    };

    const deleteTemplate = (id: string) => {
        if (confirm("Delete this template?")) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const updateTemplate = (id: string, field: keyof CertificateTemplate, value: string) => {
        setTemplates(templates.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-brand-blue" /></div>;

    const dummyUser = { first_name: 'John', last_name: 'Doe', application_type: 'Student Volunteer' };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Certificate Templates</h3>
                    <p className="text-gray-500 text-sm">Design the certificates issued to volunteers. Use {'{{name}}'}, {'{{date}}'}, and {'{{role}}'} as variables.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={resetToDefaults} disabled={saving} className="bg-gray-100 text-gray-600 px-4 py-2 font-bold rounded-lg border hover:bg-gray-200 transition">
                        Reset to Defaults
                    </button>
                    <button onClick={saveTemplates} disabled={saving} className="bg-brand-blue text-white px-4 py-2 font-bold rounded-lg flex items-center shadow hover:bg-blue-700 transition">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save All Changes
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(tpl => (
                    <div key={tpl.id} className="bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-brand-blue/30 transition">
                        <div className="h-40 bg-gray-100 relative group">
                            {tpl.background_url ? (
                                <img src={tpl.background_url} alt="bg" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition gap-2">
                                <button onClick={() => setPreviewTemplate(tpl)} className="bg-white text-gray-900 px-4 py-2 text-sm font-bold rounded-lg shadow-lg hover:bg-gray-100">
                                    Preview
                                </button>
                                <button onClick={() => setEditingId(tpl.id)} className="bg-brand-blue text-white px-4 py-2 text-sm font-bold rounded-lg shadow-lg hover:bg-blue-700">
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h4 className="font-bold text-gray-800 mb-1">{tpl.name}</h4>
                            <p className="text-xs text-brand-blue font-mono mb-4 px-2 py-1 bg-blue-50 rounded w-max">ID: {tpl.id}</p>
                            
                            {editingId === tpl.id ? (
                                <div className="space-y-3 mt-4 border-t pt-4 flex-1">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Template Name</label>
                                        <input value={tpl.name} onChange={e => updateTemplate(tpl.id, 'name', e.target.value)} className="w-full border p-2 text-sm rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Body Text</label>
                                        <textarea value={tpl.body} onChange={e => updateTemplate(tpl.id, 'body', e.target.value)} className="w-full border p-2 text-sm rounded-lg h-24" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Text Layout</label>
                                        <select value={tpl.layout || ''} onChange={e => updateTemplate(tpl.id, 'layout', e.target.value as any)} className="w-full border p-2 text-sm rounded-lg bg-white">
                                            <option value="">Centered (Default)</option>
                                            <option value="sidebar-orange">Left Sidebar (Orange Style)</option>
                                            <option value="sidebar-yellow">Left Sidebar (Yellow Style)</option>
                                            <option value="border-orange">Bordered / Full-Width Signatures</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Background Image</label>
                                            <div className="relative group">
                                                <label className="w-full h-10 border text-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 bg-white border-dashed text-gray-400 overflow-hidden relative">
                                                    {uploadingImage[`${tpl.id}_background_url`] ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> : (
                                                        tpl.background_url ? <img src={tpl.background_url} alt="bg" className="absolute inset-0 w-full h-full object-cover" /> : <span className="font-bold text-xs truncate">+ Upload Image</span>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(tpl.id, 'background_url', e)} className="hidden" />
                                                </label>
                                                {tpl.background_url && (
                                                    <button onClick={() => updateTemplate(tpl.id, 'background_url', '')} className="absolute top-1 right-1 p-1 bg-white rounded shadow text-red-600 hover:bg-red-50 z-10" title="Remove Background">
                                                        <Trash className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Text Color</label>
                                            <input type="color" value={tpl.text_color} onChange={e => updateTemplate(tpl.id, 'text_color', e.target.value)} className="w-full h-9 p-1 border rounded-lg cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Signature Image</label>
                                            <div className="relative group">
                                                <label className="w-full h-10 border text-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 bg-white border-dashed text-gray-400 overflow-hidden relative">
                                                    {uploadingImage[`${tpl.id}_signature_url`] ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> : (
                                                        tpl.signature_url ? <img src={tpl.signature_url} alt="sig" className="absolute inset-0 w-full h-full object-contain p-1 bg-white/80" /> : <span className="font-bold text-xs truncate">+ Upload Image</span>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(tpl.id, 'signature_url', e)} className="hidden" />
                                                </label>
                                                {tpl.signature_url && (
                                                    <button onClick={() => updateTemplate(tpl.id, 'signature_url', '')} className="absolute top-1 right-1 p-1 bg-white rounded shadow text-red-600 hover:bg-red-50 z-10" title="Remove Signature">
                                                        <Trash className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Logo Image</label>
                                            <div className="relative group">
                                                <label className="w-full h-10 border text-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 bg-white border-dashed text-gray-400 overflow-hidden relative">
                                                    {uploadingImage[`${tpl.id}_logo_url`] ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> : (
                                                        tpl.logo_url ? <img src={tpl.logo_url} alt="logo" className="absolute inset-0 w-full h-full object-contain p-1 bg-white/80" /> : <span className="font-bold text-xs truncate">+ Upload Image</span>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(tpl.id, 'logo_url', e)} className="hidden" />
                                                </label>
                                                {tpl.logo_url && (
                                                    <button onClick={() => updateTemplate(tpl.id, 'logo_url', '')} className="absolute top-1 right-1 p-1 bg-white rounded shadow text-red-600 hover:bg-red-50 z-10" title="Remove Logo">
                                                        <Trash className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Signatory Name</label>
                                            <input type="text" value={tpl.signatory_name || ''} onChange={e => updateTemplate(tpl.id, 'signatory_name', e.target.value)} className="w-full border p-2 text-sm rounded-lg" placeholder="e.g. John Doe" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Signatory Title</label>
                                            <input type="text" value={tpl.signatory_title || ''} onChange={e => updateTemplate(tpl.id, 'signatory_title', e.target.value)} className="w-full border p-2 text-sm rounded-lg" placeholder="e.g. Director" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Signatory 2 Image</label>
                                            <div className="relative group">
                                                <label className="w-full h-10 border text-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 bg-white border-dashed text-gray-400 overflow-hidden relative">
                                                    {uploadingImage[`${tpl.id}_signature2_url`] ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> : (
                                                        tpl.signature2_url ? <img src={tpl.signature2_url} alt="sig 2" className="absolute inset-0 w-full h-full object-contain p-1 bg-white/80" /> : <span className="font-bold text-xs truncate">+ Upload Image</span>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(tpl.id, 'signature2_url', e)} className="hidden" />
                                                </label>
                                                {tpl.signature2_url && (
                                                    <button onClick={() => updateTemplate(tpl.id, 'signature2_url', '')} className="absolute top-1 right-1 p-1 bg-white rounded shadow text-red-600 hover:bg-red-50 z-10" title="Remove Signature 2">
                                                        <Trash className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Signatory 2 Name</label>
                                            <input type="text" value={tpl.signatory2_name || ''} onChange={e => updateTemplate(tpl.id, 'signatory2_name', e.target.value)} className="w-full border p-2 text-sm rounded-lg" placeholder="e.g. Jane Smith" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Signatory 2 Title</label>
                                            <input type="text" value={tpl.signatory2_title || ''} onChange={e => updateTemplate(tpl.id, 'signatory2_title', e.target.value)} className="w-full border p-2 text-sm rounded-lg" placeholder="e.g. Co-Director" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 border-t pt-4">
                                        <input type="checkbox" id={`hide_base_${tpl.id}`} checked={tpl.hide_base_elements || false} onChange={e => updateTemplate(tpl.id, 'hide_base_elements', e.target.checked as any)} className="w-4 h-4 rounded text-brand-blue" />
                                        <label htmlFor={`hide_base_${tpl.id}`} className="text-xs font-bold text-gray-700 cursor-pointer">Hide built-in graphics & titles (Useful when uploading a pre-designed background image)</label>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 line-clamp-2 mt-auto">{tpl.body}</p>
                            )}
                            
                            {editingId === tpl.id && (
                                <div className="mt-4 flex justify-between items-center border-t pt-4">
                                    <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 font-bold px-3 py-1.5 hover:bg-gray-100 rounded">Close Editor</button>
                                    <button onClick={() => deleteTemplate(tpl.id)} className="text-xs text-red-600 font-bold p-1.5 hover:bg-red-50 rounded bg-red-50/50"><Trash className="w-3.5 h-3.5" /></button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                <button onClick={addTemplate} className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-400 hover:text-brand-blue hover:border-brand-blue/30 hover:bg-blue-50/10 transition min-h-[300px]">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="font-bold">Add Custom Template</span>
                </button>
            </div>

            {previewTemplate && (
                <CertificateViewer 
                    template={previewTemplate} 
                    user={dummyUser} 
                    issueDate={new Date().toISOString()} 
                    onClose={() => setPreviewTemplate(null)} 
                />
            )}
        </div>
    );
};
