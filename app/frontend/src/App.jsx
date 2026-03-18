// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import S3CorsTest from "./components/dev-tests/S3CorsTest";
import GuestUpload from "./components/GuestUpload";
import AuthHome from "./components/Auth/AuthHome/AuthHome";
import FilePicker from "./components/Upload/FilePicker/FilePicker";
import Button from "./components/UI/Buttons/Button";

import { useState } from "react";

function App() {
  // Két állapot (state) kell:
  // 1. isAuthorized: eldönti, hogy túljutott-e a kezdőképernyőn
  // 2. userType: megjegyzi, hogy 'guest' (vendég) vagy 'user' (regisztrált)ként van-e bent
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userType, setUserType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const loginHandler = () => {
    setUserType("user");
    setIsAuthorized(true);
  };

  const guestHandler = () => {
    setUserType("guest");
    setIsAuthorized(true);
  };

  const fileSelectHandler = (file) => {
    setSelectedFile(file);
    console.log("File selected in App:", file.name);
  };

  const uploadHandler = async (file) => {
    console.log("Starting upload process for:", file.name);

    const API_ENDPOINT =
      "https://h4g8mvrgwd.execute-api.us-east-1.amazonaws.com/dev/get-upload-link";

    try {
      console.log("1. Requesting Pre-signed URL from API...");
      const apiResponse = await fetch(API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(
          `Failed to get URL from API. Status: ${apiResponse.status}. Details: ${errorText}`,
        );
      }

      const apiData = await apiResponse.json();

      const uploadUrl = apiData.uploadUrl || apiData.UploadUrl;
      const generatedFileName = apiData.fileName || apiData.FileName;

      if (!uploadUrl) {
        throw new Error("API response did not contain an UploadUrl.");
      }

      console.log(`2. Pre-signed URL received for: ${generatedFileName}`);
      console.log("3. Starting direct S3 upload...");

      const s3Response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      if (s3Response.ok) {
        console.log("SUCCESS! File uploaded to S3 Quarantine bucket.");
        alert(
          "File successfully uploaded! The virus scan will start automatically.",
        );
        setSelectedFile(null);
      } else {
        const s3ErrorText = await s3Response.text();
        throw new Error(
          `S3 upload failed with status ${s3Response.status}. Details: ${s3ErrorText}`,
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    }
  };

  return (
    <main>
      {/* 1. ESET: Ha még nem választott, mutatjuk az AuthHome képernyőt */}
      {!isAuthorized && (
        <AuthHome onLogin={loginHandler} onContinueAsGuest={guestHandler} />
      )}

      {/* 2. ESET: Ha választott, mutatjuk a Dashboard-ot */}
      {isAuthorized && (
        <div
          style={{ textAlign: "center", marginTop: "2rem", color: "#111827" }}
        >
          <h2>
            {userType === "guest"
              ? "Guest File Transfer"
              : "Secure User Dashboard"}
          </h2>

          <FilePicker
            onFileSelect={fileSelectHandler}
            onUpload={uploadHandler}
          />

          {/* Kis extra: ha van kiválasztott fájl, jelezzük a státuszt */}
          {/* Kis extra: ha van kiválasztott fájl, jelezzük a státuszt ÉS a gombot */}
          {selectedFile && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ color: '#059669', fontWeight: 'bold', marginBottom: '1rem' }}>
                Ready to scan: {selectedFile.name}
              </p>
              
              {/* EZ A GOMB HIÁNYZOTT! */}
              <Button onClick={() => uploadHandler(selectedFile)}>
                Start Upload & Scan
              </Button>
            </div>
          )}
        </div>
      )}
    </main>
  );

  // Feltöltő négyzet tesztelő
  // return (
  //   <div className="App">
  //     <header style={{ marginBottom: '20px' }}>
  //       <h1>BLZTransfer v1.0</h1>
  //     </header>
  //     <main>

  //       <GuestUpload />
  //     </main>
  //   </div>
  // )

  // Feltöltés teszt
  // const [count, setCount] = useState(0);

  // return (
  //   <>
  //     {
  //       <div>
  //         <h1>BLZTransfer Frontend</h1>
  //         <S3CorsTest />
  //       </div>
  //     }

  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // );
}

export default App;
