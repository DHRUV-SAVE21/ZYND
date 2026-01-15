import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Send, AlertCircle } from 'lucide-react';

const IncidentChat = ({ incidentId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [roomId, setRoomId] = useState(null);
    const [error, setError] = useState(null);
    const [useSimpleChat, setUseSimpleChat] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!incidentId || !user) return;

        // Try to get/create room
        const initChat = async () => {
            try {
                // First, check if incident_rooms table exists
                const { data: roomData, error: roomError } = await supabase
                    .from('incident_rooms')
                    .select('id')
                    .eq('incident_id', incidentId)
                    .maybeSingle();

                if (roomError) {
                    // Table doesn't exist or other error - use simple chat
                    console.warn('incident_rooms table not found, using simple fallback chat');
                    setUseSimpleChat(true);
                    loadSimpleMessages();
                    return;
                }

                if (roomData) {
                    // Room exists
                    setRoomId(roomData.id);
                    fetchMessages(roomData.id);
                    subscribeToMessages(roomData.id);
                } else {
                    // Create new room
                    const { data: newRoom, error: createError } = await supabase
                        .from('incident_rooms')
                        .insert({ incident_id: incidentId })
                        .select()
                        .single();

                    if (createError) {
                        console.error('Failed to create room:', createError);
                        setUseSimpleChat(true);
                        loadSimpleMessages();
                    } else {
                        setRoomId(newRoom.id);
                        subscribeToMessages(newRoom.id);
                    }
                }
            } catch (err) {
                console.error('Chat initialization error:', err);
                setUseSimpleChat(true);
                loadSimpleMessages();
            }
        };

        initChat();

        return () => {
            supabase.removeAllChannels();
        };
    }, [incidentId, user]);

    // Simple fallback chat using localStorage
    const loadSimpleMessages = () => {
        const stored = localStorage.getItem(`chat_${incidentId}`);
        if (stored) {
            setMessages(JSON.parse(stored));
        } else {
            // Add welcome message
            setMessages([{
                id: 'welcome',
                content: '👋 Welcome to incident command chat. Database-backed chat requires the incident_rooms table. Using local fallback mode.',
                sender_id: 'system',
                created_at: new Date().toISOString(),
                profiles: { full_name: 'System', role: 'system' }
            }]);
        }
        scrollToBottom();
    };

    const saveSimpleMessages = (msgs) => {
        localStorage.setItem(`chat_${incidentId}`, JSON.stringify(msgs));
    };

    const fetchMessages = async (roomId) => {
        const { data } = await supabase
            .from('incident_messages')
            .select('*, profiles(full_name, role)')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
        scrollToBottom();
    };

    const subscribeToMessages = (roomId) => {
        const channel = supabase
            .channel(`room:${roomId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'incident_messages', filter: `room_id=eq.${roomId}` },
                async (payload) => {
                    // Avoid adding our own message twice (already added optimistically)
                    // But wait, the optimistic one doesn't have a real ID yet.
                    // Let's check sender_id and content to prevent duplicates if needed, 
                    // or just rely on the realtime event and remove the local optimistic one.

                    if (payload.new.sender_id === user?.id) return;

                    const { data: senderProfile } = await supabase
                        .from('profiles')
                        .select('full_name, role')
                        .eq('id', payload.new.sender_id)
                        .single();

                    const newMsg = {
                        ...payload.new,
                        profiles: senderProfile
                    };
                    setMessages(prev => [...prev, newMsg]);
                    scrollToBottom();
                }
            )
            .subscribe();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageContent = newMessage;
        setNewMessage('');

        if (useSimpleChat) {
            // Simple fallback mode
            const newMsg = {
                id: `msg_${Date.now()}`,
                content: messageContent,
                sender_id: user.id,
                created_at: new Date().toISOString(),
                profiles: {
                    full_name: user.user_metadata?.full_name || user.email || 'You',
                    role: 'user'
                }
            };
            const updated = [...messages, newMsg];
            setMessages(updated);
            saveSimpleMessages(updated);
            scrollToBottom();
            return;
        }

        if (!roomId) return;

        // Database mode
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg = {
            id: tempId,
            room_id: roomId,
            sender_id: user.id,
            content: messageContent,
            created_at: new Date().toISOString(),
            profiles: {
                full_name: user.user_metadata?.full_name || 'Me',
                role: 'user'
            }
        };

        setMessages(prev => [...prev, optimisticMsg]);
        scrollToBottom();

        const { data, error } = await supabase
            .from('incident_messages')
            .insert({
                room_id: roomId,
                sender_id: user.id,
                content: messageContent
            })
            .select();

        if (error) {
            console.error(error);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setError('Failed to send message');
        } else if (data && data[0]) {
            setMessages(prev => prev.map(m => m.id === tempId ? { ...data[0], profiles: optimisticMsg.profiles } : m));
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-blue-400" />
                    <span className="font-bold text-gray-200">Incident Command Chat</span>
                </div>
                {useSimpleChat && (
                    <div className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-500/30" title="Using local fallback chat">
                        <AlertCircle size={12} />
                        <span>Fallback Mode</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <MessageCircle size={48} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No messages yet</p>
                            <p className="text-xs mt-1">Start coordinating the response</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id || msg.sender_id === 'system';
                        const role = msg.profiles?.role || 'user';
                        const name = msg.profiles?.full_name || 'Unknown';
                        const isSystem = msg.sender_id === 'system';

                        return (
                            <div key={msg.id} className={`flex ${isMe && !isSystem ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-lg p-3 ${
                                    isSystem ? 'bg-blue-900/30 border border-blue-500/30 text-blue-200 text-sm' :
                                    isMe ? 'bg-blue-600 text-white' :
                                    role === 'agency' ? 'bg-red-900/80 border border-red-500 text-white' : 
                                    'bg-gray-700 text-gray-200'
                                }`}>
                                    {!isSystem && (
                                        <div className="text-xs opacity-75 mb-1 flex justify-between gap-2">
                                            <span className="font-bold">{name}</span>
                                            <span className="uppercase tracking-wider text-[10px]">{role}</span>
                                        </div>
                                    )}
                                    <div>{msg.content}</div>
                                    <div className="text-[10px] opacity-50 mt-1">
                                        {new Date(msg.created_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div className="px-3 py-2 bg-red-900/20 border-t border-red-500/30 text-red-400 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSend} className="p-3 bg-gray-800 flex gap-2 border-t border-gray-700">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={useSimpleChat ? "Type a message (local mode)..." : "Type a message..."}
                    className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Send size={16} />
                    Send
                </button>
            </form>
        </div>
    );
};

export default IncidentChat;
