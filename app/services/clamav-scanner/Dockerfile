FROM python:3.9-slim

RUN apt-get update && \
    apt-get install -y clamav clamav-daemon wget && \
    apt-get clean

RUN freshclam

RUN pip install boto3

WORKDIR /app

COPY scanner.py .

CMD ["python", "scanner.py"]
