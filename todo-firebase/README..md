# タスク管理アプリ

HTML、CSS、JavaScriptで作られたシンプルで美しいタスク管理アプリケーションです。

## 機能

- ✅ **タスク追加**: 新しいタスクを入力して追加できます
- ✏️ **タスク編集**: 既存のタスクをクリックして編集できます
- 🗑️ **タスク削除**: 個別のタスクを削除できます
- ☑️ **完了処理**: チェックボックスをクリックして完了状態を切り替えられます
- 🔍 **フィルタリング**: すべて/進行中/完了した項目をフィルタリングして表示できます
- 💾 **ローカル保存**: ブラウザのローカルストレージに自動的に保存されます
- 🧹 **一括削除**: 完了したすべての項目を一度に削除できます

## 使用方法

1. `index.html`ファイルをブラウザで開きます
2. 入力フィールドにタスクを入力し、「追加」ボタンをクリックするかEnterキーを押します
3. タスクをクリックして完了状態を変更できます
4. 「編集」ボタンをクリックしてタスクの内容を編集できます
5. 「削除」ボタンをクリックしてタスクを削除できます
6. 上部のフィルターボタンを使用して、希望する項目のみを表示できます

## セットアップ

### 1. Firebase設定

1. `firebase-config.example.js`をコピーして`firebase-config.js`を作成します：
   ```bash
   cp firebase-config.example.js firebase-config.js
   ```

2. `firebase-config.js`ファイルを開き、Firebase Consoleから取得した実際の設定値を入力します：
   - Firebase Console → プロジェクト設定 → アプリの設定
   - Webアプリの設定から各値をコピーして貼り付けます

### 2. Firebase Realtime Database設定

1. Firebase ConsoleでRealtime Databaseを作成します
2. データベースのURLを`firebase-config.js`の`databaseURL`に設定します
3. テスト用のセキュリティルールを設定します（本番環境では適切な認証ルールを設定してください）

### 3. 実行

ローカルサーバーで実行します（ES6モジュールを使用するため、ファイルを直接開くのではなくサーバーが必要です）：

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx http-server

# その後、ブラウザで http://localhost:8000/todo-firebase/ にアクセス
```

## ファイル構造

```
todo-firebase/
├── index.html                    # HTML構造
├── styles.css                    # スタイリング
├── script.js                     # 機能実装
├── firebase-config.js            # Firebase設定（.gitignoreに含まれる）
├── firebase-config.example.js    # Firebase設定例（Gitに含まれる）
└── README..md                    # 説明文書
```

## 技術スタック

- HTML5
- CSS3（グラデーション、アニメーション、レスポンシブデザイン）
- Vanilla JavaScript (ES6+)
- Firebase Realtime Database

## 特徴

- 🎨 現代的で美しいUI/UX
- 📱 レスポンシブデザイン
- ⚡ 高速なパフォーマンス
- 🔒 Firebase Realtime Databaseによるデータの永続保存
- 🔄 リアルタイム同期（複数のデバイス/ブラウザで同期）
- 🎯 直感的なユーザーインターフェース

## セキュリティ

- `firebase-config.js`は`.gitignore`に含まれているため、Gitにアップロードされません
- 本番環境では適切なFirebaseセキュリティルールを設定してください
