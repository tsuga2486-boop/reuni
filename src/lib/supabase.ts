import { createBrowserClient } from '@supabase/ssr';

// 環境変数のチェック
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase環境変数が設定されていません。\n' +
        '.env.local ファイルを確認してください。'
    );
}

// ブラウザ用Supabaseインスタンス（Cookie対応）
export const supabase = createBrowserClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// =====================================================
// 型定義
// =====================================================

export interface Profile {
    id: string;
    name: string;
    phone?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Pet {
    id: string;
    owner_id: string;
    name: string;
    species: '犬' | '猫' | 'その他';
    breed: string;
    color: string;
    age?: string;
    gender?: 'male' | 'female' | 'unknown';
    features?: string;
    photo_url?: string;
    is_lost: boolean;
    lost_at?: string;
    last_seen_location?: string;
    last_seen_lat?: number;
    last_seen_lng?: number;
    created_at: string;
    updated_at: string;
}

export interface Sighting {
    id: string;
    reporter_id?: string;
    pet_id?: string;
    type: 'sighting' | 'protected';
    description: string;
    species: '犬' | '猫' | 'その他';
    photo_url?: string;
    location: string;
    lat?: number;
    lng?: number;
    sighted_at: string;
    status: 'open' | 'resolved';
    created_at: string;
}

export interface ChatRoom {
    id: string;
    pet_id: string;
    owner_id: string;
    finder_id: string;
    sighting_id?: string;
    status: 'active' | 'closed';
    created_at: string;
}

export interface Message {
    id: string;
    room_id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

// =====================================================
// データベースヘルパー関数
// =====================================================

// === ペット関連 ===

export async function getPets(userId: string) {
    const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Pet[];
}

export async function getLostPets() {
    const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('is_lost', true)
        .order('lost_at', { ascending: false });

    if (error) throw error;
    return data as Pet[];
}

export async function getPet(id: string) {
    const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Pet;
}

export async function createPet(pet: Omit<Pet, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('pets')
        .insert(pet)
        .select()
        .single();

    if (error) throw error;
    return data as Pet;
}

export async function updatePet(id: string, updates: Partial<Pet>) {
    const { data, error } = await supabase
        .from('pets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Pet;
}

export async function deletePet(id: string) {
    const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// === 目撃・保護情報関連 ===

export async function getSightings(filters?: { type?: string; species?: string }) {
    let query = supabase
        .from('sightings')
        .select('*')
        .eq('status', 'open')
        .order('sighted_at', { ascending: false });

    if (filters?.type) {
        query = query.eq('type', filters.type);
    }
    if (filters?.species) {
        query = query.eq('species', filters.species);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Sighting[];
}

export async function getSighting(id: string) {
    const { data, error } = await supabase
        .from('sightings')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Sighting;
}

export async function createSighting(sighting: Omit<Sighting, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
        .from('sightings')
        .insert({ ...sighting, status: 'open' })
        .select()
        .single();

    if (error) throw error;
    return data as Sighting;
}

// === チャット関連 ===

export async function getChatRooms(userId: string) {
    const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
      *,
      pet:pets(name, species),
      owner:profiles!owner_id(name),
      finder:profiles!finder_id(name)
    `)
        .or(`owner_id.eq.${userId},finder_id.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getChatRoom(roomId: string) {
    const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
      *,
      pet:pets(id, name, species),
      owner:profiles!owner_id(id, name),
      finder:profiles!finder_id(id, name)
    `)
        .eq('id', roomId)
        .single();

    if (error) throw error;
    return data;
}

export async function createChatRoom(petId: string, ownerId: string, finderId: string, sightingId?: string) {
    // 既存のアクティブなチャットルームをチェック
    const { data: existing } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('pet_id', petId)
        .eq('owner_id', ownerId)
        .eq('finder_id', finderId)
        .eq('status', 'active')
        .maybeSingle();

    if (existing) return existing;

    const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
            pet_id: petId,
            owner_id: ownerId,
            finder_id: finderId,
            sighting_id: sightingId || null,
        })
        .select()
        .single();

    if (error) throw error;
    return data as ChatRoom;
}

export async function closeChatRoom(roomId: string) {
    const { error } = await supabase
        .from('chat_rooms')
        .update({ status: 'closed' })
        .eq('id', roomId);

    if (error) throw error;
}

export async function getMessages(roomId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Message[];
}

export async function getLatestMessage(roomId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data as Message | null;
}

export async function sendMessage(roomId: string, senderId: string, content: string) {
    const { data, error } = await supabase
        .from('messages')
        .insert({ room_id: roomId, sender_id: senderId, content })
        .select()
        .single();

    if (error) throw error;
    return data as Message;
}

// リアルタイム購読
export function subscribeToMessages(roomId: string, callback: (message: Message) => void) {
    return supabase
        .channel(`room:${roomId}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
            (payload) => callback(payload.new as Message)
        )
        .subscribe();
}
