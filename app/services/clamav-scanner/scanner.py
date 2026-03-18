import boto3
import os
import subprocess
import sys

def scan_file():
    bucket = os.environ.get('BUCKET_NAME')
    key = os.environ.get('FILE_KEY')
    
    if not bucket or not key:
        print("Missing BUCKET_NAME or FILE_KEY environment variables.")
        sys.exit(1)

    local_path = f"/tmp/{os.path.basename(key)}"
    s3 = boto3.client('s3')

    try:
        print(f"Downloading {key} from {bucket}...")
        s3.download_file(bucket, key, local_path)

        print("Starting ClamAV scan...")
        # A clamscan futtatása
        result = subprocess.run(['clamscan', local_path], capture_output=True, text=True)

        # Takarítás (még az exit előtt!)
        if os.path.exists(local_path):
            os.remove(local_path)
            print("Temporary file cleaned up.")

        # Eredmény kiértékelése kilépési kóddal
        if result.returncode == 0:
            print("Scan result: CLEAN")
            sys.exit(0)  # Sikeres futás -> Tiszta fájl
        elif result.returncode == 1:
            print("Scan result: INFECTED")
            print(f"Details: {result.stdout}")
            sys.exit(1)  # Hiba (TaskFailed) -> Fertőzött fájl
        else:
            print(f"Scan error: {result.stderr}")
            sys.exit(2)  # Egyéb hiba (pl. hiányzó adatbázis)

    except Exception as e:
        print(f"Critical error during scan: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    scan_file()