
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Guard: If supabase client failed to init (missing env vars), stop here.
        if (!supabase) {
            console.error("AuthContext: Supabase client is null. Auth disabled.");
            setLoading(false);
            return;
        }

        // 1. Get Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle(); // Use maybeSingle() instead of single()

            if (error) {
                console.warn('Profile fetch error:', error.message);
                setProfile(null);
            } else if (!data) {
                // No profile exists yet - create one for existing user
                console.log('No profile found, creating one...');
                await createProfileForExistingUser(userId);
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const createProfileForExistingUser = async (userId) => {
        try {
            const { data: userData } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    email: userData.user.email,
                    full_name: userData.user.user_metadata?.full_name || '',
                    role: 'user'
                })
                .select()
                .single();

            if (!error && data) {
                setProfile(data);
                console.log('✅ Profile created for existing user');
            }
        } catch (error) {
            console.error('Failed to create profile:', error);
        }
    };

    const login = async (email, password) => {
        if (!supabase) throw new Error("Supabase not configured");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email, password, fullName, role = 'user') => {
        if (!supabase) throw new Error("Supabase not configured");
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role // Note: RLS triggering handle_new_user should use this
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, signUp, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
