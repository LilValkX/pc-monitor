import psutil
import requests
import time
import json
from datetime import datetime

# ตั้งค่า
MACHINE_ID = "machine_1"  # เปลี่ยนเป็นชื่อเครื่องของคุณ
API_URL = "http://localhost:3000/api/data/submit"  # เปลี่ยนเป็น URL ของเว็บคุณ

def get_roblox_processes():
    count = 0
    for proc in psutil.process_iter(['name']):
        try:
            if proc.info['name'] and 'RobloxPlayerBeta.exe' in proc.info['name']:
                count += 1
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return count

def get_system_usage():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    return cpu, ram

def main():
    print(f"Starting monitor for {MACHINE_ID}")
    print(f"Sending data to {API_URL}")
    
    while True:
        try:
            roblox_count = get_roblox_processes()
            cpu, ram = get_system_usage()
            
            data = {
                "machine_id": MACHINE_ID,
                "cpu_usage": cpu,
                "ram_usage": ram,
                "gpu_usage": 0,  # ปรับปรุงถ้ามีวิธีดึง GPU
                "roblox_count": roblox_count,
                "watt": 300  # ปรับตามเครื่องจริง
            }
            
            response = requests.post(API_URL, json=data)
            if response.status_code == 200:
                print(f"[{datetime.now()}] Data sent successfully - Roblox: {roblox_count}")
            else:
                print(f"[{datetime.now()}] Error sending data: {response.status_code}")
                
        except Exception as e:
            print(f"Error: {e}")
            
        time.sleep(60)  # ส่งข้อมูลทุก 60 วินาที

if __name__ == "__main__":
    main()