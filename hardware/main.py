from machine import Pin
import utime
import network
import urequests

trigger = Pin(14, Pin.OUT)
echo = Pin(15, Pin.IN)

ssid = "にんじん🥕"
password = "mmmiii88"
url = "http://133.242.18.204:8080/api/v1/record/b7f0542f"


def connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

    if wlan.status() != 3:
        raise RuntimeError("ネットワーク接続失敗")
    else:
        print("接続完了")
        status = wlan.ifconfig()
        print("IPアドレス = " + status[0])


def send_post_request():
    # POST リクエストを送信する場所
    response = urequests.post(url)
    print(response.text)


def read_distance():
    trigger.low()
    utime.sleep_us(2)
    trigger.high()
    utime.sleep(0.00001)
    trigger.low()
    while echo.value() == 0:
        signaloff = utime.ticks_us()
    while echo.value() == 1:
        signalon = utime.ticks_us()
    timepassed = signalon - signaloff
    distance = (timepassed * 0.0343) / 2
    print("dinstance: ", distance, "cm")


def main():
    connect()
    while True:
        val1 = read_distance()
        utime.sleep(0.1)
        val2 = read_distance()
        utime.sleep(0.1)

        if val1 - val2 > 5 or val1 - val2 < -5:
            print("5cm 以上の差分が出ました")
            send_post_request()
            utime.sleep(600)


if __name__ == "__main__":
    main()
