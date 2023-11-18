from flask import Flask, request, abort

from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import (
    MessageEvent,
    FollowEvent,
    TextMessage,
    TextSendMessage,
)
import os
from dotenv import load_dotenv
import mysql.connector
from datetime import datetime
from linebot.models import (
    TemplateSendMessage,
    ButtonsTemplate,
    DatetimePickerTemplateAction,
    PostbackEvent,
)
import requests

# .envファイルの内容を読み込見込む
load_dotenv()
app = Flask(__name__)

# 環境変数取得
YOUR_CHANNEL_ACCESS_TOKEN = os.environ["YOUR_CHANNEL_ACCESS_TOKEN"]
YOUR_CHANNEL_SECRET = os.environ["YOUR_CHANNEL_SECRET"]
MYSQL_PASS = os.environ["MYSQL_PASSWORD"]

line_bot_api = LineBotApi(YOUR_CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(YOUR_CHANNEL_SECRET)


@app.route("/callback", methods=["POST"])
def callback():
    # get X-Line-Signature header value
    signature = request.headers["X-Line-Signature"]

    # get request body as text
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    # handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    return "OK"


@app.route("/health")
def health():
    return "200 OK"


@app.route("/emergency/<uuid>", methods=["POST"])
def emergency(uuid):
    # 1パスパラメータからuuidを受け取り、変数に格納
    # 関数の引数として用意されている

    # 2uuidを元にsqlから紐づいたuseridを取得
    # 2-1 msqlに接続
    conn = mysql.connector.connect(
        user="root", password=MYSQL_PASS, host="133.242.18.204", database="data"
    )

    cur = conn.cursor(dictionary=True)

    if not conn.is_connected():
        raise Exception("MySQLサーバーへ接続できません")

    # 2-2 sql文を用意
    query_counts = f"""
    SELECT user_name FROM users
    WHERE uuid = '{uuid}'
    """

    # 2-3 データを取得して変数に格
    cur.execute(query_counts)
    result = cur.fetchall()

    cur.close()
    conn.close()
    # 3useridに対してメッセージを送信
    if result:
        for result_one in result:
            line_bot_api.push_message(
                result_one["user_name"], TextSendMessage(text="緊急事態発生！")
            )
    return "OK"


@app.route("/time_long/<uuid>", methods=["POST"])
def longtime_through(uuid):
    conn = mysql.connector.connect(
        user="root", password=MYSQL_PASS, host="133.242.18.204", database="data"
    )

    cur = conn.cursor(dictionary=True)

    query_counts = f"""
    SELECT user_name FROM users
    WHERE uuid = '{uuid}'
    """

    # 2-3 データを取得して変数に格
    cur.execute(query_counts)
    result = cur.fetchall()

    cur.close()
    conn.close()

    if result:
        for result_one in result:
            line_bot_api.push_message(
                result_one["user_name"], TextSendMessage(text="10分以上の滞在時間が検知されました。")
            )
    return "OK"


@app.route("/detect/<uuid>", methods=["POST"])
def detect(uuid):
    conn = mysql.connector.connect(
        user="root", password=MYSQL_PASS, host="133.242.18.204", database="data"
    )

    cur = conn.cursor(dictionary=True)

    query_counts = f"""
    SELECT user_name FROM users
    WHERE uuid = '{uuid}'
    """

    # 2-3 データを取得して変数に格
    cur.execute(query_counts)
    result = cur.fetchall()

    cur.close()
    conn.close()

    if result:
        for result_one in result:
            line_bot_api.push_message(
                result_one["user_name"], TextSendMessage(text="10分以上の滞在時間が検知されました。")
            )
    return "OK"


@handler.add(FollowEvent)  # FollowEventをimportするのを忘れずに！
def follow_message(event):  # event: LineMessagingAPIで定義されるリクエストボディ
    # print(event)

    if event.type == "follow":  # フォロー時のみメッセージを送信
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="エコーを利用してくれてありがとう☺️\n連携のためにエコーに記載されているIDを送信してね！"),
        )  # イベントの応答に用いるトークン


