import boto3
import os
import subprocess
import sys
import time

def scan_file():
    bucket = os.environ.get('BUCKET_NAME')
    key = os.environ.get('FILE_KEY')
    local_path = f"/tmp/{os.path.basename(key)}"
    
    # 1. ClamD (daemon) indítása a háttérben
    print("Starting ClamAV daemon...")
    subprocess.Popen(['clamd'])
    
    # S3 Letöltés (amíg a daemon töltődik a háttérben, kihasználjuk az időt)
    s3 = boto3.client('s3')
    try:
        print(f"Downloading {key}...")
        s3.download_file(bucket, key, local_path)
    except Exception as e:
        print(f"Download failed: {e}")
        sys.exit(2)

    # 2. Várjuk meg, amíg a daemon kész (socket ellenőrzés)
    max_retries = 30
    for i in range(max_retries):
        if os.path.exists("/var/run/clamav/clamd.ctl"):
            break
        time.sleep(1)
        if i % 5 == 0: print("Waiting for ClamD to initialize...")

    # 3. Gyors scan a daemonnal
    print("Running clamdscan...")
    result = subprocess.run(['clamdscan', '--stream', local_path], capture_output=True, text=True)

    # Takarítás
    if os.path.exists(local_path): os.remove(local_path)

    # Kiértékelés
    if result.returncode == 0:
        print("Scan result: CLEAN")
        sys.exit(0)
    else:
        print(f"Scan result: INFECTED or ERROR. Details: {result.stdout}")
        sys.exit(1)

if __name__ == "__main__":
    scan_file()