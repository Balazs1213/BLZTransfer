### 5. Használati Esetek (Usecase Modell)

A fenti UML Use Case diagram a rendszer felhasználói (aktorai) és a platform főbb funkciói közötti kapcsolatokat modellezi. 
* **Elsődleges aktorok (Bal oldal):** A rendszert a `Guest Uploader`, a `Registered Uploader` és a `Downloader` használja. A regisztrált felhasználó öröklődési kapcsolatban (Generalization) áll a vendéggel, így az alapvető fájlmegosztási funkciók mellett hozzáfér a kiterjesztett, bejelentkezést igénylő funkciókhoz is (`Manage Own Files`).
* **Másodlagos aktor (Jobb oldal):** A `Notification System` egy rendszeren kívüli, aszinkron értesítési hálózatot reprezentál.
* **Folyamatlogika:** Az ábrán az `<<include>>` relációk jelölik azokat a háttérfolyamatokat, amelyek egy tranzakció során kötelezően lefutnak (pl. méretellenőrzés, AI/Vírus feldolgozás, Token validálás). Az `<<extend>>` reláció egy opcionális funkciót (pl. értesítés küldése a letöltés megtörténtéről) jelöl.