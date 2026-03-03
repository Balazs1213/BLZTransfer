**Hallgató neve:** Sándor Balázs  
**Neptun kódja:** W1SRF8  
**Email címe:** sandorbalazs1013@gmail.com  
**Konzulens(ek) neve:** Pelle István  
**Önlab tantárgy kódja:** BMEVITMAL04  
**Tanév/félév:** 2025/2026. 2. félév  

**Feladat/téma címe:** Felhő natív alkalmazásfejlesztés - Egy intelligens, serverless fájlmegosztó webalkalmazás tervezése és fejlesztése AWS környezetben.

---

Tervezett munkafázisok a félév során:

| Hét | Fejlesztési Fázis | Elvégzendő Szakmai Feladatok |
| :--- | :--- | :--- |
| **1. hét** | **Projekt előkészítése és témaegyeztetés** | - Kapcsolatfelvétel a konzulenssel.<br>- A projekt témájának és a fejlesztendő alkalmazás alapötletének a kidolgozása.<br>- Egyeztetés a konzulenssel a kidolgozott célkitűzésekről. |
| **2. hét** | **Tervezés és specifikáció** | - Serverless AWS architektúra ábra véglegesítése<br>- Rendszerspecifikáció és követelmények összeállítása<br>- Learner Lab korlátainak felmérése és összevetése a tervvel<br>- Specifikáció hozzáigazítása az elérhető felhős erőforrásokhoz<br>- A projekt heti bontású munkatervének elkészítése |
| **3. hét** | **Rendszertervezés és alapinfrastruktúra** | - A rendszertervezés véglegesítése és a használandó tervezési minták (Design Patterns) meghatározása.<br>- Az AWS adattárolási rétegének (S3 vödrök és DynamoDB) manuális létrehozása, a CORS és a jogosultságok beállítása.<br>- Kliensoldali felkészülés: JS/React tanulásának megkezdése. |
| **4. hét** | **API végpontok és feltöltési logika** | - API Gateway és a feltöltési linkeket adó Lambda manuális létrehozása (a kötelező LabRole kiválasztásával)<br>- Letöltést kezelő Lambda elkészítése atomi számlálással.<br>- A backend végpontok manuális tesztelése Postman segítségével. |
| **5. hét** | **Intelligens feldolgozás (1. rész)** | - AWS Step Functions állapotgép vizuális felépítése (Workflow Studio segítségével).<br>- Állapotgép rákötése az S3 Event Notification-re (új fájl esetén automatikus indulás).<br>- ClamAV vírusirtó Lambda konténer bekötése a beérkező fájlok átvizsgálására. |
| **6. hét** | **Intelligens feldolgozás (2. rész)** | - AI szolgáltatások (Amazon Rekognition és Textract) integrálása a Lambda függvényekbe.<br>- Véglegesítő Lambda megírása: adatok mentése DynamoDB-be és a tiszta fájl áthelyezése. |
| **7. hét** | **Kliensalkalmazás: UI és alapok (Frontend 1.)** | - React (Vite) projekt inicializálása és a mappaszerkezet kialakítása.<br>- A felhasználói felület (UI) dizájnjának és a feltöltő űrlapoknak az összerakása (még adatok nélkül.)<br> |
| **8. hét** | **Kliensalkalmazás: Integráció (Frontend 2.)** | - Frontend összekötése a letesztelt AWS backenddel: fájlfeltöltés megvalósítása a böngészőből.<br>- Visszakapott adatok feldolgozása: letöltési linkek és kliensoldali QR kód generálása/megjelenítése.<br>- Fájlméret kvóták kliensoldali validálása. |
| **9. hét** | **Rendszerintegráció és E2E tesztelés** | - A teljes rendszer "End-to-End" végigtesztelése a grafikus felületen keresztül.<br>- A különböző szerepkörök (Vendég vs. Regisztrált) korlátozásainak gyakorlati ellenőrzése.<br>- Esetleges hibák javítása (Bugfixing) és a kód optimalizálása. |
| **10. hét** | **Alkalmazásfejlesztés finomhangolása** | - Az alkalmazás funkcióinak végső polírozása és a felhasználói élmény (UX) javítása.<br>- A felmerülő szélsőséges esetek lekezelése és a kódbázis refaktorálása.<br>- A biztonsági beállítások és a jogosultságok utolsó, éles tesztelése. |
| **11. hét** | **Dokumentáció és projekt véglegesítése** | - Az írásos projektbeszámoló megírása, az architektúra ábrák és tervezési döntések kifejtése.<br>- A Learner Lab miatti kompromisszumok indoklása, a beszámoló stilisztikai véglegesítése.<br>- A GitHub repó (`README.md`) és a kódbázis kommentjeinek rendbetétele. |
| **12. hét** | **Projekt leadása és védés előkészítése** | - A teljes, kész projekt és a dokumentáció hivatalos leadása a konzulensnek.<br>- A szóbeli bemutató (prezentációs diák) tartalmi és vizuális összeállítása.<br>- Az élő rendszerbemutató forgatókönyvének megtervezése és elpróbálása. |
| **13. hét** | **Felkészülés a szóbeli beszámolóra** | - A prezentáció és az élő bemutató többszöri, időre történő elpróbálása.<br>- A lehetséges szakmai kérdésekre adandó válaszok gyakorlása.<br>- A bemutató során használt eszközök és környezet végleges ellenőrzése.<br>- Esetleges szóbeli beszámoló. |
| **14. hét** | **Szóbeli beszámoló** | - A projekt eredményeinek hivatalos prezentálása a bizottság/konzulens előtt.<br>- Az elkészült fájlmegosztó alkalmazás élő, hibamentes bemutatása.<br>- A felmerülő kérdések megválaszolása. |