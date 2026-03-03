# Rendszerspecifikáció: Intelligens Serverless Fájlmegosztó Platform

## 1. A Projekt Célkitűzése
A projekt célja egy biztonságos, eseményvezérelt (Event-driven), szervermentes (Serverless) fájlmegosztó webalkalmazás tervezése és fejlesztése az AWS (Amazon Web Services) felhőinfrastruktúráján. A rendszer a hagyományos fájlmegosztási funkciókon túl intelligens háttérfeldolgozást (vírusellenőrzés, mesterséges intelligencia alapú tartalom-analízis) biztosít. A fejlesztés figyelembe veszi és adaptálja az AWS Learner Lab egyetemi oktatási környezet szigorú biztonsági és jogosultsági korlátozásait.

## 2. Felhasználói Szerepkörök és Használati Esetek (Use Cases)
A rendszer működése két fő felhasználói útvonalra bontható, melyeket az alkalmazás logikai szinten (Token/API kulcs alapján) különböztet meg:
* **Feltöltő Kliens (Uploader):** Képes a webes felületen keresztül kiválasztani és feltölteni egy fájlt. A feldolgozás után megkapja a letöltési hivatkozást és a QR kódot.
  * *Vendég (Guest):* Alapértelmezett, kisebb fájlméret-korláttal (max. 500 MB) rendelkezik.
  * *Regisztrált/Prémium:* Érvényes azonosító esetén kiterjesztett fájlméret-korláttal (max. 2 GB) használhatja a rendszert, és kezelheti saját fájljait.
* **Letöltő Kliens (Downloader):** A kapott hivatkozás vagy QR kód segítségével hozzáfér a rendszerhez. A háttérben lezajló jogosultság- és limitellenőrzés után letöltheti a megtisztított és validált fájlt.

## 3. Funkcionális Követelmények
* **Biztonságos fájlfeltöltés:** A fájlok feltöltése a számítási réteg (backend) megkerülésével, API Gateway által generált S3 Presigned URL segítségével, közvetlenül a karantén tárhelyre történjen.
* **S3 szintű méretvédelem:** A generált feltöltési linkekbe (Presigned URL) szigorúan bele kell kódolni a maximális fájlméret korlátját (`content-length-range`), megakadályozva a rosszindulatú adatszemét közvetlen S3-ba juttatását.
* **Automatikus eseményindítás:** Az S3 tárhelyre beérkező új objektumok automatikusan indítsák el a feldolgozó állapotgépet (S3 Event Notification).
* **Biztonsági szűrés:** A feltöltött fájlokat a rendszer egy Lambda konténerben futó ClamAV segítségével ellenőrizze.
* **AI alapú adatkinyerés:** A képi fájlokból az Amazon Rekognition gépi látással, a PDF/dokumentum fájlokból az Amazon Textract vonjon ki metaadatokat.
* **Adatbázis rögzítés és áthelyezés:** A sikeresen validált fájlok metaadatai, valamint a maximális letöltési limit egy NoSQL adatbázisban (DynamoDB) rögzüljenek, a nyers fájl pedig egy tiszta S3 vödörbe kerüljön áthelyezésre.
* **Atomi letöltéskezelés:** A letöltések számának ellenőrzése és csökkentése versenyhelyzet-mentesen (Race condition elkerülése), atomi tranzakcióval (Conditional Update) valósuljon meg.
* **QR kód generálás:** A letöltési linkekhez tartozó QR kódok generálása az erőforrás-optimalizálás érdekében kliensoldalon történjen.

## 4. Nem Funkcionális Követelmények és Architektúra
* **Infrastruktúra:** 100%-ban Serverless AWS architektúra (Amazon S3, AWS Lambda, Amazon API Gateway, AWS Step Functions, Amazon DynamoDB, Amazon SNS).
* **Backend-first megközelítés:** A szerveroldali logika és az API végpontok fejlesztése és manuális tesztelése (Postman) megelőzi a vizuális felület kialakítását.
* **Kliensalkalmazás:** Modern, komponensalapú Single Page Application (SPA), React (Vite) alapokon.
* **Skálázhatóság és Költséghatékonyság:** Az eseményvezérelt architektúrának köszönhetően a rendszer alapjáraton nem fogyaszt számítási erőforrást (Pay-as-you-go modell).

