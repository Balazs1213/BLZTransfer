# BLZTransfer – Serverless file sharing on AWS

Event-driven file-sharing web app built solo, from scratch, as a university project
(BME VIK, Önálló laboratórium, 2025/26 spring).

## Features

- **Virus scanning:** every uploaded file goes through a containerized virus scan
  (ClamAV on AWS Fargate), orchestrated by an AWS Step Functions state machine
- **AI tagging:** clean files are classified by type and tagged with AI services
  (Amazon Rekognition for images, Amazon Textract for documents)
- **Accounts and sharing:** Amazon Cognito sign-in, QR-code sharing with
  time- and download-limited links
- **Frontend:** React + Vite, available in English, Hungarian and German

## CI/CD

GitHub Actions pipeline with linting, `npm audit`, .NET unit tests, and deployment
of only the changed Lambda functions.

> The pipeline deployed to an AWS Learner Lab environment that is no longer active,
> so it now runs only on manual trigger.

## Tech stack

AWS Lambda (Node.js, C# / .NET 10), S3, Step Functions, DynamoDB, Cognito, Fargate,
Rekognition, Textract, React, Vite, Docker, GitHub Actions