@handler.add(PostbackEvent)
def postback(event):
    conn = mysql.connector.connect(
        user="root", password=MYSQL_PASS, host="133.242.18.204", database="data"
    )

    cur = conn.cursor(dictionary=True)

    userid = event.source.user_id
    query_counts = f"""
        SELECT uuid FROM users
        WHERE user_name = '{userid}'
        """
    cur.execute(query_counts)
    result = cur.fetchall()
    uuid = result[0]["uuid"]

    date = event.postback.params["date"]
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text="わかりました！" + date + "を除外日として設定します。"),
    )  # イベントの応答に用いるトークン
    year = date.split("-", 2)[0]
    month = date.split("-", 2)[1]
    day = date.split("-", 2)[2]
    requests.post(f"https://rits-sec.net/api/v1/set/{uuid}/{year}/{month}/{day}")


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    conn = mysql.connector.connect(
        user="root", password=MYSQL_PASS, host="133.242.18.204", database="data"
    )
    cur = conn.cursor(dictionary=True)
    if not conn.is_connected():
        raise Exception("MySQLサーバーへ接続できません")

    message = event.message.text
    userid = event.source.user_id

    if message == "ID設定をお願いします":
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="登録ですね、わかりました！IDを送信してください！"),
        )

    elif message == "除外日設定をお願いします。":
        date_picker = TemplateSendMessage(
            alt_text="予定日を設定",
            template=ButtonsTemplate(
                text="予定日を設定",
                title="Year/Month/Day",
                actions=[
                    DatetimePickerTemplateAction(
                        label="設定",
                        data="action=buy&itemid=1",
                        mode="date",
                        initial="2017-04-01",
                        min="2017-04-01",
                        max="2099-12-31",
                    )
                ],
            ),
        )
        line_bot_api.reply_message(event.reply_token, date_picker)

    elif "-" in message:
        uuid = message
        query_counts = f"""
        SELECT * FROM users
        WHERE uuid = '{uuid}'
        """

        cur.execute(query_counts)
        result = cur.fetchall()

        if not result:
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text="IDが間違っている可能性があります💦 もう一度ご確認ください🙇‍♂️"),
            )

        else:
            # usersの中のuuidがメッセージから受け取ったuuidと同じでかつ＝OK、その行のuser_nameがuseridと同じの時の対処
            query_counts = f"""
            SELECT * FROM users
            WHERE user_name = '{userid}'
            AND uuid = '{uuid}'
            """

            cur.execute(query_counts)
            result = cur.fetchall()

            if not result:
                query_counts = f"""
                SELECT user_name FROM users
                WHERE uuid = '{uuid}'
                """
                cur.execute(query_counts)
                result = cur.fetchall()

                if result[0]["user_name"] == "":
                    query_delete = f"""
                    DELETE FROM users
                    WHERE uuid = '{uuid}'
                    """
                    cur.execute(query_delete)

                # SQLに登録
                cur.execute(
                    "Insert INTO users (uuid,user_name) values(%s,%s)",
                    (
                        uuid,
                        userid,
                    ),
                )
                conn.commit()

                textx = f"IDを連携しました！エコーが緊急だと考えた時はこちらに警告が来ます!\n取得したデータはここから閲覧できます\nhttps://r-frontend.vercel.app/dashboard/{uuid}"
                line_bot_api.reply_message(
                    event.reply_token, TextSendMessage(text=textx)
                )

            else:
                line_bot_api.reply_message(
                    event.reply_token, TextSendMessage(text="もうすでにそのIDは連携されています！")
                )

    else:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="メッセージを送信する場合はメニューから選択してください🙇🏻‍♀️"),
        )

    cur.close()
    conn.close()


if __name__ == "__main__":
    #    app.run()
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
