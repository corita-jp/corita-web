# Migration: pictan → pictan.corita.jp サブドメイン化

> **状態**: 待機中（App Store 審査通過後に実行）
> **作成日**: 2026-05
> **目的**: pictan 関連ページを `corita.jp/pictan/*` から `pictan.corita.jp/*` に移行し、ブランド分離とアナリティクス独立性を確保する。

---

## 前提

### 現状構造
- corita.jp は Vercel hosting / dnsv.jp DNS / Google Workspace メール
- corita-web リポジトリは flat HTML サイト
  - `index.html` = corita.jp/ ルート（独立アプリスタジオの紹介）
  - `pictan/` 配下 = pictan 専用ページ群（LP / Privacy / Terms / Support、日英各2ファイル）

### 既に外部登録済みの URL（更新が必要）
- App Store Connect:
  - Privacy Policy URL（英語）: 推定 `corita.jp/pictan/privacy.html` または `corita.jp/pictan/privacy`
  - Privacy Policy URL（日本語）: 推定 `corita.jp/pictan/privacy-ja.html`
  - Support URL（あれば）: 同様
- RevenueCat:
  - Privacy Policy URL
  - Terms of Service URL

### 実行タイミングの絶対条件
- ✅ App Store 審査が**通過した直後**（メタデータ更新のタイミング自由）
- ❌ 審査中は触らない（URL確認のリスク）

---

## Step 1: Vercel にドメイン追加（5分）

1. Vercel → corita-web プロジェクト → Settings → Domains
2. `Add` → `pictan.corita.jp` を入力
3. Vercel が指示する CNAME（例: `cname.vercel-dns.com`）を控える

## Step 2: dnsv.jp で CNAME 追加（5〜30分で反映）

1. dnsv.jp 管理画面でログイン
2. corita.jp の DNS レコード設定へ
3. 追加：
   ```
   Type:  CNAME
   Name:  pictan
   Value: cname.vercel-dns.com  ← Vercel が表示するもの
   TTL:   3600
   ```

