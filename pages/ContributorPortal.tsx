import React, { useState, useEffect } from 'react';
import { supabase, supabaseAnon, isSupabaseConfigured } from '../lib/supabaseClient';
import { Loader2, CheckCircle2, Circle, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CertificateViewer, DEFAULT_CERT_TEMPLATES } from '../components/CertificateViewer';

export const ContributorPortal: React.FC<{ portalType?: 'internship' | 'volunteer' }> = ({ portalType }) => {
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [application, setApplication] = useState<any>(null);
    const [template, setTemplate] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [updating, setUpdating] = useState(false);
    const [newItemText, setNewItemText] = useState('');
    const [razorpayLink, setRazorpayLink] = useState('');
    const [donationsRaised, setDonationsRaised] = useState(0);
    const [savingLink, setSavingLink] = useState(false);
    
    // New Portal States
    const [authUser, setAuthUser] = useState<any>(null);
    const [portalTasks, setPortalTasks] = useState<any[]>([]);
    const [portalGoals, setPortalGoals] = useState<any[]>([]);
    const [portalCertificates, setPortalCertificates] = useState<any[]>([]);
    const [certTemplates, setCertTemplates] = useState<any[]>([]);
    const [viewingCert, setViewingCert] = useState<any>(null);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalDesc, setNewGoalDesc] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState(100);
    const [newGoalUnit, setNewGoalUnit] = useState('');
    const [addingGoal, setAddingGoal] = useState(false);

    useEffect(() => {
        const initPortal = async () => {
            if (isSupabaseConfigured()) {
                setLoading(true);
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        setAuthUser(user);
                        
                        // We must fetch the volunteer application to ensure they are still authorized
                        const { data: appData, error: appError } = await supabase
                            .from('volunteer_applications')
                            .select('*')
                            .neq('is_deleted', true)
                            .ilike('email', user.email || '')
                            .eq('status', 'approved')
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .single();

                        if (appData && !appError) {
                            setApplication(appData);
                            setRazorpayLink(appData.razorpay_link || '');
                            fetchChecklist(appData);
                            fetchDonationsRaised(appData.id);

                            // Fetch latest real-time portal data
                            const [tasksRes, goalsRes, certsRes, tplRes] = await Promise.all([
                                supabase.from('portal_tasks').select('*').neq('is_deleted', true).eq('user_id', user.id).order('created_at', { ascending: false }),
                                supabase.from('portal_goals').select('*').neq('is_deleted', true).eq('user_id', user.id).order('created_at', { ascending: false }),
                                supabase.from('portal_certificates').select('*').neq('is_deleted', true).eq('user_id', user.id).order('created_at', { ascending: false }),
                                supabase.from('system_settings').select('value').eq('key', 'certificate_templates').single()
                            ]);
                            
                            if (!tasksRes.error && tasksRes.data) setPortalTasks(tasksRes.data);
                            if (!goalsRes.error && goalsRes.data) setPortalGoals(goalsRes.data);
                            if (!certsRes.error && certsRes.data) setPortalCertificates(certsRes.data);
                            if (!tplRes.error && tplRes.data?.value) {
                                try {
                                    const parsed = typeof tplRes.data.value === 'string' ? JSON.parse(tplRes.data.value) : tplRes.data.value;
                                    setCertTemplates(Array.isArray(parsed) ? parsed : DEFAULT_CERT_TEMPLATES);
                                } catch {
                                    setCertTemplates(DEFAULT_CERT_TEMPLATES);
                                }
                            } else setCertTemplates(DEFAULT_CERT_TEMPLATES);
                        } else {
                            // Invalid session or app deleted/unapproved
                            await supabase.auth.signOut();
                            localStorage.removeItem(`contributor_app_${portalType || 'all'}`);
                        }
                    } else {
                        // User is not authenticated, clean up any stale local storage
                        localStorage.removeItem(`contributor_app_${portalType || 'all'}`);
                    }
                } catch (err) {
                    console.error("Error restoring portal data from Supabase:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                // Simulation mode
                const savedApp = localStorage.getItem(`contributor_app_${portalType || 'all'}`);
                if (savedApp) {
                    const app = JSON.parse(savedApp);
                    setApplication(app);
                    setRazorpayLink(app.razorpay_link || '');
                    fetchChecklist(app);
                    fetchDonationsRaised(app.id);
                }
            }
        };

        initPortal();
    }, [portalType]);

    const fetchDonationsRaised = async (appId: number) => {
        if (!isSupabaseConfigured()) return;

        // --- TEST USER BYPASS ---
        if (appId === 9999) {
            setDonationsRaised(5000); // Mock amount
            return;
        }
        // ------------------------

        try {
            const { data, error } = await supabase
                .from('donations')
                .select('amount')
                .eq('volunteer_id', appId)
                .eq('status', 'success');
                
            if (!error && data) {
                const total = data.reduce((sum, d) => sum + Number(d.amount), 0);
                setDonationsRaised(total);
            }
        } catch (err) {
            console.error("Error fetching donations:", err);
        }
    };

    const saveRazorpayLink = async () => {
        if (!application || savingLink) return;
        setSavingLink(true);

        // --- TEST USER BYPASS ---
        if (application.id === 9999) {
            alert("Razorpay link saved successfully (Test Mode)!");
            const updatedApp = { ...application, razorpay_link: razorpayLink };
            setApplication(updatedApp);
            localStorage.setItem(`contributor_app_${portalType || 'all'}`, JSON.stringify(updatedApp));
            setSavingLink(false);
            return;
        }
        // ------------------------

        try {
            const { error } = await supabase
                .from('volunteer_applications')
                .update({ razorpay_link: razorpayLink })
                .eq('id', application.id);
            if (error) throw error;
            alert("Razorpay link saved successfully!");
            const updatedApp = { ...application, razorpay_link: razorpayLink };
            setApplication(updatedApp);
            localStorage.setItem(`contributor_app_${portalType || 'all'}`, JSON.stringify(updatedApp));
        } catch (err: any) {
            alert("Error saving link: " + err.message);
        } finally {
            setSavingLink(false);
        }
    };

    const fetchChecklist = async (app: any) => {
        try {
            // Fetch template
            const { data: templateData, error: tError } = await supabase
                .from('checklist_templates')
                .select('*')
                .eq('role', app.application_type)
                .eq('day', 1)
                .single();
            
            if (tError && tError.code !== 'PGRST116') throw tError;
            
            if (templateData) {
                setTemplate(templateData);
                
                // Fetch progress
                const { data: progressData, error: pError } = await supabase
                    .from('user_checklist_progress')
                    .select('*')
                    .eq('application_id', app.id)
                    .eq('template_id', templateData.id)
                    .single();
                
                if (pError && pError.code !== 'PGRST116') throw pError;
                
                if (progressData) {
                    setProgress(progressData);
                } else {
                    // --- TEST USER BYPASS ---
                    if (app.id === 9999) {
                        setProgress({
                            id: 'test-progress-id',
                            application_id: 9999,
                            template_id: templateData.id,
                            completed_items: [],
                            custom_items: []
                        });
                        return;
                    }
                    // ------------------------

                    // Create progress
                    const { data: newProgress, error: insertError } = await supabase
                        .from('user_checklist_progress')
                        .insert({
                            application_id: app.id,
                            template_id: templateData.id,
                            completed_items: []
                        })
                        .select()
                        .single();
                        
                    if (insertError) throw insertError;
                    setProgress(newProgress);
                }
            }
        } catch (err: any) {
            console.error("Error fetching checklist:", err);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!isSupabaseConfigured()) {
                // Simulation mode
                setTimeout(() => {
                    setOtpSent(true);
                    setLoading(false);
                    alert("SIMULATION MODE: Enter any 6-digit code (e.g., 123456) to continue.");
                }, 1000);
                return;
            }

            // --- TEST USER BYPASS ---
            // Temporary bypass for testing purposes. Can be removed by super admin.
            if (email.toLowerCase() === 'test@example.com') {
                setOtpSent(true);
                setLoading(false);
                return;
            }
            // ------------------------

            // 1. Verify the email exists in our applications first using secure RPC
            const { data: isApproved, error: rpcError } = await supabase.rpc('check_application_status', {
                p_email: email,
                p_type: portalType || null
            });

            if (rpcError) {
                console.error("RPC Error:", rpcError);
                throw new Error("Could not verify application status. Please try again.");
            }

            if (!isApproved) {
                throw new Error(`No approved ${portalType ? portalType + ' ' : ''}application found with this email.`);
            }

            // 2. Send OTP via Supabase Auth
            const { error: authError } = await supabase.auth.signInWithOtp({
                email: email,
            });

            if (authError) throw authError;

            setOtpSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!isSupabaseConfigured()) {
                // Simulation mode verification
                setTimeout(async () => {
                    if (otpCode.length >= 6) {
                        await loadApplicationData();
                    } else {
                        setError("Invalid code.");
                        setLoading(false);
                    }
                }, 1000);
                return;
            }

            // --- TEST USER BYPASS ---
            if (email.toLowerCase() === 'test@example.com') {
                if (otpCode === '123456') {
                    await loadApplicationData();
                    return;
                } else {
                    throw new Error("Invalid test OTP. Use 123456.");
                }
            }
            // ------------------------

            // Verify OTP with Supabase
            const { error: authError } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'email'
            });

            if (authError) throw authError;

            // Load application data after successful auth
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setAuthUser(user);
                await loadApplicationData(user.id);
            } else {
                throw new Error("Could not find authenticated user.");
            }

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const loadApplicationData = async (userIdStr?: string) => {
        try {
            let query = supabase
                .from('volunteer_applications')
                .select('*')
                .neq('is_deleted', true)
                .ilike('email', email)
                .eq('status', 'approved')
                .order('created_at', { ascending: false })
                .limit(1);

            if (portalType) {
                query = query.eq('application_type', portalType);
            }

            const { data, error } = await query.single();

            // --- TEST USER BYPASS ---
            if (email.toLowerCase() === 'test@example.com' && (error || !data)) {
                const mockData = {
                    id: 9999,
                    first_name: 'Test',
                    last_name: 'User',
                    email: 'test@example.com',
                    application_type: portalType || 'volunteer',
                    status: 'approved',
                    razorpay_link: ''
                };
                setApplication(mockData);
                localStorage.setItem(`contributor_app_${portalType || 'all'}`, JSON.stringify(mockData));
                setRazorpayLink('');
                fetchChecklist(mockData);
                setLoading(false);
                return;
            }
            // ------------------------

            if (error) {
                console.error("loadApplicationData error:", error);
                throw new Error(`Could not load application data: ${error.message}`);
            }
            if (!data) {
                throw new Error("Could not load application data: No data returned.");
            }

            localStorage.setItem(`contributor_app_${portalType || 'all'}`, JSON.stringify(data));
            setApplication(data);
            setRazorpayLink(data.razorpay_link || '');
            fetchChecklist(data);
            fetchDonationsRaised(data.id);

            // Fetch new portal data if userId available
            let userId = userIdStr;
            if (!userId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    userId = user.id;
                    setAuthUser(user);
                }
            }

            if (userId && isSupabaseConfigured()) {
                const [tasksRes, goalsRes, certsRes, tplRes] = await Promise.all([
                    supabase.from('portal_tasks').select('*').neq('is_deleted', true).eq('user_id', userId).order('created_at', { ascending: false }),
                    supabase.from('portal_goals').select('*').neq('is_deleted', true).eq('user_id', userId).order('created_at', { ascending: false }),
                    supabase.from('portal_certificates').select('*').neq('is_deleted', true).eq('user_id', userId).order('created_at', { ascending: false }),
                    supabase.from('system_settings').select('value').eq('key', 'certificate_templates').single()
                ]);
                
                if (!tasksRes.error && tasksRes.data) setPortalTasks(tasksRes.data);
                if (!goalsRes.error && goalsRes.data) setPortalGoals(goalsRes.data);
                if (!certsRes.error && certsRes.data) setPortalCertificates(certsRes.data);
                if (!tplRes.error && tplRes.data?.value) {
                    try {
                        const parsed = typeof tplRes.data.value === 'string' ? JSON.parse(tplRes.data.value) : tplRes.data.value;
                        setCertTemplates(Array.isArray(parsed) ? parsed : DEFAULT_CERT_TEMPLATES);
                    } catch {
                        setCertTemplates(DEFAULT_CERT_TEMPLATES);
                    }
                } else setCertTemplates(DEFAULT_CERT_TEMPLATES);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (isSupabaseConfigured()) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem(`contributor_app_${portalType || 'all'}`);
        setApplication(null);
        setOtpSent(false);
        setOtpCode('');
        setEmail('');
        setTemplate(null);
        setProgress(null);
    };

    const toggleItem = async (itemId: string) => {
        if (!progress || updating) return;
        setUpdating(true);
        
        const isCompleted = progress.completed_items.includes(itemId);
        const newCompletedItems = isCompleted 
            ? progress.completed_items.filter((id: string) => id !== itemId)
            : [...progress.completed_items, itemId];
            
        // --- TEST USER BYPASS ---
        if (progress.id === 'test-progress-id') {
            setProgress({ ...progress, completed_items: newCompletedItems });
            setUpdating(false);
            return;
        }
        // ------------------------

        try {
            const { error } = await supabase
                .from('user_checklist_progress')
                .update({ completed_items: newCompletedItems })
                .eq('id', progress.id);
                
            if (error) throw error;
            setProgress({ ...progress, completed_items: newCompletedItems });
        } catch (err) {
            console.error("Error updating progress:", err);
        } finally {
            setUpdating(false);
        }
    };

    const addCustomItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim() || !progress || updating) return;
        setUpdating(true);

        const newItem = {
            id: `custom_${Date.now()}`,
            text: newItemText,
            icon: 'Circle'
        };

        const newCustomItems = [...(progress.custom_items || []), newItem];

        // --- TEST USER BYPASS ---
        if (progress.id === 'test-progress-id') {
            setProgress({ ...progress, custom_items: newCustomItems });
            setNewItemText('');
            setUpdating(false);
            return;
        }
        // ------------------------

        try {
            const { error } = await supabase
                .from('user_checklist_progress')
                .update({ custom_items: newCustomItems })
                .eq('id', progress.id);

            if (error) throw error;
            setProgress({ ...progress, custom_items: newCustomItems });
            setNewItemText('');
        } catch (err) {
            console.error("Error adding custom item:", err);
        } finally {
            setUpdating(false);
        }
    };

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser || !newGoalTitle.trim() || addingGoal) return;
        setAddingGoal(true);
        try {
            const { data, error } = await supabase.from('portal_goals').insert([{
                user_id: authUser.id,
                title: newGoalTitle,
                description: newGoalDesc,
                target_value: newGoalTarget,
                unit: newGoalUnit,
                current_value: 0,
                is_system_goal: false,
                created_by: authUser.id
            }]).select().single();

            if (error) throw error;
            if (data) {
                setPortalGoals(prev => [data, ...prev]);
                setNewGoalTitle('');
                setNewGoalDesc('');
                setNewGoalTarget(100);
                setNewGoalUnit('');
            }
        } catch (err: any) {
            console.error("Error adding goal:", err);
            alert("Error adding goal: " + err.message);
        } finally {
            setAddingGoal(false);
        }
    };

    const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
        if (!authUser) return;
        try {
            const { error } = await supabase.from('portal_tasks')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', taskId)
                .eq('user_id', authUser.id);
            if (error) throw error;
            setPortalTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        } catch (err: any) {
            console.error("Error updating task:", err);
        }
    };

    const renderIcon = (iconName: string, className: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[iconName] || LucideIcons.CircleHelp;
        return <IconComponent className={className} />;
    };

    if (!application) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-brand-blue mb-2">
                            {portalType === 'internship' ? 'Internship Portal' : portalType === 'volunteer' ? 'Volunteer Portal' : 'Contributor Portal'}
                        </h1>
                        <p className="text-gray-600">
                            {otpSent 
                                ? "We've sent a 6-digit code to your email. Please enter it below to securely access your dashboard."
                                : "Enter the email you used to apply to securely access your dashboard."}
                        </p>
                    </div>
                    
                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send Secure Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">6-Digit Code</label>
                                <input 
                                    type="text" 
                                    required
                                    value={otpCode}
                                    onChange={e => setOtpCode(e.target.value)}
                                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                            </div>
                            
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                            
                            <button 
                                type="submit" 
                                disabled={loading || otpCode.length < 6}
                                className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify & Access Portal'}
                            </button>

                            <div className="text-center mt-4">
                                <button 
                                    type="button"
                                    onClick={() => { setOtpSent(false); setError(''); }}
                                    className="text-sm text-gray-500 hover:text-brand-blue font-medium"
                                >
                                    Use a different email
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    const isIntern = application.application_type === 'internship';
    const themeColor = isIntern ? 'text-orange-600' : 'text-brand-blue';
    const themeBg = isIntern ? 'bg-orange-600' : 'bg-brand-blue';
    const themeLightBg = isIntern ? 'bg-orange-50' : 'bg-blue-50';

    const completedCount = progress?.completed_items?.length || 0;
    const totalCount = (template?.items?.length || 0) + (progress?.custom_items?.length || 0);
    const progressPercentage = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-gray-900">Welcome, {application.first_name}</h1>
                        <p className="text-xs text-gray-500 capitalize">{application.application_type} Portal</p>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Intro Card */}
                <div className={`rounded-[2.5rem] p-8 md:p-12 ${themeLightBg} border border-opacity-20 ${isIntern ? 'border-orange-200' : 'border-blue-200'} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${themeBg} text-white`}>START HERE</span>
                        <span className={`text-sm font-bold ${themeColor}`}>STEP 0</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif-heading font-bold text-gray-900 mb-4">First, understand the project</h2>
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed max-w-2xl">
                        Before you start, take 3 minutes to learn what Bennu Rising Foundation is, how your efforts help communities, and the impact our contributors have already made.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                        <button className={`flex-1 py-4 rounded-2xl font-bold text-white ${themeBg} shadow-md flex items-center justify-center hover:opacity-90 transition-opacity`}>
                            Learn About Our Mission <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                        <button className={`flex-1 py-4 rounded-2xl font-bold ${themeColor} border-2 ${isIntern ? 'border-orange-200 hover:bg-orange-50' : 'border-blue-200 hover:bg-blue-50'} bg-white transition-colors`}>
                            Why This Matters
                        </button>
                    </div>
                </div>

                {/* Checklist Card */}
                {template && progress ? (
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">STEP 1</span>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Most Important</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-serif-heading font-bold text-gray-900 mb-3">Complete these {totalCount} actions today</h2>
                        <p className="text-gray-500 text-lg mb-8">Kick off with momentum and make your mark.</p>

                        <div className={`rounded-3xl p-6 md:p-8 ${isIntern ? 'bg-[#FDF6F0]' : 'bg-[#F0F7FD]'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-gray-900">Your Day 1 Checklist</h3>
                                <span className={`text-lg font-bold ${themeColor}`}>{completedCount} of {totalCount}</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="h-3 w-full bg-gray-200 rounded-full mb-8 overflow-hidden">
                                <div 
                                    className={`h-full ${themeBg} transition-all duration-500 ease-out`}
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            <div className="space-y-2">
                                {[...template.items, ...(progress.custom_items || [])].map((item: any) => {
                                    const isCompleted = progress.completed_items.includes(item.id);
                                    return (
                                        <div 
                                            key={item.id}
                                            onClick={() => toggleItem(item.id)}
                                            className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all ${isCompleted ? 'bg-white/60' : 'hover:bg-white/40'}`}
                                        >
                                            <button className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-6 transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-300 text-transparent'}`}>
                                                <CheckCircle2 className="w-6 h-6" />
                                            </button>
                                            <div className={`flex items-center gap-4 flex-1 ${isCompleted ? 'opacity-50 line-through' : ''}`}>
                                                <div className="text-gray-500">
                                                    {renderIcon(item.icon, "w-6 h-6")}
                                                </div>
                                                <span className="font-medium text-gray-800 text-lg">{item.text}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <form onSubmit={addCustomItem} className="mt-8 flex gap-3">
                                <input 
                                    type="text" 
                                    value={newItemText}
                                    onChange={e => setNewItemText(e.target.value)}
                                    placeholder="Add your own task..."
                                    className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-4 text-base focus:outline-none focus:border-brand-blue"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newItemText.trim() || updating}
                                    className={`px-8 py-4 rounded-2xl text-white font-bold text-base ${themeBg} disabled:opacity-50 hover:opacity-90 transition-opacity`}
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">Loading your checklist...</p>
                    </div>
                )}

                {/* Donation Tracking Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">STEP 2</span>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Fundraising</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif-heading font-bold text-gray-900 mb-3">Track Your Impact</h2>
                    <p className="text-gray-500 text-lg mb-8">Share your personal link — every donation through it is tracked automatically, no setup required.</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className={`rounded-3xl p-6 md:p-8 ${isIntern ? 'bg-[#FDF6F0]' : 'bg-[#F0F7FD]'}`}>
                            <h3 className="font-bold text-xl text-gray-900 mb-2">Your Personal Link</h3>
                            <p className="text-sm text-gray-600 mb-6">Share this link with your network — donations made through it count toward your total automatically.</p>

                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <input
                                            readOnly
                                            value={`${window.location.origin}/#/donate?vid=${application.id}`}
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-600"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/#/donate?vid=${application.id}`);
                                                alert("Link copied to clipboard!");
                                            }}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <details className="text-sm">
                                    <summary className="cursor-pointer font-bold text-gray-500 uppercase text-xs tracking-wider">
                                        Advanced: use an external Razorpay link instead
                                    </summary>
                                    <div className="mt-4 space-y-3">
                                        <p className="text-xs text-gray-500">
                                            Only needed if you already have a fixed-amount Razorpay Payment Link set up
                                            elsewhere. Otherwise the link above already tracks everything for you.
                                        </p>
                                        <input
                                            type="url"
                                            value={razorpayLink}
                                            onChange={e => setRazorpayLink(e.target.value)}
                                            placeholder="https://rzp.io/l/..."
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue"
                                        />
                                        <button
                                            onClick={saveRazorpayLink}
                                            disabled={savingLink || !razorpayLink.trim() || razorpayLink === application.razorpay_link}
                                            className={`w-full py-3 rounded-xl text-white font-bold text-sm ${themeBg} disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center`}
                                        >
                                            {savingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Link'}
                                        </button>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="rounded-3xl p-6 md:p-8 bg-gray-900 text-white flex flex-col justify-center items-center text-center">
                            <h3 className="font-bold text-gray-400 uppercase tracking-wider text-sm mb-4">Total Raised</h3>
                            <div className="text-5xl md:text-6xl font-bold mb-2">
                                ₹{donationsRaised.toLocaleString('en-IN')}
                            </div>
                            <p className="text-gray-400 text-sm">from your network</p>
                        </div>
                    </div>
                </div>

                {/* Portal Goals Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">STEP 3</span>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Your Goals</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif-heading font-bold text-gray-900 mb-3">Goal Tracker</h2>
                    <p className="text-gray-500 text-lg mb-8">Set and achieve milestones. System goals cannot be modified.</p>
                    
                    <div className="space-y-4 mb-8">
                        {portalGoals.map(goal => (
                            <div key={goal.id} className={`rounded-3xl p-6 ${goal.is_system_goal ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900">{goal.title} {goal.is_system_goal && <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded ml-2">System Goal</span>}</h3>
                                        <p className="text-gray-600 text-sm">{goal.description}</p>
                                    </div>
                                    <span className="font-bold text-brand-blue">{goal.current_value} / {goal.target_value}{goal.unit ? ` ${goal.unit}` : ''}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-4">
                                    <div className="h-full bg-brand-blue transition-all" style={{ width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {portalGoals.length === 0 && <p className="text-gray-500 italic">No goals set yet.</p>}
                    </div>

                    <form onSubmit={handleAddGoal} className={`rounded-3xl p-6 md:p-8 ${isIntern ? 'bg-[#FDF6F0]' : 'bg-[#F0F7FD]'}`}>
                        <h3 className="font-bold text-xl text-gray-900 mb-4">Add Personal Goal</h3>
                        <div className="space-y-4">
                            <input 
                                type="text"
                                required 
                                value={newGoalTitle}
                                onChange={e => setNewGoalTitle(e.target.value)}
                                placeholder="Goal Title"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue"
                            />
                            <input 
                                type="text" 
                                value={newGoalDesc}
                                onChange={e => setNewGoalDesc(e.target.value)}
                                placeholder="Description"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue"
                            />
                            <div className="flex gap-4">
                                <input 
                                    type="number"
                                    value={newGoalTarget}
                                    onChange={e => setNewGoalTarget(parseInt(e.target.value) || 0)}
                                    placeholder="Target Qty (e.g. 100)"
                                    className="w-1/3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue"
                                />
                                <input 
                                    type="text"
                                    value={newGoalUnit}
                                    onChange={e => setNewGoalUnit(e.target.value)}
                                    placeholder="Unit (e.g. Hours, Items)"
                                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={addingGoal || !newGoalTitle.trim()}
                                className={`w-full py-3 rounded-xl text-white font-bold ${themeBg} hover:opacity-90 transition-opacity`}
                            >
                                {addingGoal ? 'Adding...' : 'Add Goal'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Portal Tasks Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">STEP 4</span>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Duties</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif-heading font-bold text-gray-900 mb-3">Work Items for the Day</h2>
                    <p className="text-gray-500 text-lg mb-8">Tasks assigned to you by administrators.</p>

                    <div className="space-y-4">
                        {portalTasks.map(task => (
                            <div key={task.id} className="rounded-3xl p-6 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900">{task.title}</h3>
                                    <p className="text-gray-600 text-sm">{task.description}</p>
                                    {task.due_date && <p className="text-xs text-red-500 mt-2 font-bold">Due: {new Date(task.due_date).toLocaleDateString()}</p>}
                                </div>
                                <select 
                                    value={task.status}
                                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 font-medium focus:outline-none focus:border-brand-blue"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        ))}
                        {portalTasks.length === 0 && <p className="text-gray-500 italic">No tasks assigned today.</p>}
                    </div>
                </div>

                {/* Certificates Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-safe">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">STEP 5</span>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Recognition</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif-heading font-bold text-gray-900 mb-3">Your Certificates</h2>
                    <p className="text-gray-500 text-lg mb-8">Based on your Profile, Role, and goals met. Only generated when admins review and approve.</p>

                    <div className="space-y-4">
                        {portalCertificates.map(cert => (
                            <div key={cert.id} className="rounded-3xl p-6 bg-yellow-50 border border-yellow-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 uppercase">
                                        {certTemplates.find((t) => t.id === cert.certificate_type)?.name || cert.certificate_type + " Certificate"}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">Status: <span className="font-bold">{cert.status}</span></p>
                                </div>
                                {cert.status === 'issued' ? (
                                    <button onClick={() => setViewingCert(cert)} className="px-6 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition">
                                        View Certificate
                                    </button>
                                ) : (
                                    <span className="text-sm font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-lg">Awaiting Action</span>
                                )}
                            </div>
                        ))}
                        {portalCertificates.length === 0 && (
                            <div className="text-center p-8 bg-gray-50 rounded-3xl">
                                <LucideIcons.Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 italic">You don't have any certificates issued yet.<br/>Complete your tasks and goals to request one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {viewingCert && (
                <CertificateViewer
                    template={certTemplates.find((t) => t.id === viewingCert.certificate_type) || { name: 'Certificate', body: 'This certificate is issued to {{name}}.', text_color: '#000', id: 'custom', logo_url: '', background_url: '', signature_url: '' }}
                    user={application}
                    issueDate={viewingCert.created_at}
                    onClose={() => setViewingCert(null)}
                />
            )}
        </div>
    );
};
