# REUNI - Supabase セットアップガイド

このガイドでは、REUNIをSupabaseと連携させる手順を説明します。

---

## ステップ1: 環境変数の設定（2分）

1. **Supabaseダッシュボード** を開く
2. 左メニューの **Settings** → **API** をクリック
3. 以下の値をコピー:

| 項目 | 場所 |
|------|------|
| Project URL | `URL` 欄 |
| anon public | `Project API keys` の `anon` `public` |

4. **VSCodeで `.env.local` を開く** (プロジェクトのルートフォルダにあります)
5. 値を貼り付けて保存

```env
NEXT_PUBLIC_SUPABASE_URL=https://あなたのプロジェクト.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...（長い文字列）
```

---

## ステップ2: データベーステーブルの作成（1分）

1. Supabaseダッシュボードで **SQL Editor** をクリック
2. **New query** をクリック
3. `supabase/schema.sql` ファイルの **全内容をコピー**
4. SQL Editorに**貼り付け**
5. **Run** ボタンをクリック

✅ 成功すると、左メニューの **Table Editor** にテーブルが表示されます:
- `profiles`
- `pets`
- `sightings`
- `chat_rooms`
- `messages`

---

## ステップ3: 認証設定（1分）

1. Supabaseダッシュボードで **Authentication** → **Providers** をクリック
2. **Email** が有効になっていることを確認
3. （オプション）Google認証を有効にする場合:
   - **Google** をクリック
   - Google Cloud Consoleで OAuth 2.0 クライアントを作成
   - Client ID と Secret を入力

---

## ステップ4: 動作確認

1. 開発サーバーを再起動:
```bash
npm run dev
```

2. 以下のURLにアクセス（ポート3000が使用中の場合は3001）:
   - http://localhost:3001/auth/register
   - または http://localhost:3000/auth/register
3. 新規アカウントを作成
4. ダッシュボードでペットを登録

### 主要ページへのリンク

| ページ | URL |
|-------|-----|
| トップページ | http://localhost:3001 |
| 地図 | http://localhost:3001/service/map |
| ダッシュボード | http://localhost:3001/service/dashboard |
| 目撃情報投稿 | http://localhost:3001/service/sightings/new |

---

## トラブルシューティング

### 「Supabase環境変数が設定されていません」エラー
→ `.env.local` ファイルを確認してください。サーバー再起動が必要です。

### テーブルが作成されない
→ SQL EditorでエラーメッセージをChatクロードに共有してください。

### 認証が動作しない
→ Supabaseダッシュボード → Authentication → Users でユーザーが作成されているか確認してください。

---

## 完了！

これでREUNIがSupabaseと完全に連携されました！ 🎉
