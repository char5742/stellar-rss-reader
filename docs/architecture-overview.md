
## **ディレクトリ構成（サンプル）**

```
src/
 ┣ domain/
 ┃  ┣ feed/
 ┃  ┃  ┣ Feed.ts             // エンティティ(ドメインモデル)
 ┃  ┃  ┣ IFeedRepository.ts  // リポジトリインターフェイス
 ┃  ┃  ┗ index.ts            // エクスポートまとめ
 ┃  ┣ article/
 ┃  ┣ user/
 ┃  ┗ ...
 ┣ application/
 ┃  ┣ feed/
 ┃  ┃  ┣ useCases/
 ┃  ┃  ┃  ┣ FetchFeeds.ts
 ┃  ┃  ┃  ┣ AddFeed.ts
 ┃  ┃  ┃  ┗ ...
 ┃  ┃  ┗ index.ts
 ┃  ┣ article/
 ┃  ┣ user/
 ┃  ┗ ...
 ┣ infrastructure/
 ┃  ┣ firebase/
 ┃  ┃  ┣ firebaseConfig.ts   // Firebase初期化
 ┃  ┃  ┣ FeedRepository.ts   // IFeedRepository実装例
 ┃  ┃  ┗ ...
 ┃  ┣ rss/
 ┃  ┣ ...
 ┣ interface/
 ┃  ┣ router/
 ┃  ┃  ┣ rootRoute.ts
 ┃  ┃  ┣ feedRoute.ts
 ┃  ┃  ┗ router.ts           // Tanstack Routerのエントリポイント
 ┃  ┣ components/
 ┃  ┃  ┣ FeedList.tsx
 ┃  ┃  ┗ ...
 ┃  ┣ pages/
 ┃  ┃  ┗ ...
 ┃  ┣ hooks/
 ┃  ┗ ...
 ┣ store/
 ┃  ┣ feedAtom.ts            // Jotaiの状態管理
 ┃  ┗ ...
 ┣ App.tsx
 ┣ main.tsx
 ┗ index.html
```

- **domain**: ビジネスロジック（エンティティ・リポジトリインターフェイスなど）。DDDにおけるドメイン層。
- **application**: ユースケース。ドメインの振る舞いを組み合わせ、アプリケーションとして「何を実行するか」をまとめる層。
- **infrastructure**: 実際のデータ取得（Firebase, RSSパーサー, 外部API）などの実装詳細。ドメイン層のリポジトリをここで具象化。
- **interface**（プレゼンテーション層）: ReactコンポーネントやルーティングなどUI周り。
- **store**: グローバルな状態管理（Jotai）関連。

---

## **サンプルコード**

### 1. **Domain層**: `src/domain/feed/Feed.ts`

```ts
// src/domain/feed/Feed.ts

export type FeedId = string;

export type Feed = {
  id: FeedId;
  title: string;
  url: string;
  categoryIds: string[];
  // 必要に応じて拡張
};
```

```ts
// src/domain/feed/IFeedRepository.ts

import { Feed, FeedId } from './Feed';

export interface IFeedRepository {
  getAllFeeds(): Promise<Feed[]>;
  getFeedById(id: FeedId): Promise<Feed | null>;
  addFeed(feed: Feed): Promise<void>;
  removeFeed(id: FeedId): Promise<void>;
  // 必要に応じて拡張
}
```

### 2. **Application層**: `src/application/feed/useCases/FetchFeeds.ts`

```ts
// src/application/feed/useCases/FetchFeeds.ts
import { IFeedRepository } from '../../../domain/feed/IFeedRepository';
import { Feed } from '../../../domain/feed/Feed';

// 「最新のフィード一覧を取得する」ユースケース
export const fetchFeeds = (repo: IFeedRepository) => async (): Promise<Feed[]> => {
  // 関数型プログラミング的に引数(repo)を部分適用して利用
  // ここでドメイン知識に基づくバリデーションなどを行うこともある
  return await repo.getAllFeeds();
};
```

```ts
// src/application/feed/useCases/AddFeed.ts
import { IFeedRepository } from '../../../domain/feed/IFeedRepository';
import { Feed } from '../../../domain/feed/Feed';

// 「新規フィードを追加する」ユースケース
export const addFeed = (repo: IFeedRepository) => async (feed: Feed): Promise<void> => {
  // ドメインルールの検証など行う
  if (!feed.url.startsWith('http')) {
    throw new Error('Invalid URL');
  }
  return await repo.addFeed(feed);
};
```

### 3. **Infrastructure層**: `src/infrastructure/firebase/FeedRepository.ts`

