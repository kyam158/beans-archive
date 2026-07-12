# Bean Archive

Bean Archiveは、コーヒー豆の産地情報、購入情報、焙煎情報、レシピ、味わいを記録する日本語UIのコーヒー図鑑です。

## Sprint1

- ホーム画面
- 豆の追加
- 一覧表示
- 編集
- 削除
- 検索
- localStorage保存
- レスポンシブ対応

## Sprint2

- カードタップで詳細画面へ移動
- 一覧カードの情報量を最小化
- 詳細画面で図鑑情報を指定順に表示
- 画像表示エリアを追加
- 焙煎機をデータモデルへ追加

## 技術構成

- HTML
- CSS
- JavaScript
- GitHub Pages対応
- localStorage保存

## ファイル構成

```text
beans-archive/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── storage.js
│   └── ui.js
└── README.md
```

## 保存仕様

localStorage key: `beanArchive.v1`

旧プロトタイプの `beanArchive` が残っている場合は、初回読み込み時にv1形式へ正規化します。

## データモデル

```js
{
  id: "",
  name: "",
  imageUrl: "",
  country: "",
  farm: "",
  process: "",
  variety: "",
  area: "",
  altitude: "",
  producer: "",
  harvestYear: "",
  importer: "",
  shop: "",
  price: "",
  purchaseDate: "",
  roastDate: "",
  roastLevel: "",
  roasterMachine: "",
  recipe: "",
  flavorTags: [],
  cupping: "",
  memo: "",
  createdAt: "",
  updatedAt: ""
}
```
