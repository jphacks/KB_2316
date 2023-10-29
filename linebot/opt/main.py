from flask import Flask, request, abort

from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import (
    MessageEvent,
    TextMessage,
    TextSendMessage,
)
import os
from dotenv import load_dotenv
import mysql.connector
from datetime import datetime


# .envファイルの内容を読み込見込む
load_dotenv()
app = Flask(__name__)

# 環境変数取得
YOUR_CHANNEL_ACCESS_TOKEN = os.environ["YOUR_CHANNEL_ACCESS_TOKEN"]
YOUR_CHANNEL_SECRET = os.environ["YOUR_CHANNEL_SECRET"]

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


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    uuid = event.message.text
    userid = event.source.user_id

    conn = mysql.connector.connect(user="root", password="kv3riopme1act", host="133.242.18.204", database="data")

    if not conn.is_connected():
        raise Exception("MySQLサーバーへ接続できません")

    query_counts = f"""
    SELECT * FROM counts
    WHERE uuid = '{uuid}'
    """
    cur = conn.cursor(dictionary=True)

    cur.execute(query_counts)
    result = cur.fetchall()

    if not result:
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text="IDが間違っている可能性があります💦 もう一度ご確認ください🙇‍♂️"))
    else:
        # SQLに登録

        cur.execute(
            "Insert INTO users (uuid,user_name) values(%s,%s)",
            (
                uuid,
                userid,
            ),
        )
        conn.commit()
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text="IDを連携しました！エコーが緊急だと考えた時はこちらに警告が来ます!"))

    cur.close()
    conn.close()


if __name__ == "__main__":
    #    app.run()
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
