// Eserciziario di Cinematica: quesiti con risposte commentate e soluzioni svolte.
// I valori numerici sono calcolati dal modello fisico (model.js).
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => r * 180 / Math.PI;

// 0 · lancio più veloce
const H2 = (2 * M.VY0) ** 2 / (2 * M.G);
// 1 · afferrata sotto il punto di lancio
const DROP = 1.50, DIST1 = 2 * M.H + DROP;
// 2 · medie nei primi 1.50 s
const T2 = 1.50, Y2 = M.y(T2), D2 = 2 * M.H - Y2;
// 3 · intervallo stroboscopico
const TAU = M.STROBE;
// 5 · velocità a 3.00 m di quota
const Y5 = 3.00, V5 = Math.sqrt(M.VY0 ** 2 - 2 * M.G * Y5);
// 6 · velocità orizzontale doppia
const R6 = 2 * M.VX * M.T;
// 7 · automobile più veloce
const VC7 = 20.0, A7 = dg(Math.atan2(VC7, M.RAIN.vr));
// 8 · corrente più intensa
const VW8 = 2.0;
// 9 · forza frenante decrescente a 2.00 s
const T9 = 2.00, V9 = M.PULL.a0 * T9 - 0.5 * M.PULL.k * T9 ** 2;

export const PRACTICE = {
  0: [
    { q: `La pallina viene lanciata verso l'alto a ${f(2 * M.VY0, 1)} m/s invece di ${f(M.VY0)} m/s. Quale altezza massima raggiunge? (Trascurando l'attrito dell'aria.)`,
      choices: [`${p3(2 * M.H)} m`, `${p3(Math.SQRT2 * M.H)} m`, `${p3(H2)} m`, `${p3(8 * M.H)} m`], answer: 2,
      why: `<p>All'apice <i>v</i> = 0, quindi <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i>. L'altezza cresce con il <b>quadrato</b> della velocità di lancio: raddoppiare <i>v</i><sub>0</sub> quadruplica l'altezza: 4 × ${f(M.H)} m.</p><div class="eq"><i>h</i> = (${f(2 * M.VY0, 1)})² / (2 × ${f(M.G)}) = ${p3(H2)} m</div><p>${p3(2 * M.H)} m presupporrebbe erroneamente che l'altezza sia direttamente proporzionale alla velocità.</p>` },
    { q: 'Nell’istante in cui la pallina raggiunge il punto più alto della traiettoria, la sua accelerazione è',
      choices: ['nulla', `${f(M.G)} m/s² verso il basso`, `${f(M.G)} m/s² verso l'alto`, 'indeterminata, poiché inverte il moto'], answer: 1,
      why: `<p>La gravità è l'unica forza agente in ogni istante del volo, quindi <i>a</i> = <i>g</i> = ${f(M.G)} m/s² diretta verso il basso per l'intera traiettoria. All'apice la <b>velocità</b> è istantaneamente nulla, ma sta variando: un istante dopo punterà verso il basso.</p>` },
  ],
  1: [
    { q: `Una pallina viene lanciata verso l'alto a ${f(M.VY0)} m/s da un balcone e ripresa in caduta ${f(DROP)} m <b>sotto</b> la quota di partenza. Quale distanza complessiva ha percorso?`,
      choices: [`${p3(DROP)} m`, `${p3(2 * M.H - DROP)} m`, `${p3(M.H + DROP)} m`, `${p3(DIST1)} m`], answer: 3,
      why: `<p>La distanza percorsa somma la lunghezza di ciascun tratto del moto. Sale di <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i> = ${f(M.H)} m, riscende di ${f(M.H)} m fino alla quota di lancio, poi prosegue per altri ${f(DROP)} m:</p><div class="eq">${f(M.H)} + ${f(M.H)} + ${f(DROP)} = ${p3(DIST1)} m</div><p>${p3(DROP)} m è il modulo dello <b>spostamento</b> netto (−${f(DROP)} m verso il basso), non la distanza percorsa.</p>` },
    { q: 'In un moto rettilineo, come si confronta il modulo dello spostamento con la distanza percorsa?',
      choices: ['Sono sempre uguali.', 'Lo spostamento può essere maggiore della distanza.', 'Lo spostamento non è mai maggiore della distanza; sono uguali solo in assenza di inversioni.', 'Lo spostamento è sempre rigorosamente minore della distanza.'], answer: 2,
      why: `<p>La distanza somma ogni metro di percorso; lo spostamento misura la variazione tra punto finale e iniziale. Qualsiasi inversione riduce lo spostamento netto ma incrementa la distanza. In assenza di inversioni di marcia le due grandezze coincidono.</p>` },
  ],
  2: [
    { q: `Qual è la <b>rapidità media</b> (scalare) della pallina dal lancio fino a <i>t</i> = ${f(T2)} s? (Lanciata a ${f(M.VY0)} m/s, raggiunge l'apice a ${f(M.H)} m in ${f(M.T / 2)} s.)`,
      choices: [`${p3(D2 / T2)} m/s`, `${p3(Y2 / T2)} m/s`, `${p3(M.H / T2)} m/s`, `${p3((M.VY0 + Math.abs(M.vy(T2))) / 2)} m/s`], answer: 0,
      why: `<p>Rapidità media = distanza percorsa / tempo. A ${f(T2)} s la pallina si trova a <i>y</i> = ${f(M.VY0)}(${f(T2)}) − ½(${f(M.G)})(${f(T2)})² = ${f(Y2, 3)} m in fase discendente. Distanza = salita ${f(M.H)} m + discesa ${f(M.H - Y2, 3)} m = ${f(D2, 3)} m.</p><div class="eq">${f(D2, 3)} m / ${f(T2)} s = ${p3(D2 / T2)} m/s</div><p>${p3(Y2 / T2)} m/s è la <b>velocità media vettoriale</b> (spostamento / tempo).</p>` },
    { q: 'Confronta la velocità della pallina un istante dopo il lancio con quella un istante prima di toccare la terra.',
      choices: ['Sono identiche.', 'La velocità all’atterraggio è maggiore perché l’accelerazione ha agito più a lungo.', 'Entrambe sono nulle in media, quindi non confrontabili.', 'Hanno lo stesso modulo (rapidità) ma versi opposti.'], answer: 3,
      why: `<p>Il moto è perfettamente simmetrico: +${f(M.VY0)} m/s al lancio, −${f(M.VY0)} m/s alla stessa quota in caduta. Il modulo (rapidità) è uguale, ma trattandosi di un vettore dotato di verso, le due velocità hanno segno opposto.</p>` },
  ],
  3: [
    { q: 'Assumendo il verso verso l’alto come positivo, in quale fase del moto la pallina aumenta la propria rapidità?',
      choices: ['In salita, perché la velocità è positiva', 'Nel punto più alto, perché l’accelerazione è massima', 'In discesa, perché v e a hanno segno concorde', 'Mai: un’accelerazione negativa rallenta sempre il corpo'], answer: 2,
      why: `<p>Un corpo accelera (aumenta di rapidità) quando <i>v</i> e <i>a</i> hanno lo stesso verso (segno concorde). L’accelerazione vale sempre <i>a</i> = −${f(M.G)} m/s²; in discesa anche <i>v</i> è negativa, perciò il modulo cresce. Un’accelerazione negativa decelera il corpo solo finché <i>v</i> è positiva.</p>` },
    { q: `La fotografia stroboscopica scatta ogni ${f(TAU, 3)} s. Durante la salita, di quanto diminuisce ciascun intervallo di spazio rispetto al precedente?`,
      choices: [`${p3(0.5 * M.G * TAU ** 2)} m`, `${p3(M.G * TAU ** 2)} m`, `${p3(M.G * TAU)} m`, `${p3(2 * M.G * TAU ** 2)} m`], answer: 1,
      why: `<p>Ciascun intervallo è lo spazio percorso in un intervallo τ: Δ<i>y</i> = <i>v</i>τ − ½<i>g</i>τ². Da un intervallo al successivo la velocità cala di <i>g</i>τ, quindi lo spazio diminuisce di (<i>g</i>τ)τ:</p><div class="eq">Δ(spazio) = <i>g</i>τ² = ${f(M.G)} × (${f(TAU, 3)})² = ${p3(M.G * TAU ** 2)} m</div><p>Il fattore ½ appartiene al singolo intervallo parabolico, non alla differenza tra intervalli consecutivi.</p>` },
  ],
  4: [
    { q: `Sul grafico <i>v</i>–<i>t</i> del moto (verso l'alto positivo, <i>v</i><sub>0</sub> = ${f(M.VY0)} m/s), qual è l'area netta tra la curva e l'asse dei tempi da 0 a ${f(T2)} s?`,
      choices: [`${p3(D2)} m`, `${p3(M.VY0 * T2)} m`, `${p3(M.H)} m`, `${p3(Y2)} m`], answer: 3,
      why: `<p>L'area con segno sottesa alla curva <i>v</i>–<i>t</i> rappresenta lo spostamento. Sopra l'asse dei tempi (fino a ${f(M.T / 2)} s) si ha un'area positiva: +½(${f(M.VY0)})(${f(M.T / 2)}) = +${f(M.H)} m. Sotto l'asse (da ${f(M.T / 2)} a ${f(T2)} s) si ha un'area negativa: −½(${f(T2 - M.T / 2)})(${f(-M.vy(T2))}) = −${f(M.H - Y2, 3)} m.</p><div class="eq">area netta = ${f(M.H)} − ${f(M.H - Y2, 3)} = ${p3(Y2)} m</div><p>${p3(D2)} m sommerebbe le due aree in valore assoluto, che corrisponde alla distanza totale, non allo spostamento.</p>` },
    { q: 'Nell’istante in cui la pallina è nel punto più alto della traiettoria, quale di queste grandezze è nulla?',
      choices: ['la pendenza del grafico <i>y</i>–<i>t</i>', 'la pendenza del grafico <i>v</i>–<i>t</i>', 'il valore dell’accelerazione letto su <i>a</i>–<i>t</i>', 'l’area sottesa al grafico <i>a</i>–<i>t</i> dal lancio'], answer: 0,
      why: `<p>La pendenza del grafico posizione-tempo <i>y</i>–<i>t</i> è la velocità istantanea, che si annulla all’apice. La pendenza di <i>v</i>–<i>t</i> e il valore di <i>a</i> valgono costantemente −${f(M.G)} m/s². L'area sotto <i>a</i>–<i>t</i> rappresenta Δ<i>v</i> = −${f(M.VY0)} m/s, non zero.</p>` },
  ],
  5: [
    { q: `A quale velocità si muove la pallina quando si trova a una quota di ${f(Y5)} m dal punto di lancio? (<i>v</i><sub>0</sub> = ${f(M.VY0)} m/s verso l'alto.)`,
      choices: [`${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s`, `${p3(V5)} m/s`, `${p3(Math.sqrt(M.VY0 ** 2 - M.G * Y5))} m/s`, `${p3(V5 ** 2)} m/s`], answer: 1,
      why: `<p>Non conoscendo il tempo, utilizziamo la legge senza il tempo (legge di Torricelli), con <i>a</i> = −${f(M.G)} m/s²:</p><div class="eq"><i>v</i>² = ${f(M.VY0)}² + 2(−${f(M.G)})(${f(Y5)}) = ${f(V5 ** 2)} m²/s², &nbsp;<i>v</i> = ${p3(V5)} m/s</div><p>${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s scaturirebbe dall'uso errato di un segno positivo per l'accelerazione: la pallina deve rallentare in quota, non accelerare.</p>` },
    { q: `Vuoi determinare l'istante in cui la pallina transita per la prima volta a quota ${f(Y5)} m, conoscendo solo <i>v</i><sub>0</sub>, <i>a</i> e Δ<i>y</i>. Quale formula lo calcola in un solo passaggio?`,
      choices: ['<i>v</i> = <i>v</i><sub>0</sub> + <i>at</i>', '<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>', 'Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²', 'Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i>'], answer: 2,
      why: `<p>La grandezza incognita che non serve determinare è la velocità finale <i>v</i>, quindi si seleziona l'equazione oraria che omette <i>v</i>: Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>². È un'equazione di secondo grado in <i>t</i>; la soluzione minore corrisponde alla salita.</p>` },
  ],
  6: [
    { q: `La seconda pallina viene lanciata con velocità orizzontale di ${f(M.VX)} m/s e velocità verticale iniziale di ${f(M.VY0)} m/s. Qual è la sua rapidità al vertice della parabola?`,
      choices: ['0 m/s', `${p3(M.VY0)} m/s`, `${p3(M.V0P)} m/s`, `${p3(M.VX)} m/s`], answer: 3,
      why: `<p>Al vertice solo la componente verticale <i>v</i><sub>y</sub> è nulla. Poiché non agiscono forze orizzontali, <i>v</i><sub>x</sub> rimane costantemente pari a ${f(M.VX)} m/s, e la velocità totale vale √(<i>v</i><sub>x</sub>² + 0²) = ${p3(M.VX)} m/s. La risposta 0 m/s è corretta solo per il lancio puramente verticale.</p>` },
    { q: `Lanciata nuovamente con la stessa velocità verticale iniziale di ${f(M.VY0)} m/s ma con velocità orizzontale <b>doppia</b> (${f(2 * M.VX)} m/s). Quale sarà la gittata sul piano orizzontale?`,
      choices: [`${p3(M.RANGE)} m`, `${p3(R6)} m`, `${p3(4 * M.RANGE)} m`, `${p3(Math.SQRT2 * M.RANGE)} m`], answer: 1,
      why: `<p>Il tempo di volo dipende unicamente dal moto verticale: <i>t</i> = 2<i>v</i><sub>0y</sub>/<i>g</i> = ${f(M.T)} s, che resta invariato. Il moto orizzontale è uniforme:</p><div class="eq">Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(2 * M.VX)} × ${f(M.T)} = ${p3(R6)} m</div><p>${p3(4 * M.RANGE)} m si otterrebbe raddoppiando l'intera velocità iniziale, il che raddoppierebbe anche il tempo di volo.</p>` },
  ],
  7: [
    { q: `La pioggia cade verticalmente a ${f(M.RAIN.vr, 1)} m/s rispetto al terreno. Un'auto accelera fino a ${f(VC7, 1)} m/s. Con quale angolo rispetto alla verticale appaiono inclinate le traiettorie delle gocce per i passeggeri?`,
      choices: [`${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}°`, `${p3(M.RAIN_ANGLE)}°`, `${p3(A7)}°`, `${p3(dg(Math.atan2(M.RAIN.vr, M.RAIN.vc)))}°`], answer: 2,
      why: `<p><i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>: ${f(M.RAIN.vr, 1)} m/s verso il basso e ${f(VC7, 1)} m/s all'indietro, tra loro ortogonali. L'angolo rispetto alla verticale vede la componente orizzontale al cateto opposto:</p><div class="eq">tan θ = ${f(VC7, 1)} / ${f(M.RAIN.vr, 1)}, &nbsp;θ = ${p3(A7)}°</div><p>${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}° rappresenterebbe l'angolo rispetto al piano <b>orizzontale</b>.</p>` },
    { q: `Per un passeggero all'interno dell'automobile che avanza a ${f(M.RAIN.vc, 1)} m/s, qual è la velocità della strada?`,
      choices: [`${f(M.RAIN.vc, 1)} m/s all'indietro`, `${f(M.RAIN.vc, 1)} m/s in avanti`, 'nulla: la strada è il riferimento assoluto', `${f(M.vlen(M.V_RC))} m/s inclinata`], answer: 0,
      why: `<p>Invertendo l'ordine dei sistemi di riferimento il vettore inverte il segno: <i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>. L'auto si muove a ${f(M.RAIN.vc, 1)} m/s in avanti rispetto alla strada, dunque la strada scorre a ${f(M.RAIN.vc, 1)} m/s all'indietro rispetto all'auto. Nessun riferimento è privilegiato.</p>` },
  ],
  8: [
    { q: `La corrente del fiume aumenta a ${f(VW8, 1)} m/s. La barca naviga ancora a ${f(M.RIVER.vb, 1)} m/s rispetto all'acqua, puntata perpendicolarmente alla corrente sul fiume largo ${M.RIVER.w} m. Quanto tempo impiega ad attraversare?`,
      choices: [`${p3(M.RIVER.w / Math.hypot(M.RIVER.vb, VW8))} s`, `${p3(M.RIVER.w / Math.sqrt(M.RIVER.vb ** 2 - VW8 ** 2))} s`, `${p3(M.RIVER.w / (M.RIVER.vb + VW8))} s`, `${p3(M.RIVER.w / M.RIVER.vb)} s`], answer: 3,
      why: `<p>Solo la componente della velocità perpendicolare alla sponda permette l'avanzamento verso l'altra riva, e la corrente non ha componenti perpendicolari. Dunque:</p><div class="eq"><i>t</i> = <i>w</i> / <i>v</i><sub>b</sub> = ${M.RIVER.w} / ${f(M.RIVER.vb, 1)} = ${p3(M.RIVER.w / M.RIVER.vb)} s</div><p>Il tempo è invariato; la corrente più rapida produce unicamente una maggiore deriva a valle (${f(VW8 * M.RIVER.w / M.RIVER.vb, 1)} m).</p>` },
    { q: `Tornando a una corrente di ${f(M.RIVER.vw, 1)} m/s: con quale angolo a monte rispetto alla perpendicolare deve puntare la barca da ${f(M.RIVER.vb, 1)} m/s per approdare esattamente di fronte?`,
      choices: [`${p3(dg(Math.atan(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(M.AIM_UP))}°`, `${p3(dg(Math.acos(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(Math.atan(M.RIVER.vb / M.RIVER.vw)))}°`], answer: 1,
      why: `<p>La componente della velocità della barca a monte deve annullare la corrente fluviale. La velocità propria della barca rappresenta l'ipotenusa del triangolo vettoriale:</p><div class="eq"><i>v</i><sub>b</sub> sin θ = <i>v</i><sub>w</sub> &nbsp;→ sin θ = ${f(M.RIVER.vw, 1)} / ${f(M.RIVER.vb, 1)}, θ = ${p3(dg(M.AIM_UP))}°</div>` },
  ],
  9: [
    { q: `L'auto parte da ferma con accelerazione variabile <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> (m/s², con <i>t</i> in s). Qual è la sua velocità all'istante <i>t</i> = ${f(T9)} s?`,
      choices: [`${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s`, `${p3(M.PULL.a0 * T9)} m/s`, `${p3(V9)} m/s`, `${p3(M.pa(T9))} m/s`], answer: 2,
      why: `<p>L'accelerazione non è costante, perciò integriamo nel tempo:</p><div class="eq"><i>v</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup> (${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>′) d<i>t</i>′ = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>²</div><div class="eq"><i>v</i>(${f(T9)}) = ${f(M.PULL.a0 * T9, 1)} − ${f(M.PULL.k / 2 * T9 ** 2, 1)} = ${p3(V9)} m/s</div>` },
    { q: `Per la medesima auto (<i>a</i> = <i>a</i><sub>0</sub> − <i>kt</i> fino all'annullamento, poi 0; con partenza da ferma in <i>x</i> = 0), dimostra che la distanza percorsa al momento in cui <i>a</i> = 0 vale <i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/3<i>k</i>², e calcola la posizione a <i>t</i> = 5.00 s.`,
      solution: `<p>1. <i>a</i> = 0 all'istante <i>t</i><sub>1</sub> = <i>a</i><sub>0</sub>/<i>k</i> = ${f(M.T1)} s.</p><p>2. <i>v</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup><i>a</i> d<i>t</i>′ = <i>a</i><sub>0</sub><i>t</i> − ½<i>kt</i>², da cui <i>v</i><sub>1</sub> = <i>a</i><sub>0</sub>²/2<i>k</i> = ${f(M.V1, 1)} m/s.</p><p>3. <i>x</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup><i>v</i> d<i>t</i>′ = ½<i>a</i><sub>0</sub><i>t</i>² − <i>kt</i>³/6. Valutando in <i>t</i><sub>1</sub>:</p><div class="eq"><i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/2<i>k</i>² − <i>a</i><sub>0</sub>³/6<i>k</i>² = <i>a</i><sub>0</sub>³/3<i>k</i>² = ${f(M.PULL.a0, 1)}³ / (3 × ${f(M.PULL.k, 1)}²) = ${f(M.X1, 1)} m</div><p>4. Dopo <i>t</i><sub>1</sub> l'accelerazione è nulla (moto rettilineo uniforme a ${f(M.V1, 1)} m/s):</p><div class="eq"><i>x</i>(5.00) = ${f(M.X1, 1)} + ${f(M.V1, 1)} × (5.00 − ${f(M.T1)}) = ${f(M.px(5), 1)} m</div>` },
  ],
  10: [
    { q: `Una particella si muove secondo la legge oraria <i>x</i>(<i>t</i>) = <i>t</i>³ − 3<i>t</i> (con <i>x</i> in m, <i>t</i> in s). Quanto vale la sua accelerazione nell'istante in cui la velocità si annulla (per <i>t</i> &gt; 0)?`,
      choices: [`${p3(M.ca(M.T_TURN))} m/s²`, '0 m/s²', `${p3(M.cx(M.T_TURN))} m/s²`, `${p3(3 * M.CUBE.A * M.T_TURN)} m/s²`], answer: 0,
      why: `<p><i>v</i>(<i>t</i>) = d<i>x</i>/d<i>t</i> = 3<i>t</i>² − 3 = 0 per <i>t</i> = ${f(M.T_TURN)} s. L'accelerazione è la derivata della velocità: <i>a</i>(<i>t</i>) = d<i>v</i>/d<i>t</i> = 6<i>t</i> = ${p3(M.ca(M.T_TURN))} m/s².</p><p>Velocità nulla non implica accelerazione nulla: la particella inverte il moto, dunque la velocità sta variando.</p>` },
    { q: 'Un punto materiale ha accelerazione <i>a</i> = 6<i>t</i> (m/s²), con velocità iniziale <i>v</i>(0) = −3 m/s e posizione iniziale <i>x</i>(0) = 0. Ricava <i>x</i>(<i>t</i>), l’istante <i>t</i> &gt; 0 in cui ripassa per l’origine e la velocità in quell’istante.',
      solution: `<p>1. Integrando l'accelerazione: <i>v</i>(<i>t</i>) = 3<i>t</i>² + <i>C</i><sub>1</sub>; poiché <i>v</i>(0) = −3, si ha <i>C</i><sub>1</sub> = −3.</p><p>2. Integrando la velocità: <i>x</i>(<i>t</i>) = <i>t</i>³ − 3<i>t</i> + <i>C</i><sub>2</sub>; poiché <i>x</i>(0) = 0, si ha <i>C</i><sub>2</sub> = 0.</p><p>3. Ripassa per l'origine quando <i>x</i>(<i>t</i>) = <i>t</i>(<i>t</i>² − 3) = 0, da cui <i>t</i> = √3 = ${f(Math.sqrt(3))} s.</p><div class="eq"><i>v</i>(√3) = 3(3) − 3 = ${f(M.cv(Math.sqrt(3)))} m/s</div><p>La particella si sposta inizialmente a sinistra fino a <i>x</i> = −2 m (a 1 s), per poi ritornare verso destra con velocità maggiore rispetto a quella di partenza.</p>` },
  ],
};
