# Classroom Live Sync Server

このフォルダには、VS Code 拡張機能「Workspace Launch by Link」用のサーバー実装が入っています。このコードは npm パッケージ `@kodai-yamamoto-siw/workspace-launch-server` として配布することを想定しています。

提供するエンドポイント:
- GET /manifest?student&exercise&token
- POST /event/fileSnapshot
- POST /event/create
- POST /event/delete
- POST /event/rename
- POST /event/heartbeat
- GET /_events (監査用)

## コード構成 (TypeScript)
- `server/src/server.ts` : Express アプリケーションの初期化とルーターの登録
- `server/src/routes/manifest.ts` : マニフェスト関連のエンドポイント
- `server/src/routes/events.ts` : ファイル操作に関するイベントエンドポイント
- `server/src/utils/storage.ts` : パスのサニタイズやディレクトリ操作のユーティリティ
- `server/src/utils/manifest.ts` : テンプレートからマニフェストを組み立てるユーティリティ
- `server/src/config.ts` : 設定値の解決 (ポート・テンプレート/ストレージパス)

生成された JavaScript は `server/dist/` に出力され、ランタイムではそちらが使用されます。

## インストール

npm パッケージとして利用する場合は、依存関係に追加します。

```powershell
npm install @kodai-yamamoto-siw/workspace-launch-server
```

テンプレートの置き場所:
- 既定では、コマンドを実行したプロジェクト（npm でインストールした側）の `templates/` ディレクトリを優先的に使用します。
- 上記が存在しない場合は、パッケージ同梱の `templates/` ディレクトリにフォールバックします。
- 任意のテンプレートを利用したい場合は `TEMPLATE_ROOT` 環境変数でパスを上書きしてください。
- 例: `server/templates/week1/README.md`, `server/templates/week1/src/main.py` など。

## ローカル開発 (パッケージ側)

```powershell
cd server
npm install
npm run dev
```

## コンシューマー側の起動方法

```powershell
workspace-launch-server
```

本番向けにプリビルドされた成果物を利用する場合は、直接 CLI を起動するだけで構いません。ソースを変更した場合は次のコマンドで再ビルドしてください。

```powershell
npm run build
```

環境変数:
- `PORT` (既定: 8787)
- `STORAGE_ROOT` 受信した学生ごとの作業内容を保存するルート (既定: `./storage`)
- `TEMPLATE_ROOT` 配布テンプレートのルート (既定: `./server/templates`)

動作確認:
- http://localhost:8787/manifest?student=alice&exercise=demo
- http://localhost:8787/_events
