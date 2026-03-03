# Rendszerkövetelmények: Intelligens Serverless Fájlmegosztó Platform

## 1. Felhasználói Szerepkörök (User Roles)
A rendszer a jogosultságokat és kvótákat alkalmazásszinten (API kulcs vagy token alapján) különbözteti meg, mivel külső identitásszolgáltató (Cognito) nem áll rendelkezésre.

* **Feltöltő Kliens (Uploader):**
  * **Vendég (Guest) felhasználó:** Alapértelmezett, kisebb fájlméret-korláttal (pl. max. 50 MB) és rövidebb fájl-élettartammal rendelkezik a rendszerben. Hitelesítés nélkül használhatja az alapfunkciókat.
  * **Regisztrált/Prémium felhasználó:** Érvényes azonosító (token/jelszó) megadása esetén nagyobb fájlméret-korláttal (pl. max. 500 MB) tölthet fel fájlokat.
* **Letöltő Kliens (Downloader):** A kapott hivatkozás vagy QR kód segítségével fér hozzá a rendszerhez. A letöltés sikeressége a fájlhoz rendelt egyedi token érvényességétől és a fennmaradó letöltési limittől függ.

## 2. Funkcionális Követelmények (Functional Requirements)
Ezek a követelmények írják le, hogy a rendszernek milyen konkrét funkciókat kell végrehajtania a felhasználó és a háttérfolyamatok szempontjából.

* **FR-01: Közvetlen fájlfeltöltés (Direct Upload):** A rendszernek biztosítania kell, hogy a felhasználó a kliensalkalmazásból közvetlenül a felhős tárhelyre (S3 Quarantine Bucket) tölthesse fel a fájlokat, anélkül, hogy a fájladatfolyam áthaladna a számítási rétegen (Lambda). Ezt Presigned URL-ek generálásával kell megoldani.
* **FR-02: Feltöltési kvóták és méretkorlátok ellenőrzése:** A rendszernek (az Upload API végponton keresztül) a feltöltés megkezdése előtt validálnia kell a kliens által bejelentett fájlméretet a felhasználói jogosultsági szint (Vendég vagy Regisztrált) alapján.
* **FR-03: S3 szintű méretvédelem (Enforcement):** A szerver által generált feltöltési linkekbe (Presigned URL) szigorúan bele kell kódolni a maximális fájlméret korlátját (`content-length-range`), ezzel megakadályozva a rosszindulatú, túlméretes adatszemét közvetlen S3-ba juttatását.
* **FR-04: Automatikus eseményindítás:** Egy új fájl feltöltése a karantén tárhelyre automatikusan (emberi beavatkozás nélkül) indítsa el a feldolgozó munkafolyamatot (S3 Event Notification).
* **FR-05: Vírusellenőrzés:** A rendszernek minden beérkező fájlt át kell vizsgálnia egy ClamAV motorral ellátott Lambda konténer segítségével. A fertőzött fájlokat a folyamatnak meg kell semmisítenie.
* **FR-06: Intelligens metaadat-kinyerés:** A rendszernek képesnek kell lennie a feltöltött képekből gépi látással (Amazon Rekognition), illetve a dokumentumokból/PDF-ekből szövegelemzéssel (Amazon Textract) automatikusan metaadatokat kinyerni.
* **FR-07: Fájl áthelyezése és adatrögzítés:** A sikeresen validált és elemzett fájlokat a rendszernek át kell mozgatnia a publikus (Clean) tárhelyre, a metaadatokat pedig egy NoSQL adatbázisban (DynamoDB) kell rögzítenie.
* **FR-08: Letöltési korlátok kezelése:** A rendszernek biztosítania kell a fájlok letöltésének korlátozását (pl. maximum letöltés/fájl). Ennek ellenőrzése és csökkentése atomi tranzakcióval (Conditional Update) kell történjen a versenyhelyzetek (Race Condition) elkerülése végett.
* **FR-09: Biztonságos letöltés:** Érvényes azonosító és megfelelő letöltési limit esetén a rendszer generáljon egy időkorlátos letöltési linket (GET Presigned URL) a felhasználó számára.
* **FR-10: Kliensoldali QR kód:** A rendszer kliensoldalon (React) vizuálisan jelenítse meg a generált megosztási linket, és automatikusan generáljon hozzá egy letölthető QR kódot.

## 3. Nem Funkcionális Követelmények (Non-functional Requirements)
Ezek a rendszer minőségi jellemzőit, teljesítményét és biztonságát határozzák meg.

* **NFR-01: Skálázhatóság (Scalability):** A rendszernek automatikusan alkalmazkodnia kell a terheléshez. Mivel 100%-ban Serverless architektúrára épül, hirtelen forgalomnövekedés esetén (pl. 100 egyidejű feltöltés) is stabilan kell működnie.
* **NFR-02: Költséghatékonyság (Pay-as-you-go):** A rendszer üresjáratban (amikor nincs fel- vagy letöltés) nem generálhat számítási költségeket. Csak az események lefutásakor történhet erőforrás-használat.
* **NFR-03: Adatbiztonság:** A fájlok a feldolgozás során izolált karantén tárhelyen (Quarantine Bucket) kell, hogy legyenek. A végleges fájlokhoz való hozzáférés csak ideiglenes (lejárattal rendelkező) linkeken keresztül történhet.
* **NFR-04: Rendelkezésre állás (Availability):** Az infrastruktúrának a felhőszolgáltató (AWS) beépített magas rendelkezésre állási (High Availability) mutatóira kell épülnie.
* **NFR-05: Szeparált felelősségi körök:** A fájlmozgatás (nehéz adatfolyam) és a jogosultság-ellenőrzés (vékony számítási logika) architekturálisan szét kell legyen választva.

## 4. Technikai és Környezeti Követelmények (Technical Requirements)
Ezek a megvalósításhoz használt eszközöket és a külső korlátozásokat írják le.

* **TR-01: Fejlesztési környezet:** A backend architektúrát az Amazon Web Services (AWS) felhőkörnyezetben kell megvalósítani.
* **TR-02: Kliensalkalmazás:** A frontend egy böngészőben futó, React és Vite alapú Single Page Application (SPA) kell, hogy legyen.
* **TR-03: IAM Korlátozások (Learner Lab):** A rendszernek teljes mértékben alkalmazkodnia kell az AWS Learner Lab oktatási korlátaihoz. Új IAM Role-ok létrehozása nélkül, kizárólag a kötelező `LabRole` használatával kell megoldani a szolgáltatások közötti kommunikációt (Lambda, Step Functions).
* **TR-04: Autentikáció alternatívája:** AWS Cognito hiányában az azonosítást és a jogosultságkezelést (Autorizációt) az adatbázisban tárolt UUID tokenekkel és egyedi API paraméterekkel kell alkalmazásszinten megoldani.
* **TR-05: Manuális infrastruktúra kiépítés:** A felhő erőforrások (S3, DynamoDB, Lambda, API Gateway) létrehozása és paraméterezése vizuálisan, az AWS Management Console felületén történik (nem IaC kódolással). Az állapotgépet az AWS Step Functions Workflow Studio-jával kell megtervezni.