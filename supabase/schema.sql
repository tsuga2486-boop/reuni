-- =====================================================
-- REUNI データベーススキーマ
-- SupabaseのSQL Editorでこのファイルの内容を実行してください
-- =====================================================

-- プロフィールテーブル（認証ユーザーの追加情報）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- プロフィール作成トリガー（新規ユーザー登録時に自動作成）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'ユーザー'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ペットテーブル
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('犬', '猫', 'その他')),
  breed TEXT NOT NULL,
  color TEXT NOT NULL,
  age TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'unknown')),
  features TEXT,
  photo_url TEXT,
  is_lost BOOLEAN DEFAULT FALSE,
  lost_at DATE,
  last_seen_location TEXT,
  last_seen_lat DECIMAL(10, 8),
  last_seen_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 目撃・保護情報テーブル
CREATE TABLE sightings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('sighting', 'protected')),
  description TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('犬', '猫', 'その他')),
  photo_url TEXT,
  location TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  sighted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- チャットルームテーブル
CREATE TABLE chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  finder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sighting_id UUID REFERENCES sightings(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- メッセージテーブル
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_pets_is_lost ON pets(is_lost);
CREATE INDEX idx_sightings_type ON sightings(type);
CREATE INDEX idx_sightings_status ON sightings(status);
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- Row Level Security (RLS) を有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: profiles
CREATE POLICY "プロフィールは本人のみ更新可能" ON profiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "プロフィールは誰でも閲覧可能" ON profiles
  FOR SELECT USING (true);

-- RLSポリシー: pets
CREATE POLICY "ペットは所有者のみ作成可能" ON pets
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "ペットは所有者のみ更新可能" ON pets
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "ペットは所有者のみ削除可能" ON pets
  FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "迷子ペットは誰でも閲覧可能" ON pets
  FOR SELECT USING (is_lost = true OR auth.uid() = owner_id);

-- RLSポリシー: sightings
CREATE POLICY "目撃情報はログインユーザーが作成可能" ON sightings
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "目撃情報は誰でも閲覧可能" ON sightings
  FOR SELECT USING (true);

CREATE POLICY "目撃情報は投稿者のみ更新可能" ON sightings
  FOR UPDATE USING (auth.uid() = reporter_id);

-- RLSポリシー: chat_rooms
CREATE POLICY "チャットルームは参加者のみ閲覧可能" ON chat_rooms
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = finder_id);

CREATE POLICY "チャットルームは発見者が作成可能" ON chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = finder_id);

-- RLSポリシー: messages
CREATE POLICY "メッセージはルーム参加者のみ閲覧可能" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE id = messages.room_id 
      AND (owner_id = auth.uid() OR finder_id = auth.uid())
    )
  );

CREATE POLICY "メッセージはルーム参加者のみ送信可能" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE id = messages.room_id 
      AND (owner_id = auth.uid() OR finder_id = auth.uid())
    )
  );

-- リアルタイム購読を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE sightings;
