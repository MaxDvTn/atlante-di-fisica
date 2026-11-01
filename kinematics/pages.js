// The chapter, page by page: text on the left, and for the figure on the right the camera,
// the one lit thing and what is shown. Every number comes from model.js.
import * as M from './model.js';
import { ST, RAIN_V, RIV, PULLS } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const tau = M.STROBE;
const deg = r => (r * 180 / Math.PI).toFixed(1);

// ---------- small SVG charts for pages 1.7–1.10 (live parts are updated in main.js) ----------
const CW = 420, CH = 86, CP = { l: 40, r: 12, t: 9, b: 19 };
export const KR = {
  rain: { x0: 0, x1: 30, y0: 0, y1: 90 },
  map: { x0: -2, x1: 16, y0: 0, y1: 24 },
  pa: { x0: 0, x1: 5, y0: 0, y1: 6 }, pv: { x0: 0, x1: 5, y0: 0, y1: 12 }, px: { x0: 0, x1: 5, y0: 0, y1: 45 },
  cx: { x0: 0, x1: 2, y0: -3, y1: 3 }, cv: { x0: 0, x1: 2, y0: -3, y1: 9 }, ca: { x0: 0, x1: 2, y0: 0, y1: 12 },
};
export const KC = {
  sx: (x, R) => CP.l + (x - R.x0) / (R.x1 - R.x0) * (CW - CP.l - CP.r),
  sy: (y, R) => CP.t + (1 - (y - R.y0) / (R.y1 - R.y0)) * (CH - CP.t - CP.b),
};
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
function kchart(R, { series, xlabel, ylabel, label, live = '', marks = [] }) {
  const sx = x => KC.sx(x, R), sy = y => KC.sy(y, R);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = R.y0 < 0 ? `<line class="zero" x1="${CP.l}" x2="${CW - CP.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const fmt = v => (v < 0 ? '−' : '') + Math.abs(v);
  return `<svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="${label}">
    <rect class="frame" x="${CP.l}" y="${CP.t}" width="${CW - CP.l - CP.r}" height="${CH - CP.t - CP.b}"/>${zero}${live}${paths}${mk}
    <text class="ax" x="${CP.l - 6}" y="${sy(R.y1) + 4}" text-anchor="end">${fmt(R.y1)}</text><text class="ax" x="${CP.l - 6}" y="${sy(R.y0) + 4}" text-anchor="end">${fmt(R.y0)}</text>
    <text class="ax" x="${CP.l}" y="${CH - 7}">${R.x0}</text><text class="ax" x="${CW - CP.r}" y="${CH - 7}" text-anchor="end">${R.x1}</text>
    <text class="lab" x="${CP.l + 6}" y="${CP.t + 13}">${ylabel}</text><text class="ax" x="${(CP.l + CW - CP.r) / 2}" y="${CH - 7}" text-anchor="middle">${xlabel}</text>
  </svg>`;
}
// live pieces: a shaded area (filled by main.js), a red tangent, a cursor
const AREA = k => `<path data-area="${k}" style="fill:rgba(229,72,77,.18);stroke:none"/>`;
const TAN = k => `<line data-tan="${k}" style="stroke:#e5484d;stroke-width:1.4"/>`;
const CUR = k => `<circle class="cursor" r="4.5" data-cursor="${k}"/>`;

export const PAGES = [
  {
    kicker: 'Capitolo 1', title: 'Cinematica', sub: 'la descrizione del moto',
    body: `
      <p class="lede">La cinematica descrive il moto mediante tre grandezze fondamentali: dove si trova un corpo, quanto rapidamente si muove e come tale moto varia nel tempo. Non indaga le cause del moto.</p>
      <p>Tutto in questo capitolo prende origine da una pallina lanciata verso l'alto a ${f(M.VY0)} m/s. Una volta lasciata la mano, l'unica forza che agisce su di essa è la gravità: il corpo è in <b>caduta libera</b>, sia durante la salita che durante la discesa.</p>
      <p>Sale per ${f(M.T / 2)} s, raggiunge l'apice a ${f(M.H)} m e tocca terra ${f(M.T)} s dopo il lancio. La simulazione è mostrata a metà velocità.</p>`,
    cam: { target: [-1.0, 2.7, 0], az: 22, el: 7, dist: 21 }, lit: 'ball', look: { strobe: 1, level: 1 },
    fig: 'Una pallina lanciata verso l’alto',
  },
  {
    kicker: '1.1', title: 'Posizione', sub: 'spostamento e distanza percorsa',
    body: `
      <p class="lede">La <b>posizione</b> <i>y</i> indica dove si trova la pallina rispetto all'origine scelta. Qui l'origine è il punto di lancio e il verso verso l'alto è assunto come positivo.</p>
      <p>Lo <b>spostamento</b> Δ<i>y</i> = <i>y</i><sub>f</sub> − <i>y</i><sub>0</sub> è la variazione complessiva di posizione. È un vettore, dotato di modulo e verso (la freccia nera accanto all'asse).</p>
      <p>La <b>distanza percorsa</b> è la lunghezza totale della traiettoria. È una grandezza scalare e non è mai negativa.</p>
      <table class="data">
        <tr><th></th><th>spostamento</th><th>distanza</th></tr>
        <tr><td>lancio → apice</td><td>+${f(M.H)} m</td><td>${f(M.H)} m</td></tr>
        <tr><td>lancio → atterraggio</td><td>0.00 m</td><td>${f(2 * M.H)} m</td></tr>
      </table>`,
    cam: { target: [-0.3, 2.9, 0], az: -16, el: 6, dist: 15 }, lit: 'staff', look: { disp: 1 },
    fig: 'L’asse delle posizioni',
  },
  {
    kicker: '1.2', title: 'Velocità', sub: 'velocità vettoriale e scalare',
    body: `
      <p class="lede">La <b>velocità</b> <i>v</i> = Δ<i>y</i>/Δ<i>t</i> misura quanto rapidamente varia la posizione ed è dotata di verso e segno. La <b>velocità scalare</b> (o rapidità) ne rappresenta solo l'intensità priva di verso.</p>
      <p>La freccia rappresenta il vettore velocità. Parte da +${f(M.VY0)} m/s, si annulla nel punto più alto e poi cresce puntando verso il basso fino a −${f(M.VY0)} m/s al momento dell'impatto. I moduli al lancio e all'arrivo sono identici; i vettori velocità hanno invece verso opposto.</p>
      <p>La stessa distinzione si applica ai valori medi sull'intero intervallo di volo:</p>
      <table class="data">
        <tr><td>velocità media</td><td>Δ<i>y</i>/Δ<i>t</i> = 0 / ${f(M.T)} = 0 m/s</td></tr>
        <tr><td>rapidità media (scalare)</td><td>distanza/Δ<i>t</i> = ${f(2 * M.H)} / ${f(M.T)} = ${f(2 * M.H / M.T)} m/s</td></tr>
      </table>`,
    cam: { target: [0.1, 3.0, 0.2], az: 24, el: 8, dist: 18 }, lit: 'vArrow', look: {},
    fig: 'Vettore velocità',
  },
  {
    kicker: '1.3', title: 'Accelerazione', sub: 'la rapidità con cui varia la velocità',
    body: `
      <p class="lede">L'<b>accelerazione</b> <i>a</i> = Δ<i>v</i>/Δ<i>t</i>. Per questa pallina vale stabilmente −${f(M.G)} m/s² per l'intera traiettoria: in salita, nel punto più alto e in discesa. Il vettore rosso non varia mai.</p>
      <p>Le immagini traslucide mostrano una fotografia stroboscopica a intervalli di ${f(tau, 1)} s. In salita, le distanze tra scatti successivi si contraggono di <i>g</i>τ² = ${f(M.G * tau * tau)} m a ogni passo. In discesa, le posizioni corrispondono esattamente alle medesime quote.</p>
      <p><b>Accelerazione o decelerazione?</b> Confronta i segni. Quando <i>v</i> e <i>a</i> hanno segni opposti, il corpo rallenta (in salita). Quando hanno segno concorde, accelera (in discesa). In fisica entrambi sono moti accelerati con accelerazione costante.</p>
      <p class="live" id="live-sign"></p>`,
    cam: { target: [0.1, 2.75, 0], az: -6, el: 5, dist: 15.5 }, lit: 'aArrow', look: { strobe: 1 },
    fig: 'Stroboscopia, ogni ' + tau.toFixed(1) + ' s',
  },
  {
    kicker: '1.4', title: 'Grafici del moto', sub: 'pendenze e aree sottese',
    body: `
      <p class="lede">I tre grafici descrivono il medesimo volo. Il grafico della posizione è in scala reale: le sue quote corrispondono esattamente all'altezza della pallina nello spazio.</p>
      <ul class="rules">
        <li>pendenza di <i>x</i>–<i>t</i> = velocità</li>
        <li>pendenza di <i>v</i>–<i>t</i> = accelerazione</li>
        <li>area sotto la curva <i>v</i>–<i>t</i> = spostamento</li>
        <li>area sotto la curva <i>a</i>–<i>t</i> = variazione di velocità</li>
      </ul>
      <p>Un'accelerazione costante produce una retta orizzontale in <i>a</i>–<i>t</i>, una retta inclinata in <i>v</i>–<i>t</i> e un arco parabolico in <i>x</i>–<i>t</i>.</p>
      <p class="hintline">Fai clic su un grafico per esaminarne pendenza e area.</p>`,
    cam: { target: [-7.6, 3.0, -1.0], az: 0, el: 3, dist: 40 }, lit: 'boardX', look: { level: 1 },
    fig: 'Posizione, velocità e accelerazione nel tempo',
  },
  {
    kicker: '1.5', title: 'Le leggi del moto', sub: 'per accelerazione costante',
    body: `
      <p class="lede">Cinque grandezze descrivono questo moto: Δ<i>y</i>, <i>v</i><sub>0</sub>, <i>v</i>, <i>a</i>, <i>t</i>. Ciascuna formula ne omette una: individua quella che esclude l'incognita che non conosci e non devi trovare.</p>
      <table class="data eqs">
        <tr><th>legge oraria</th><th>omette</th></tr>
        <tr><td><i>v</i> = <i>v</i><sub>0</sub> + <i>at</i></td><td>Δ<i>y</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²</td><td><i>v</i></td></tr>
        <tr><td><i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i></td><td><i>t</i></td></tr>
        <tr><td>Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i></td><td><i>a</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>vt</i> − ½<i>at</i>²</td><td><i>v</i><sub>0</sub></td></tr>
      </table>
      <p>Fino a che altezza sale? Nel punto più alto <i>v</i> = 0 e il tempo <i>t</i> non è richiesto: 0 = ${f(M.VY0)}² + 2(−${f(M.G)})Δ<i>y</i>, da cui Δ<i>y</i> = ${f(M.H)} m.</p>`,
    cam: { target: [-3.2, 3.1, -0.4], az: 20, el: 15, dist: 34 }, lit: 'ball', look: { level: 1 },
    fig: 'Un moto, cinque grandezze',
  },
  {
    kicker: '1.6', title: 'Moto del proiettile', sub: 'due moti simultanei e indipendenti',
    body: `
      <p class="lede">Una seconda pallina viene lanciata nello stesso istante con la medesima velocità iniziale verticale di ${f(M.VY0)} m/s, combinata con una velocità orizzontale costante di ${f(M.VX)} m/s.</p>
      <p>Mantiene la stessa quota della prima pallina lungo l'intera traiettoria e atterra nel medesimo istante. Il moto verticale è una caduta libera e la velocità orizzontale non ne influenza la durata. L'ombra sul piano si muove a passi costanti di ${f(M.VX * tau)} m: il moto orizzontale è rettilineo uniforme.</p>
      <table class="data cols">
        <tr><th>orizzontale · uniforme</th><th>verticale · caduta libera</th></tr>
        <tr><td><i>v</i><sub>x</sub> = ${f(M.VX)} m/s</td><td><i>v</i><sub>0</sub> = ${f(M.VY0)} m/s, <i>v</i> = −${f(M.VY0)} m/s</td></tr>
        <tr><td>Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(M.RANGE, 1)} m</td><td><i>a</i> = −${f(M.G)} m/s², Δ<i>y</i> = 0</td></tr>
        <tr><td><i>t</i> = ${f(M.T)} s</td><td><i>t</i> = ${f(M.T)} s</td></tr>
      </table>
      <p>Nel punto più alto solo la componente verticale <i>v</i><sub>y</sub> è nulla. Il corpo continua a muoversi orizzontalmente a ${f(M.VX)} m/s.</p>`,
    cam: { target: [4.6, 2.7, 0.6], az: -16, el: 13, dist: 33 }, lit: 'projV', look: { proj: 1, comp: 1 },
    fig: 'Stessa quota, a ogni istante',
  },
  {
    kicker: '1.7', title: 'Sistemi di riferimento', sub: 'la velocità dipende dall’osservatore',
    body: `
      <p class="lede">Ogni velocità è misurata rispetto a un sistema di riferimento. La pioggia cade a ${f(M.RAIN.vr, 1)} m/s verticalmente rispetto alla terra; per chi viaggia su un'auto a ${f(M.RAIN.vc, 1)} m/s appare inclinata con una velocità di ${f(M.vlen(M.V_RC))} m/s.</p>
      <p>Indichiamo con <i>v</i><sub>AB</sub> la velocità di "A rispetto a B" (R pioggia, C auto, G terra). Le velocità relative si compongono mediante la legge galileiana:</p>
      <div class="eq"><i>v</i><sub>AC</sub> = <i>v</i><sub>AB</sub> + <i>v</i><sub>BC</sub></div>
      <p>Quindi <i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>, sommate punta a coda. Invertendo l'ordine dei riferimenti si inverte il verso del vettore: dall'auto la strada si muove all'indietro, <i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>. Le componenti sono ad angolo retto, quindi |<i>v</i><sub>RC</sub>| = √(${f(M.RAIN.vc, 1)}² + ${f(M.RAIN.vr, 1)}²) = ${f(M.vlen(M.V_RC))} m/s, con tan θ = ${f(M.RAIN.vc, 1)}/${f(M.RAIN.vr, 1)}, θ = ${f(M.RAIN_ANGLE, 1)}° dalla verticale. Auto più veloce, pioggia più inclinata:</p>
      <div class="charts">${kchart(KR.rain, { xlabel: 'velocità auto (m/s)', ylabel: 'inclinazione θ dalla verticale (°)', label: 'Inclinazione della pioggia vista dall’auto',
        series: [{ pts: samples(60, 0, 30, M.rainAngleAt) }], marks: [[M.RAIN.vc, M.RAIN_ANGLE, `${f(M.RAIN_ANGLE, 1)}°`, 8, 16]] })}</div>
      <p class="hintline">Disegnato 1:1. Frecce ${(RAIN_V * 100).toFixed(0)} cm per m/s. ¼ di velocità. Clicca sul triangolo per visualizzare l'angolo.</p>`,
    cam: { target: [ST.rain + 11, 2.3, 0], az: -8, el: 10, dist: 60 }, lit: 'rainSum', look: {}, scene: 'rain',
    fig: 'La stessa pioggia, due sistemi di riferimento',
  },
  {
    kicker: '1.8', title: 'Attraversamento di un fiume', sub: 'due velocità sommate punta a coda',
    body: `
      <p class="lede">La velocità di un'imbarcazione rispetto alla riva è data dalla somma vettoriale della sua velocità relativa all'acqua e della velocità della corrente rispetto alla riva:</p>
      <div class="eq"><i>v</i><sub>BS</sub> = <i>v</i><sub>BW</sub> + <i>v</i><sub>WS</sub></div>
      <p>Entrambe le barche navigano a ${f(M.RIVER.vb, 1)} m/s rispetto all'acqua con una corrente di ${f(M.RIVER.vw, 1)} m/s, su un fiume largo ${M.RIVER.w} m.</p>
      <table class="data">
        <tr><th>m/s, s, m</th><th>rotta perpendicolare</th><th>rotta inclinata di ${deg(M.AIM_UP)}° a monte</th></tr>
        <tr><td>velocità risultante</td><td>√(${f(M.RIVER.vb, 1)}² + ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(0)))}</td><td>√(${f(M.RIVER.vb, 1)}² − ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(M.AIM_UP)))}</td></tr>
        <tr><td>tempo</td><td>${M.RIVER.w}/${f(M.RIVER.vb, 1)} = ${f(M.crossTime(0), 1)} s</td><td>${M.RIVER.w}/${f(M.vBS(M.AIM_UP)[1], 1)} = ${f(M.crossTime(M.AIM_UP), 1)} s</td></tr>
        <tr><td>deriva</td><td>${f(M.RIVER.vw, 1)} × ${f(M.crossTime(0), 1)} = ${f(M.drift(0), 1)} m</td><td>0 m</td></tr>
      </table>
      <p>Solo la componente perpendicolare alla riva garantisce l'avanzamento, pertanto la rotta diretta è la più rapida; la corrente provoca unicamente una traslazione a valle. Per approdare esattamente di fronte occorre puntare la prua a monte in modo che sin θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)}.</p>
      <div class="charts">${kchart(KR.map, { xlabel: 'a valle (m)', ylabel: 'traversata (m)', label: 'Traiettorie di entrambe le imbarcazioni viste dall’alto',
        live: CUR('boatA') + CUR('boatB'), series: [{ pts: [[0, 0], [M.drift(0), M.RIVER.w]], tag: [8.6, 12.5, 'diretta'] }, { pts: [[0, 0], [0, M.RIVER.w]], tag: [0.3, 3, 'inclinata'] }] })}</div>
      <p class="hintline">Scala 1 m = ${(RIV.s * 100).toFixed(0)} cm. Frecce ${(RIV.v * 100).toFixed(0)} cm per m/s. Mostrato a velocità ${M.RIVER.rate}×.</p>`,
    cam: { target: [ST.river - 1.7, 0, 0.3], az: -4, el: 44, dist: 40 }, lit: 'boatA', look: {}, scene: 'river',
    fig: 'Puntata in una direzione, trascinata in un’altra',
  },
  {
    kicker: '1.9 · Calcolo infinitesimale', title: 'Cinematica con integrali', sub: 'quando l’accelerazione varia nel tempo',
    body: `
      <p class="lede">Le formule con accelerazione costante non si applicano se <i>a</i> varia. Per quest'auto l'accelerazione <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> m/s² decade a zero a <i>t</i><sub>1</sub> = ${f(M.T1)} s. Partendo da ferma nell'origine (<i>v</i><sub>0</sub> = 0, <i>x</i><sub>0</sub> = 0), integriamo nel tempo:</p>
      <div class="eq"><i>v</i> = <i>v</i><sub>0</sub> + ∫<i>a</i> d<i>t</i> = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>² &nbsp;→ ${f(M.V1, 1)} m/s</div>
      <div class="eq"><i>x</i> = <i>x</i><sub>0</sub> + ∫<i>v</i> d<i>t</i> = ${f(M.PULL.a0 / 2, 1)}<i>t</i>² − ${f(M.PULL.k / 6)}<i>t</i>³ &nbsp;→ ${f(M.X1, 1)} m</div>
      <div class="charts">
        ${kchart(KR.pa, { xlabel: 't (s)', ylabel: 'a (m/s²) · area = Δv', label: 'Accelerazione nel tempo, area colorata', live: AREA('pa') + CUR('pa'), series: [{ pts: samples(100, 0, 5, M.pa) }] })}
        ${kchart(KR.pv, { xlabel: 't (s)', ylabel: 'v (m/s) · area = Δx, pendenza = a', label: 'Velocità nel tempo, area colorata', live: AREA('pv') + TAN('pv') + CUR('pv'), series: [{ pts: samples(100, 0, 5, M.pv) }] })}
        ${kchart(KR.px, { xlabel: 't (s)', ylabel: 'x (m) · pendenza = v', label: 'Posizione nel tempo con retta tangente', live: TAN('px') + CUR('px'), series: [{ pts: samples(100, 0, 5, M.px) }] })}
      </div>
      <p class="hintline">Aree = integrali, linee rosse = derivate (tangenti). 1 m disegnato come ${(PULLS.s * 100).toFixed(0)} cm.</p>`,
    cam: { target: [ST.pull + 4.4, 0.3, 0], az: -8, el: 24, dist: 22 }, lit: 'pull', look: {}, scene: 'pull',
    fig: 'a = ' + M.PULL.a0.toFixed(1) + ' − ' + M.PULL.k.toFixed(1) + 't',
  },
  {
    kicker: '1.10 · Calcolo infinitesimale', title: 'Dal moto a x(t)', sub: 'derivare per scendere, integrare per risalire',
    body: `
      <p class="lede">Data la legge oraria <i>x</i>(<i>t</i>), calcoliamo le derivate. Per <i>x</i> = <i>t</i>³ − 3<i>t</i>:</p>
      <div class="eq"><i>v</i> = 3<i>t</i>² − 3 &nbsp;&nbsp; <i>a</i> = 6<i>t</i></div>
      <p>Il moto inizia verso sinistra a ${f(-M.cv(0))} m/s e inverte il verso all'istante <i>t</i> = ${f(M.T_TURN)} s a <i>x</i> = ${f(M.cx(M.T_TURN))} m. In 2 s: spostamento ${f(M.cx(2))} m, distanza percorsa ${f(M.cdist(2))} m.</p>
      <p><b>Per risalire a ritroso</b> servono le condizioni iniziali: da <i>a</i> = 6<i>t</i>, <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub> e <i>x</i> = <i>t</i>³ + <i>C</i><sub>1</sub><i>t</i> + <i>C</i><sub>2</sub>; con <i>v</i>(0) = −3 e <i>x</i>(0) = 0 otteniamo <i>C</i><sub>1</sub> = −3 e <i>C</i><sub>2</sub> = 0.</p>
      <div class="charts">
        ${kchart(KR.cx, { xlabel: 't (s)', ylabel: 'x (m) · pendenza = v', label: 'Posizione in funzione del tempo', live: TAN('cx') + CUR('cx'), series: [{ pts: samples(100, 0, 2, M.cx) }] })}
        ${kchart(KR.cv, { xlabel: 't (s)', ylabel: 'v (m/s) · area = Δx', label: 'Velocità in funzione del tempo, area con segno', live: AREA('cv') + CUR('cv'), series: [{ pts: samples(100, 0, 2, M.cv) }] })}
        ${kchart(KR.ca, { xlabel: 't (s)', ylabel: 'a (m/s²) · area = Δv', label: 'Accelerazione in funzione del tempo, area colorata', live: AREA('ca') + CUR('ca'), series: [{ pts: samples(100, 0, 2, M.ca) }] })}
      </div>
      <p class="hintline">Campionamento ogni 0.2 s; il tragitto di ritorno è mostrato in primo piano.</p>`,
    cam: { target: [ST.cube + 0.25, 0.25, 0], az: -6, el: 28, dist: 19.5 }, lit: 'bead', look: {}, scene: 'cube',
    fig: 'x = t³ − 3t',
  },
];

