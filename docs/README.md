# Stellar RSS Reader

モダンで使いやすいRSSリーダーアプリケーション。

## 技術スタック

- React 19
- Vite
- TanStack Router
- TypeScript
- Biome (リンター&フォーマッター)

## 開発を始める

### 前提条件

- Node.js 20.0.0以上
- bun 1.0.0以上

### セットアップ

1. リポジトリのクローン：
```bash
git clone [repository-url]
cd stellar-rss-reader
```

2. 依存関係のインストール：
```bash
bun install
```

3. 開発サーバーの起動：
```bash
bun run dev
```

アプリケーションは http://localhost:3001 で起動します。

## 利用可能なスクリプト

- `bun run dev` - 開発サーバーの起動
- `bun run build` - プロダクションビルドの作成
- `bun run serve` - ビルドしたアプリケーションのプレビュー
- `bun run typecheck` - TypeScriptの型チェック
- `bun run lint` - リンターの実行
- `bun run format` - コードフォーマットの実行

## プロジェクト構造

```
├── docs/           # ドキュメント
├── src/            # ソースコード
│   ├── routes/     # ルーティング
│   └── main.tsx    # エントリーポイント
├── biome.json      # Biome設定
├── package.json    # プロジェクト設定
└── vite.config.ts  # Vite設定
```

## 詳細なドキュメント

- [アーキテクチャ概要](./architecture-overview.md)
- [機能概要](./feature-abstract.md)
- [リンティングルール](./linting-rules.md)
- [コンテキストマップ](./context-map.md)
