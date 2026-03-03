# Projekt Dokumentáció: Intelligens Serverless Fájlmegosztó Platform
**Hallgató:** Sándor Balázs (W1SRF8)
**Konzulens:** Pelle István

## 1. Rendszertervezés és Architektúra (3. hét)

Ebben a fázisban a rendszer alapvető logikai felépítését és a felhő-natív tervezési mintákat határoztam meg. A cél egy skálázható, költséghatékony és eseményvezérelt backend kialakítása.

### 1.1. Alkalmazott tervezési minták (Design Patterns)

A fejlesztés során az alábbi mintákat alkalmazom, hogy a rendszer megfeleljen a modern felhő-alapú elvárásoknak:

* **Facade (Homlokzat) minta:** Az **Amazon API Gateway** segítségével egy egységes belépési pontot hozok létre. Ez elrejti a kliens elől a háttérben futó számos mikroszolgáltatást (Lambda függvényeket), így a frontendnek csak egyetlen végpontot kell ismernie.
* **Event-driven (Eseményvezérelt) minta:** A rendszer nem folyamatosan fut, hanem eseményekre reagál. Amint egy fájl bekerül az S3 vödörbe (**S3 ObjectCreated**), az automatikusan elindítja a feldolgozási láncot. Ezzel minimalizálható az üresjárati költség.
* **Pipes and Filters (Csövek és szűrők) minta:** Az **AWS Step Functions** állapotgép valósítja meg. A fájl feldolgozása diszkrét lépéseken (szűrőkön) halad keresztül:
    1.  `VirusScanFilter`: ClamAV ellenőrzés.
    2.  `AIAnalysisFilter`: Amazon Rekognition/Textract elemzés.
    3.  `FinalizeMetadataFilter`: Adatbázisba mentés és fájl áthelyezése.
* **Valet Key minta:** A nagy méretű fájlok feltöltéséhez **S3 Presigned URL**-t használok. A backend generál egy ideiglenes, biztonságos "kulcsot" (URL-t), amivel a kliens közvetlenül az S3-ba tölthet. Így a Lambda függvényeknek nem kell a fájlátvitel sávszélességével foglalkozniuk, ami gyorsabb és olcsóbb működést eredményez.

### 1.2. Alapinfrastruktúra és Adattárolás (Storage Layer)

A 3. héten manuálisan létrehoztam az AWS konzolon a rendszer gerincét alkotó tárolóegységeket.

#### Amazon S3 Bucket-ek (Vödrök)
Az S3 vödrök az objektum alapú tárolást biztosítják. Az alábbi három vödröt különítettem el a biztonság és a logikai szétválasztás érdekében:
* `blz-frontend-w1srf8`: Itt foglal helyet a React webalkalmazás (Static Website Hosting).
* `blz-quarantine-w1srf8`: Ide kerülnek a frissen feltöltött fájlok. Ebben a fázisban a fájlok még nem publikusak és "veszélyesnek" minősülnek, amíg a vírusirtó le nem fut.
* `blz-clean-w1srf8`: A sikeresen ellenőrzött, tiszta fájlok végleges tárolója.

#### Amazon DynamoDB Tábla
A fájlokhoz tartozó strukturált adatokat (metaadatokat) NoSQL táblában tárolom.
* **Tábla neve:** `FileMetadata`
* **Partition Key:** `fileId` (String) - Egyedi azonosító minden fájlhoz.
* **Döntés indoklása:** Az **On-demand** kapacitást választottam, mert a projekt elején a forgalom kiszámíthatatlan, és ez a modell biztosítja, hogy csak a tényleges lekérdezések után fizessünk.

#### 1.2.1. S3 Tárolóegységek implementációja
Létrehoztam a rendszer működéséhez szükséges három alapvető tárolót (bucket) az `us-east-1` régióban:
* **`blz-quarantine-bucket-w1srf8`**: Ide érkeznek a kliensoldalról feltöltött nyers adatok.
* **`blz-clean-bucket-w1srf8`**: A sikeres vírusirtás és AI elemzés után ide kerülnek a végleges fájlok.
* **`blz-frontend-bucket-w1srf8`**: A React alkalmazás statikus hosztolására kijelölt tárhely.

**Alkalmazott biztonsági beállítások:**
* **Block Public Access:** Minden vödörnél bekapcsolva marad, az adatokhoz csak belső IAM szerepkörök (Lambda) férhetnek hozzá.
* **SSE-S3 Titkosítás:** Aktiválva az adatok nyugalmi állapotban történő védelme érdekében.
* **S3 Bucket Key:** Engedélyezve a KMS hívások számának és a költségeknek a csökkentése érdekében.
* **Object Lock:** Kikapcsolva maradt, hogy a feldolgozási folyamat (mozgatás/törlés) akadálymentes legyen.

#### 1.2.3. Adatbázis réteg: Amazon DynamoDB
A fájlokhoz tartozó metaadatok és az AI elemzési eredmények tárolására egy Amazon DynamoDB NoSQL táblát konfiguráltam.

* **Tábla neve:** `FileMetadata`
* **Elsődleges kulcs (Partition Key):** `fileId` (String). Ez az egyedi azonosító kapcsolja össze az S3-ban tárolt fájlt az adatbázisban lévő rekorddal.
* **Kapacitáskezelés (Capacity Mode):** On-demand.
    * **Döntés indoklása:** A kiszámíthatatlan terhelés és a laboratóriumi környezet költségkorlátai miatt ez a legoptimálisabb választás, mivel nincs fix óradíja, kizárólag a tényleges műveletek után generál költséget.
* **Tábla osztály:** DynamoDB Standard.
* **Titkosítás:** AWS owned key (SSE-DDB), amely alapértelmezett védelmet nyújt az adatoknak.

---