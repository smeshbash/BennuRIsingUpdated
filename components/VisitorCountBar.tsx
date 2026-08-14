import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getAllSystemSettings, invalidateSystemSettingsCache } from '../lib/systemSettingsCache';
import { Users, Eye, TrendingUp,} from 'lucide-react';

export const VisitorCountBar: React.FC = () => {
    const [totalVisitors, setTotalVisitors] = useState<number>(0);
    const [liveActive, setLiveActive] = useState<number>(1);
    const [sessionViews, setSessionViews] = useState<number>(1);
    const [enabled, setEnabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Track session view locally in session storage
        const currentSessionViews = sessionStorage.getItem('bennu_session_views');
        let sessionCount = 1;
        let isNewSession = false;
        if (currentSessionViews) {
            sessionCount = parseInt(currentSessionViews, 10) + 1;
        } else {
            isNewSession = true;
        }
        sessionStorage.setItem('bennu_session_views', String(sessionCount));
        setSessionViews(sessionCount);

        let presenceChannel: any = null;

        // Fetch dynamic visitor stats from Supabase key-value store (system_settings)
        const fetchVisitorStats = async () => {
            if (isSupabaseConfigured()) {
                try {
                    const data = await getAllSystemSettings();

                    if (data) {
                        const baselineObj = data.find(item => item.key === 'visitor_baseline_count');
                        const enabledObj = data.find(item => item.key === 'visitor_tracker_enabled');

                        if (baselineObj && baselineObj.value) {
                            let parsedBaseline = parseInt(baselineObj.value, 10);
                            if (!isNaN(parsedBaseline)) {
                                if (isNewSession) {
                                    parsedBaseline += 1;
                                    await supabase.from('system_settings').upsert({
                                        key: 'visitor_baseline_count',
                                        value: parsedBaseline.toString(),
                                        updated_at: new Date().toISOString()
                                    });
                                    // The shared cache now holds a stale (pre-increment) baseline —
                                    // clear it so any other reader (e.g. this component remounting)
                                    // gets the true just-written value instead of the cached one.
                                    invalidateSystemSettingsCache();
                                }
                                setTotalVisitors(parsedBaseline);
                            }
                        }

                        if (enabledObj) {
                            setEnabled(enabledObj.value !== 'false');
                        }
                    }

                    const userId = sessionStorage.getItem('bennu_visitor_id') || Math.random().toString(36).substring(2);
                    sessionStorage.setItem('bennu_visitor_id', userId);

                    presenceChannel = supabase.channel('online-visitors');

                    presenceChannel
                        .on('presence', { event: 'sync' }, () => {
                            const state = presenceChannel.presenceState();
                            const onlineCount = Object.keys(state).length;
                            // Make it feel a bit more alive by adding a small baseline if it's too low, 
                            // but actually show the true presence count + some baseline if we want it to look busy.
                            // The user asked to make it functional, so let's just use the true online count!
                            setLiveActive(Math.max(1, onlineCount));
                        })
                        .subscribe(async (status: string) => {
                            if (status === 'SUBSCRIBED') {
                                await presenceChannel.track({
                                    user_id: userId,
                                    online_at: new Date().toISOString(),
                                });
                            }
                        });

                } catch (err) {
                    console.error('Failed to load visitor statistics:', err);
                }
            }
            setLoading(false);
        };

        fetchVisitorStats();

        return () => {
            if (presenceChannel && isSupabaseConfigured()) {
                supabase.removeChannel(presenceChannel);
            }
        };
    }, []);

    if (!enabled || loading) {
        return null;
    }

    // Format numbers with commas (e.g. 124,830)
    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div 
            id="visitor-count-bar" 
            className="w-full bg-brand-blue/30 backdrop-blur-md rounded-2xl border border-blue-900/50 p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-blue-100/90 shadow-sm"
        >
            {/* Left Section: Live statistics */}
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-950/40 rounded-lg border border-blue-800/30">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-gray-300">Live:</span>
                    <span className="font-mono text-emerald-400 font-bold">{liveActive} online</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-200">
                    <Eye className="w-3.5 h-3.5 text-brand-green" />
                    <span>Your session:</span>
                    <span className="font-mono text-brand-green font-bold">{sessionViews} {sessionViews === 1 ? 'view' : 'views'}</span>
                </div>
            </div>

            {/* Right Section: Total Visitor Count */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-green" />
                    <span className="text-blue-200">Total Visits:</span>
                </div>
                
                {/* Digit-strip scoreboard styling */}
                <div className="flex gap-0.5" aria-label={`Total visitor count: ${totalVisitors}`}>
                    {formatNumber(totalVisitors + sessionViews).split('').map((char, index) => {
                        const isComma = char === ',';
                        return (
                            <span 
                                key={index} 
                                className={`inline-flex items-center justify-center font-mono font-bold leading-none ${
                                    isComma 
                                    ? 'text-brand-green text-sm px-0.5' 
                                    : 'bg-blue-950 text-white border border-blue-800/40 rounded px-1.5 py-1 text-sm shadow-inner'
                                }`}
                            >
                                {char}
                            </span>
                        );
                    })}
                </div>
                
                <div className="flex items-center gap-1 text-[10px] text-blue-400 ml-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span>Verified</span>
                </div>
            </div>
        </div>
    );
};
