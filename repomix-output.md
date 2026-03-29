This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: node_modules/**, .git/**, dist/**, build/**, .next/**, bin/**, obj/a**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/backend/.gitignore
app/backend/src/Blz.CheckFileStatus/aws-lambda-tools-defaults.json
app/backend/src/Blz.CheckFileStatus/Blz.CheckFileStatus.csproj
app/backend/src/Blz.CheckFileStatus/Function.cs
app/backend/src/Blz.CheckFileStatus/Readme.md
app/backend/src/Blz.GetPresignedUrl/aws-lambda-tools-defaults.json
app/backend/src/Blz.GetPresignedUrl/Blz.GetPresignedUrl.csproj
app/backend/src/Blz.GetPresignedUrl/Function.cs
app/backend/src/Blz.GetPresignedUrl/Readme.md
app/frontend/.gitignore
app/frontend/eslint.config.js
app/frontend/index.html
app/frontend/package.json
app/frontend/public/vite.svg
app/frontend/README.md
app/frontend/src/api/fileApi.js
app/frontend/src/App.css
app/frontend/src/App.jsx
app/frontend/src/assets/react.svg
app/frontend/src/components/Auth/AuthHome/AuthHome.jsx
app/frontend/src/components/Auth/AuthHome/AuthHome.module.css
app/frontend/src/components/dev-tests/S3CorsTest.jsx
app/frontend/src/components/UI/Buttons/Button.jsx
app/frontend/src/components/UI/Buttons/Button.module.css
app/frontend/src/components/UI/Cards/Card.jsx
app/frontend/src/components/UI/Cards/Card.module.css
app/frontend/src/components/UI/Dropzone/Dropzone.jsx
app/frontend/src/components/UI/Dropzone/Dropzone.module.css
app/frontend/src/components/UI/Feedback/ProgressBar/ProgressBar.jsx
app/frontend/src/components/Upload/FilePicker/FilePicker.jsx
app/frontend/src/components/Upload/FilePicker/FilePicker.module.css
app/frontend/src/config/aws-config.js
app/frontend/src/index.css
app/frontend/src/main.jsx
app/frontend/src/teszt.jsx
app/frontend/vite.config.js
app/services/clamav-scanner/Dockerfile
app/services/clamav-scanner/scanner.py
BLZTrsanfer.sln
diagrams/architecture-aws-diagram.drawio
diagrams/use-case-diagram.drawio
docs/project-documentation.md
docs/requirements.md
docs/specification.md
docs/workPlan.md
docs/workPlan.pdf
files_for_upload_test/test.txt
files_for_upload_test/test2.txt
weekly-work/week-02/AWS_Diagram.txt
weekly-work/week-02/onlab.drawio.png
weekly-work/week-02/use-case-describe.md
weekly-work/week-02/Work_Plan.txt
weekly-work/week-03/weekly-work-3.md
weekly-work/week-06/weekly-work-6.txt
```

# Files

## File: app/backend/.gitignore
````
 1: ## .NET Core / C# specifikus ignorálások ##
 2: 
 3: # Build kimenetek
 4: [Dd]ebug/
 5: [Rr]elease/
 6: x64/
 7: x86/
 8: bin/
 9: obj/
10: 
11: # Felhasználó-specifikus editor beállítások (VS, VS Code)
12: .vs/
13: .vscode/
14: *.user
15: *.userossc
16: *.suo
17: *.userprefs
18: *.sln.docstates
19: 
20: # Roslyn analyzer cache
21: *.bcb
22: 
23: # .NET Tools és cache
24: .dotnet/
25: .tools/
26: *.DotSettings.user
27: 
28: # Ha használsz appsettings.json titkokat, azokat is érdemes itt kizárni (később):
29: # appsettings.Development.json
````

## File: app/backend/src/Blz.CheckFileStatus/aws-lambda-tools-defaults.json
````json
 1: {
 2:   "Information": [
 3:     "This file provides default values for the deployment wizard inside Visual Studio and the AWS Lambda commands added to the .NET Core CLI.",
 4:     "To learn more about the Lambda commands with the .NET Core CLI execute the following command at the command line in the project root directory.",
 5:     "dotnet lambda help",
 6:     "All the command line options for the Lambda command can be specified in this file."
 7:   ],
 8:   "profile": "",
 9:   "region": "",
10:   "configuration": "Release",
11:   "function-architecture": "x86_64",
12:   "function-runtime": "dotnet10",
13:   "function-memory-size": 512,
14:   "function-timeout": 30,
15:   "function-handler": "Blz.CheckFileStatus::Blz.CheckFileStatus.Function::FunctionHandler"
16: }
````

## File: app/backend/src/Blz.CheckFileStatus/Blz.CheckFileStatus.csproj
````
 1: <Project Sdk="Microsoft.NET.Sdk">
 2:   <PropertyGroup>
 3:     <TargetFramework>net10.0</TargetFramework>
 4:     <ImplicitUsings>enable</ImplicitUsings>
 5:     <Nullable>enable</Nullable>
 6:     <GenerateRuntimeConfigurationFiles>true</GenerateRuntimeConfigurationFiles>
 7:     <AWSProjectType>Lambda</AWSProjectType>
 8:     <!-- This property makes the build directory similar to a publish directory and helps the AWS .NET Lambda Mock Test Tool find project dependencies. -->
 9:     <CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>
10:     <!-- Generate ready to run images during publishing to improve cold start time. -->
11:     <PublishReadyToRun>true</PublishReadyToRun>
12:   </PropertyGroup>
13:   <ItemGroup>
14:     <PackageReference Include="Amazon.Lambda.Core" Version="2.8.0" />
15:     <PackageReference Include="Amazon.Lambda.Serialization.SystemTextJson" Version="2.4.4" />
16:     <PackageReference Include="AWSSDK.DynamoDBv2" Version="4.0.17.1" />
17:   </ItemGroup>
18: </Project>
````

## File: app/backend/src/Blz.CheckFileStatus/Function.cs
````csharp
 1: using System;
 2: using System.Collections.Generic;
 3: using System.Text.Json;
 4: using System.Text.Json.Serialization;
 5: using System.Threading.Tasks;
 6: using Amazon.Lambda.Core;
 7: using Amazon.DynamoDBv2;
 8: using Amazon.DynamoDBv2.Model;
 9: 
10: [assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]
11: 
12: namespace Blz.CheckFileStatus;
13: 
14: public class Function
15: {
16:     private readonly IAmazonDynamoDB _dynamoDbClient;
17:     private readonly string _tableName = "blz-files-table";
18: 
19:     public Function()
20:     {
21:         _dynamoDbClient = new AmazonDynamoDBClient();
22:     }
23: 
24:    
25:     public async Task<StatusResponse> FunctionHandler(JsonElement requestEvent, ILambdaContext context)
26:     {
27:         try
28:         {
29:            
30:             if (!requestEvent.TryGetProperty("body", out var bodyElement) || string.IsNullOrEmpty(bodyElement.GetString()))
31:             {
32:                 throw new Exception("Body is missing from the Lambda URL event.");
33:             }
34: 
35:      
36:             string bodyString = bodyElement.GetString()!;
37:             var request = JsonSerializer.Deserialize<StatusRequest>(bodyString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
38: 
39:             if (request == null || string.IsNullOrEmpty(request.FileName))
40:             {
41:                 throw new Exception("FileName is missing from the parsed body.");
42:             }
43: 
44:             var userId = string.IsNullOrEmpty(request.UserId) ? "guest" : request.UserId;
45: 
46:             
47:             var requestDb = new GetItemRequest
48:             {
49:                 TableName = _tableName,
50:                 Key = new Dictionary<string, AttributeValue>
51:                 {
52:                     { "userId", new AttributeValue { S = userId } },
53:                     { "fileName", new AttributeValue { S = request.FileName } }
54:                 }
55:             };
56: 
57:             var response = await _dynamoDbClient.GetItemAsync(requestDb);
58: 
59:             if (response.Item == null || response.Item.Count == 0)
60:             {
61:                 return new StatusResponse { Status = "NotFound" };
62:             }
63: 
64:             return new StatusResponse { Status = response.Item["status"].S };
65:         }
66:         catch (Exception ex)
67:         {
68:             context.Logger.LogError($"Error: {ex.Message}");
69:             throw; 
70:         }
71:     }
72: }
73: 
74: public class StatusRequest
75: {
76:     public string? UserId { get; set; }
77:     public string? FileName { get; set; }
78: }
79: 
80: public class StatusResponse
81: {
82:     
83:     [JsonPropertyName("status")]
84:     public string? Status { get; set; }
85: }
````

## File: app/backend/src/Blz.CheckFileStatus/Readme.md
````markdown
 1: # AWS Lambda Empty Function Project
 2: 
 3: This starter project consists of:
 4: * Function.cs - class file containing a class with a single function handler method
 5: * aws-lambda-tools-defaults.json - default argument settings for use with Visual Studio and command line deployment tools for AWS
 6: 
 7: You may also have a test project depending on the options selected.
 8: 
 9: The generated function handler is a simple method accepting a string argument that returns the uppercase equivalent of the input string. Replace the body of this method, and parameters, to suit your needs. 
10: 
11: ## Here are some steps to follow from Visual Studio:
12: 
13: To deploy your function to AWS Lambda, right click the project in Solution Explorer and select *Publish to AWS Lambda*.
14: 
15: To view your deployed function open its Function View window by double-clicking the function name shown beneath the AWS Lambda node in the AWS Explorer tree.
16: 
17: To perform testing against your deployed function use the Test Invoke tab in the opened Function View window.
18: 
19: To configure event sources for your deployed function, for example to have your function invoked when an object is created in an Amazon S3 bucket, use the Event Sources tab in the opened Function View window.
20: 
21: To update the runtime configuration of your deployed function use the Configuration tab in the opened Function View window.
22: 
23: To view execution logs of invocations of your function use the Logs tab in the opened Function View window.
24: 
25: ## Here are some steps to follow to get started from the command line:
26: 
27: Once you have edited your template and code you can deploy your application using the [Amazon.Lambda.Tools Global Tool](https://github.com/aws/aws-extensions-for-dotnet-cli#aws-lambda-amazonlambdatools) from the command line.
28: 
29: Install Amazon.Lambda.Tools Global Tools if not already installed.
30: ```
31:     dotnet tool install -g Amazon.Lambda.Tools
32: ```
33: 
34: If already installed check if new version is available.
35: ```
36:     dotnet tool update -g Amazon.Lambda.Tools
37: ```
38: 
39: Execute unit tests
40: ```
41:     cd "Blz.CheckFileStatus/test/Blz.CheckFileStatus.Tests"
42:     dotnet test
43: ```
44: 
45: Deploy function to AWS Lambda
46: ```
47:     cd "Blz.CheckFileStatus/src/Blz.CheckFileStatus"
48:     dotnet lambda deploy-function
49: ```
````

## File: app/backend/src/Blz.GetPresignedUrl/aws-lambda-tools-defaults.json
````json
 1: {
 2:   "Information": [
 3:     "This file provides default values for the deployment wizard inside Visual Studio and the AWS Lambda commands added to the .NET Core CLI.",
 4:     "To learn more about the Lambda commands with the .NET Core CLI execute the following command at the command line in the project root directory.",
 5:     "dotnet lambda help",
 6:     "All the command line options for the Lambda command can be specified in this file."
 7:   ],
 8:   "profile": "",
 9:   "region": "",
10:   "configuration": "Release",
11:   "function-architecture": "x86_64",
12:   "function-runtime": "dotnet10",
13:   "function-memory-size": 512,
14:   "function-timeout": 30,
15:   "function-handler": "Blz.GetPresignedUrl::Blz.GetPresignedUrl.Function::FunctionHandler"
16: }
````

## File: app/backend/src/Blz.GetPresignedUrl/Readme.md
````markdown
 1: # AWS Lambda Empty Function Project
 2: 
 3: This starter project consists of:
 4: * Function.cs - class file containing a class with a single function handler method
 5: * aws-lambda-tools-defaults.json - default argument settings for use with Visual Studio and command line deployment tools for AWS
 6: 
 7: You may also have a test project depending on the options selected.
 8: 
 9: The generated function handler is a simple method accepting a string argument that returns the uppercase equivalent of the input string. Replace the body of this method, and parameters, to suit your needs. 
10: 
11: ## Here are some steps to follow from Visual Studio:
12: 
13: To deploy your function to AWS Lambda, right click the project in Solution Explorer and select *Publish to AWS Lambda*.
14: 
15: To view your deployed function open its Function View window by double-clicking the function name shown beneath the AWS Lambda node in the AWS Explorer tree.
16: 
17: To perform testing against your deployed function use the Test Invoke tab in the opened Function View window.
18: 
19: To configure event sources for your deployed function, for example to have your function invoked when an object is created in an Amazon S3 bucket, use the Event Sources tab in the opened Function View window.
20: 
21: To update the runtime configuration of your deployed function use the Configuration tab in the opened Function View window.
22: 
23: To view execution logs of invocations of your function use the Logs tab in the opened Function View window.
24: 
25: ## Here are some steps to follow to get started from the command line:
26: 
27: Once you have edited your template and code you can deploy your application using the [Amazon.Lambda.Tools Global Tool](https://github.com/aws/aws-extensions-for-dotnet-cli#aws-lambda-amazonlambdatools) from the command line.
28: 
29: Install Amazon.Lambda.Tools Global Tools if not already installed.
30: ```
31:     dotnet tool install -g Amazon.Lambda.Tools
32: ```
33: 
34: If already installed check if new version is available.
35: ```
36:     dotnet tool update -g Amazon.Lambda.Tools
37: ```
38: 
39: Execute unit tests
40: ```
41:     cd "Blz.GetPresignedUrl/test/Blz.GetPresignedUrl.Tests"
42:     dotnet test
43: ```
44: 
45: Deploy function to AWS Lambda
46: ```
47:     cd "Blz.GetPresignedUrl/src/Blz.GetPresignedUrl"
48:     dotnet lambda deploy-function
49: ```
````

## File: app/frontend/.gitignore
````
 1: # Logs
 2: logs
 3: *.log
 4: npm-debug.log*
 5: yarn-debug.log*
 6: yarn-error.log*
 7: pnpm-debug.log*
 8: lerna-debug.log*
 9: 
10: node_modules
11: dist
12: dist-ssr
13: *.local
14: 
15: # Editor directories and files
16: .vscode/*
17: !.vscode/extensions.json
18: .idea
19: .DS_Store
20: *.suo
21: *.ntvs*
22: *.njsproj
23: *.sln
24: *.sw?
````

## File: app/frontend/eslint.config.js
````javascript
 1: import js from '@eslint/js'
 2: import globals from 'globals'
 3: import reactHooks from 'eslint-plugin-react-hooks'
 4: import reactRefresh from 'eslint-plugin-react-refresh'
 5: import { defineConfig, globalIgnores } from 'eslint/config'
 6: 
 7: export default defineConfig([
 8:   globalIgnores(['dist']),
 9:   {
10:     files: ['**/*.{js,jsx}'],
11:     extends: [
12:       js.configs.recommended,
13:       reactHooks.configs.flat.recommended,
14:       reactRefresh.configs.vite,
15:     ],
16:     languageOptions: {
17:       ecmaVersion: 2020,
18:       globals: globals.browser,
19:       parserOptions: {
20:         ecmaVersion: 'latest',
21:         ecmaFeatures: { jsx: true },
22:         sourceType: 'module',
23:       },
24:     },
25:     rules: {
26:       'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
27:     },
28:   },
29: ])
````

## File: app/frontend/index.html
````html
 1: <!doctype html>
 2: <html lang="en">
 3:   <head>
 4:     <meta charset="UTF-8" />
 5:     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
 6:     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 7:     <title>frontend</title>
 8:   </head>
 9:   <body>
10:     <div id="root"></div>
11:     <script type="module" src="/src/main.jsx"></script>
12:   </body>
13: </html>
````

## File: app/frontend/public/vite.svg
````xml
1: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
````

## File: app/frontend/README.md
````markdown
 1: # React + Vite
 2: 
 3: This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
 4: 
 5: Currently, two official plugins are available:
 6: 
 7: - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
 8: - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
 9: 
10: ## React Compiler
11: 
12: The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
13: 
14: ## Expanding the ESLint configuration
15: 
16: If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
````

## File: app/frontend/src/api/fileApi.js
````javascript
 1: const CHECK_STATUS_URL =
 2:   "https://qigh5mj3inljeykao7ruvjopyu0eyfiv.lambda-url.us-east-1.on.aws/";
 3: 
 4: export const checkFileStatus = async (fileName, userId = "guest") => {
 5:   try {
 6:     const response = await fetch(CHECK_STATUS_URL, {
 7:       method: "POST",
 8:       headers: { "Content-Type": "application/json" },
 9:       body: JSON.stringify({ FileName: fileName, UserId: userId }),
10:     });
11: 
12:     if (!response.ok) throw new Error("Network response was not ok");
13: 
14:     const data = await response.json();
15:     return data.status;
16:   } catch (error) {
17:     console.error("Error fetching status:", error);
18:     return "Error";
19:   }
20: };
````