// ---------- click a concept: what it breaks into ----------
const sign = v => v > 1e-9 ? '+' : v < -1e-9 ? '−' : '';
export const PLATES = {
  ball: { text: `Una pallina in caduta libera. Nessuna forza la spinge verso l'alto dopo il lancio; sale solo per inerzia e la gravità ne decresce la velocità di ${M.G.toFixed(2)} m/s ogni secondo.`,
    facts: t => [['tempo', `${t.toFixed(2)} s`], ['posizione y', `${M.y(t).toFixed(2)} m`], ['velocità v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['accelerazione a', `−${M.G.toFixed(2)} m/s²`]] },
  staff: { text: `La retta verticale rappresenta l'asse delle posizioni, con origine nel punto di lancio. Il segno nero scorre all'altezza istantanea della pallina; la freccia nera indica lo spostamento dall'origine, che torna a zero all'atterraggio anche se il percorso totale è ${(2 * M.H).toFixed(2)} m.`,
    facts: t => [['posizione y', `${M.y(t).toFixed(2)} m`], ['spostamento', `${sign(M.y(t))}${Math.abs(M.y(t)).toFixed(2)} m`], ['distanza percorsa', `${M.distance(t).toFixed(2)} m`]] },
  vArrow: { text: `La lunghezza della freccia rappresenta il modulo della velocità e il verso ne indica il segno. È disegnata in scala fissa: velocità doppia corrisponde a lunghezza doppia.`,
    facts: t => [['velocità', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['modulo (rapidità)', `${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['verso', M.vy(t) > 1e-9 ? 'verso l’alto' : M.vy(t) < -1e-9 ? 'verso il basso' : 'nullo, per un istante']] },
  aArrow: { text: `L'accelerazione è costante in ogni istante, quindi questo vettore rosso non cambia mai. Che la pallina acceleri o rallenti dipende dalla concordanza di segno con la velocità.`,
    facts: t => [['accelerazione', `−${M.G.toFixed(2)} m/s²`], ['velocità', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['stato del moto', M.vy(t) > 1e-9 ? 'sta rallentando' : M.vy(t) < -1e-9 ? 'sta accelerando' : 'nel punto più alto']] },
  boardX: { text: `La retta rossa rappresenta la tangente alla curva in questo istante. La sua pendenza è la velocità istantanea: ripida al lancio, orizzontale al vertice, inclinata verso il basso all'impatto.`,
    facts: t => [['pendenza = v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  boardV: { text: `Una retta, dunque la pendenza (l'accelerazione) è costante. L'area sottesa tra la retta e l'asse dei tempi corrisponde allo spostamento. L'area sotto lo zero conta come negativa, quindi al termine del volo le due aree si compensano.`,
    facts: t => [['pendenza = a', `−${M.G.toFixed(2)} m/s²`], ['area = Δy', `${sign(M.areaUnderV(t))}${Math.abs(M.areaUnderV(t)).toFixed(2)} m`]] },
  boardA: { text: `Una linea orizzontale: accelerazione costante. L'area sottesa rappresenta la variazione complessiva di velocità, a·t.`,
    facts: t => [['area = Δv', `${t > 0 ? '−' : ''}${(M.G * t).toFixed(2)} m/s`], ['v = v₀ + Δv', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  proj: { text: `Due moti indipendenti che si svolgono simultaneamente: moto rettilineo uniforme in orizzontale, caduta libera in verticale. Condividono unicamente la coordinata temporale.`,
    facts: t => [['x', `${M.x(t).toFixed(2)} m`], ['y', `${M.y(t).toFixed(2)} m`], ['tempo', `${t.toFixed(2)} s`]] },
  projV: { text: `Il vettore velocità si scompone in una componente orizzontale costante e una componente verticale identica a quella della pallina lanciata verso l'alto. La somma vettoriale restituisce il vettore totale.`,
    facts: t => [['vₓ', `${M.VX.toFixed(2)} m/s`], ['v_y', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['modulo √(vₓ² + v_y²)', `${Math.hypot(M.VX, M.vy(t)).toFixed(2)} m/s`]] },
  shadow: { text: `Una luce dall'alto proietta l'ombra del moto sul pavimento. Rimane solo il moto orizzontale: intervalli di spazio uguali in tempi uguali, poiché non agiscono forze laterali.`,
    facts: t => [['Δx percorso', `${M.x(t).toFixed(2)} m`], ['passo ogni ' + M.STROBE.toFixed(1) + ' s', `${(M.VX * M.STROBE).toFixed(2)} m`]] },
  rainRoad: { text: `Dalla strada, ogni goccia cade verticalmente a ${M.RAIN.vr.toFixed(1)} m/s mentre l'auto avanza a ${M.RAIN.vc.toFixed(1)} m/s. Nel sistema della terra la pioggia non ha inclinazione.`,
    facts: () => [['auto, v_CG', `${M.RAIN.vc.toFixed(2)} m/s avanti`], ['pioggia, v_RG', `${M.RAIN.vr.toFixed(2)} m/s giù`], ['traiettoria goccia', 'verticale']] },
  rainCar: { text: `Dall'auto, il veicolo è fermo. La strada scorre all'indietro a ${M.RAIN.vc.toFixed(1)} m/s e ogni goccia conserva il moto verso il basso scorrendo anche all'indietro, tracciando una scia inclinata.`,
    facts: () => [['pioggia, v_RC', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['angolo dalla verticale', `${M.RAIN_ANGLE.toFixed(1)}°`], ['strada, v_GC', `${M.RAIN.vc.toFixed(2)} m/s indietro`], ['auto', '0 m/s']] },
  rainSum: { text: `Somma punta-coda: inizia con la velocità della pioggia rispetto al suolo, poi aggiungi la velocità del suolo rispetto all'auto. Il vettore risultante è la velocità della pioggia vista dall'auto.`,
    facts: () => [['componente orizzontale', `${M.V_RC[0].toFixed(2).replace('-', '−')} m/s`], ['componente verticale', `${M.V_RC[1].toFixed(2).replace('-', '−')} m/s`], ['|v_RC|', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['tan θ = 10.0 / 7.0', `θ = ${M.RAIN_ANGLE.toFixed(1)}°`]] },
  river: { text: `L'acqua scorre a ${M.RIVER.vw.toFixed(1)} m/s rispetto alla riva. Qualsiasi corpo galleggiante viene trascinato a tale velocità sommandola alla propria velocità relativa all'acqua.`,
    facts: (t, s) => [['corrente, v_WS', `${M.RIVER.vw.toFixed(2)} m/s a valle`], ['larghezza', `${M.RIVER.w} m`], ['tempo', `${s.river.t.toFixed(1)} s`]] },
  boatA: { text: `Puntata perpendicolarmente alla sponda, raggiunge l'altra riva in w/v_b = ${M.crossTime(0).toFixed(1)} s (il tempo minimo), ma la corrente la sposta di ${M.drift(0).toFixed(1)} m a valle.`,
    facts: (t, s) => boatFacts(0, s.river.t) },
  boatB: { text: `Inclinata di ${deg(M.AIM_UP)}° a monte, la sua componente controcorrente (${M.RIVER.vb.toFixed(1)} sin θ = ${M.RIVER.vw.toFixed(1)} m/s) annulla la corrente, approdando esattamente di fronte in ${M.crossTime(M.AIM_UP).toFixed(1)} s.`,
    facts: (t, s) => boatFacts(M.AIM_UP, s.river.t) },
  pull: { text: `L'accelerazione non è costante, quindi le formule del moto uniformemente accelerato non valgono. La velocità è l'integrale di a(t) e la posizione è l'integrale di v(t).`,
    facts: (t, s) => { const u = s.pull.t; return [['tempo', `${u.toFixed(2)} s`], ['x = ∫v dt', `${M.px(u).toFixed(2)} m`], ['v = ∫a dt', `${M.pv(u).toFixed(2)} m/s`], ['a', `${M.pa(u).toFixed(2)} m/s²`]]; } },
  pullA: { text: `a = ${M.PULL.a0.toFixed(1)} − ${M.PULL.k.toFixed(1)}t: pendenza del grafico v–t, che si annulla a t₁ = ${M.T1.toFixed(2)} s. La sua derivata da/dt = −${M.PULL.k.toFixed(1)} m/s³ è nota come strappo (jerk).`,
    facts: (t, s) => { const u = s.pull.t; return [['a = dv/dt', `${M.pa(u).toFixed(2)} m/s²`], ['da/dt', u < M.T1 ? `−${M.PULL.k.toFixed(2)} m/s³` : '0'], ['area (velocità)', `${M.pv(u).toFixed(2)} m/s`]]; } },
  bead: { text: `x = t³ − 3t. Derivando una volta si ottiene la velocità, due volte l'accelerazione. Al momento dell'inversione v = 0 ma a = ${M.ca(M.T_TURN).toFixed(1)} m/s²: velocità nulla non significa accelerazione nulla.`,
    facts: (t, s) => { const u = s.cube.t, v = M.cv(u), a = M.ca(u); return [['tempo', `${u.toFixed(2)} s`], ['x', `${f(M.cx(u))} m`], ['v = 3t² − 3', `${f(v)} m/s`], ['a = 6t', `${f(a)} m/s²`], ['stato', Math.abs(v) < 0.02 ? 'inversione del moto' : v * a > 0 ? 'accelera' : a === 0 ? 'a = 0 per un istante' : 'rallenta']]; } },
  cubeLine: { text: `La freccia nera è lo spostamento dall'origine. La particella va per 2 m a sinistra e poi 4 m a destra: lo spostamento a 2 s è +2 m, ma la distanza totale percorsa è 6 m.`,
    facts: (t, s) => { const u = s.cube.t; return [['posizione x', `${f(M.cx(u))} m`], ['spostamento', `${f(M.cx(u))} m`], ['distanza percorsa', `${M.cdist(u).toFixed(2)} m`]]; } },
};
function boatFacts(phi, t) {
  const tt = Math.min(t, M.crossTime(phi)), [dx, dy] = M.boatPos(phi, t);
  return [['tempo', `${tt.toFixed(1)} s`], ['traversata', `${dy.toFixed(1)} di ${M.RIVER.w} m`], ['a valle', `${Math.abs(dx) < 0.05 ? '0.0' : dx.toFixed(1)} m`], ['modulo |v_BS|', `${M.vlen(M.vBS(phi)).toFixed(2)} m/s`], ['approdo', `${M.crossTime(phi).toFixed(1)} s, ${Math.abs(M.drift(phi)) < 0.05 ? '0.0' : M.drift(phi).toFixed(1)} m a valle`]];
}

