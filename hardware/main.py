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

] )
        
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
    print("dinstance: ",distance,"cm")

connect()

while True:
    val1 = read_distance()
    utime.sleep(0.1)
    val2 = read_distance()
    utime.sleep(0.1)
    
    if val1-val2 >5  or val1-val2 < -5:
        print("5cm 以上の差分が出ました")