## File: app/frontend/src/App.css
````css
 1: #root {
 2:   max-width: 1280px;
 3:   margin: 0 auto;
 4:   padding: 2rem;
 5:   text-align: center;
 6: }
 7: 
 8: .logo {
 9:   height: 6em;
10:   padding: 1.5em;
11:   will-change: filter;
12:   transition: filter 300ms;
13: }
14: .logo:hover {
15:   filter: drop-shadow(0 0 2em #646cffaa);
16: }
17: .logo.react:hover {
18:   filter: drop-shadow(0 0 2em #61dafbaa);
19: }
20: 
21: @keyframes logo-spin {
22:   from {
23:     transform: rotate(0deg);
24:   }
25:   to {
26:     transform: rotate(360deg);
27:   }
28: }
29: 
30: @media (prefers-reduced-motion: no-preference) {
31:   a:nth-of-type(2) .logo {
32:     animation: logo-spin infinite 20s linear;
33:   }
34: }
35: 
36: .card {
37:   padding: 2em;
38: }
39: 
40: .read-the-docs {
41:   color: #888;
42: }
````

## File: app/frontend/src/assets/react.svg
````xml
1: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
````

## File: app/frontend/src/components/dev-tests/S3CorsTest.jsx
````javascript
 1: import React, { useState } from "react";
 2: 
 3: function S3CorsTest() {
 4:   const [status, setStatus] = useState("Waiting for test to start...");
 5: 
 6:   const handleFullUploadTest = async () => {
 7:     const API_URL =
 8:       " https://edjc4tzhwc.execute-api.us-east-1.amazonaws.com/default/blz-get-presigned-url";
 9: 
10:     try {
11:       // --- STEP 1: Request Presigned URL from Lambda via API Gateway ---
12:       setStatus("1. Requesting Presigned URL from API Gateway...");
13:       console.log("Calling API:", API_URL);
14: 
15:       const apiResponse = await fetch(`${API_URL}?fileName=final-test.txt`);
16:       const apiData = await apiResponse.json();
17: 
18:       if (!apiResponse.ok) {
19:         throw new Error("Lambda failed to generate the presigned URL!");
20:       }
21: 
22:       const uploadUrl = apiData.uploadUrl;
23:       setStatus("2. Presigned URL received! Uploading file to S3...");
24:       console.log("Received S3 Link:", uploadUrl);
25: 
26:       // --- STEP 2: Upload to S3 using the received link ---
27:       const uploadResponse = await fetch(uploadUrl, {
28:         method: "PUT",
29:         body: "Congratulations! This file successfully passed through the entire BLZTransfer system!",
30:       });
31: 
32:       if (uploadResponse.ok) {
33:         setStatus("✅ 3. SUCCESS! File is in the Quarantine bucket (200 OK)!");
34:         console.log("Upload successful: 200 OK");
35:       } else {
36:         setStatus(`❌ S3 Error: ${uploadResponse.status}`);
37:       }
38:     } catch (error) {
39:       console.error("Error during the process:", error);
40:       setStatus(`❌ An error occurred: Check the console (F12)`);
41:     }
42:   };
43: 
44:   return (
45:     <div
46:       style={{
47:         border: "2px solid #00ff00",
48:         padding: "20px",
49:         marginTop: "20px",
50:         borderRadius: "8px",
51:         backgroundColor: "#1a1a1a",
52:       }}
53:     >
54:       <h2 style={{ color: "#00ff00" }}>🚀 Full System Integration Test</h2>
55:       <button
56:         onClick={handleFullUploadTest}
57:         style={{
58:           padding: "10px 20px",
59:           fontSize: "16px",
60:           cursor: "pointer",
61:           backgroundColor: "#00ff00",
62:           color: "black",
63:           border: "none",
64:           borderRadius: "4px",
65:           fontWeight: "bold",
66:         }}
67:       >
68:         Upload Test File
69:       </button>
70:       <p style={{ marginTop: "15px", color: "#fff" }}>
71:         <strong>Status:</strong> {status}
72:       </p>
73:     </div>
74:   );
75: }
76: 
77: export default S3CorsTest;
````

## File: app/frontend/src/components/UI/Buttons/Button.jsx
````javascript
 1: import React from 'react'
 2: import classes from './Button.module.css';
 3: 
 4: const Button = (props) => {
 5:   return (
 6:     <button
 7:         type={props.type || 'button'}
 8:         className={`${classes.button} ${props.className || ''}`}
 9:         onClick={props.onClick}
10:         disabled={props.disabled}
11:     >
12:         {props.children}
13:     </button>
14:   );
15: };
16: 
17: export default Button
````

## File: app/frontend/src/components/UI/Buttons/Button.module.css
````css
 1: .button {
 2:   font: inherit;
 3:   border: 1px solid #1f2937;
 4:   background: #1f2937; 
 5:   color: white;
 6:   padding: 0.75rem 2rem;
 7:   cursor: pointer;
 8:   border-radius: 6px;
 9:   font-weight: bold;
10:   transition: all 0.2s ease-out;
11: }
12: 
13: .button:hover,
14: .button:active {
15:   background: #374151;
16:   border-color: #374151;
17:   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
18: }
19: 
20: .button:disabled {
21:   background: #9ca3af;
22:   border-color: #9ca3af;
23:   cursor: not-allowed;
24:   box-shadow: none;
25: }
````

## File: app/frontend/src/components/UI/Cards/Card.jsx
````javascript
 1: import React from 'react';
 2: import classes from './Card.module.css';
 3: 
 4: const Card = (props) => {
 5:   return (
 6:     <div className={`${classes.card} ${props.className || ''}`}>
 7:       {props.children}
 8:     </div>
 9:   );
10: };
11: 
12: export default Card;
````

## File: app/frontend/src/components/UI/Cards/Card.module.css
````css
1: .card {
2:   background: white;
3:   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
4:   border-radius: 12px;
5:   padding: 2rem;
6:   margin: 2rem auto;
7:   max-width: 500px;
8: }
````

## File: app/frontend/src/components/UI/Dropzone/Dropzone.jsx
````javascript
 1: import React, { useState } from 'react';
 2: import {MdCloudUpload} from 'react-icons/md';
 3: import classes from './Dropzone.module.css';
 4: 
 5: const Dropzone = (props) => {
 6:   const [isDragOver, setIsDragOver] = useState(false);
 7: 
 8:   const dragOverHandler = (event) => {
 9:     event.preventDefault(); // Megakadályozzuk, hogy a böngésző megnyissa a fájlt
10:     setIsDragOver(true);
11:   };
12: 
13:   const dragLeaveHandler = () => {
14:     setIsDragOver(false);
15:   };
16: 
17:   const dropHandler = (event) => {
18:     event.preventDefault();
19:     setIsDragOver(false);
20:     
21:     if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
22:       props.onFilesDropped(event.dataTransfer.files[0]); // Átadjuk a fájlt
23:     }
24:   };
25: 
26:   return (
27:     <div 
28:       className={`${classes.dropzone} ${isDragOver ? classes.active : ''}`}
29:       onDragOver={dragOverHandler}
30:       onDragLeave={dragLeaveHandler}
31:       onDrop={dropHandler}
32:       onClick={props.onClick} 
33:     >
34:       <MdCloudUpload />
35:       {props.children}
36:     </div>
37:   );
38: };
39: 
40: export default Dropzone;
````

## File: app/frontend/src/components/UI/Dropzone/Dropzone.module.css
````css
 1: .dropzone {
 2:   width: 100%;
 3:   min-height: 200px;
 4:   border: 2px dashed #d1d5db; 
 5:   border-radius: 12px;
 6:   display: flex;
 7:   flex-direction: column;
 8:   align-items: center;
 9:   justify-content: center;
10:   cursor: pointer;
11:   background-color: #f9fafb;
12:   transition: all 0.3s ease;
13:   padding: 1rem;
14: }
15: 
16: .dropzone.active {
17:   border-color: #3b82f6; 
18:   background-color: #eff6ff;
19:   transform: scale(1.02);
20: }
21: 
22: .dropzone p {
23:   color: #6b7280;
24:   margin: 0;
25:   pointer-events: none; 
26: }
27: 
28: .icon {
29:   font-size: 3.5rem; 
30:   color: #9ca3af;    
31:   margin-bottom: 1rem;
32:   transition: color 0.3s ease;
33:   pointer-events: none;
34: }
35: 
36: .dropzone.active .icon {
37:   color: #3b82f6;    
38: }
````

## File: app/frontend/src/components/UI/Feedback/ProgressBar/ProgressBar.jsx
````javascript
 1: export default function ProgressBar({ progress, text, currentStatus }) {
 2:   let barColor = "#3b82f6"; 
 3:   if (currentStatus === "Clean") barColor = "#10b981"; 
 4:   if (currentStatus === "Infected" || currentStatus === "Error")
 5:     barColor = "#ef4444"; 
 6: 
 7:   return (
 8:     <div style={{ marginTop: "20px", width: "100%" }}>
 9:       <div
10:         style={{
11:           background: "#e5e7eb",
12:           borderRadius: "8px",
13:           height: "16px",
14:           overflow: "hidden",
15:           width: "100%",
16:         }}
17:       >
18:         <div
19:           style={{
20:             width: `${progress}%`,
21:             background: barColor,
22:             height: "100%",
23:             transition: "width 0.5s ease-in-out, background-color 0.3s ease",
24:           }}
25:         />
26:       </div>
27:       {text && (
28:         <p
29:           style={{
30:             textAlign: "center",
31:             marginTop: "8px",
32:             fontSize: "14px",
33:             fontWeight: "500",
34:             color: "#374151",
35:           }}
36:         >
37:           {text} ({progress}%)
38:         </p>
39:       )}
40:     </div>
41:   );
42: }
````

## File: app/frontend/src/components/Upload/FilePicker/FilePicker.module.css
````css
 1: .picker {
 2:   text-align: center;
 3:   border: 2px dashed #d1d5db; /* Szaggatott vonal, mint a profi feltöltőknél */
 4:   background: #f9fafb;
 5: }
 6: 
 7: .preview {
 8:   margin-bottom: 1rem;
 9:   color: #4b5563;
10: }
11: 
12: .uploadBtn {
13:   margin-top: 1rem;
14:   background-color: #059669; /* Zöld szín a feltöltésnek */
15:   border-color: #059669;
16:   display: block;
17:   width: 100%;
18: }
19: 
20: .uploadBtn:hover {
21:   background-color: #047857;
22: }
````

## File: app/frontend/src/config/aws-config.js
````javascript
1: export const awsConfig = {
2:   Auth: {
3:     Cognito: {
4:       userPoolId: "us-east-1_8e4pBhDRa",
5:       userPoolClientId: "3lbmonpmjtabv2ss84j5ce99hu",
6:     },
7:   },
8: };
````

## File: app/frontend/src/index.css
````css
 1: :root {
 2:   font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
 3:   line-height: 1.5;
 4:   font-weight: 400;
 5: 
 6:   color-scheme: light dark;
 7:   color: rgba(255, 255, 255, 0.87);
 8:   background-color: #242424;
 9: 
10:   font-synthesis: none;
11:   text-rendering: optimizeLegibility;
12:   -webkit-font-smoothing: antialiased;
13:   -moz-osx-font-smoothing: grayscale;
14: }
15: 
16: a {
17:   font-weight: 500;
18:   color: #646cff;
19:   text-decoration: inherit;
20: }
21: a:hover {
22:   color: #535bf2;
23: }
24: 
25: body {
26:   margin: 0;
27:   display: flex;
28:   place-items: center;
29:   min-width: 320px;
30:   min-height: 100vh;
31: }
32: 
33: h1 {
34:   font-size: 3.2em;
35:   line-height: 1.1;
36: }
37: 
38: button {
39:   border-radius: 8px;
40:   border: 1px solid transparent;
41:   padding: 0.6em 1.2em;
42:   font-size: 1em;
43:   font-weight: 500;
44:   font-family: inherit;
45:   background-color: #1a1a1a;
46:   cursor: pointer;
47:   transition: border-color 0.25s;
48: }
49: button:hover {
50:   border-color: #646cff;
51: }
52: button:focus,
53: button:focus-visible {
54:   outline: 4px auto -webkit-focus-ring-color;
55: }
56: 
57: @media (prefers-color-scheme: light) {
58:   :root {
59:     color: #213547;
60:     background-color: #ffffff;
61:   }
62:   a:hover {
63:     color: #747bff;
64:   }
65:   button {
66:     background-color: #f9f9f9;
67:   }
68: }
````

## File: app/frontend/src/teszt.jsx
````javascript
1: import React from 'react'
2: 
3: function teszt() {
4:   return (
5:     <div>teszt</div>
6:   )
7: }
8: 
9: export default teszt
````

## File: app/frontend/vite.config.js
````javascript
1: import { defineConfig } from 'vite'
2: import react from '@vitejs/plugin-react'
3: 
4: // https://vite.dev/config/
5: export default defineConfig({
6:   plugins: [react()],
7: })
````

## File: app/services/clamav-scanner/Dockerfile
````
 1: FROM python:3.9-slim
 2: 
 3: RUN apt-get update && \
 4:     apt-get install -y clamav clamav-daemon wget && \
 5:     apt-get clean
 6: 
 7: RUN freshclam
 8: 
 9: RUN pip install boto3
10: 
11: WORKDIR /app
12: 
13: COPY scanner.py .
14: 
15: CMD ["python", "scanner.py"]
````

## File: app/services/clamav-scanner/scanner.py
````python
 1: import boto3
 2: import os
 3: import subprocess
 4: import sys
 5: 
 6: def scan_file():
 7:     bucket = os.environ.get('BUCKET_NAME')
 8:     key = os.environ.get('FILE_KEY')
 9:     
10:     if not bucket or not key:
11:         print("Missing BUCKET_NAME or FILE_KEY environment variables.")
12:         sys.exit(1)
13: 
14:     local_path = f"/tmp/{os.path.basename(key)}"
15:     s3 = boto3.client('s3')
16: 
17:     try:
18:         print(f"Downloading {key} from {bucket}...")
19:         s3.download_file(bucket, key, local_path)
20: 
21:         print("Starting ClamAV scan...")
22:         # A clamscan futtatása
23:         result = subprocess.run(['clamscan', local_path], capture_output=True, text=True)
24: 
25:         # Takarítás (még az exit előtt!)
26:         if os.path.exists(local_path):
27:             os.remove(local_path)
28:             print("Temporary file cleaned up.")
29: 
30:         # Eredmény kiértékelése kilépési kóddal
31:         if result.returncode == 0:
32:             print("Scan result: CLEAN")
33:             sys.exit(0)  # Sikeres futás -> Tiszta fájl
34:         elif result.returncode == 1:
35:             print("Scan result: INFECTED")
36:             print(f"Details: {result.stdout}")
37:             sys.exit(1)  # Hiba (TaskFailed) -> Fertőzött fájl
38:         else:
39:             print(f"Scan error: {result.stderr}")
40:             sys.exit(2)  # Egyéb hiba (pl. hiányzó adatbázis)
41: 
42:     except Exception as e:
43:         print(f"Critical error during scan: {str(e)}")
44:         sys.exit(1)
45: 
46: if __name__ == "__main__":
47:     scan_file()
````

## File: BLZTrsanfer.sln
````
 1: Microsoft Visual Studio Solution File, Format Version 12.00
 2: # Visual Studio Version 17
 3: VisualStudioVersion = 17.5.2.0
 4: MinimumVisualStudioVersion = 10.0.40219.1
 5: Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "app", "app", "{F95F473B-E98A-ACD6-1986-755F447BE36F}"
 6: EndProject
 7: Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "backend", "backend", "{F1C03477-FB42-63FE-39FD-AEF02E061287}"
 8: EndProject
 9: Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "src", "src", "{65D9C1F2-D865-B7E6-3236-3B006EAA463E}"
10: EndProject
11: Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Blz.GetPresignedUrl", "app\backend\src\Blz.GetPresignedUrl\Blz.GetPresignedUrl.csproj", "{3AEF0F96-1B3E-0A73-7706-A1A00F8B9FA3}"
12: EndProject
13: Global
14: 	GlobalSection(SolutionConfigurationPlatforms) = preSolution
15: 		Debug|Any CPU = Debug|Any CPU
16: 		Release|Any CPU = Release|Any CPU
17: 	EndGlobalSection
18: 	GlobalSection(ProjectConfigurationPlatforms) = postSolution
19: 		{3AEF0F96-1B3E-0A73-7706-A1A00F8B9FA3}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
20: 		{3AEF0F96-1B3E-0A73-7706-A1A00F8B9FA3}.Debug|Any CPU.Build.0 = Debug|Any CPU
21: 		{3AEF0F96-1B3E-0A73-7706-A1A00F8B9FA3}.Release|Any CPU.ActiveCfg = Release|Any CPU
22: 		{3AEF0F96-1B3E-0A73-7706-A1A00F8B9FA3}.Release|Any CPU.Build.0 = Release|Any CPU
23: 	EndGlobalSection
24: 	GlobalSection(SolutionProperties) = preSolution
25: 		HideSolutionNode = FALSE
26: 	EndGlobalSection
27: 	GlobalSection(NestedProjects) = preSolution
28: 		{F1C03477-FB42-63FE-39FD-AEF02E061287} = {F95F473B-E98A-ACD6-1986-755F447BE36F}
29: 		{65D9C1F2-D865-B7E6-3236-3B006EAA463E} = {F1C03477-FB42-63FE-39FD-AEF02E061287}
30: 		{3AEF0F96-1B3E-0A73-7706-A1A00F8B9FA3} = {65D9C1F2-D865-B7E6-3236-3B006EAA463E}
31: 	EndGlobalSection
32: 	GlobalSection(ExtensibilityGlobals) = postSolution
33: 		SolutionGuid = {EDEA32D4-950D-41E8-9A24-5A4500D75084}
34: 	EndGlobalSection
35: EndGlobal
````

## File: diagrams/architecture-aws-diagram.drawio
````
  1: <mxfile host="65bd71144e">
  2:     <diagram name="Oldal-1" id="tE6mlzJQ9H6_ee2F0kNt">
  3:         <mxGraphModel dx="676" dy="1602" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
  4:             <root>
  5:                 <mxCell id="0"/>
  6:                 <mxCell id="1" parent="0"/>
  7:                 <mxCell id="c0Oq6ompEd36doW8mOSI-50" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;entryPerimeter=0;strokeWidth=3;curved=1;" parent="1" source="c0Oq6ompEd36doW8mOSI-79" target="c0Oq6ompEd36doW8mOSI-42" edge="1">
  8:                     <mxGeometry relative="1" as="geometry">
  9:                         <Array as="points">
 10:                             <mxPoint x="250" y="1130"/>
 11:                             <mxPoint x="1759" y="1130"/>
 12:                         </Array>
 13:                         <mxPoint x="250" y="1320" as="sourcePoint"/>
 14:                     </mxGeometry>
 15:                 </mxCell>
 16:                 <mxCell id="c0Oq6ompEd36doW8mOSI-51" value="13. Direct File Download (GET)" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-50" connectable="0" vertex="1">
 17:                     <mxGeometry x="0.2713" y="-2" relative="1" as="geometry">
 18:                         <mxPoint x="-849" y="48" as="offset"/>
 19:                     </mxGeometry>
 20:                 </mxCell>
 21:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-8" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;curved=1;" parent="1" target="c0Oq6ompEd36doW8mOSI-58" edge="1">
 22:                     <mxGeometry relative="1" as="geometry">
 23:                         <Array as="points">
 24:                             <mxPoint x="220" y="170"/>
 25:                             <mxPoint x="630" y="170"/>
 26:                             <mxPoint x="630" y="79"/>
 27:                         </Array>
 28:                         <mxPoint x="220" y="650" as="sourcePoint"/>
 29:                         <mxPoint x="670.0000000000002" y="79" as="targetPoint"/>
 30:                     </mxGeometry>
 31:                 </mxCell>
 32:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-9" value="1. Loads React App" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="_c3sEWyGl7t7oog0Gv7p-8" connectable="0" vertex="1">
 33:                     <mxGeometry x="-0.2788" y="-2" relative="1" as="geometry">
 34:                         <mxPoint x="108" y="-78" as="offset"/>
 35:                     </mxGeometry>
 36:                 </mxCell>
 37:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-20" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.513;entryDx=0;entryDy=0;entryPerimeter=0;curved=1;" parent="1" source="_c3sEWyGl7t7oog0Gv7p-7" target="_c3sEWyGl7t7oog0Gv7p-16" edge="1">
 38:                     <mxGeometry relative="1" as="geometry">
 39:                         <Array as="points">
 40:                             <mxPoint x="220" y="350"/>
 41:                             <mxPoint x="500" y="350"/>
 42:                             <mxPoint x="500" y="280"/>
 43:                         </Array>
 44:                     </mxGeometry>
 45:                 </mxCell>
 46:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-21" value="2. Request Upload URL" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="_c3sEWyGl7t7oog0Gv7p-20" connectable="0" vertex="1">
 47:                     <mxGeometry x="0.5765" relative="1" as="geometry">
 48:                         <mxPoint x="-6" y="30" as="offset"/>
 49:                     </mxGeometry>
 50:                 </mxCell>
 51:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-43" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=default;dashed=1;curved=1;" parent="1" source="_c3sEWyGl7t7oog0Gv7p-23" target="_c3sEWyGl7t7oog0Gv7p-7" edge="1">
 52:                     <mxGeometry relative="1" as="geometry">
 53:                         <Array as="points">
 54:                             <mxPoint x="959" y="570"/>
 55:                             <mxPoint x="420" y="570"/>
 56:                             <mxPoint x="420" y="745"/>
 57:                         </Array>
 58:                     </mxGeometry>
 59:                 </mxCell>
 60:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-38" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;curved=1;strokeWidth=3;" parent="1" source="_c3sEWyGl7t7oog0Gv7p-7" target="_c3sEWyGl7t7oog0Gv7p-29" edge="1">
 61:                     <mxGeometry relative="1" as="geometry">
 62:                         <Array as="points">
 63:                             <mxPoint x="230" y="380"/>
 64:                             <mxPoint x="1110" y="380"/>
 65:                             <mxPoint x="1110" y="280"/>
 66:                             <mxPoint x="1170" y="280"/>
 67:                         </Array>
 68:                         <mxPoint x="226.00000000000045" y="630" as="sourcePoint"/>
 69:                         <mxPoint x="1240.9999999999995" y="259" as="targetPoint"/>
 70:                     </mxGeometry>
 71:                 </mxCell>
 72:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-40" value="4. Direct File Upload (PUT)" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="_c3sEWyGl7t7oog0Gv7p-38" connectable="0" vertex="1">
 73:                     <mxGeometry x="0.2427" y="6" relative="1" as="geometry">
 74:                         <mxPoint x="-305" y="26" as="offset"/>
 75:                     </mxGeometry>
 76:                 </mxCell>
 77:                 <mxCell id="c0Oq6ompEd36doW8mOSI-48" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;curved=1;" parent="1" source="c0Oq6ompEd36doW8mOSI-41" target="c0Oq6ompEd36doW8mOSI-79" edge="1">
 78:                     <mxGeometry relative="1" as="geometry">
 79:                         <Array as="points">
 80:                             <mxPoint x="1209" y="1620"/>
 81:                             <mxPoint x="205" y="1620"/>
 82:                         </Array>
 83:                         <mxPoint x="205" y="1610" as="targetPoint"/>
 84:                     </mxGeometry>
 85:                 </mxCell>
 86:                 <mxCell id="c0Oq6ompEd36doW8mOSI-49" value="12. Returns Presigned GET URL" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-48" connectable="0" vertex="1">
 87:                     <mxGeometry x="-0.2857" y="1" relative="1" as="geometry">
 88:                         <mxPoint x="207" y="-51" as="offset"/>
 89:                     </mxGeometry>
 90:                 </mxCell>
 91:                 <mxCell id="c0Oq6ompEd36doW8mOSI-43" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;curved=0;" parent="1" source="c0Oq6ompEd36doW8mOSI-79" edge="1">
 92:                     <mxGeometry relative="1" as="geometry">
 93:                         <Array as="points">
 94:                             <mxPoint x="684" y="1420"/>
 95:                         </Array>
 96:                         <mxPoint x="490" y="1429" as="sourcePoint"/>
 97:                         <mxPoint x="684" y="1429" as="targetPoint"/>
 98:                     </mxGeometry>
 99:                 </mxCell>
100:                 <mxCell id="c0Oq6ompEd36doW8mOSI-45" value="10. Request Download" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-43" connectable="0" vertex="1">
101:                     <mxGeometry x="0.7478" y="1" relative="1" as="geometry">
102:                         <mxPoint x="-165" y="-3" as="offset"/>
103:                     </mxGeometry>
104:                 </mxCell>
105:                 <mxCell id="c0Oq6ompEd36doW8mOSI-56" value="AWS Cloud / Learner Lab" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=19;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud;strokeColor=#232F3E;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#232F3E;dashed=0;strokeWidth=11;" parent="1" vertex="1">
106:                     <mxGeometry x="590" y="-10" width="2020" height="1850" as="geometry"/>
107:                 </mxCell>
108:                 <mxCell id="c0Oq6ompEd36doW8mOSI-58" value="S3 Web Hosting (React)" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#7AA116;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
109:                     <mxGeometry x="90" y="50" width="78" height="78" as="geometry"/>
110:                 </mxCell>
111:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-16" value="Upload API" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#E7157B;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
112:                     <mxGeometry x="90" y="250" width="78" height="78" as="geometry"/>
113:                 </mxCell>
114:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-23" value="Lambda – Upload Presigner" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#ED7100;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;horizontal=1;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
115:                     <mxGeometry x="330" y="250" width="78" height="78" as="geometry"/>
116:                 </mxCell>
117:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-30" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;" parent="c0Oq6ompEd36doW8mOSI-56" source="_c3sEWyGl7t7oog0Gv7p-16" target="_c3sEWyGl7t7oog0Gv7p-23" edge="1">
118:                     <mxGeometry relative="1" as="geometry"/>
119:                 </mxCell>
120:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-31" value="&lt;div&gt;&lt;br&gt;&lt;/div&gt;" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="_c3sEWyGl7t7oog0Gv7p-30" connectable="0" vertex="1">
121:                     <mxGeometry x="0.177" relative="1" as="geometry">
122:                         <mxPoint x="-37" y="-19" as="offset"/>
123:                     </mxGeometry>
124:                 </mxCell>
125:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-33" value="Invoke" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="_c3sEWyGl7t7oog0Gv7p-30" connectable="0" vertex="1">
126:                     <mxGeometry x="-0.0911" y="-2" relative="1" as="geometry">
127:                         <mxPoint x="-6" y="-11" as="offset"/>
128:                     </mxGeometry>
129:                 </mxCell>
130:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-29" value="Quarantine Bucket" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#7AA116;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
131:                     <mxGeometry x="580" y="250" width="78" height="78" as="geometry"/>
132:                 </mxCell>
133:                 <mxCell id="c0Oq6ompEd36doW8mOSI-1" value="Step Function" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#E7157B;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.step_functions;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
134:                     <mxGeometry x="580" y="820" width="78" height="78" as="geometry"/>
135:                 </mxCell>
136:                 <mxCell id="c0Oq6ompEd36doW8mOSI-22" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="_c3sEWyGl7t7oog0Gv7p-29" target="c0Oq6ompEd36doW8mOSI-1" edge="1">
137:                     <mxGeometry relative="1" as="geometry"/>
138:                 </mxCell>
139:                 <mxCell id="c0Oq6ompEd36doW8mOSI-23" value="5. S3 ObjectCreated Event" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-22" connectable="0" vertex="1">
140:                     <mxGeometry x="-0.06" y="3" relative="1" as="geometry">
141:                         <mxPoint x="7" y="5" as="offset"/>
142:                     </mxGeometry>
143:                 </mxCell>
144:                 <mxCell id="c0Oq6ompEd36doW8mOSI-4" value="Lamda - ClamAV Scanner" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#ED7100;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
145:                     <mxGeometry x="890" y="660" width="78" height="78" as="geometry"/>
146:                 </mxCell>
147:                 <mxCell id="c0Oq6ompEd36doW8mOSI-24" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;curved=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-1" target="c0Oq6ompEd36doW8mOSI-4" edge="1">
148:                     <mxGeometry relative="1" as="geometry">
149:                         <Array as="points">
150:                             <mxPoint x="720" y="859"/>
151:                             <mxPoint x="720" y="699"/>
152:                         </Array>
153:                     </mxGeometry>
154:                 </mxCell>
155:                 <mxCell id="c0Oq6ompEd36doW8mOSI-27" value="6a. Scan File" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-24" connectable="0" vertex="1">
156:                     <mxGeometry x="-0.0017" y="1" relative="1" as="geometry">
157:                         <mxPoint x="31" y="12" as="offset"/>
158:                     </mxGeometry>
159:                 </mxCell>
160:                 <mxCell id="c0Oq6ompEd36doW8mOSI-7" value="Lambda -&amp;nbsp;AI Metadata" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#ED7100;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
161:                     <mxGeometry x="890" y="820" width="78" height="78" as="geometry"/>
162:                 </mxCell>
163:                 <mxCell id="c0Oq6ompEd36doW8mOSI-25" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;curved=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-1" target="c0Oq6ompEd36doW8mOSI-7" edge="1">
164:                     <mxGeometry relative="1" as="geometry"/>
165:                 </mxCell>
166:                 <mxCell id="c0Oq6ompEd36doW8mOSI-28" value="6b. Extract Data" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-25" connectable="0" vertex="1">
167:                     <mxGeometry x="0.3492" y="1" relative="1" as="geometry">
168:                         <mxPoint x="-65" y="1" as="offset"/>
169:                     </mxGeometry>
170:                 </mxCell>
171:                 <mxCell id="c0Oq6ompEd36doW8mOSI-8" value="Lamda -&amp;nbsp;Finalize" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#ED7100;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
172:                     <mxGeometry x="890" y="980" width="78" height="78" as="geometry"/>
173:                 </mxCell>
174:                 <mxCell id="c0Oq6ompEd36doW8mOSI-26" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;curved=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-1" target="c0Oq6ompEd36doW8mOSI-8" edge="1">
175:                     <mxGeometry relative="1" as="geometry">
176:                         <Array as="points">
177:                             <mxPoint x="720" y="859"/>
178:                             <mxPoint x="720" y="1019"/>
179:                         </Array>
180:                     </mxGeometry>
181:                 </mxCell>
182:                 <mxCell id="c0Oq6ompEd36doW8mOSI-29" value="6c. Complete Workflow" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-26" connectable="0" vertex="1">
183:                     <mxGeometry x="0.2212" y="-9" relative="1" as="geometry">
184:                         <mxPoint x="-38" y="-68" as="offset"/>
185:                     </mxGeometry>
186:                 </mxCell>
187:                 <mxCell id="c0Oq6ompEd36doW8mOSI-10" value="Rekognition" style="outlineConnect=0;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.aws3.rekognition;fillColor=#2E73B8;gradientColor=none;fontStyle=0;fontColor=default;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
188:                     <mxGeometry x="1130" y="812.5" width="76.5" height="93" as="geometry"/>
189:                 </mxCell>
190:                 <mxCell id="c0Oq6ompEd36doW8mOSI-30" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;curved=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-7" target="c0Oq6ompEd36doW8mOSI-10" edge="1">
191:                     <mxGeometry relative="1" as="geometry"/>
192:                 </mxCell>
193:                 <mxCell id="c0Oq6ompEd36doW8mOSI-11" value="Textract" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#01A88D;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.textract;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
194:                     <mxGeometry x="1370" y="820" width="78" height="78" as="geometry"/>
195:                 </mxCell>
196:                 <mxCell id="c0Oq6ompEd36doW8mOSI-31" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;exitPerimeter=0;curved=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-7" target="c0Oq6ompEd36doW8mOSI-11" edge="1">
197:                     <mxGeometry relative="1" as="geometry">
198:                         <Array as="points">
199:                             <mxPoint x="1070" y="859"/>
200:                             <mxPoint x="1070" y="940"/>
201:                             <mxPoint x="1300" y="940"/>
202:                             <mxPoint x="1300" y="859"/>
203:                         </Array>
204:                         <mxPoint x="1170" y="1080" as="sourcePoint"/>
205:                     </mxGeometry>
206:                 </mxCell>
207:                 <mxCell id="c0Oq6ompEd36doW8mOSI-32" value="7. API Calls" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-31" connectable="0" vertex="1">
208:                     <mxGeometry x="-0.6797" y="-4" relative="1" as="geometry">
209:                         <mxPoint x="-46" y="-4" as="offset"/>
210:                     </mxGeometry>
211:                 </mxCell>
212:                 <mxCell id="c0Oq6ompEd36doW8mOSI-12" value="Metadata &amp;amp; TTL Table" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#C925D1;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.dynamodb;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
213:                     <mxGeometry x="1128.5" y="980" width="78" height="78" as="geometry"/>
214:                 </mxCell>
215:                 <mxCell id="c0Oq6ompEd36doW8mOSI-35" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-8" target="c0Oq6ompEd36doW8mOSI-12" edge="1">
216:                     <mxGeometry relative="1" as="geometry"/>
217:                 </mxCell>
218:                 <mxCell id="c0Oq6ompEd36doW8mOSI-36" value="8. Save Metadata &amp;amp; TTL" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-35" connectable="0" vertex="1">
219:                     <mxGeometry x="0.0797" y="-1" relative="1" as="geometry">
220:                         <mxPoint x="-15" y="-1" as="offset"/>
221:                     </mxGeometry>
222:                 </mxCell>
223:                 <mxCell id="c0Oq6ompEd36doW8mOSI-13" value="Clean Bucket" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#7AA116;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
224:                     <mxGeometry x="1370" y="980" width="78" height="78" as="geometry"/>
225:                 </mxCell>
226:                 <mxCell id="c0Oq6ompEd36doW8mOSI-37" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;curved=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-8" target="c0Oq6ompEd36doW8mOSI-13" edge="1">
227:                     <mxGeometry relative="1" as="geometry">
228:                         <Array as="points">
229:                             <mxPoint x="929" y="1160"/>
230:                             <mxPoint x="1300" y="1160"/>
231:                             <mxPoint x="1300" y="1019"/>
232:                         </Array>
233:                     </mxGeometry>
234:                 </mxCell>
235:                 <mxCell id="c0Oq6ompEd36doW8mOSI-38" value="9. Move Clean File" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-37" connectable="0" vertex="1">
236:                     <mxGeometry x="-0.019" y="-4" relative="1" as="geometry">
237:                         <mxPoint x="-152" y="-24" as="offset"/>
238:                     </mxGeometry>
239:                 </mxCell>
240:                 <mxCell id="c0Oq6ompEd36doW8mOSI-41" value="Lambda - Gatekeeper / Download" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#ED7100;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
241:                     <mxGeometry x="580" y="1390" width="78" height="78" as="geometry"/>
242:                 </mxCell>
243:                 <mxCell id="c0Oq6ompEd36doW8mOSI-46" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;startArrow=classic;startFill=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;entryPerimeter=0;curved=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-12" target="c0Oq6ompEd36doW8mOSI-41" edge="1">
244:                     <mxGeometry relative="1" as="geometry">
245:                         <Array as="points">
246:                             <mxPoint x="1168" y="1210"/>
247:                             <mxPoint x="620" y="1210"/>
248:                             <mxPoint x="620" y="1390"/>
249:                         </Array>
250:                         <mxPoint x="640" y="1370" as="targetPoint"/>
251:                     </mxGeometry>
252:                 </mxCell>
253:                 <mxCell id="c0Oq6ompEd36doW8mOSI-47" value="11. Check Auth &amp;amp; Decrement TTL" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-46" connectable="0" vertex="1">
254:                     <mxGeometry x="-0.0699" y="6" relative="1" as="geometry">
255:                         <mxPoint x="-129" y="4" as="offset"/>
256:                     </mxGeometry>
257:                 </mxCell>
258:                 <mxCell id="c0Oq6ompEd36doW8mOSI-42" value="Email Notifications" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#E7157B;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.sns;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
259:                     <mxGeometry x="1130" y="1390" width="78" height="78" as="geometry"/>
260:                 </mxCell>
261:                 <mxCell id="c0Oq6ompEd36doW8mOSI-52" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;dashed=1;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-41" target="c0Oq6ompEd36doW8mOSI-42" edge="1">
262:                     <mxGeometry relative="1" as="geometry"/>
263:                 </mxCell>
264:                 <mxCell id="c0Oq6ompEd36doW8mOSI-53" value="14. Trigger Download Alert" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-52" connectable="0" vertex="1">
265:                     <mxGeometry x="0.2497" y="-6" relative="1" as="geometry">
266:                         <mxPoint x="-104" y="-6" as="offset"/>
267:                     </mxGeometry>
268:                 </mxCell>
269:                 <mxCell id="c0Oq6ompEd36doW8mOSI-65" value="Download API" style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#E7157B;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway;" parent="c0Oq6ompEd36doW8mOSI-56" vertex="1">
270:                     <mxGeometry x="90" y="1390" width="78" height="78" as="geometry"/>
271:                 </mxCell>
272:                 <mxCell id="c0Oq6ompEd36doW8mOSI-69" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;" parent="c0Oq6ompEd36doW8mOSI-56" source="c0Oq6ompEd36doW8mOSI-65" target="c0Oq6ompEd36doW8mOSI-41" edge="1">
273:                     <mxGeometry relative="1" as="geometry"/>
274:                 </mxCell>
275:                 <mxCell id="c0Oq6ompEd36doW8mOSI-70" value="Invoke" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-69" connectable="0" vertex="1">
276:                     <mxGeometry x="0.2826" y="-2" relative="1" as="geometry">
277:                         <mxPoint x="-92" y="-2" as="offset"/>
278:                     </mxGeometry>
279:                 </mxCell>
280:                 <mxCell id="c0Oq6ompEd36doW8mOSI-63" value="AWS Step Functions workflow" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_step_functions_workflow;strokeColor=#CD2264;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#CD2264;dashed=0;" parent="1" vertex="1">
281:                     <mxGeometry x="1390" y="630" width="250" height="460" as="geometry"/>
282:                 </mxCell>
283:                 <mxCell id="c0Oq6ompEd36doW8mOSI-84" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;" parent="1" source="_c3sEWyGl7t7oog0Gv7p-7" target="c0Oq6ompEd36doW8mOSI-79" edge="1">
284:                     <mxGeometry relative="1" as="geometry"/>
285:                 </mxCell>
286:                 <mxCell id="c0Oq6ompEd36doW8mOSI-86" value="Share Link / QR Code (External)" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="c0Oq6ompEd36doW8mOSI-84" connectable="0" vertex="1">
287:                     <mxGeometry x="-0.0587" y="-2" relative="1" as="geometry">
288:                         <mxPoint x="2" y="10" as="offset"/>
289:                     </mxGeometry>
290:                 </mxCell>
291:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-7" value="&lt;b&gt;&lt;font style=&quot;font-size: 24px;&quot;&gt;Client1 - Uploader&lt;/font&gt;&lt;/b&gt;" style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;strokeColor=#232F3E;fillColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.client;" parent="1" vertex="1">
292:                     <mxGeometry x="110" y="650" width="190" height="190" as="geometry"/>
293:                 </mxCell>
294:                 <mxCell id="_c3sEWyGl7t7oog0Gv7p-46" value="3. Returns Presigned URL" style="text;whiteSpace=wrap;html=1;" parent="1" vertex="1">
295:                     <mxGeometry x="414" y="585" width="170" height="40" as="geometry"/>
296:                 </mxCell>
297:                 <mxCell id="c0Oq6ompEd36doW8mOSI-79" value="&lt;b&gt;&lt;font style=&quot;font-size: 24px;&quot;&gt;Client2 - Downloader&lt;/font&gt;&lt;/b&gt;" style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;strokeColor=#232F3E;fillColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.client;" parent="1" vertex="1">
298:                     <mxGeometry x="110" y="1330" width="190" height="190" as="geometry"/>
299:                 </mxCell>
300:             </root>
301:         </mxGraphModel>
302:     </diagram>
303: </mxfile>
````

## File: diagrams/use-case-diagram.drawio
````
  1: <mxfile host="65bd71144e">
  2:     <diagram id="W-u11FUtg7Dke5pPiidQ" name="Page-1">
  3:         <mxGraphModel dx="1155" dy="649" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
  4:             <root>
  5:                 <mxCell id="0"/>
  6:                 <mxCell id="1" parent="0"/>
  7:                 <mxCell id="4" value="BLZtransfer" style="html=1;align=center;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=20;dashed=1;whiteSpace=wrap;" vertex="1" parent="1">
  8:                     <mxGeometry x="260" y="230" width="600" height="760" as="geometry"/>
  9:                 </mxCell>
 10:                 <mxCell id="5" value="Guest Uploader" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;strokeWidth=3;" vertex="1" parent="1">
 11:                     <mxGeometry x="130" y="320" width="30" height="60" as="geometry"/>
 12:                 </mxCell>
 13:                 <mxCell id="6" value="&lt;b data-index-in-node=&quot;0&quot; data-path-to-node=&quot;8,1,0&quot;&gt;Registered Uploader&lt;/b&gt;" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;strokeWidth=3;" vertex="1" parent="1">
 14:                     <mxGeometry x="130" y="550" width="30" height="60" as="geometry"/>
 15:                 </mxCell>
 16:                 <mxCell id="7" value="&lt;b data-index-in-node=&quot;0&quot; data-path-to-node=&quot;8,2,0&quot;&gt;Downloader&lt;/b&gt;" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;strokeWidth=3;" vertex="1" parent="1">
 17:                     <mxGeometry x="130" y="750" width="30" height="60" as="geometry"/>
 18:                 </mxCell>
 19:                 <mxCell id="12" value="" style="edgeStyle=none;html=1;endSize=12;endArrow=block;endFill=0;exitX=0.5;exitY=0;exitDx=0;exitDy=0;exitPerimeter=0;strokeWidth=3;" edge="1" parent="1" source="6">
 20:                     <mxGeometry width="160" relative="1" as="geometry">
 21:                         <mxPoint x="310" y="560" as="sourcePoint"/>
 22:                         <mxPoint x="145" y="400" as="targetPoint"/>
 23:                     </mxGeometry>
 24:                 </mxCell>
 25:                 <mxCell id="16" value="&lt;b data-index-in-node=&quot;181&quot; data-path-to-node=&quot;8&quot;&gt;Notification System&lt;/b&gt;" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;strokeWidth=3;" vertex="1" parent="1">
 26:                     <mxGeometry x="930" y="880" width="30" height="60" as="geometry"/>
 27:                 </mxCell>
 28:                 <mxCell id="17" value="Upload File" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 29:                     <mxGeometry x="340" y="320" width="140" height="70" as="geometry"/>
 30:                 </mxCell>
 31:                 <mxCell id="18" value="" style="endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;" edge="1" parent="1" target="17">
 32:                     <mxGeometry width="160" relative="1" as="geometry">
 33:                         <mxPoint x="160" y="354.44" as="sourcePoint"/>
 34:                         <mxPoint x="320" y="354.44" as="targetPoint"/>
 35:                     </mxGeometry>
 36:                 </mxCell>
 37:                 <mxCell id="19" value="Check Size Limit" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 38:                     <mxGeometry x="660" y="320" width="140" height="70" as="geometry"/>
 39:                 </mxCell>
 40:                 <mxCell id="25" value="&amp;lt;&amp;lt;include&amp;gt;&amp;gt;" style="html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;strokeWidth=3;" edge="1" parent="1" target="19">
 41:                     <mxGeometry width="160" relative="1" as="geometry">
 42:                         <mxPoint x="480" y="354.40999999999997" as="sourcePoint"/>
 43:                         <mxPoint x="640" y="354.40999999999997" as="targetPoint"/>
 44:                     </mxGeometry>
 45:                 </mxCell>
 46:                 <mxCell id="26" value="Process File" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 47:                     <mxGeometry x="610" y="440" width="140" height="70" as="geometry"/>
 48:                 </mxCell>
 49:                 <mxCell id="27" value="&amp;lt;&amp;lt;include&amp;gt;&amp;gt;" style="html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;entryX=0.034;entryY=0.38;entryDx=0;entryDy=0;exitX=0.577;exitY=1.032;exitDx=0;exitDy=0;exitPerimeter=0;entryPerimeter=0;strokeWidth=3;" edge="1" parent="1" source="17" target="26">
 50:                     <mxGeometry x="-0.0615" y="8" width="160" relative="1" as="geometry">
 51:                         <mxPoint x="410" y="474.40999999999997" as="sourcePoint"/>
 52:                         <mxPoint x="590" y="475" as="targetPoint"/>
 53:                         <mxPoint as="offset"/>
 54:                     </mxGeometry>
 55:                 </mxCell>
 56:                 <mxCell id="28" value="Get Shareable Link &amp;amp; QR" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 57:                     <mxGeometry x="390" y="470" width="140" height="70" as="geometry"/>
 58:                 </mxCell>
 59:                 <mxCell id="29" value="" style="endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" target="28">
 60:                     <mxGeometry width="160" relative="1" as="geometry">
 61:                         <mxPoint x="170" y="380" as="sourcePoint"/>
 62:                         <mxPoint x="330" y="380" as="targetPoint"/>
 63:                     </mxGeometry>
 64:                 </mxCell>
 65:                 <mxCell id="30" value="Download File" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 66:                     <mxGeometry x="330" y="750" width="140" height="70" as="geometry"/>
 67:                 </mxCell>
 68:                 <mxCell id="31" value="" style="endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;" edge="1" parent="1">
 69:                     <mxGeometry width="160" relative="1" as="geometry">
 70:                         <mxPoint x="160" y="790" as="sourcePoint"/>
 71:                         <mxPoint x="330" y="790" as="targetPoint"/>
 72:                     </mxGeometry>
 73:                 </mxCell>
 74:                 <mxCell id="32" value="Verify Quota &amp;amp; Token" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 75:                     <mxGeometry x="620" y="750" width="140" height="70" as="geometry"/>
 76:                 </mxCell>
 77:                 <mxCell id="33" value="&amp;lt;&amp;lt;include&amp;gt;&amp;gt;" style="html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;strokeWidth=3;exitX=1;exitY=0.5;exitDx=0;exitDy=0;" edge="1" parent="1" source="30">
 78:                     <mxGeometry width="160" relative="1" as="geometry">
 79:                         <mxPoint x="460" y="784.41" as="sourcePoint"/>
 80:                         <mxPoint x="620" y="784.41" as="targetPoint"/>
 81:                     </mxGeometry>
 82:                 </mxCell>
 83:                 <mxCell id="34" value="Send Notification" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 84:                     <mxGeometry x="630" y="880" width="140" height="70" as="geometry"/>
 85:                 </mxCell>
 86:                 <mxCell id="37" value="" style="endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;" edge="1" parent="1">
 87:                     <mxGeometry width="160" relative="1" as="geometry">
 88:                         <mxPoint x="770" y="914.63" as="sourcePoint"/>
 89:                         <mxPoint x="930" y="914.63" as="targetPoint"/>
 90:                     </mxGeometry>
 91:                 </mxCell>
 92:                 <mxCell id="38" value="Manage Own Files" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 93:                     <mxGeometry x="330" y="620" width="140" height="70" as="geometry"/>
 94:                 </mxCell>
 95:                 <mxCell id="39" value="Log In" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
 96:                     <mxGeometry x="610" y="620" width="140" height="70" as="geometry"/>
 97:                 </mxCell>
 98:                 <mxCell id="40" value="&amp;lt;&amp;lt;include&amp;gt;&amp;gt;" style="html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;strokeWidth=3;exitX=1;exitY=0.5;exitDx=0;exitDy=0;" edge="1" parent="1" source="38" target="39">
 99:                     <mxGeometry x="-0.0615" y="8" width="160" relative="1" as="geometry">
100:                         <mxPoint x="490" y="660" as="sourcePoint"/>
101:                         <mxPoint x="654" y="735" as="targetPoint"/>
102:                         <mxPoint as="offset"/>
103:                     </mxGeometry>
104:                 </mxCell>
105:                 <mxCell id="41" value="" style="endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" target="38">
106:                     <mxGeometry width="160" relative="1" as="geometry">
107:                         <mxPoint x="150" y="570" as="sourcePoint"/>
108:                         <mxPoint x="370" y="695" as="targetPoint"/>
109:                     </mxGeometry>
110:                 </mxCell>
111:                 <mxCell id="42" value="&amp;lt;&amp;lt;extend&amp;gt;&amp;gt;" style="html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;entryX=1;entryY=1;entryDx=0;entryDy=0;exitX=0;exitY=0.5;exitDx=0;exitDy=0;strokeWidth=3;" edge="1" parent="1" source="34" target="30">
112:                     <mxGeometry x="-0.2458" y="-11" width="160" relative="1" as="geometry">
113:                         <mxPoint x="540" y="890" as="sourcePoint"/>
114:                         <mxPoint x="700" y="890" as="targetPoint"/>
115:                         <mxPoint as="offset"/>
116:                     </mxGeometry>
117:                 </mxCell>
118:             </root>
119:         </mxGraphModel>
120:     </diagram>
121: </mxfile>
````

## File: docs/project-documentation.md
````markdown
 1: # Projekt Dokumentáció: Intelligens Serverless Fájlmegosztó Platform
 2: **Hallgató:** Sándor Balázs (W1SRF8)
 3: **Konzulens:** Pelle István
 4: 
 5: ## 1. Rendszertervezés és Architektúra (3. hét)
 6: 
 7: Ebben a fázisban a rendszer alapvető logikai felépítését és a felhő-natív tervezési mintákat határoztam meg. A cél egy skálázható, költséghatékony és eseményvezérelt backend kialakítása.
 8: 
 9: ### 1.1. Alkalmazott tervezési minták (Design Patterns)
10: 
11: A fejlesztés során az alábbi mintákat alkalmazom, hogy a rendszer megfeleljen a modern felhő-alapú elvárásoknak:
12: 
13: * **Facade (Homlokzat) minta:** Az **Amazon API Gateway** segítségével egy egységes belépési pontot hozok létre. Ez elrejti a kliens elől a háttérben futó számos mikroszolgáltatást (Lambda függvényeket), így a frontendnek csak egyetlen végpontot kell ismernie.
14: * **Event-driven (Eseményvezérelt) minta:** A rendszer nem folyamatosan fut, hanem eseményekre reagál. Amint egy fájl bekerül az S3 vödörbe (**S3 ObjectCreated**), az automatikusan elindítja a feldolgozási láncot. Ezzel minimalizálható az üresjárati költség.
15: * **Pipes and Filters (Csövek és szűrők) minta:** Az **AWS Step Functions** állapotgép valósítja meg. A fájl feldolgozása diszkrét lépéseken (szűrőkön) halad keresztül:
16:     1.  `VirusScanFilter`: ClamAV ellenőrzés.
17:     2.  `AIAnalysisFilter`: Amazon Rekognition/Textract elemzés.
18:     3.  `FinalizeMetadataFilter`: Adatbázisba mentés és fájl áthelyezése.
19: * **Valet Key minta:** A nagy méretű fájlok feltöltéséhez **S3 Presigned URL**-t használok. A backend generál egy ideiglenes, biztonságos "kulcsot" (URL-t), amivel a kliens közvetlenül az S3-ba tölthet. Így a Lambda függvényeknek nem kell a fájlátvitel sávszélességével foglalkozniuk, ami gyorsabb és olcsóbb működést eredményez.
20: 
21: ### 1.2. Alapinfrastruktúra és Adattárolás (Storage Layer)
22: 
23: A 3. héten manuálisan létrehoztam az AWS konzolon a rendszer gerincét alkotó tárolóegységeket.
24: 
25: #### Amazon S3 Bucket-ek (Vödrök)
26: Az S3 vödrök az objektum alapú tárolást biztosítják. Az alábbi három vödröt különítettem el a biztonság és a logikai szétválasztás érdekében:
27: * `blz-frontend-w1srf8`: Itt foglal helyet a React webalkalmazás (Static Website Hosting).
28: * `blz-quarantine-w1srf8`: Ide kerülnek a frissen feltöltött fájlok. Ebben a fázisban a fájlok még nem publikusak és "veszélyesnek" minősülnek, amíg a vírusirtó le nem fut.
29: * `blz-clean-w1srf8`: A sikeresen ellenőrzött, tiszta fájlok végleges tárolója.
30: 
31: #### Amazon DynamoDB Tábla
32: A fájlokhoz tartozó strukturált adatokat (metaadatokat) NoSQL táblában tárolom.
33: * **Tábla neve:** `FileMetadata`
34: * **Partition Key:** `fileId` (String) - Egyedi azonosító minden fájlhoz.
35: * **Döntés indoklása:** Az **On-demand** kapacitást választottam, mert a projekt elején a forgalom kiszámíthatatlan, és ez a modell biztosítja, hogy csak a tényleges lekérdezések után fizessünk.
36: 
37: #### 1.2.1. S3 Tárolóegységek implementációja
38: Létrehoztam a rendszer működéséhez szükséges három alapvető tárolót (bucket) az `us-east-1` régióban:
39: * **`blz-quarantine-bucket-w1srf8`**: Ide érkeznek a kliensoldalról feltöltött nyers adatok.
40: * **`blz-clean-bucket-w1srf8`**: A sikeres vírusirtás és AI elemzés után ide kerülnek a végleges fájlok.
41: * **`blz-frontend-bucket-w1srf8`**: A React alkalmazás statikus hosztolására kijelölt tárhely.
42: 
43: **Alkalmazott biztonsági beállítások:**
44: * **Block Public Access:** Minden vödörnél bekapcsolva marad, az adatokhoz csak belső IAM szerepkörök (Lambda) férhetnek hozzá.
45: * **SSE-S3 Titkosítás:** Aktiválva az adatok nyugalmi állapotban történő védelme érdekében.
46: * **S3 Bucket Key:** Engedélyezve a KMS hívások számának és a költségeknek a csökkentése érdekében.
47: * **Object Lock:** Kikapcsolva maradt, hogy a feldolgozási folyamat (mozgatás/törlés) akadálymentes legyen.
48: 
49: #### 1.2.3. Adatbázis réteg: Amazon DynamoDB
50: A fájlokhoz tartozó metaadatok és az AI elemzési eredmények tárolására egy Amazon DynamoDB NoSQL táblát konfiguráltam.
51: 
52: * **Tábla neve:** `FileMetadata`
53: * **Elsődleges kulcs (Partition Key):** `fileId` (String). Ez az egyedi azonosító kapcsolja össze az S3-ban tárolt fájlt az adatbázisban lévő rekorddal.
54: * **Kapacitáskezelés (Capacity Mode):** On-demand.
55:     * **Döntés indoklása:** A kiszámíthatatlan terhelés és a laboratóriumi környezet költségkorlátai miatt ez a legoptimálisabb választás, mivel nincs fix óradíja, kizárólag a tényleges műveletek után generál költséget.
56: * **Tábla osztály:** DynamoDB Standard.
57: * **Titkosítás:** AWS owned key (SSE-DDB), amely alapértelmezett védelmet nyújt az adatoknak.
58: 
59: ---
````

## File: docs/requirements.md
````markdown
 1: # Rendszerkövetelmények: Intelligens Serverless Fájlmegosztó Platform
 2: 
 3: ## 1. Felhasználói Szerepkörök (User Roles)
 4: A rendszer a jogosultságokat és kvótákat alkalmazásszinten (API kulcs vagy token alapján) különbözteti meg, mivel külső identitásszolgáltató (Cognito) nem áll rendelkezésre.
 5: 
 6: * **Feltöltő Kliens (Uploader):**
 7:   * **Vendég (Guest) felhasználó:** Alapértelmezett, kisebb fájlméret-korláttal (pl. max. 50 MB) és rövidebb fájl-élettartammal rendelkezik a rendszerben. Hitelesítés nélkül használhatja az alapfunkciókat.
 8:   * **Regisztrált/Prémium felhasználó:** Érvényes azonosító (token/jelszó) megadása esetén nagyobb fájlméret-korláttal (pl. max. 500 MB) tölthet fel fájlokat.
 9: * **Letöltő Kliens (Downloader):** A kapott hivatkozás vagy QR kód segítségével fér hozzá a rendszerhez. A letöltés sikeressége a fájlhoz rendelt egyedi token érvényességétől és a fennmaradó letöltési limittől függ.
10: 
11: ## 2. Funkcionális Követelmények (Functional Requirements)
12: Ezek a követelmények írják le, hogy a rendszernek milyen konkrét funkciókat kell végrehajtania a felhasználó és a háttérfolyamatok szempontjából.
13: 
14: * **FR-01: Közvetlen fájlfeltöltés (Direct Upload):** A rendszernek biztosítania kell, hogy a felhasználó a kliensalkalmazásból közvetlenül a felhős tárhelyre (S3 Quarantine Bucket) tölthesse fel a fájlokat, anélkül, hogy a fájladatfolyam áthaladna a számítási rétegen (Lambda). Ezt Presigned URL-ek generálásával kell megoldani.
15: * **FR-02: Feltöltési kvóták és méretkorlátok ellenőrzése:** A rendszernek (az Upload API végponton keresztül) a feltöltés megkezdése előtt validálnia kell a kliens által bejelentett fájlméretet a felhasználói jogosultsági szint (Vendég vagy Regisztrált) alapján.
16: * **FR-03: S3 szintű méretvédelem (Enforcement):** A szerver által generált feltöltési linkekbe (Presigned URL) szigorúan bele kell kódolni a maximális fájlméret korlátját (`content-length-range`), ezzel megakadályozva a rosszindulatú, túlméretes adatszemét közvetlen S3-ba juttatását.
17: * **FR-04: Automatikus eseményindítás:** Egy új fájl feltöltése a karantén tárhelyre automatikusan (emberi beavatkozás nélkül) indítsa el a feldolgozó munkafolyamatot (S3 Event Notification).
18: * **FR-05: Vírusellenőrzés:** A rendszernek minden beérkező fájlt át kell vizsgálnia egy ClamAV motorral ellátott Lambda konténer segítségével. A fertőzött fájlokat a folyamatnak meg kell semmisítenie.
19: * **FR-06: Intelligens metaadat-kinyerés:** A rendszernek képesnek kell lennie a feltöltött képekből gépi látással (Amazon Rekognition), illetve a dokumentumokból/PDF-ekből szövegelemzéssel (Amazon Textract) automatikusan metaadatokat kinyerni.
20: * **FR-07: Fájl áthelyezése és adatrögzítés:** A sikeresen validált és elemzett fájlokat a rendszernek át kell mozgatnia a publikus (Clean) tárhelyre, a metaadatokat pedig egy NoSQL adatbázisban (DynamoDB) kell rögzítenie.
21: * **FR-08: Letöltési korlátok kezelése:** A rendszernek biztosítania kell a fájlok letöltésének korlátozását (pl. maximum letöltés/fájl). Ennek ellenőrzése és csökkentése atomi tranzakcióval (Conditional Update) kell történjen a versenyhelyzetek (Race Condition) elkerülése végett.
22: * **FR-09: Biztonságos letöltés:** Érvényes azonosító és megfelelő letöltési limit esetén a rendszer generáljon egy időkorlátos letöltési linket (GET Presigned URL) a felhasználó számára.
23: * **FR-10: Kliensoldali QR kód:** A rendszer kliensoldalon (React) vizuálisan jelenítse meg a generált megosztási linket, és automatikusan generáljon hozzá egy letölthető QR kódot.
24: 
25: ## 3. Nem Funkcionális Követelmények (Non-functional Requirements)
26: Ezek a rendszer minőségi jellemzőit, teljesítményét és biztonságát határozzák meg.
27: 
28: * **NFR-01: Skálázhatóság (Scalability):** A rendszernek automatikusan alkalmazkodnia kell a terheléshez. Mivel 100%-ban Serverless architektúrára épül, hirtelen forgalomnövekedés esetén (pl. 100 egyidejű feltöltés) is stabilan kell működnie.
29: * **NFR-02: Költséghatékonyság (Pay-as-you-go):** A rendszer üresjáratban (amikor nincs fel- vagy letöltés) nem generálhat számítási költségeket. Csak az események lefutásakor történhet erőforrás-használat.
30: * **NFR-03: Adatbiztonság:** A fájlok a feldolgozás során izolált karantén tárhelyen (Quarantine Bucket) kell, hogy legyenek. A végleges fájlokhoz való hozzáférés csak ideiglenes (lejárattal rendelkező) linkeken keresztül történhet.
31: * **NFR-04: Rendelkezésre állás (Availability):** Az infrastruktúrának a felhőszolgáltató (AWS) beépített magas rendelkezésre állási (High Availability) mutatóira kell épülnie.
32: * **NFR-05: Szeparált felelősségi körök:** A fájlmozgatás (nehéz adatfolyam) és a jogosultság-ellenőrzés (vékony számítási logika) architekturálisan szét kell legyen választva.
33: 
34: ## 4. Technikai és Környezeti Követelmények (Technical Requirements)
35: Ezek a megvalósításhoz használt eszközöket és a külső korlátozásokat írják le.
36: 
37: * **TR-01: Fejlesztési környezet:** A backend architektúrát az Amazon Web Services (AWS) felhőkörnyezetben kell megvalósítani.
38: * **TR-02: Kliensalkalmazás:** A frontend egy böngészőben futó, React és Vite alapú Single Page Application (SPA) kell, hogy legyen.
39: * **TR-03: IAM Korlátozások (Learner Lab):** A rendszernek teljes mértékben alkalmazkodnia kell az AWS Learner Lab oktatási korlátaihoz. Új IAM Role-ok létrehozása nélkül, kizárólag a kötelező `LabRole` használatával kell megoldani a szolgáltatások közötti kommunikációt (Lambda, Step Functions).
40: * **TR-04: Autentikáció alternatívája:** AWS Cognito hiányában az azonosítást és a jogosultságkezelést (Autorizációt) az adatbázisban tárolt UUID tokenekkel és egyedi API paraméterekkel kell alkalmazásszinten megoldani.
41: * **TR-05: Manuális infrastruktúra kiépítés:** A felhő erőforrások (S3, DynamoDB, Lambda, API Gateway) létrehozása és paraméterezése vizuálisan, az AWS Management Console felületén történik (nem IaC kódolással). Az állapotgépet az AWS Step Functions Workflow Studio-jával kell megtervezni.
````

## File: docs/specification.md
````markdown
 1: # Rendszerspecifikáció: Intelligens Serverless Fájlmegosztó Platform
 2: 
 3: ## 1. A Projekt Célkitűzése
 4: A projekt célja egy biztonságos, eseményvezérelt (Event-driven), szervermentes (Serverless) fájlmegosztó webalkalmazás tervezése és fejlesztése az AWS (Amazon Web Services) felhőinfrastruktúráján. A rendszer a hagyományos fájlmegosztási funkciókon túl intelligens háttérfeldolgozást (vírusellenőrzés, mesterséges intelligencia alapú tartalom-analízis) biztosít. A fejlesztés figyelembe veszi és adaptálja az AWS Learner Lab egyetemi oktatási környezet szigorú biztonsági és jogosultsági korlátozásait.
 5: 
 6: ## 2. Felhasználói Szerepkörök és Használati Esetek (Use Cases)
 7: A rendszer működése két fő felhasználói útvonalra bontható, melyeket az alkalmazás logikai szinten (Token/API kulcs alapján) különböztet meg:
 8: * **Feltöltő Kliens (Uploader):** Képes a webes felületen keresztül kiválasztani és feltölteni egy fájlt. A feldolgozás után megkapja a letöltési hivatkozást és a QR kódot.
 9:   * *Vendég (Guest):* Alapértelmezett, kisebb fájlméret-korláttal (max. 500 MB) rendelkezik.
10:   * *Regisztrált/Prémium:* Érvényes azonosító esetén kiterjesztett fájlméret-korláttal (max. 2 GB) használhatja a rendszert, és kezelheti saját fájljait.
11: * **Letöltő Kliens (Downloader):** A kapott hivatkozás vagy QR kód segítségével hozzáfér a rendszerhez. A háttérben lezajló jogosultság- és limitellenőrzés után letöltheti a megtisztított és validált fájlt.
12: 
13: ## 3. Funkcionális Követelmények
14: * **Biztonságos fájlfeltöltés:** A fájlok feltöltése a számítási réteg (backend) megkerülésével, API Gateway által generált S3 Presigned URL segítségével, közvetlenül a karantén tárhelyre történjen.
15: * **S3 szintű méretvédelem:** A generált feltöltési linkekbe (Presigned URL) szigorúan bele kell kódolni a maximális fájlméret korlátját (`content-length-range`), megakadályozva a rosszindulatú adatszemét közvetlen S3-ba juttatását.
16: * **Automatikus eseményindítás:** Az S3 tárhelyre beérkező új objektumok automatikusan indítsák el a feldolgozó állapotgépet (S3 Event Notification).
17: * **Biztonsági szűrés:** A feltöltött fájlokat a rendszer egy Lambda konténerben futó ClamAV segítségével ellenőrizze.
18: * **AI alapú adatkinyerés:** A képi fájlokból az Amazon Rekognition gépi látással, a PDF/dokumentum fájlokból az Amazon Textract vonjon ki metaadatokat.
19: * **Adatbázis rögzítés és áthelyezés:** A sikeresen validált fájlok metaadatai, valamint a maximális letöltési limit egy NoSQL adatbázisban (DynamoDB) rögzüljenek, a nyers fájl pedig egy tiszta S3 vödörbe kerüljön áthelyezésre.
20: * **Atomi letöltéskezelés:** A letöltések számának ellenőrzése és csökkentése versenyhelyzet-mentesen (Race condition elkerülése), atomi tranzakcióval (Conditional Update) valósuljon meg.
21: * **QR kód generálás:** A letöltési linkekhez tartozó QR kódok generálása az erőforrás-optimalizálás érdekében kliensoldalon történjen.
22: 
23: ## 4. Nem Funkcionális Követelmények és Architektúra
24: * **Infrastruktúra:** 100%-ban Serverless AWS architektúra (Amazon S3, AWS Lambda, Amazon API Gateway, AWS Step Functions, Amazon DynamoDB, Amazon SNS).
25: * **Backend-first megközelítés:** A szerveroldali logika és az API végpontok fejlesztése és manuális tesztelése (Postman) megelőzi a vizuális felület kialakítását.
26: * **Kliensalkalmazás:** Modern, komponensalapú Single Page Application (SPA), React (Vite) alapokon.
27: * **Skálázhatóság és Költséghatékonyság:** Az eseményvezérelt architektúrának köszönhetően a rendszer alapjáraton nem fogyaszt számítási erőforrást (Pay-as-you-go modell).
28: 
29: ## 5. Fejlesztési Környezet és Korlátozások (Learner Lab)
30: A rendszer tervezése során alkalmazkodni kell az AWS Academy / Learner Lab környezet technikai limitációihoz:
31: * **IAM Szabályozás:** Új jogosultsági profilok (IAM Roles) létrehozása tiltott (`iam:CreateRole` hiánya). Minden számítási egység (Lambda, Step Functions) végrehajtását az előre definiált **`LabRole`** profil használatával kell megoldani.
32: * **Hitelesítés:** Az Amazon Cognito szolgáltatás elérhetetlensége miatt az autentikációt és az engedélyezést az egyedi, egyszer használatos linkek és a DynamoDB alapú Token/TTL ellenőrzés kombinációjával kell kiváltani.
33: * **Implementáció módja:** Az infrastruktúra kiépítése a hivatalos AWS Management Console felületén, manuális, vizuális konfigurációval történik többnyire. Bizonyos esetekben ettől eltérhet, és infrastruktúra-mint-kód (IaC) megoldásokat alkalmazhat.
34: 
35: ---
36: 
37: ## 6. Kapacitástervezés és Rendszerkorlátok (Capacity Planning)
38: A Serverless környezet stabilitása és a futásidejű hibák (Timeout) elkerülése érdekében az AWS szolgáltatások fizikai korlátai az alábbi limitek bevezetését igénylik:
39: * **Feldolgozási limit (ClamAV):** Az AWS Lambda maximális futási ideje 15 perc, átmeneti tárhelye (`/tmp`) 10 GB. A ClamAV vírusleíró adatbázisa (1.5 GB) és a tömörített fájlok kibontási igénye miatt az alkalmazásszintű **maximális fájlméret 2 GB-ban** lett maximalizálva. Ekkora fájl letöltése, memóriában történő teljes átvizsgálása és S3 áthelyezése biztonságosan, 3-5 perc alatt lefut.
40: * **AI Limitek:** Az Amazon Rekognition szinkron képelemzése maximum **15 MB**-os, az Amazon Textract dokumentumelemzése pedig maximum **150 MB**-os fájlokon futtatható biztonságosan a Lambda időkeretén belül.
41: 
42: ## 7. Feltételes Feldolgozás (Conditional Routing & Graceful Degradation)
43: A különböző szolgáltatások eltérő fizikai korlátai miatt a rendszer intelligens elágazásokat (Choice State) használ az AWS Step Functions állapotgépben:
44: 1. **Védelem a kapuban:** A kliensalkalmazás (React) és az API Gateway (S3 content-length-range) élből elutasítja a kvótát (500 MB / 2 GB) meghaladó feltöltéseket.
45: 2. **Elágazás (Choice):** A ClamAV sikeres lefutása után az állapotgép megvizsgálja a fájl MIME típusát és méretét. 
46: 3. **Elegáns Funkcióvesztés:** Ha egy fájl meghaladja az AI réteg szigorú korlátait (pl. egy 50 MB-os kép), a folyamat nem áll le hibával. A rendszer átugorja a Rekognition/Textract hívást, és AI metaadatok nélkül (`ai_tags: null`), de érvényes, vírusmentes fájlként rögzíti és teszi letölthetővé az állományt a DynamoDB-ben.
47: 
48: ## 8. Költségbecslés és Skálázhatóság (TCO)
49: Az AWS Pricing Calculator alapján végzett kapacitás-kalkulációk bizonyítják a Serverless architektúra költséghatékonyságát.
50: 
51: * **Alapforgatókönyv (Egyetemi tesztüzem):** Napi néhány feltöltés és AI elemzés esetén a rendszer teljes mértékben a havi ingyenes AWS Free Tier keretein belül marad, így az üzemeltetési költsége **0.00 USD/hónap**, védve a Learner Lab 100 USD-s költségkeretét.
52: * **Skálázódási Forgatókönyv (10 000 aktív felhasználó):** Feltételezve havi 14 TB tárolt adatot és 28 TB kimenő internetes forgalmat, a horizontálisan skálázódó Lambda függvények (egyidejű párhuzamosítás) biztosítják a hiba nélküli kiszolgálást. Ekkora terhelés mellett a számítási réteg (Lambda, API Gateway) költsége továbbra is elhanyagolható (~15 USD). A becsült havi ~2922 USD összköltség több mint 95%-át az S3 adat fizikai tárolása és az internet felé irányuló sávszélesség (Data Transfer Out) teszi ki. A fajlagos kiszolgálási költség felhasználónként mindössze ~0.29 USD havonta.
````

## File: docs/workPlan.md
````markdown
 1: **Hallgató neve:** Sándor Balázs  
 2: **Neptun kódja:** W1SRF8  
 3: **Email címe:** sandorbalazs1013@gmail.com  
 4: **Konzulens(ek) neve:** Pelle István  
 5: **Önlab tantárgy kódja:** BMEVITMAL04  
 6: **Tanév/félév:** 2025/2026. 2. félév  
 7: 
 8: **Feladat/téma címe:** Felhő natív alkalmazásfejlesztés - Egy intelligens, serverless fájlmegosztó webalkalmazás tervezése és fejlesztése AWS környezetben.
 9: 
10: ---
11: 
12: Tervezett munkafázisok a félév során:
13: 
14: | Hét | Fejlesztési Fázis | Elvégzendő Szakmai Feladatok |
15: | :--- | :--- | :--- |
16: | **1. hét** | **Projekt előkészítése és témaegyeztetés** | - Kapcsolatfelvétel a konzulenssel.<br>- A projekt témájának és a fejlesztendő alkalmazás alapötletének a kidolgozása.<br>- Egyeztetés a konzulenssel a kidolgozott célkitűzésekről. |
17: | **2. hét** | **Tervezés és specifikáció** | - Serverless AWS architektúra ábra véglegesítése<br>- Rendszerspecifikáció és követelmények összeállítása<br>- Learner Lab korlátainak felmérése és összevetése a tervvel<br>- Specifikáció hozzáigazítása az elérhető felhős erőforrásokhoz<br>- A projekt heti bontású munkatervének elkészítése |
18: | **3. hét** | **Rendszertervezés és alapinfrastruktúra** | - A rendszertervezés véglegesítése és a használandó tervezési minták (Design Patterns) meghatározása.<br>- Az AWS adattárolási rétegének (S3 vödrök és DynamoDB) manuális létrehozása, a CORS és a jogosultságok beállítása.<br>- Kliensoldali felkészülés: JS/React tanulásának megkezdése. |
19: | **4. hét** | **API végpontok és feltöltési logika** | - API Gateway és a feltöltési linkeket adó Lambda manuális létrehozása (a kötelező LabRole kiválasztásával)<br>- Letöltést kezelő Lambda elkészítése atomi számlálással.<br>- A backend végpontok manuális tesztelése Postman segítségével. |
20: | **5. hét** | **Intelligens feldolgozás (1. rész)** | - AWS Step Functions állapotgép vizuális felépítése (Workflow Studio segítségével).<br>- Állapotgép rákötése az S3 Event Notification-re (új fájl esetén automatikus indulás).<br>- ClamAV vírusirtó Lambda konténer bekötése a beérkező fájlok átvizsgálására. |
21: | **6. hét** | **Intelligens feldolgozás (2. rész)** | - AI szolgáltatások (Amazon Rekognition és Textract) integrálása a Lambda függvényekbe.<br>- Véglegesítő Lambda megírása: adatok mentése DynamoDB-be és a tiszta fájl áthelyezése. |
22: | **7. hét** | **Kliensalkalmazás: UI és alapok (Frontend 1.)** | - React (Vite) projekt inicializálása és a mappaszerkezet kialakítása.<br>- A felhasználói felület (UI) dizájnjának és a feltöltő űrlapoknak az összerakása (még adatok nélkül.)<br> |
23: | **8. hét** | **Kliensalkalmazás: Integráció (Frontend 2.)** | - Frontend összekötése a letesztelt AWS backenddel: fájlfeltöltés megvalósítása a böngészőből.<br>- Visszakapott adatok feldolgozása: letöltési linkek és kliensoldali QR kód generálása/megjelenítése.<br>- Fájlméret kvóták kliensoldali validálása. |
24: | **9. hét** | **Rendszerintegráció és E2E tesztelés** | - A teljes rendszer "End-to-End" végigtesztelése a grafikus felületen keresztül.<br>- A különböző szerepkörök (Vendég vs. Regisztrált) korlátozásainak gyakorlati ellenőrzése.<br>- Esetleges hibák javítása (Bugfixing) és a kód optimalizálása. |
25: | **10. hét** | **Alkalmazásfejlesztés finomhangolása** | - Az alkalmazás funkcióinak végső polírozása és a felhasználói élmény (UX) javítása.<br>- A felmerülő szélsőséges esetek lekezelése és a kódbázis refaktorálása.<br>- A biztonsági beállítások és a jogosultságok utolsó, éles tesztelése. |
26: | **11. hét** | **Dokumentáció és projekt véglegesítése** | - Az írásos projektbeszámoló megírása, az architektúra ábrák és tervezési döntések kifejtése.<br>- A Learner Lab miatti kompromisszumok indoklása, a beszámoló stilisztikai véglegesítése.<br>- A GitHub repó (`README.md`) és a kódbázis kommentjeinek rendbetétele. |
27: | **12. hét** | **Projekt leadása és védés előkészítése** | - A teljes, kész projekt és a dokumentáció hivatalos leadása a konzulensnek.<br>- A szóbeli bemutató (prezentációs diák) tartalmi és vizuális összeállítása.<br>- Az élő rendszerbemutató forgatókönyvének megtervezése és elpróbálása. |
28: | **13. hét** | **Felkészülés a szóbeli beszámolóra** | - A prezentáció és az élő bemutató többszöri, időre történő elpróbálása.<br>- A lehetséges szakmai kérdésekre adandó válaszok gyakorlása.<br>- A bemutató során használt eszközök és környezet végleges ellenőrzése.<br>- Esetleges szóbeli beszámoló. |
29: | **14. hét** | **Szóbeli beszámoló** | - A projekt eredményeinek hivatalos prezentálása a bizottság/konzulens előtt.<br>- Az elkészült fájlmegosztó alkalmazás élő, hibamentes bemutatása.<br>- A felmerülő kérdések megválaszolása. |
````

## File: files_for_upload_test/test.txt
````
1: 
````

## File: files_for_upload_test/test2.txt
````
1: 
````

## File: weekly-work/week-02/AWS_Diagram.txt
````
 1: 1. A Szervermentes (Serverless) Paradigma kiemelése:
 2: 
 3: "Tanár úr / Konzulens úr, a rendszer fő tervezési alapelve a hálózati szűk keresztmetszetek elkerülése volt. Ahogy a vastag nyilak is mutatják (4. és 13. lépés), a nagyméretű fájlok fel- és letöltése Presigned URL-ekkel közvetlenül az S3-ba történik, így a számítási réteg (a Lambda) egyáltalán nem terhelődik a gigabájtos adatfolyamokkal."
 4: 
 5: 2. A Bonyolítás (A TMIT-es "Okos" rész) bemutatása:
 6: 
 7: "A puszta fájltároláson túl a rendszer 'agya' a középső sávban látható aszinkron feldolgozó pipeline. Egy S3 esemény indítja az AWS Step Functions állapotgépet, ami párhuzamosan végeztet el egy ClamAV vírusirtást, illetve az Amazon Rekognition és Textract segítségével intelligens adatkinyerést a fájlokból."
 8: 
 9: 3. A Tranzakció-biztonság (Versenyhelyzetek kezelése):
10: 
11: "A letöltési oldalon kiemelt figyelmet fordítottam az adatintegritásra. A Gatekeeper Lambda és a DynamoDB közötti kétirányú nyíl (11. lépés) egy atomi tranzakciót (Conditional Update) jelöl. Ez biztosítja, hogy ha egy egyszer letölthető fájlra ketten kattintanak rá ezredmásodpercre pontosan egyszerre, a rendszer akkor is csak az egyiküket engedi át."
12: 
13: 4. A Learner Lab korlátok elegáns kezelése:
14: 
15: "Végül pedig az egész architektúrát úgy optimalizáltam, hogy tökéletesen illeszkedjen az egyetemi Learner Lab korlátozásaihoz: kiküszöböltem a Cognito-t, és a tervezésnél figyelembe vettem, hogy minden számítási egység a kötelező 'LabRole' IAM profillal tudjon csak futni."
16: 
17: 
18: Itt látható a bal oldalon, ahogy az 1-es Kliens feltölti a fájlt a rendszerbe. Miután a felhő feldolgozta (középső sáv), a felhasználó kap egy generált linket és QR kódot, amit külső csatornán – a szaggatott nyíl mentén – átküld a 2-es Kliensnek. A 2-es Kliens ezen a linken keresztül indítja el a letöltési kérést a 10-es nyílnál."
````

## File: weekly-work/week-02/use-case-describe.md
````markdown
1: ### 5. Használati Esetek (Usecase Modell)
2: 
3: A fenti UML Use Case diagram a rendszer felhasználói (aktorai) és a platform főbb funkciói közötti kapcsolatokat modellezi. 
4: * **Elsődleges aktorok (Bal oldal):** A rendszert a `Guest Uploader`, a `Registered Uploader` és a `Downloader` használja. A regisztrált felhasználó öröklődési kapcsolatban (Generalization) áll a vendéggel, így az alapvető fájlmegosztási funkciók mellett hozzáfér a kiterjesztett, bejelentkezést igénylő funkciókhoz is (`Manage Own Files`).
5: * **Másodlagos aktor (Jobb oldal):** A `Notification System` egy rendszeren kívüli, aszinkron értesítési hálózatot reprezentál.
6: * **Folyamatlogika:** Az ábrán az `<<include>>` relációk jelölik azokat a háttérfolyamatokat, amelyek egy tranzakció során kötelezően lefutnak (pl. méretellenőrzés, AI/Vírus feldolgozás, Token validálás). Az `<<extend>>` reláció egy opcionális funkciót (pl. értesítés küldése a letöltés megtörténtéről) jelöl.
````

## File: weekly-work/week-02/Work_Plan.txt
````
 1: A Projekt Munkaterv Módszertani Indoklása és Szakmai Kifejtése
 2: (Kalkulált időkeret: egyenletes, heti ~5 munkaóra)
 3: 
 4: A bemutatott 11 hetes fejlesztési ütemterv (2-12. hét) az "API-first" (Backend-first) megközelítésre és a kockázatalapú szoftvertervezésre (Risk-driven Development) épül.
 5: A feladatok elosztásának fő célja, hogy a munkafolyamat egyenletes, heti 5 órás terhelést jelentsen, elkerülve a félév végi torlódást.
 6: 
 7: 1. Tervezés, Specifikáció és Kockázatelemzés (2. Hét)
 8: Szerepe: A projekt alapozása és az architekturális zsákutcák elkerülése.
 9: Miért ekkor: Mielőtt bármilyen kódolás megkezdődne, pontosan fel kell mérni az AWS Learner Lab környezet szigorú korlátait (pl. iam:CreateRole hiánya, Cognito hiánya). 
10: A vizuális architektúra és az UML modellek (Use Case) ezen a héten történő véglegesítése biztosítja, hogy a későbbi hetekben már tisztán a megvalósításra fókuszálhassunk.
11: 
12: 2. Backend-first Architektúra (3-4. Hét)
13: Szerepe: A stabil adatréteg és az API végpontok felállítása a felhőben.
14: Miért ekkor: A vizuális (kattintgatós) AWS konzol használatával a S3 és DynamoDB erőforrások felhúzása viszonylag gyors (3. hét), így már ekkor megkezdődhet a frontend (React) technológiák elméleti alapozása. 
15: A 4. héten az API Gateway és a feltöltési logika (Presigner Lambda) izoláltan, vizuális felület nélkül, Postman segítségével tesztelhető. Ezzel kizárjuk, hogy a későbbi szakaszokban a backend és a frontend hibái összekeveredjenek.
16: 
17: 3. Intelligens Háttérfeldolgozás - Két hétre bontva (5-6. Hét)
18: Szerepe: A rendszer "agyának", a Serverless állapotgépnek (Step Functions) a megépítése.
19: Miért ekkor: Mivel ez a folyamat integrálja a ClamAV vírusirtót és az AI szolgáltatásokat (Rekognition, Textract), komplexitása magas.
20: Hogy tartható legyen a heti ~5 órás keret, a folyamatot kettébontottuk. Az 5. hét az alapvető folyamatirányításé és a biztonságé, a 6. hét az adatkinyerésé. Így van idő alaposan tesztelni a felhős komponensek közötti adatátvitelt.
21: 
22: 4. Kliensalkalmazás és Felhasználói Felület (7-8. Hét)
23: Szerepe: A React alapú SPA (Single Page Application) lefejlesztése és integrálása.
24: Miért ekkor: A frontend fejlesztés szándékosan a projekt második felére került. Egyrészt ekkorra a fejlesztő már elegendő elméleti tudást szerzett (a korábbi hetek párhuzamos tanulása révén), 
25: másrészt egy 100%-osan működő, tesztelt felhős háttérrendszerhez kell csak csatlakoznia. A UI kialakításának (7. hét) és a hálózati integrációnak/logikának (8. hét) a szétválasztása tovább csökkenti a kognitív terhelést.
26: 
27: 5. Rendszerintegráció és Tesztelés (9. Hét)
28: Szerepe: Minőségbiztosítás (QA) és az üzleti logika validálása.
29: Miért ekkor: A rendszer összeállt. Ezen a héten a fókusz kizárólag a különböző felhasználói szerepkörök (Vendég vs. Regisztrált), a fájlméret-korlátok, 
30: és az atomi letöltésszámláló "End-to-End" (E2E) tesztelésén, valamint a fellépő hibák (Bugok) javításán van. Új funkció már nem készül.
31: 
32: 6. Dokumentáció és Leadás (10-11. Hét)
33: Szerepe: A hivatalos akadémiai és szakmai követelmények teljesítése.
34: Miért ekkor: Egy minőségi, mérnöki kompromisszumokat (Trade-off) indokló dokumentáció megírása időigényes. 
35: A 10. héten a nyers szövegezés és az ábrák beillesztése történik, míg a 11. hét a stilisztikai csiszolásé, a kódkommentek ellenőrzéséé és a projekt hivatalos leadásáé. Így a leadás stresszmentes marad.
36: 
37: 7. Prezentáció és Védés (12. Hét)
38: Szerepe: A vizsgahelyzet szimulációja és a kommunikációs felkészülés.
39: Miért ekkor: A munka technikai és adminisztratív része lezárult. Ezen a héten a teljes 5 órás időkeret a diák összeállítására, az élő demó (Live Demo) elpróbálására, 
40: valamint a bizottság várható (pl. architektúrára vagy jogosultságkezelésre vonatkozó) kérdéseire adott szakmai válaszok begyakorlására fordítható.
````

## File: weekly-work/week-03/weekly-work-3.md
````markdown
 1: # BLZTransfer - AWS Felhős Architektúra és Frontend Integráció
 2: 
 3: 
 4: ## 1. Az adattárolás előkészítése (Amazon S3)
 5: A rendszer alapját a fájlok tárolása adja. Ehhez két különálló S3 vödröt (bucket) hoztam létre:
 6: 
 7: * **Frontend vödör (`blz-frontend-bucket-w1srf8`):** Ennek a feladata a lefordított React weboldal kiszolgálása.
 8:     * Bekapcsoltam a *Static website hosting* funkciót, az index dokumentumot `index.html`-re állítva.
 9:     * Kikapcsoltam a *Block all public access* opciót.
10:     * Írtam egy publikus olvasást engedélyező *Bucket Policy*-t, így a világon bárki elérheti az oldalt böngészőből.
11: * **Karantén vödör (`blz-quarantine-bucket-w1srf8`):** Ide érkeznek be a felhasználók által feltöltött fájlok.
12:     * Mivel ez a vödör más domainen van, mint a weboldalam, be kellett állítanom a *CORS (Cross-Origin Resource Sharing)* szabályokat.
13:     * Engedélyeztem a `PUT`, `POST`, `GET` metódusokat a lokális fejlesztői szerverem (`http://localhost:5173`) és a publikus frontend vödröm URL-je számára.
14:     * Hozzáadtam a `"MaxAgeSeconds": 3000` paramétert a hálózati kérések optimalizálása (Preflight caching) érdekében.
15: 
16: ## 2. A szerveroldali logika (AWS Lambda)
17: A fájlok biztonságos feltöltéséhez nem adhatok közvetlen írási jogot a publikus weblapnak. Ehelyett egy *Presigned URL* (ideiglenes, lejáró engedély) stratégiát alkalmaztam.
18: 
19: * Létrehoztam egy új Lambda függvényt `blz-get-presigned-url` néven.
20: * **Futtatókörnyezet:** Node.js 24.x (a legfrissebb LTS verzió).
21: * **Jogosultság (IAM Role):** Mivel a Learner Lab környezetben saját IAM Role létrehozása korlátozott, az egyetemi fiókhoz biztosított, beépített `LabRole`-t használtam, ami megfelelő jogokkal rendelkezik az S3 és a CloudWatch logok eléréséhez.
22: * **Kód:** A beépített AWS SDK (v3) segítségével írtam egy rövid scriptet. A kód a bejövő kérés alapján generál egy 5 percig (300 másodperc) érvényes `PutObject` parancsot a Karantén vödrömhöz, és ezt az URL-t küldi vissza JSON formátumban. A válaszfejlécbe (Headers) a CORS engedélyeket is beleégettem.
23: 
24: ## 3. A Backend publikálása (Amazon API Gateway)
25: A Lambda függvény önmagában nem elérhető a böngészők számára, ezért egy API végpontot kellett elé tennem.
26: 
27: * A Lambda függvényhez hozzáadtam egy *API Gateway* triggert.
28: * Típusként a modern, gyors és költséghatékony **HTTP API**-t választottam.
29: * A biztonságot "Open"-re hagytam (hiszen maga az S3 link eleve védett és lejár).
30: * Az integráció során bekapcsoltam a beépített *CORS* támogatást, így a React alkalmazásom hálózati (fetch) kéréseit nem blokkolja a böngésző.
31: 
32: ## 4. A Frontend élesítése (Deploy)
33: Miután a lokális gépemen (Vite + React környezetben) sikeresen megírtam és teszteltem az `S3CorsTest.jsx` komponenst, a kódot ki kellett juttatnom az AWS-be.
34: 
35: 1.  A fejlesztői szervert leállítva lefuttattam az `npm run build` parancsot, amely elkészítette az optimalizált `dist` mappát.
36: 2.  A mappa tartalmát (az `assets` almappát, az `index.html`-t és a logókat) feltöltöttem a `blz-frontend-bucket-w1srf8` S3 vödörbe.
37: 
38: ## 5. Rendszer Integrációs Teszt (End-to-End)
39: Az utolsó lépés a teljes, felhőben futó architektúra tesztelése volt.
40: 
41: 1.  Megnyitottam a frontend vödör publikus URL-jét.
42: 2.  A weboldalon elindítottam az integrációs tesztet.
43: 3.  **A folyamat a háttérben:** * A böngésző kérést küldött az API Gateway-nek.
44:     * Az API Gateway elindította a Lambdát.
45:     * A Lambda visszaküldte a 300 másodpercig érvényes S3 URL-t.v
46:     * A frontend React kódja ezt a linket felhasználva egy `PUT` kéréssel közvetlenül feltöltötte a `final-test.txt` nevű fájlt.
47: 4.  **Eredmény:** A böngésző konzoljában és az oldalon is megjelent a *200 OK* státuszkód. Az AWS Konzolon ellenőrizve a Karantén vödör tartalmát, a fájl sikeresen, hibátlanul megérkezett a felhőbe.
48: 
49: Ezzel a projekt infrastruktúrájának alapvető, legkritikusabb fájlmozgatási ciklusa sikeresen kiépült!
````

## File: app/backend/src/Blz.GetPresignedUrl/Blz.GetPresignedUrl.csproj
````
 1: <Project Sdk="Microsoft.NET.Sdk">
 2:   <PropertyGroup>
 3:     <TargetFramework>net10.0</TargetFramework>
 4:     <ImplicitUsings>enable</ImplicitUsings>
 5:     <Nullable>enable</Nullable>
 6:     <GenerateRuntimeConfigurationFiles>true</GenerateRuntimeConfigurationFiles>
 7:     <AWSProjectType>Lambda</AWSProjectType>
 8:     <!-- This property makes the build directory similar to a publish directory and helps the AWS .NET Lambda Mock Test Tool find project dependencies. -->
 9:     <CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>
10:     <!-- Generate ready to run images during publishing to improve cold start time. -->
11:     <PublishReadyToRun>true</PublishReadyToRun>
12:   </PropertyGroup>
13:   <ItemGroup>
14:     <PackageReference Include="Amazon.Lambda.APIGatewayEvents" Version="2.7.3" />
15:     <PackageReference Include="Amazon.Lambda.Core" Version="2.8.0" />
16:     <PackageReference Include="Amazon.Lambda.Serialization.SystemTextJson" Version="2.4.5" />
17:     <PackageReference Include="AWSSDK.DynamoDBv2" Version="4.0.16" />
18:     <PackageReference Include="AWSSDK.S3" Version="4.0.19" />
19:   </ItemGroup>
20: </Project>
````

## File: app/frontend/src/components/Auth/AuthHome/AuthHome.jsx
````javascript
  1: import React, { useState } from "react";
  2: import Button from "../../UI/Buttons/Button";
  3: import Card from "../../UI/Cards/Card";
  4: import classes from "./AuthHome.module.css";
  5: 
  6: import { signIn, signUp, confirmSignUp, signOut } from "aws-amplify/auth";
  7: 
  8: const AuthHome = (props) => {
  9:   // Nézetek: 'home' | 'login' | 'register' | 'confirm'
 10:   const [view, setView] = useState("home");
 11:   const [isLoading, setIsLoading] = useState(false);
 12:   const [errorMessage, setErrorMessage] = useState("");
 13:   const [successMessage, setSuccessMessage] = useState("");
 14: 
 15:   // Űrlap adatok egyetlen objektumban
 16:   const [formData, setFormData] = useState({
 17:     name: "",
 18:     username: "",
 19:     password: "",
 20:     email: "",
 21:     phone: "",
 22:     address: "",
 23:     gender: "male",
 24:     code: "",
 25:   });
 26: 
 27:   const handleChange = (e) => {
 28:     setFormData({ ...formData, [e.target.name]: e.target.value });
 29:   };
 30: 
 31:   // --- 1. REGISZTRÁCIÓ LOGIKA ---
 32:   const handleRegister = async (e) => {
 33:     e.preventDefault();
 34:     setIsLoading(true);
 35:     setErrorMessage("");
 36: 
 37:     try {
 38:       await signUp({
 39:         username: formData.username,
 40:         password: formData.password,
 41:         options: {
 42:           userAttributes: {
 43:             name: formData.name,
 44:             email: formData.email,
 45:             phone_number: formData.phone, // Format: +36301234567
 46:             address: formData.address,
 47:             gender: formData.gender,
 48:           },
 49:         },
 50:       });
 51:       setView("confirm");
 52:       setSuccessMessage(
 53:         "Registration successful! Please check your email for the verification code.",
 54:       );
 55:     } catch (error) {
 56:       setErrorMessage(error.message);
 57:     } finally {
 58:       setIsLoading(false);
 59:     }
 60:   };
 61: 
 62:   // --- 2. EMAIL MEGERŐSÍTÉS (OTP) LOGIKA ---
 63:   const handleConfirmCode = async (e) => {
 64:     e.preventDefault();
 65:     setIsLoading(true);
 66:     setErrorMessage("");
 67:     setSuccessMessage("");
 68: 
 69:     try {
 70:       await confirmSignUp({
 71:         username: formData.username,
 72:         confirmationCode: formData.code,
 73:       });
 74:       setView("login");
 75:       setSuccessMessage("Email verified successfully! You can now log in.");
 76:     } catch (error) {
 77:       setErrorMessage(error.message);
 78:     } finally {
 79:       setIsLoading(false);
 80:     }
 81:   };
 82: 
 83:   // --- 3. BEJELENTKEZÉS LOGIKA ---
 84:   const handleLogin = async (e) => {
 85:     e.preventDefault();
 86:     setIsLoading(true);
 87:     setErrorMessage("");
 88:     setSuccessMessage("");
 89: 
 90:     try {
 91:       // 1. ÚJDONSÁG: Biztos, ami biztos, kiléptetjük a "beragadt" felhasználót
 92:       try {
 93:         await signOut();
 94:       } catch {
 95:         /* Nem baj, ha nem volt senki belépve */
 96:       }
 97: 
 98:       // 2. Jöhet a tényleges bejelentkezés
 99:       const { isSignedIn } = await signIn({
100:         username: formData.username,
101:         password: formData.password,
102:       });
103: 
104:       if (isSignedIn) {
105:         props.onLogin(formData.username);
106:       }
107:     } catch (error) {
108:       // Ha már eleve be van jelentkezve (bár a signOut után ez ritka), engedjük be!
109:       if (
110:         error.name === "UserAlreadyAuthenticatedException" ||
111:         error.message.includes("already a signed in user")
112:       ) {
113:         props.onLogin(formData.username);
114:       } else {
115:         setErrorMessage(error.message);
116:       }
117:     } finally {
118:       setIsLoading(false);
119:     }
120:   };
121: 
122:   // ==========================================================
123:   // RENDERELÉSI NÉZETEK (Gyakorlatilag "al-komponensek")
124:   // ==========================================================
125: 
126:   if (view === "register") {
127:     return (
128:       <Card className={classes.auth}>
129:         <h1>Create Account</h1>
130:         <p>Join BLZ Transfer today.</p>
131:         {errorMessage && <p className={classes.error}>{errorMessage}</p>}
132: 
133:         <form className={classes.form} onSubmit={handleRegister}>
134:           <div className={classes.inputGroup}>
135:             <label>Username</label>
136:             <input
137:               className={classes.input}
138:               name="username"
139:               required
140:               onChange={handleChange}
141:             />
142:           </div>
143:           <div className={classes.inputGroup}>
144:             <label>Full Name</label>
145:             <input
146:               className={classes.input}
147:               type="text"
148:               name="name"
149:               required
150:               onChange={handleChange}
151:             />
152:           </div>
153:           <div className={classes.inputGroup}>
154:             <label>Email Address</label>
155:             <input
156:               className={classes.input}
157:               type="email"
158:               name="email"
159:               required
160:               onChange={handleChange}
161:             />
162:           </div>
163:           <div className={classes.inputGroup}>
164:             <label>Password</label>
165:             <input
166:               className={classes.input}
167:               type="password"
168:               name="password"
169:               required
170:               onChange={handleChange}
171:             />
172:           </div>
173:           <div className={classes.inputGroup}>
174:             <label>Phone Number (e.g. +36301234567)</label>
175:             <input
176:               className={classes.input}
177:               type="tel"
178:               name="phone"
179:               required
180:               onChange={handleChange}
181:             />
182:           </div>
183:           <div className={classes.inputGroup}>
184:             <label>Address</label>
185:             <input
186:               className={classes.input}
187:               type="text"
188:               name="address"
189:               required
190:               onChange={handleChange}
191:             />
192:           </div>
193:           <div className={classes.inputGroup}>
194:             <label>Gender</label>
195:             <select
196:               className={classes.input}
197:               name="gender"
198:               value={formData.gender}
199:               onChange={handleChange}
200:             >
201:               <option value="male">Male</option>
202:               <option value="female">Female</option>
203:               <option value="other">Other</option>
204:             </select>
205:           </div>
206: 
207:           <Button
208:             type="submit"
209:             disabled={isLoading}
210:             style={{ marginTop: "1rem" }}
211:           >
212:             {isLoading ? "Creating..." : "Sign Up"}
213:           </Button>
214:         </form>
215: 
216:         <p className={classes.switchText}>
217:           Already have an account?
218:           <button
219:             type="button"
220:             className={classes.linkBtn}
221:             onClick={() => {
222:               setView("login");
223:               setErrorMessage("");
224:             }}
225:           >
226:             Log In
227:           </button>
228:         </p>
229:       </Card>
230:     );
231:   }
232: 
233:   if (view === "confirm") {
234:     return (
235:       <Card className={classes.auth}>
236:         <h1>Verify Email</h1>
237:         <p>We sent a 6-digit code to your email.</p>
238:         {successMessage && <p className={classes.success}>{successMessage}</p>}
239:         {errorMessage && <p className={classes.error}>{errorMessage}</p>}
240: 
241:         <form className={classes.form} onSubmit={handleConfirmCode}>
242:           <div className={classes.inputGroup}>
243:             <label>Verification Code</label>
244:             <input
245:               className={classes.input}
246:               type="text"
247:               name="code"
248:               required
249:               onChange={handleChange}
250:             />
251:           </div>
252:           <Button
253:             type="submit"
254:             disabled={isLoading}
255:             style={{ marginTop: "1rem" }}
256:           >
257:             {isLoading ? "Verifying..." : "Confirm Code"}
258:           </Button>
259:         </form>
260:       </Card>
261:     );
262:   }
263: 
264:   if (view === "login") {
265:     return (
266:       <Card className={classes.auth}>
267:         <h1>Welcome Back</h1>
268:         <p>Log in to access your secure files.</p>
269:         {successMessage && <p className={classes.success}>{successMessage}</p>}
270:         {errorMessage && <p className={classes.error}>{errorMessage}</p>}
271: 
272:         <form className={classes.form} onSubmit={handleLogin}>
273:           <div className={classes.inputGroup}>
274:             <label>Username</label>
275:             <input
276:               className={classes.input}
277:               type="text"
278:               name="username"
279:               required
280:               onChange={handleChange}
281:             />
282:           </div>
283:           <div className={classes.inputGroup}>
284:             <label>Password</label>
285:             <input
286:               className={classes.input}
287:               type="password"
288:               name="password"
289:               required
290:               onChange={handleChange}
291:             />
292:           </div>
293:           <Button
294:             type="submit"
295:             disabled={isLoading}
296:             style={{ marginTop: "1rem" }}
297:           >
298:             {isLoading ? "Logging in..." : "Log In"}
299:           </Button>
300:         </form>
301: 
302:         <p className={classes.switchText}>
303:           Don't have an account?
304:           <button
305:             type="button"
306:             className={classes.linkBtn}
307:             onClick={() => {
308:               setView("register");
309:               setErrorMessage("");
310:               setSuccessMessage("");
311:             }}
312:           >
313:             Sign Up
314:           </button>
315:         </p>
316:         <p className={classes.switchText} style={{ marginTop: "0.5rem" }}>
317:           <button
318:             type="button"
319:             className={classes.linkBtn}
320:             onClick={() => setView("home")}
321:           >
322:             Back to Home
323:           </button>
324:         </p>
325:       </Card>
326:     );
327:   }
328: 
329:   // --- ALAPÉRTELMEZETT (HOME) NÉZET ---
330:   return (
331:     <Card className={classes.auth}>
332:       <h1>Welcome to BLZ Transfer</h1>
333:       <p>Secure file sharing with integrated virus scanning.</p>
334: 
335:       <div className={classes.actions}>
336:         <Button className={classes.guestBtn} onClick={props.onContinueAsGuest}>
337:           Continue as Guest
338:         </Button>
339: 
340:         <Button className={classes.loginBtn} onClick={() => setView("login")}>
341:           Login to Account
342:         </Button>
343:       </div>
344:     </Card>
345:   );
346: };
347: 
348: export default AuthHome;
````

## File: app/frontend/src/components/Auth/AuthHome/AuthHome.module.css
````css
  1: .auth {
  2:   text-align: center;
  3:   max-width: 450px;
  4:   margin: 0 auto;
  5: }
  6: 
  7: .auth h1 {
  8:   color: #111827;
  9:   margin-bottom: 0.5rem;
 10: }
 11: 
 12: .auth p {
 13:   color: #6b7280;
 14:   margin-bottom: 2rem;
 15: }
 16: 
 17: .actions {
 18:   display: flex;
 19:   flex-direction: column;
 20:   gap: 1rem;
 21: }
 22: 
 23: .guestBtn {
 24:   background: transparent;
 25:   color: #1f2937;
 26: }
 27: 
 28: .guestBtn:hover {
 29:   background: #f3f4f6;
 30:   color: #1f2937;
 31: }
 32: 
 33: .loginBtn {
 34:   width: 100%;
 35: }
 36: 
 37: /* --- ÚJ ŰRLAP STÍLUSOK --- */
 38: .form {
 39:   display: flex;
 40:   flex-direction: column;
 41:   gap: 1rem;
 42:   text-align: left;
 43: }
 44: 
 45: .inputGroup {
 46:   display: flex;
 47:   flex-direction: column;
 48:   gap: 0.3rem;
 49: }
 50: 
 51: .inputGroup label {
 52:   font-size: 0.875rem;
 53:   font-weight: 500;
 54:   color: #374151;
 55: }
 56: 
 57: .input {
 58:   padding: 0.5rem;
 59:   border: 1px solid #d1d5db;
 60:   border-radius: 6px;
 61:   font-size: 1rem;
 62: }
 63: 
 64: .input:focus {
 65:   outline: none;
 66:   border-color: #3b82f6;
 67:   box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
 68: }
 69: 
 70: .error {
 71:   color: #ef4444;
 72:   font-size: 0.875rem;
 73:   margin-bottom: 1rem;
 74:   font-weight: 500;
 75:   text-align: center;
 76: }
 77: 
 78: .success {
 79:   color: #10b981;
 80:   font-size: 0.875rem;
 81:   margin-bottom: 1rem;
 82:   font-weight: 500;
 83:   text-align: center;
 84: }
 85: 
 86: .switchText {
 87:   font-size: 0.875rem;
 88:   color: #6b7280;
 89:   margin-top: 1.5rem;
 90:   text-align: center;
 91: }
 92: 
 93: .linkBtn {
 94:   background: none;
 95:   border: none;
 96:   color: #3b82f6;
 97:   font-weight: 600;
 98:   cursor: pointer;
 99:   padding: 0;
100:   margin-left: 0.3rem;
101: }
102: 
103: .linkBtn:hover {
104:   text-decoration: underline;
105: }
````

## File: app/frontend/src/components/Upload/FilePicker/FilePicker.jsx
````javascript
 1: import React, { useRef } from 'react';
 2: import Dropzone from '../../UI/Dropzone/Dropzone';
 3: import ProgressBar from '../../UI/Feedback/ProgressBar/ProgressBar'; 
 4: import classes from './FilePicker.module.css';
 5: 
 6: const FilePicker = ({ 
 7:   onFileSelect, 
 8:   isUploading, 
 9:   progress, 
10:   statusText, 
11:   currentStatus 
12: }) => {
13:   const fileInputRef = useRef();
14: 
15:   const selectFileHandler = () => {
16:     // Ha épp töltünk fel, ne lehessen rákattintani újra
17:     if (!isUploading) {
18:       fileInputRef.current.click();
19:     }
20:   };
21: 
22:   return (
23:     <div className={classes.container}>
24:       <input 
25:         type="file" 
26:         ref={fileInputRef} 
27:         style={{ display: 'none' }} 
28:         onChange={(e) => onFileSelect(e.target.files[0])}
29:         disabled={isUploading} // Letiltjuk a bevitelt feltöltés közben
30:       />
31:       
32:       <Dropzone 
33:         onFilesDropped={isUploading ? () => {} : onFileSelect} 
34:         onClick={selectFileHandler}
35:       >
36:         <p>Drag & Drop your file here</p>
37:         <span>or click to browse</span>
38:       </Dropzone>
39: 
40:       {/* A folyamatjelző csík csak akkor jelenik meg, ha elindult a feltöltés */}
41:       {(isUploading || progress > 0) && (
42:         <ProgressBar 
43:           progress={progress} 
44:           text={statusText} 
45:           currentStatus={currentStatus} 
46:         />
47:       )}
48:     </div>
49:   );
50: };
51: 
52: export default FilePicker;
````

## File: app/frontend/src/main.jsx
````javascript
 1: import React from "react";
 2: import ReactDOM from "react-dom/client";
 3: import App from "./App.jsx";
 4: import "./index.css";
 5: 
 6: import { Amplify } from "aws-amplify";
 7: import { awsConfig } from './config/aws-config.js';
 8: 
 9: Amplify.configure(awsConfig);
10: 
11: 
12: ReactDOM.createRoot(document.getElementById("root")).render(
13:   <React.StrictMode>
14:     <App />
15:   </React.StrictMode>,
16: );
````

## File: app/backend/src/Blz.GetPresignedUrl/Function.cs
````csharp
  1: using System;
  2: using System.Collections.Generic;
  3: using System.Threading.Tasks;
  4: using Amazon.Lambda.Core;
  5: using Amazon.S3;
  6: using Amazon.S3.Model;
  7: using Amazon.DynamoDBv2;
  8: using Amazon.DynamoDBv2.Model;
  9: using System.Text.Json.Serialization; // EZ ÚJ!
 10: 
 11: [assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]
 12: 
 13: namespace Blz.GetPresignedUrl;
 14: 
 15: public class Function
 16: {
 17:     private readonly IAmazonS3 _s3Client;
 18:     private readonly IAmazonDynamoDB _dynamoDbClient;
 19:     private readonly string _bucketName = "blz-quarantine-bucket-w1srf8"; 
 20:     private readonly string _tableName = "blz-files-table"; 
 21: 
 22:     public Function()
 23:     {
 24:         _s3Client = new AmazonS3Client();
 25:         _dynamoDbClient = new AmazonDynamoDBClient(); 
 26:     }
 27: 
 28:     public async Task<UploadResponse> FunctionHandler(UploadRequest request, ILambdaContext context)
 29:     {
 30:         try
 31:         {
 32:             if (string.IsNullOrEmpty(request.FileName))
 33:             {
 34:                 throw new Exception("FileName is missing from the request.");
 35:             }
 36: 
 37:             // Ha a frontend nem küld UserId-t, alapértelmezetten "guest" lesz
 38:             var userId = string.IsNullOrEmpty(request.UserId) ? "guest" : request.UserId;
 39:             var uniqueFileName = $"{userId}/{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{request.FileName}";
 40:             
 41:             // 1. Pre-signed URL generálása
 42:             var urlRequest = new GetPreSignedUrlRequest
 43:             {
 44:                 BucketName = _bucketName,
 45:                 Key = uniqueFileName,
 46:                 Verb = HttpVerb.PUT,
 47:                 Expires = DateTime.UtcNow.AddMinutes(5) 
 48:             };
 49: 
 50:             string presignedUrl = _s3Client.GetPreSignedURL(urlRequest);
 51:             context.Logger.LogInformation($"Successfully generated pre-signed URL for: {uniqueFileName}");
 52: 
 53:             // 2. Bejegyzés írása a DynamoDB-be
 54:             var item = new Dictionary<string, AttributeValue>
 55:             {
 56:                 { "userId", new AttributeValue { S = userId } },                   
 57:                 { "fileName", new AttributeValue { S = uniqueFileName } },         
 58:                 { "originalName", new AttributeValue { S = request.FileName } },   
 59:                 { "fileSize", new AttributeValue { N = request.FileSize.ToString() } }, 
 60:                 { "uploadDate", new AttributeValue { S = DateTime.UtcNow.ToString("o") } }, 
 61:                 { "status", new AttributeValue { S = "Scanning" } }                
 62:             };
 63: 
 64:             var putRequest = new PutItemRequest
 65:             {
 66:                 TableName = _tableName,
 67:                 Item = item
 68:             };
 69: 
 70:             await _dynamoDbClient.PutItemAsync(putRequest);
 71:             context.Logger.LogInformation($"Successfully written to DynamoDB: {uniqueFileName} for user {userId}");
 72: 
 73:             // 3. Válasz visszaküldése a Reactnak
 74:             return new UploadResponse
 75:             {
 76:                 Message = "Success",
 77:                 FileName = uniqueFileName,
 78:                 UploadUrl = presignedUrl
 79:             };
 80:         }
 81:         catch (Exception ex)
 82:         {
 83:             context.Logger.LogError($"Error: {ex.Message}");
 84:             throw; 
 85:         }
 86:     }
 87: }
 88: 
 89: public class UploadRequest
 90: {
 91:     [JsonPropertyName("fileName")]
 92:     public string? FileName { get; set; }
 93:     
 94:     [JsonPropertyName("fileSize")]
 95:     public long FileSize { get; set; }
 96:     
 97:     [JsonPropertyName("userId")]
 98:     public string? UserId { get; set; } 
 99: }
100: 
101: public class UploadResponse
102: {
103:     [JsonPropertyName("message")]
104:     public string? Message { get; set; }
105:     
106:     [JsonPropertyName("fileName")]
107:     public string? FileName { get; set; }
108:     
109:     [JsonPropertyName("uploadUrl")]
110:     public string? UploadUrl { get; set; }
111: }
````

## File: app/frontend/package.json
````json
 1: {
 2:   "name": "frontend",
 3:   "private": true,
 4:   "version": "0.0.0",
 5:   "type": "module",
 6:   "scripts": {
 7:     "dev": "vite",
 8:     "build": "vite build",
 9:     "lint": "eslint .",
10:     "preview": "vite preview"
11:   },
12:   "dependencies": {
13:     "aws-amplify": "^6.16.3",
14:     "axios": "^1.13.6",
15:     "react": "^19.2.0",
16:     "react-dom": "^19.2.0",
17:     "react-icons": "^5.6.0"
18:   },
19:   "devDependencies": {
20:     "@eslint/js": "^9.39.1",
21:     "@types/react": "^19.2.7",
22:     "@types/react-dom": "^19.2.3",
23:     "@vitejs/plugin-react": "^5.1.1",
24:     "eslint": "^9.39.3",
25:     "eslint-plugin-react-hooks": "^7.0.1",
26:     "eslint-plugin-react-refresh": "^0.4.24",
27:     "globals": "^16.5.0",
28:     "vite": "^7.3.1"
29:   }
30: }
````

## File: weekly-work/week-06/weekly-work-6.txt
````
 1: -Step function fertőzőtt ágán a lambdát frísítettem, hogy a dynamodb-ben átírja a fertőzőtt fájlállapotát, infected-re.
 2: -Windows defenderbeállítása, hogy a megfelelő mappát ne vizsgálja ezáltal könnyen tudok tesztelni az vírusos (EICAR) fájllal.
 3: -Progress bar elkészítése a fájl feltöltéshez ehhez a következő fájlokat módosítottam:
 4:         -app\frontend\src\components\Upload\FilePicker => FilePicker.jsx
 5:         -app\frontend\src\components\UI\Feedback\ProgressBar => ProgressBar.jsx
 6:         -app\frontend\src\api => fileApi.js
 7:         -app\frontend\src => App.jsx
 8:         -létrehoztam a CheckFileStatus lambát, app\backend\src\BLZ.CheckFileStatus => Function.cs
 9: -file-mover lambda javítása, hogy az ékezetes és space karakterrel rendelkező nevű fájlokat is elfogadja a rendszer
10: -felhasználói autentikáció és a személyre szabott feájlkezelés implelementálása:
11:         -AWS cognitoban létrehoztam egy user poolt
12:         -integráltam a aws-ampify könyvtárat és létrehoztam a src/config/aws-config.js konfigurációs fájlt
13:         -App.jsx-ben bevezettem a currentUsername állapotot, amely alapértelmezetten "guest", de sikeres bejelentkezés után felveszi a felhasználó egyedi azonosítóját.
14:         -AuthHome komponens fejlesztése: Megírtam a regisztrációs (Sign Up), email-visszaigazoló (OTP) és bejelentkezési (Login) logikát egy belső állapotgép segítségével.     
15:         -Frissítettem a Blz.GetPresignedUrl Lambdát.
16:         -Bevezettem a dinamikus mappakezelést: a fájlok az S3-ban és a DynamoDB-ben már nem fixen a "guest", hanem a bejelentkezett felhasználó saját neve alatti mappába kerülnek.
17:         -Beállítottam a Mapping Template-et $input.json('$') (Passthrough) módra, hogy az adatok módosítás nélkül jussanak el a Lambdához.
18:         -Kikapcsoltam a Request Validator-t és a Request Body Model-t, hogy az API ne utasítsa el az új userId mezőt tartalmazó kéréseket.
19:         -Konfiguráltam a Gateway Responses (Default 4XX/5XX) hibaágakat a CORS fejlécekkel, így a hálózati hibák nem maszkolják el a valódi API válaszokat.
20: -Rekognition bevezetése:
21:         -blz-file-classifier lambda létrehozása, amely segít felcímkézni az egyes fájloakt, IMAGE, DOCUMENT, OTHER
22:         -blz-rekognition-analyzer: ez a képelemező logika a DetectLabelsCommand metódust használja, kinyeri a top 5 legalább 75%-os pontosságú címkét a képből, és frissíti a dynamoDB aiLabels attribútumát
23:         -kibővítettem a stepfunctionst
````

## File: app/frontend/src/App.jsx
````javascript
  1: import "./App.css";
  2: import AuthHome from "./components/Auth/AuthHome/AuthHome";
  3: import FilePicker from "./components/Upload/FilePicker/FilePicker";
  4: import Button from "./components/UI/Buttons/Button";
  5: import { useState } from "react";
  6: import { checkFileStatus } from "./api/fileApi";
  7: 
  8: function App() {
  9:   const [isAuthorized, setIsAuthorized] = useState(false);
 10:   const [userType, setUserType] = useState(null);
 11:   const [selectedFile, setSelectedFile] = useState(null);
 12: 
 13:   // Itt tároljuk a bejelentkezett felhasználó nevét!
 14:   const [currentUsername, setCurrentUsername] = useState("guest");
 15: 
 16:   const [isUploading, setIsUploading] = useState(false);
 17:   const [progress, setProgress] = useState(0);
 18:   const [statusText, setStatusText] = useState("");
 19:   const [currentStatus, setCurrentStatus] = useState("Idle");
 20: 
 21:   const loginHandler = (username) => {
 22:     setUserType("user");
 23:     setCurrentUsername(username); // Eltesszük a nevet a memóriába
 24:     setIsAuthorized(true);
 25:   };
 26: 
 27:   const guestHandler = () => {
 28:     setUserType("guest");
 29:     setCurrentUsername("guest");
 30:     setIsAuthorized(true);
 31:   };
 32: 
 33:   const fileSelectHandler = (file) => {
 34:     setSelectedFile(file);
 35:     setProgress(0);
 36:     setStatusText("");
 37:     setCurrentStatus("Idle");
 38:   };
 39: 
 40:   const uploadHandler = async (file) => {
 41:     setIsUploading(true);
 42:     setProgress(10);
 43:     setCurrentStatus("Uploading");
 44:     setStatusText("Preparing upload...");
 45: 
 46:     const API_ENDPOINT =
 47:       "https://h4g8mvrgwd.execute-api.us-east-1.amazonaws.com/dev/get-upload-link";
 48: 
 49:     try {
 50:       const apiResponse = await fetch(API_ENDPOINT, {
 51:         method: "POST",
 52:         body: JSON.stringify({
 53:           fileName: file.name,
 54:           fileSize: file.size,
 55:           UserId: currentUsername, 
 56:           userId: currentUsername, 
 57:         }),
 58:         headers: { "Content-Type": "application/json" },
 59:       });
 60: 
 61:       if (!apiResponse.ok) throw new Error("Failed to get URL from API.");
 62: 
 63:       const apiData = await apiResponse.json();
 64:       const uploadUrl = apiData.uploadUrl || apiData.UploadUrl;
 65:       const generatedFileName = apiData.fileName || apiData.FileName;
 66: 
 67:       setProgress(30);
 68:       setStatusText("Uploading to AWS S3...");
 69: 
 70:       const s3Response = await fetch(uploadUrl, {
 71:         method: "PUT",
 72:         body: file,
 73:         headers: { "Content-Type": file.type || "application/octet-stream" },
 74:       });
 75: 
 76:       if (!s3Response.ok) throw new Error("S3 upload failed.");
 77: 
 78:       setProgress(50);
 79:       setStatusText("Virus scan in progress... 🛡️");
 80:       setCurrentStatus("Scanning");
 81: 
 82:       let pollingStatus = "Scanning";
 83:       let fakeProgress = 50;
 84: 
 85:       // =====================================
 86:       // POLLING: A vírusvizsgálat lekérdezése
 87:       // =====================================
 88:       while (pollingStatus === "Scanning" || pollingStatus === "NotFound") {
 89:         await new Promise((resolve) => setTimeout(resolve, 2000));
 90: 
 91:         // Itt most már garantáltan a helyes névvel (currentUsername) kérdezünk rá!
 92:         pollingStatus = await checkFileStatus(
 93:           generatedFileName,
 94:           currentUsername,
 95:         );
 96: 
 97:         if (pollingStatus === "Scanning" && fakeProgress < 90) {
 98:           fakeProgress += 5;
 99:           setProgress(fakeProgress);
100:         }
101:       }
102: 
103:       setCurrentStatus(pollingStatus);
104:       setProgress(100);
105: 
106:       if (pollingStatus === "Clean") {
107:         setStatusText("Upload successful! File is clean. ✅");
108:         setSelectedFile(null);
109:       } else if (pollingStatus === "Infected") {
110:         setStatusText("Upload aborted! Virus detected! ❌☣️");
111:       } else {
112:         setStatusText("An error occurred during scanning.");
113:         setCurrentStatus("Error");
114:       }
115:     } catch (error) {
116:       console.error("Upload error:", error);
117:       setStatusText(`Error: ${error.message}`);
118:       setCurrentStatus("Error");
119:       setProgress(0);
120:     } finally {
121:       setIsUploading(false);
122:     }
123:   };
124: 
125:   return (
126:     <main>
127:       {!isAuthorized && (
128:         <AuthHome onLogin={loginHandler} onContinueAsGuest={guestHandler} />
129:       )}
130: 
131:       {isAuthorized && (
132:         <div
133:           style={{ textAlign: "center", marginTop: "2rem", color: "#111827" }}
134:         >
135:           <h2>
136:             {userType === "guest"
137:               ? "Guest File Transfer"
138:               : "Secure User Dashboard"}
139:           </h2>
140: 
141:           <FilePicker
142:             onFileSelect={fileSelectHandler}
143:             isUploading={isUploading}
144:             progress={progress}
145:             statusText={statusText}
146:             currentStatus={currentStatus}
147:           />
148: 
149:           {selectedFile && !isUploading && progress === 0 && (
150:             <div style={{ marginTop: "1rem" }}>
151:               <p
152:                 style={{
153:                   color: "#059669",
154:                   fontWeight: "bold",
155:                   marginBottom: "1rem",
156:                 }}
157:               >
158:                 Ready to scan: {selectedFile.name}
159:               </p>
160:               <Button onClick={() => uploadHandler(selectedFile)}>
161:                 Start Upload & Scan
162:               </Button>
163:             </div>
164:           )}
165:         </div>
166:       )}
167:     </main>
168:   );
169: }
170: 
171: export default App;
````