## Step 3: corita-web/vercel.json を更新

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/pictan/:path*",
      "has": [
        { "type": "host", "value": "pictan.corita.jp" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/pictan",
      "destination": "https://pictan.corita.jp/",
      "permanent": true,
      "has": [
        { "type": "host", "value": "corita.jp" }
      ]
    },
    {
      "source": "/pictan/(.*)",
      "destination": "https://pictan.corita.jp/$1",
      "permanent": true,
      "has": [
        { "type": "host", "value": "corita.jp" }
      ]
    }
  ]
}
```

- `rewrites`: `pictan.corita.jp` でリクエストを受けたら、内部的に `/pictan/*` の中身を serve（URL は書き換わらない）
- `redirects`: 旧 `corita.jp/pictan/*` への外部リクエストは 308（≒301）で新ドメインに飛ばす
- 両者は host 条件でホスト分離されているので衝突しない

git commit して push → Vercel で deploy が走る。

## Step 4: 動作確認チェックリスト

| URL | 期待動作 |
|---|---|
| `https://pictan.corita.jp/` | 英語 LP（`/pictan/index.html` の内容）を 200 で表示 |
| `https://pictan.corita.jp/ja` | 日本語 LP を 200 で表示 |
| `https://pictan.corita.jp/privacy` | 英語 Privacy Policy を 200 で表示 |
| `https://pictan.corita.jp/privacy-ja` | 日本語 Privacy を 200 で表示 |
| `https://pictan.corita.jp/terms` `/terms-ja` | 200 で表示 |
| `https://pictan.corita.jp/support` `/support-ja` | 200 で表示 |
| `https://corita.jp/pictan/privacy.html` | **301** → `pictan.corita.jp/privacy.html` → cleanUrls 経由で `/privacy` に着地 |
| `https://corita.jp/pictan/` | **301** → `pictan.corita.jp/` に着地 |
| `https://corita.jp/` | 引き続き corita 紹介ページ（変更なし） |

curl コマンドでの確認例：
```bash
# 新URLが200で返る
curl -I https://pictan.corita.jp/privacy

# 旧URLが301で新ドメインを返す
curl -I https://corita.jp/pictan/privacy.html
# Location ヘッダーに pictan.corita.jp/... が含まれることを確認
```

## Step 5: App Store Connect の URL 更新

App Store Connect → pictan → App Information

- **Privacy Policy URL (English)**: `https://pictan.corita.jp/privacy`
- **Privacy Policy URL (Japanese localization)**: `https://pictan.corita.jp/privacy-ja`
- **Support URL** がある場合: `https://pictan.corita.jp/support` (and `-ja` for Japanese localization)
- **Marketing URL** がある場合: `https://pictan.corita.jp/`

> ローカライズ毎の URL は、各言語タブで個別に設定するUIになっている。日本語と英語両方の設定を忘れずに。

## Step 6: RevenueCat の URL 更新

RevenueCat → Project → Apps → 該当アプリ → Settings

- **Privacy Policy URL**: `https://pictan.corita.jp/privacy`
- **Terms of Service URL**: `https://pictan.corita.jp/terms`
- 言語別設定の場合は `/privacy-ja` `/terms-ja` も

## Step 7: その他の参照箇所更新

- [ ] アプリ内 `app/(tabs)/settings.tsx` で `support@corita.jp` のみ参照（URL リンクは無し → 不要）
- [ ] `CLAUDE.md` にドメインの新構造を追記（オプション）
- [ ] X / Threads / Instagram bio に LP URL を更新
- [ ] LinkedIn / 個人ブログなど他の参照箇所

---

## ロールバック手順（万が一）

Phase 3 で問題が出た場合：

1. **Vercel 上で過去 deploy を「Promote to Production」**: Vercel ダッシュボードから前 deploy を一発で復旧可能
2. **App Store Connect**: 旧 URL に戻して保存（メタデータ変更なのでバイナリ審査は不要）
3. **RevenueCat**: 旧 URL に戻して保存（即時反映）

リダイレクト・rewrite は vercel.json を git revert で戻せばよい。

---

## 完了後の状態

- `pictan.corita.jp` がプロダクトの正規ドメイン
- `corita.jp/pictan/*` への過去リンクも 301 で機能継続
- App Store / RevenueCat のメタデータは新URLで一貫
- corita.jp は今後別プロダクトを追加する際の親ドメインとして使える状態

---

## メモ

- 将来 `pictan.app` 等の独立ドメインを取得した場合は、同様の手順で `pictan.corita.jp → pictan.app` の 301 リダイレクトを追加すれば移行可能
- Vercel の host-based rewrite は Vercel Pro 以上で使える機能だったが現在は無料プランでも使える（2024 以降）

---

# Migration: pictan 日本語 LP のリデザイン適用

> **状態**: 待機中（App Store 審査通過後に実行）
> **作成日**: 2026-05-26
> **目的**: 現状プレースホルダーの `pictan/ja.html` を、Claude Design で作成した本番LPに差し替える。

## 前提

### 設計成果物（指示書）
Claude Design（claude.ai/design）から書き出した handoff バンドルが、デプロイ対象外の以下に保管されている：

```
/Users/tatsuya/Corita/pictan/code/design/pitan-web/
├── README.md                          ← Coding agent 向けの読み順指示
├── chats/chat1.md                     ← 設計意図・トーン調整の全履歴（必読）
└── project/
    ├── index.html                     ← エントリ（React+Babel CDN プロトタイプ）
    ├── styles.css                     ← Anthropic 由来トークン一式（cream/coral/dark-navy）
    ├── app.jsx                        ← 9セクション全体の JSX 実装
    ├── assets/app-card-spill.png      ← Hero の iPhone 内スクショ
    └── uploads/01_learn_english_visually.png   ← 参照用アップロード画像
```

`code/web/` レポの外側（`code/design/`）に置くことで Vercel デプロイには含まれない。git 管理もしていない。バンドル全体で約 1.2MB。

ソースURL（再取得が必要な場合・期限切れの可能性あり）：
`https://api.anthropic.com/v1/design/h/RSe7TJaJcxafNcgNZI3MeA?open_file=index.html`

### 設計の中身（要点）
- 言語: 日本語版（`<html lang="ja">`）
- 構成: Hero / ペイン4枚 / 続かない理由3つ / 3本柱+シナジー三角形 / インタラクティブ・フラッシュカードデモ / Lv.1〜10可視化 / プライバシー姿勢 / FAQ / コーラル Final CTA / フッター
- カラー: canvas `#faf9f5` / coral primary `#cc785c` / dark navy `#181715`（Anthropic 由来）
- タイポ: Cormorant Garamond + Noto Serif JP（display）／ Inter + Noto Sans JP（body）— Google Fonts から取得
- インタラクション: Hero の iPhone フレーム、フラッシュカードの 3 フェーズ（推測→答え合わせ→自己判定）、FAQ 開閉
- トーン: 「AIっぽさ」を抜く方向で 2 回チューニング済（chat1.md 末尾参照）

### 配置決定
- ターゲットファイル: `corita-web/pictan/ja.html` を差し替え（設計が日本語のため）
- `pictan/index.html`（英語プレースホルダー）は今回触らない。英語版が必要になった時点で別途翻訳ジョブを切る
- 同ディレクトリの privacy / terms / support 系ファイルは触らない（旧スタイル維持）

### 実行タイミングの絶対条件
- ✅ App Store 審査が**通過した直後**
- ❌ 審査中は触らない（外部参照URLが変わるリスクは無いが、不要なデプロイは避ける）
- このリデザインと、上の `pictan.corita.jp` サブドメイン化を**同じデプロイで**まとめて出すと、リダイレクト確認と LP 動作確認を一度で済ませられる

## 実装方針（実行時に決定）

設計バンドルは React+Babel-standalone（CDN）で書かれた**プロトタイプ**で、本番にそのまま乗せるには重い。実行時に以下のいずれかを選ぶ：

| 方針 | 中身 | 適性 |
|---|---|---|
| A. プロトタイプそのまま | `index.html`/`styles.css`/`app.jsx` ＋ 画像を `pictan/ja.html` 周辺に配置。React・Babel は CDN のまま | 最短。LCP は犠牲（~1MB の dev React + Babel をブラウザでトランスパイル） |
| B. 静的 HTML に手で展開 | JSX を静的マークアップに展開。FAQ 開閉・デモカードのフェーズ機械だけ素の JS で書く。React なし | corita-web の他ページと整合。本番として妥当 |
| C. ビルドツール導入 | Vite / Astro 等を corita-web に入れて JSX のまま build → 静的出力 | やりすぎ。他ページ（privacy/terms 等）と粒度が合わない |

**推奨は B**。理由：他のページが素の HTML で書かれていて、ja.html だけ React ランタイムを引くのは構成上ちぐはぐ。設計バンドルの `app.jsx` は読みやすく分割されているので、Component 単位で手作業展開してもコストは小さい。

## 手順（実行時）

1. このセクションと chat1.md（特に末尾の「AIっぽさを抜く」修正履歴）を読み返す
2. 上の A/B/C から方針を決める（デフォルト B）
3. 設計バンドル一式を読み込んで実装
   ```bash
   open /Users/tatsuya/Corita/pictan/code/design/pitan-web/project/index.html  # ローカル確認は可能
   ```
4. `corita-web/pictan/ja.html` を差し替え。CSS/JS/画像は同階層に置く（既存の他ページに干渉しないファイル名で）
5. ローカル `python3 -m http.server` 等で各ブレークポイント（mobile / tablet / desktop）を目視確認
6. リンク（`#cta` の App Store URL、`#faq` 等のアンカー）が機能するか確認
7. SEO 用 `<title>` `<meta description>` `<meta og:*>` を ja.html 用に整備（プロトタイプは title だけ）
8. `corita.jp/pictan/ja` で表示確認（cleanUrls 経由で `.html` 拡張子は消える）
9. サブドメイン化と同じ deploy にまとめるなら、上のセクション「Migration: pictan → pictan.corita.jp サブドメイン化」の Step 3 と一緒に commit

## 注意点

- フォント: Google Fonts から Cormorant Garamond / Noto Serif JP / Noto Sans JP / Inter を引いている。preconnect 済み。`display=swap` 指定でレイアウトシフトは最小化済
- 画像: Hero の `assets/app-card-spill.png` は `media/` 配下の `01_flashcard_ja.png` 等で差し替え可能だが、設計時点でこの画像が選ばれている経緯は chat1.md には記録されていない（uploads に置かれた `01_learn_english_visually.png` とは別物。後者は参照用）
- インタラクション: フラッシュカードのデモは「画面内のカードを実際にタップさせて 3 フェーズを体験させる」LP の核。静的展開する場合も、この体験性は落とさないこと
- スパイクマーク: SVG インラインで埋まっている（Anthropic 風の 4-spoke 星形）。ロゴ扱い、白黒反転禁止

