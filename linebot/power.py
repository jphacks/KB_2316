from machine import Pin
import time

# ピンの設定
power_detect_pin = Pin(2, Pin.IN) # 主電源を検出するためのピン
relay_pin = Pin(3, Pin.OUT) # リレーを制御するためのピン

# リレーを通常は閉じた状態（主電源を使用）に設定
relay_pin.value(0)

def check_power():
    # power_detect_pinがLOWならば、電源はオフ
    return power_detect_pin.value() == 1

while True:
    if not check_power():
        # 電源が失われたら、バックアップ電源に切り替え
        relay_pin.value(1)
        # さらに、ここでアラートを送信するなどのアクションを取ることができます
        
    time.sleep(1) # 1秒ごとにチェック
