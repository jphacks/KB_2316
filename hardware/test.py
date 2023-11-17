from machine import Pin
import utime
import urequests
import network

button_pin = Pin(12, Pin.IN, Pin.PULL_UP)
is_hit = False

ssid = "にんじん🥕"
password = ""
url = "https://rits-sec.net/api/v1/record/b7f0542f"
em_url = "https://yuki-ishida.tech/emergency/b7f0542f"
# machine.Pin(23, machine.Pin.OUT).low()


def connect():
    print("Wi-Fi接続を試みます")
    i = 0
    while i < 3:
        # machine.Pin(23, machine.Pin.OUT).high()
        # utime.sleep(3)
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        wlan.connect(ssid, password)

        if wlan.status() != 3:
            i += 1
            raise RuntimeError("ネットワーク接続失敗")
        else:
            print("接続完了")
            status = wlan.ifconfig()
            print("IPアドレス = " + status[0])
            break


def emergency():
    connect()

    request(em_url)


def request(url):
    res = urequests.post(url)
    print(res)


def main():
    # 電圧確認

    # ボタンがされたか
    while True:
        button_state = button_pin.value()

        is_pushed = False
        if button_state == 0:
            if not is_hit:
                is_hit = True
                is_pushed = True
        else:
            is_hit = False

        if is_pushed:
            # TODO: 緊急リクエスト
            emergency()
        else:
            print("No")
        utime.sleep(0.5)



    # 人感センサが反応したか
    
    
if __name__ == "__main__":
    main()