```ts
// src/infrastructure/firebase/FeedRepository.ts
import { IFeedRepository } from '../../domain/feed/IFeedRepository';
import { Feed, FeedId } from '../../domain/feed/Feed';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Firebaseの初期化済みfirestoreインスタンス

export class FirebaseFeedRepository implements IFeedRepository {
  async getAllFeeds(): Promise<Feed[]> {
    const snapshot = await getDocs(collection(db, 'feeds'));
    const feeds: Feed[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Feed;
      feeds.push({ ...data, id: docSnap.id });
    });
    return feeds;
  }

  async getFeedById(id: FeedId): Promise<Feed | null> {
    // doc取得処理など実装
    return null;
  }

  async addFeed(feed: Feed): Promise<void> {
    await setDoc(doc(collection(db, 'feeds')), feed);
  }

  async removeFeed(id: FeedId): Promise<void> {
    await deleteDoc(doc(db, 'feeds', id));
  }
}
```

```ts
// src/infrastructure/firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // your config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 4. **Store (Jotai)**: `src/store/feedAtom.ts`

```ts
import { atom } from 'jotai';
import { Feed } from '../domain/feed/Feed';

export const feedListAtom = atom<Feed[]>([]);
```

- グローバルに管理したい状態（フィード一覧など）をAtomとして定義。
- ターゲットが限られている場合は、コンポーネント直下の`useState`で済ませてもOK。

### 5. **Interface層 (UI)**

#### **5.1 ルーティング**: `src/interface/router/router.ts`

```ts
// src/interface/router/router.ts
import { createReactRouter } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';
import { feedRoute } from './feedRoute';

export const router = createReactRouter({
  routeTree: rootRoute.addChildren([feedRoute]),
});
```

```tsx
// src/interface/router/rootRoute.ts
import { createRouteConfig } from '@tanstack/react-router';

export const rootRoute = createRouteConfig({
  component: () => <div>Root Layout</div>,
});
```

```tsx
// src/interface/router/feedRoute.ts
import { createRouteConfig } from '@tanstack/react-router';
import { FeedList } from '../components/FeedList';

export const feedRoute = createRouteConfig({
  path: '/feeds',
  component: FeedList,
});
```

#### **5.2 コンポーネント**: `src/interface/components/FeedList.tsx`

```tsx
import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { feedListAtom } from '../../store/feedAtom';
import { fetchFeeds } from '../../application/feed/useCases/FetchFeeds';
import { FirebaseFeedRepository } from '../../infrastructure/firebase/FeedRepository';

const repo = new FirebaseFeedRepository();

export function FeedList() {
  const [feeds, setFeeds] = useAtom(feedListAtom);

  useEffect(() => {
    // コンポーネントマウント時にフィードを取得
    const loadFeeds = async () => {
      const result = await fetchFeeds(repo)();
      setFeeds(result);
    };
    loadFeeds();
  }, [setFeeds]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feed List</h1>
      <ul className="space-y-4">
        {feeds.map((feed) => (
          <li key={feed.id} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold">{feed.title}</h2>
            <p>{feed.url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- `fetchFeeds`ユースケース（application層）を呼び出し、結果を `feedListAtom` に格納。
- `FirebaseFeedRepository`（infrastructure層）を注入して利用。

### 6. **エントリポイント**: `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './interface/router/router';
import './index.css'; // TailwindのCSS( PostCSS経由で読み込み )
import { App } from './App'; // 全体Layoutなど

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);
```

---

## **ポイント**

1. **DDD/Clean Architecture**
   - ドメイン（ビジネスロジック）を **`domain/`** にまとめ、インターフェイス（`IFeedRepository`など）を定義する。
   - それらを呼び出すユースケース（`application/`）で実際の「操作（UseCase）」をまとめる。
   - インフラやUIが変わっても、ドメイン・ユースケースは変更の影響を受けにくくなる。

2. **関数型プログラミング**
   - ユースケースを「純粋関数の集まり」のように扱う（リポジトリなどの依存は引数経由で渡す）。
   - 副作用を極力少なくし、テストしやすい形にする。

3. **データフロー**
   - UI（Reactコンポーネント）はユースケースを呼び出すことでインフラにアクセス。
   - 取得したデータを Jotai の Atom（`feedAtom`など）に保存し、コンポーネントはそれを監視して自動レンダリング。
   - **Tanstack Router** を使い、各ページ（ルート）ごとに表示コンポーネントを切り替え。

4. **Tailwind CSS**
   - `index.css` や各コンポーネントで Tailwind のユーティリティクラスを使用。
   - デザインポリシーに合わせてカスタムクラスを設定してもよい。

---

## **まとめ**

- DDD/Clean Architecture を意識してフォルダ・依存関係を整理することで、機能追加や変更に強い構成を実現します。  
- 関数型プログラミングの発想で「ユースケースを純粋関数化」し、テスト性・可読性の向上を図れます。  
- **Firebase (Firestore)** をインフラ層とし、UI は **React (Tanstack Router)**、状態管理に **Jotai**、スタイリングに **Tailwind** を使用する構成です。  
- 大まかな骨格（エンティティ・リポジトリ・ユースケース・UI のつなぎ）を把握するためのサンプルコードなので、実際の要件や運用に合わせてカスタマイズしてください。
