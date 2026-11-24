# BLZTransfer – Serverless file sharing on AWS

Event-driven file-sharing web app built solo, from scratch, as a university project
(BME VIK, Önálló laboratórium, 2025/26 spring).

- Uploaded files go through a containerized virus scan (ClamAV on AWS Fargate),
  orchestrated by an AWS Step Functions state machine
- Clean files are classified by type and tagged with AI services
  (Amazon Rekognition for images, Amazon Textract for documents)
- Cognito sign-in, QR-code sharing with time- and download-limited links,
  React + Vite frontend in English, Hungarian and German
- CI/CD with GitHub Actions: lint, `npm audit`, .NET unit tests,
  and deployment of only the changed Lambda functions

**Tech:** AWS Lambda (Node.js, C# / .NET 10), S3, Step Functions, DynamoDB,
Cognito, Fargate, Rekognition, Textract, React, Docker, GitHub Actions
