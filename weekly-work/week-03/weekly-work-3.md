# BLZTransfer - AWS Felhős Architektúra és Frontend Integráció


## 1. Az adattárolás előkészítése (Amazon S3)
A rendszer alapját a fájlok tárolása adja. Ehhez két különálló S3 vödröt (bucket) hoztam létre:

* **Frontend vödör (`blz-frontend-bucket-w1srf8`):** Ennek a feladata a lefordított React weboldal kiszolgálása.
    * Bekapcsoltam a *Static website hosting* funkciót, az index dokumentumot `index.html`-re állítva.
    * Kikapcsoltam a *Block all public access* opciót.
    * Írtam egy publikus olvasást engedélyező *Bucket Policy*-t, így a világon bárki elérheti az oldalt böngészőből.
* **Karantén vödör (`blz-quarantine-bucket-w1srf8`):** Ide érkeznek be a felhasználók által feltöltött fájlok.
    * Mivel ez a vödör más domainen van, mint a weboldalam, be kellett állítanom a *CORS (Cross-Origin Resource Sharing)* szabályokat.
    * Engedélyeztem a `PUT`, `POST`, `GET` metódusokat a lokális fejlesztői szerverem (`http://localhost:5173`) és a publikus frontend vödröm URL-je számára.
    * Hozzáadtam a `"MaxAgeSeconds": 3000` paramétert a hálózati kérések optimalizálása (Preflight caching) érdekében.

## 2. A szerveroldali logika (AWS Lambda)
A fájlok biztonságos feltöltéséhez nem adhatok közvetlen írási jogot a publikus weblapnak. Ehelyett egy *Presigned URL* (ideiglenes, lejáró engedély) stratégiát alkalmaztam.

* Létrehoztam egy új Lambda függvényt `blz-get-presigned-url` néven.
* **Futtatókörnyezet:** Node.js 24.x (a legfrissebb LTS verzió).
* **Jogosultság (IAM Role):** Mivel a Learner Lab környezetben saját IAM Role létrehozása korlátozott, az egyetemi fiókhoz biztosított, beépített `LabRole`-t használtam, ami megfelelő jogokkal rendelkezik az S3 és a CloudWatch logok eléréséhez.
* **Kód:** A beépített AWS SDK (v3) segítségével írtam egy rövid scriptet. A kód a bejövő kérés alapján generál egy 5 percig (300 másodperc) érvényes `PutObject` parancsot a Karantén vödrömhöz, és ezt az URL-t küldi vissza JSON formátumban. A válaszfejlécbe (Headers) a CORS engedélyeket is beleégettem.

## 3. A Backend publikálása (Amazon API Gateway)
A Lambda függvény önmagában nem elérhető a böngészők számára, ezért egy API végpontot kellett elé tennem.

* A Lambda függvényhez hozzáadtam egy *API Gateway* triggert.
* Típusként a modern, gyors és költséghatékony **HTTP API**-t választottam.
* A biztonságot "Open"-re hagytam (hiszen maga az S3 link eleve védett és lejár).
* Az integráció során bekapcsoltam a beépített *CORS* támogatást, így a React alkalmazásom hálózati (fetch) kéréseit nem blokkolja a böngésző.

## 4. A Frontend élesítése (Deploy)
Miután a lokális gépemen (Vite + React környezetben) sikeresen megírtam és teszteltem az `S3CorsTest.jsx` komponenst, a kódot ki kellett juttatnom az AWS-be.

1.  A fejlesztői szervert leállítva lefuttattam az `npm run build` parancsot, amely elkészítette az optimalizált `dist` mappát.
2.  A mappa tartalmát (az `assets` almappát, az `index.html`-t és a logókat) feltöltöttem a `blz-frontend-bucket-w1srf8` S3 vödörbe.

## 5. Rendszer Integrációs Teszt (End-to-End)
Az utolsó lépés a teljes, felhőben futó architektúra tesztelése volt.

1.  Megnyitottam a frontend vödör publikus URL-jét.
2.  A weboldalon elindítottam az integrációs tesztet.
3.  **A folyamat a háttérben:** * A böngésző kérést küldött az API Gateway-nek.
    * Az API Gateway elindította a Lambdát.
    * A Lambda visszaküldte a 300 másodpercig érvényes S3 URL-t.v
    * A frontend React kódja ezt a linket felhasználva egy `PUT` kéréssel közvetlenül feltöltötte a `final-test.txt` nevű fájlt.
4.  **Eredmény:** A böngésző konzoljában és az oldalon is megjelent a *200 OK* státuszkód. Az AWS Konzolon ellenőrizve a Karantén vödör tartalmát, a fájl sikeresen, hibátlanul megérkezett a felhőbe.

Ezzel a projekt infrastruktúrájának alapvető, legkritikusabb fájlmozgatási ciklusa sikeresen kiépült!