## 5. Fejlesztési Környezet és Korlátozások (Learner Lab)
A rendszer tervezése során alkalmazkodni kell az AWS Academy / Learner Lab környezet technikai limitációihoz:
* **IAM Szabályozás:** Új jogosultsági profilok (IAM Roles) létrehozása tiltott (`iam:CreateRole` hiánya). Minden számítási egység (Lambda, Step Functions) végrehajtását az előre definiált **`LabRole`** profil használatával kell megoldani.
* **Hitelesítés:** Az Amazon Cognito szolgáltatás elérhetetlensége miatt az autentikációt és az engedélyezést az egyedi, egyszer használatos linkek és a DynamoDB alapú Token/TTL ellenőrzés kombinációjával kell kiváltani.
* **Implementáció módja:** Az infrastruktúra kiépítése a hivatalos AWS Management Console felületén, manuális, vizuális konfigurációval történik többnyire. Bizonyos esetekben ettől eltérhet, és infrastruktúra-mint-kód (IaC) megoldásokat alkalmazhat.

---

## 6. Kapacitástervezés és Rendszerkorlátok (Capacity Planning)
A Serverless környezet stabilitása és a futásidejű hibák (Timeout) elkerülése érdekében az AWS szolgáltatások fizikai korlátai az alábbi limitek bevezetését igénylik:
* **Feldolgozási limit (ClamAV):** Az AWS Lambda maximális futási ideje 15 perc, átmeneti tárhelye (`/tmp`) 10 GB. A ClamAV vírusleíró adatbázisa (1.5 GB) és a tömörített fájlok kibontási igénye miatt az alkalmazásszintű **maximális fájlméret 2 GB-ban** lett maximalizálva. Ekkora fájl letöltése, memóriában történő teljes átvizsgálása és S3 áthelyezése biztonságosan, 3-5 perc alatt lefut.
* **AI Limitek:** Az Amazon Rekognition szinkron képelemzése maximum **15 MB**-os, az Amazon Textract dokumentumelemzése pedig maximum **150 MB**-os fájlokon futtatható biztonságosan a Lambda időkeretén belül.

## 7. Feltételes Feldolgozás (Conditional Routing & Graceful Degradation)
A különböző szolgáltatások eltérő fizikai korlátai miatt a rendszer intelligens elágazásokat (Choice State) használ az AWS Step Functions állapotgépben:
1. **Védelem a kapuban:** A kliensalkalmazás (React) és az API Gateway (S3 content-length-range) élből elutasítja a kvótát (500 MB / 2 GB) meghaladó feltöltéseket.
2. **Elágazás (Choice):** A ClamAV sikeres lefutása után az állapotgép megvizsgálja a fájl MIME típusát és méretét. 
3. **Elegáns Funkcióvesztés:** Ha egy fájl meghaladja az AI réteg szigorú korlátait (pl. egy 50 MB-os kép), a folyamat nem áll le hibával. A rendszer átugorja a Rekognition/Textract hívást, és AI metaadatok nélkül (`ai_tags: null`), de érvényes, vírusmentes fájlként rögzíti és teszi letölthetővé az állományt a DynamoDB-ben.

## 8. Költségbecslés és Skálázhatóság (TCO)
Az AWS Pricing Calculator alapján végzett kapacitás-kalkulációk bizonyítják a Serverless architektúra költséghatékonyságát.

* **Alapforgatókönyv (Egyetemi tesztüzem):** Napi néhány feltöltés és AI elemzés esetén a rendszer teljes mértékben a havi ingyenes AWS Free Tier keretein belül marad, így az üzemeltetési költsége **0.00 USD/hónap**, védve a Learner Lab 100 USD-s költségkeretét.
* **Skálázódási Forgatókönyv (10 000 aktív felhasználó):** Feltételezve havi 14 TB tárolt adatot és 28 TB kimenő internetes forgalmat, a horizontálisan skálázódó Lambda függvények (egyidejű párhuzamosítás) biztosítják a hiba nélküli kiszolgálást. Ekkora terhelés mellett a számítási réteg (Lambda, API Gateway) költsége továbbra is elhanyagolható (~15 USD). A becsült havi ~2922 USD összköltség több mint 95%-át az S3 adat fizikai tárolása és az internet felé irányuló sávszélesség (Data Transfer Out) teszi ki. A fajlagos kiszolgálási költség felhasználónként mindössze ~0.29 USD havonta.