FROM python:3.9-slim

RUN apt-get update && \
    apt-get install -y clamav clamav-daemon clamav-freshclam wget && \
    apt-get clean

# Vírusadatbázis letöltése a build során (ezt már jól csináltad)
RUN freshclam

# Jogosultságok és könyvtárak beállítása a daemonnak
RUN mkdir -p /var/run/clamav && chown clamav:clamav /var/run/clamav

RUN pip install boto3

WORKDIR /app
COPY scanner.py .

CMD ["python", "scanner.py"]