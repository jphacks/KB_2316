from linebot import LineBotApi
from linebot.models import TextSendMessage
from linebot.exceptions import LineBotApiError
import os
from dotenv import load_dotenv
import mysql.connector
from datetime import datetime
import sys

load_dotenv()


YOUR_CHANNEL_ACCESS_TOKEN = os.environ["YOUR_CHANNEL_ACCESS_TOKEN"]
YOUR_CHANNEL_SECRET = os.environ["YOUR_CHANNEL_SECRET"]
MYSQL_PASS = os.environ["MYSQL_PASSWORD"]

conn = mysql.connector.connect(user="root", password=MYSQL_PASS, host="133.242.18.204", database="data")


cur = conn.cursor(dictionary=True)


if not conn.is_connected():
    raise Exception("MySQLサーバーへ接続できません")


def send_message(user_id):
    line_bot_api = LineBotApi(YOUR_CHANNEL_ACCESS_TOKEN)

    try:
        line_bot_api.push_message(user_id, TextSendMessage(text="⚠️緊急事態発生⚠️ \n本日1回も検知されていません!!"))
    except LineBotApiError as e:
        print(e.message)


def has_record(uuid: str) -> bool:
    today = datetime.now().strftime("%Y-%m-%d")

    query_counts = f"""
    SELECT * FROM counts
    WHERE uuid = '{uuid}'
    AND DATE(created_at) = '{today}'
    AND TIME(created_at) BETWEEN '00:00:00' AND '17:00:00';
    """

    cur.execute(query_counts)
    result = cur.fetchall()

    if not result:
        return False
    else:
        return True


def main():
    query = "select * from users;"
    cur.execute(query)

    for fetched_line in cur.fetchall():
        uuid = fetched_line["uuid"]
        user = fetched_line["user_name"]
        print(f"{uuid}: {user}")
        if not has_record(uuid):
            send_message(user)

    print(opt.main.ex_date)


main()

cur.close()
conn.close()
