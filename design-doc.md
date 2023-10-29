# エコー

## 全体仕様

老人の孤独死を防ぐ見守りIoTを作ろう

- 人感センサーと超音波センサを搭載したIoTを設置し、人の出入りを計測する
- 一日に一回も計測されなかった場合はアラートを登録したLINEに送信する
- 計測の結果はWeb上で簡単に確認ができうる

### 計測について

人感センサで人がトイレに入ったかどうかを測定し、値が変化していたらAPIリクエストを送るようにする。
また、人感センサの制度によっては超音波センサを同時並行で動作させることを考える

## 機能要件

### ハード側要件

- ラズピコからWi-Fi経由でかつ単独でAPIを送信できる
- 電源のオンオフを切り替えられる ( ボタン電池などで実装? )
- 子機単体で動作するようにする。電気的な問題
- 外装は3Dプリンタでプリント

### ソフト要件(フロント)

技術選定

- React (Next.js)
- 開発期間が短いのでテンプレートを利用する?

必須要件

- 記録見れるようにする。
- 日付を指定して記録を見れる機能
- シンプルなUI

努力要件

- ログイン機能 (他の人のデータを見れないように)

### ソフト要件(バック)


技術選定

- Golang
- echo (webフレームワーク)
- gorm (ORM)
- sqlite3 (データベース : ただし、本番環境では異なる場合あり )

必要要件

- echoでAPIサーバーを作る
- API経由でデータベースに記録を取る
- gormを使って安全にデータベースを操作する
  
## 

## API定義 (バックエンド)

| メソッド | エンドポイント | 役割 | params | return |
| -- | -- | -- | -- | -- |
| POST | `/api/v1/record/<uuid>`| uuidに対応したデータを挿入する | :uuid | 200 OK, 403, 404 |
| GET | `/api/v1/get/<uuid>` | uuidに対応したデータを返す | :uuid | 200 json, 404 |

## ページ (フロントエンド)

| メソッド | エンドポイント | 役割 |
| -- | -- | -- |
| GET | `/` | トップページ |
| GET | `/dashboard/:uuid` | ダッシュボードページ 一括ですべてが見れる |
| GET | `/calendar/:uuid` | カレンダーから記録を探すことができるページ |

### Dashboard

dashboardからuuidを入力を行うとuuidに対応したデータをバックエンドから取得し、dashboardに反映する。

**Dashboardに含める情報**

- 現在のメトリクス
