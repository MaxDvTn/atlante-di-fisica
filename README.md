# Atlante di Fisica

Un libro di testo interattivo in 3D. Ogni capitolo illustra un fenomeno fisico disegnato in 3D nello stile di una tavola tecnica cartacea (solidi di carta, contorni a china, elementi illuminati). Nessun apparato superfluo: solo l'oggetto in movimento, i suoi vettori, gli assi cartesiani e i grafici orari. Lo scroll volta le pagine e orienta la telecamera; il passaggio del cursore illumina un componente; il clic ne mostra la scomposizione vettoriale o analitica.

```
index.html              Indice generale e copertina
atlas.css               Design system condiviso (tema chiaro Anatomy)
engine/
  render.js             Motore grafico: ombreggiatura cartacea + contorni normali/profondità, picking, molle smorzate
  parts.js              Materiali cartacei, frecce vettoriali 3D, quote e assi
  book.js               Controller del libro: scroll → voltapagina 3D + telecamera, tab Teoria / Esercizi
  xrefs.js              Analogie e confronti incrociati tra capitoli
kinematics/
  model.js              Modello fisico analitico: formule pure, unità SI, calcolo differenziale e integrale
  checks.mjs            Invarianti e test matematici del modello (node <capitolo>/checks.mjs)
  world.js              Scena 3D: pallina, asse, vettori, stroboscopia, grafici, proiettile
  pages.js              Testo delle pagine, configurazioni di telecamera, scomposizioni (PLATES)
  practice.js           Eserciziario interattivo contestuale ({ pageIndex: [{ q, choices, answer, why }] })
  main.js               Entry point del capitolo: scroll, interazioni, telemetria in tempo reale
newton/ circular/ energy/ momentum/ oscillations/ rotation/ fluids/
                        Meccanica classica (Capitoli 1–8)
electrostatics/ gauss/ potential/ capacitors/ circuits/ magnetism/ induction/
                        Elettromagnetismo (Capitoli 9–15)
equations/              Formulario interattivo, collegato alle pagine corrispondenti
tools/test_modes.mjs    Test automatizzato E2E per il selettore Teoria / Esercizi
```

## Esecuzione in locale

Avvia qualsiasi server web statico nella cartella principale:
```bash
python3 -m http.server 8137
```
e apri [http://localhost:8137/](http://localhost:8137/) nel browser.

## Controlli di navigazione
* **Frecce `←` / `→` o Scroll:** voltano le pagine in 3D.
* **Selettore `[ 📖 Teoria ]` / `[ ✍️ Esercizi ]`:** passa dalla lettura della teoria al quaderno degli esercizi contestuali.
* **Clic / Tap sul modello 3D:** mostra la scomposizione del componente selezionato.
* **`Esc`:** richiude la scomposizione e riposiziona i vettori.
* **Deep link:** `kinematics/#3` apre direttamente la pagina 1.3.
* **Dispositivi mobili e tablet:** layout verticale con la figura in alto e il testo in basso; swipe con snap alla pagina.

## Test e verifiche

Esecuzione dei controlli di tutti i capitoli e dei collegamenti del formulario:
```bash
npm run check
```

Esecuzione del test automatico dell'interfaccia:
```bash
npm run test:modes
```

Licenza MIT.
