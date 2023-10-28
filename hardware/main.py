from machine import Pin
import time
import network

trigger = Pin(14,Pin.OUT)
echo = Pin(15,Pin.IN)

ssid = 'にんじん🥕'
password = 'mmmiii88'

def connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

    if wlan.status() != 3:
        raise RuntimeError('ネットワーク接続失敗')
    else:
        print('接続完了')
        status = wlan.ifconfig()
        print( 'IPアドレス = ' + status[0] )

connect()
