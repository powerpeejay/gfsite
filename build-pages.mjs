// One-shot generator for Senta subpages.
// Reads zoeliakie-verstehen.html as the template, swaps title/meta/hero/main/active-nav per page, writes files.
import { readFile, writeFile } from 'fs/promises';

const template = await readFile('zoeliakie-verstehen.html', 'utf8');

// Base slots:
const HERO_RE = /<!-- PAGE HERO -->[\s\S]*?<!-- MAIN CONTENT -->/;
const MAIN_RE = /<!-- MAIN CONTENT -->[\s\S]*?<!-- CTA BAND -->/;
const TITLE_RE = /<title>[^<]*<\/title>/;
const DESC_RE = /<meta name="description" content="[^"]*">/;
const ACTIVE_NAV_RE = /<a href="zoeliakie-verstehen\.html" class="nav-link" style="color:#4F8A7A">Zöliakie<\/a>/;

const bare = (n) => `<a href="${n}.html" class="nav-link">${NAV_LABEL[n]}</a>`;
const active = (n) => `<a href="${n}.html" class="nav-link" style="color:#4F8A7A">${NAV_LABEL[n]}</a>`;
const NAV_LABEL = {
  'index':'Start','zoeliakie-verstehen':'Zöliakie','zuhause':'Zuhause','produkte-shops':'Produkte',
  'auswaerts':'Auswärts','reisen':'Reisen','mindset':'Mindset','angebote-kontakt':'Angebote'
};

const build = ({slug, title, desc, navKey, hero, main}) => {
  let out = template;
  out = out.replace(TITLE_RE, `<title>${title} — Senta Jacob</title>`);
  out = out.replace(DESC_RE, `<meta name="description" content="${desc}">`);
  // Reset Zöliakie nav link to bare, then set active on navKey
  out = out.replace(ACTIVE_NAV_RE, bare('zoeliakie-verstehen'));
  if (navKey && NAV_LABEL[navKey]) {
    // Replace the first occurrence of the bare link for navKey within the desktop nav
    const bareLink = bare(navKey);
    const activeLink = active(navKey);
    out = out.replace(bareLink, activeLink);
  }
  out = out.replace(HERO_RE, `<!-- PAGE HERO -->\n${hero}\n<!-- MAIN CONTENT -->`);
  out = out.replace(MAIN_RE, `<!-- MAIN CONTENT -->\n${main}\n<!-- CTA BAND -->`);
  return out;
};

const hero = (crumb, tag, h1, lead) => `
<section class="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-6">
  <div class="flex items-center gap-2 text-xs text-brand-muted">
    <a href="index.html" class="hover:text-brand-teal">Start</a><span>/</span><span class="text-brand-ink">${crumb}</span>
  </div>
  <div class="grid grid-cols-12 gap-5 mt-5" data-stagger>
    <div class="col-span-12 lg:col-span-8">
      <div class="reveal pill" style="--i:0"><span class="dot"></span> ${tag}</div>
      <h1 class="reveal mt-5 text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem] max-w-[18ch]" style="--i:1">${h1}</h1>
      <p class="reveal mt-5 text-[1.02rem] text-brand-muted max-w-[52ch]" style="--i:2">${lead}</p>
    </div>
  </div>
</section>`;

// Helper for a standard 8/4 split page body
const body = (leftInner, sidebarInner) => `
<section class="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-8">
  <div class="grid grid-cols-12 gap-5 lg:gap-6">
    <article class="col-span-12 lg:col-span-8 card prose-block reveal" style="padding:2.5rem 2.5rem 2.2rem">
${leftInner}
    </article>
    <aside class="col-span-12 lg:col-span-4 flex flex-col gap-5">
${sidebarInner}
    </aside>
  </div>
</section>`;

const darkSidebar = (label, title, items) => `
  <div class="card card-float reveal" style="padding:1.8rem 1.8rem;background:linear-gradient(155deg,#4F8A7A 0%,#2F5448 100%);color:#fff;border-color:rgba(255,255,255,0.06)">
    <div class="text-[0.72rem] uppercase tracking-[0.18em] text-white/70">${label}</div>
    <h3 class="mt-3 font-display text-[1.4rem] text-white leading-tight">${title}</h3>
    <ul class="mt-5 space-y-3 text-[0.92rem] text-white/85">
${items.map(x => `      <li class="flex gap-2"><span class="text-white/40">→</span> ${x}</li>`).join('\n')}
    </ul>
  </div>`;

const linksSidebar = (label, links) => `
  <div class="card reveal" style="padding:1.6rem 1.6rem">
    <div class="text-[0.72rem] uppercase tracking-[0.18em] text-brand-teal">${label}</div>
    <ul class="mt-3 space-y-2 text-[0.9rem]">
${links.map(([href,text]) => `      <li><a href="${href}" class="text-brand-ink hover:text-brand-teal">→ ${text}</a></li>`).join('\n')}
    </ul>
  </div>`;

const calloutSidebar = (title, body) => `
  <div class="card reveal" style="padding:1.6rem 1.6rem;background:#EDF6F0">
    <div class="font-display text-[1.15rem] text-brand-charcoal leading-snug">${title}</div>
    <p class="mt-2 text-[0.85rem] text-brand-muted">${body}</p>
  </div>`;

// ===================== PAGES =====================
const pages = [];

// 1. Beschwerden & Diagnose
pages.push({
  slug: 'beschwerden-diagnose', navKey: 'zoeliakie-verstehen',
  title: 'Beschwerden & Diagnose', desc: 'Typische und unspezifische Symptome, der Diagnoseweg, und der wichtigste Fehler beim Bluttest.',
  hero: hero('Beschwerden & Diagnose','Symptome im Detail','Beschwerden<br>und <span class="italic">Diagnose.</span>','Welche Symptome auf Zöliakie hindeuten — und welche nicht. Wie der Diagnoseweg wirklich abläuft, und warum der Zeitpunkt entscheidend ist.'),
  main: body(
`      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> Beschwerden erkennen</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[20ch]">Zöliakie sieht bei jedem anders aus.</h2>
      <p class="mt-5">Die Lehrbuch-Symptome — Bauchschmerzen, Durchfall, Gewichtsverlust — sind bei Erwachsenen oft gar nicht die führenden Beschwerden. Viele Menschen kommen über Umwege zur Diagnose: über einen Eisenmangel, der nicht weggeht; über unerklärliche Erschöpfung; über Hautprobleme, die kein Dermatologe einordnen kann.</p>
      <h3>Typische Symptome</h3>
      <ul><li>Bauchschmerzen, Blähungen, Völlegefühl</li><li>Durchfall — aber auch Verstopfung</li><li>Übelkeit, besonders nach Getreideprodukten</li><li>Müdigkeit nach dem Essen</li><li>Gewichtsverlust ohne Diät</li></ul>
      <h3>Unspezifische Beschwerden — die fast nie sofort zugeordnet werden</h3>
      <ul><li>Eisenmangel, der auf Tabletten kaum anspringt</li><li>Folsäure- oder Vitamin-B12-Mangel</li><li>Haut: Dermatitis herpetiformis (juckende, bläschenartige Ausschläge), oft an Ellbogen und Knien</li><li>Zahnschmelzdefekte, wiederkehrende Aphten im Mund</li><li>Kopfschmerzen, Migräne, Brainfog</li><li>Gelenk- und Muskelschmerzen ohne rheumatologische Ursache</li><li>Stimmungsschwankungen, depressive Verstimmung</li><li>Unfruchtbarkeit oder wiederholte Fehlgeburten bei Frauen</li><li>Bei Kindern: Wachstumsverzögerung, verzögerte Pubertät</li></ul>
      <div class="callout"><strong>Ernährungstagebuch:</strong> Wenn du den Verdacht hast und noch nicht diagnostiziert bist, führe ein paar Wochen ein Tagebuch — was gegessen, wie gefühlt. Das gibt deiner Ärztin echte Anhaltspunkte und beschleunigt die Diagnose.</div>
      <h3>Der Diagnoseweg</h3>
      <p>Der Weg besteht aus zwei Säulen — beide sind nötig:</p>
      <ul><li><strong>1. Bluttest.</strong> Antikörper (tTG-IgA, Gesamt-IgA, bei Bedarf EMA). Die Werte werden in Relation zu einem Referenzbereich bewertet — eine einfache „positiv/negativ“-Logik greift zu kurz.</li><li><strong>2. Dünndarmbiopsie.</strong> Bei auffälligem Bluttest: Magenspiegelung mit Gewebeentnahme. Der Pathologe sieht dann, ob die Zottenstruktur verändert ist (Marsh-Klassifikation).</li></ul>
      <div class="warning"><strong>Der Klassiker-Fehler:</strong> Vor der Biopsie mit glutenfreier Ernährung anfangen. Ohne Gluten im System normalisieren sich Antikörper und Schleimhaut — und die Tests werden falsch negativ. Die einzige Konsequenz: Du musst Wochen später erneut Gluten essen („Glutenbelastung“), um die Diagnose nachzuholen. Unnötig schmerzhaft. Iss weiter, bis die Untersuchungen durch sind.</div>
      <h3>Nach der Diagnose — was passiert dann?</h3>
      <p>Eine Verlaufskontrolle nach 3–6 Monaten und dann jährlich ist Standard. Antikörper werden nachverfolgt, der Vitaminstatus wird geprüft. Bei Kindern engmaschiger, weil Wachstum und Nährstoffaufnahme eng zusammenhängen. Wichtig: Die Diagnose ist keine Endstation. Sie ist ein Startpunkt für eine Ernährungsweise, die dein Körper gut mitgeht.</p>`,
    darkSidebar('Rote Flaggen', 'Wann zum Arzt?', [
      'Eisenmangel, der sich nicht behandeln lässt',
      'Monate­lange Erschöpfung ohne Ursache',
      'Wiederkehrende Bauchbeschwerden',
      'Hautausschläge an Ellbogen/Knien',
      'Wachstumsstopp bei Kindern'
    ]) + linksSidebar('Weiterlesen', [
      ['zoeliakie-verstehen.html','Was ist Zöliakie?'],
      ['zuhause.html','Küche einrichten'],
      ['mindset.html','Mindset nach der Diagnose']
    ]) + calloutSidebar('Informativ, nicht ärztlich', 'Diese Seite ersetzt keine ärztliche Beratung. Für Diagnose, Bluttest und Biopsie ist deine Hausärztin oder Gastroenterologin die erste Adresse.')
  )
});

// 2. Zuhause
pages.push({
  slug:'zuhause', navKey:'zuhause',
  title:'Zuhause — Sichere Küche', desc:'Küche einrichten, Kreuzkontamination vermeiden, Mischhaushalt, Vorrat, Basis-Rezepte.',
  hero: hero('Zuhause','Küche & Alltag','Zuhause<br><span class="italic">sicher kochen.</span>','Dein Heimspiel. Wie du die Küche einmal gründlich glutensicher machst — und danach nicht mehr nachdenken musst.'),
  main: body(
`      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> Die eigene Küche</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[22ch]">Einmal gründlich einrichten — dann läuft es.</h2>
      <p class="mt-5">Die Küche ist der Ort, an dem du 100 % Kontrolle hast. Genau deshalb lohnt es sich, sie einmal durchzudenken. Nicht mit Perfektionismus, sondern mit einem klaren System: Was ist sicher, was ist getrennt, wer in der Familie weiß Bescheid.</p>
      <h3>Grundausstattung — die Must-haves</h3>
      <ul><li><strong>Eigener Toaster</strong> oder Toasterbeutel (Krümel sind hartnäckig, der Toaster ist der Kreuzkontaminations-Klassiker Nummer 1)</li><li><strong>Eigene Holzbretter</strong> — Holz nimmt Gluten in Poren auf, Plastik lässt sich abwaschen</li><li><strong>Eigene Kochlöffel und Pfannenwender</strong></li><li><strong>Eigenes Sieb</strong> — Nudelwasser-Reste unsichtbar, aber da</li><li><strong>Eigene Butterdose und Marmeladenglas</strong> (niemals mit dem „Krümel-Messer“ der anderen reinfahren)</li><li><strong>Farbige Markierung</strong> reicht als System — zum Beispiel grüne Punkte für „sicher“</li></ul>
      <h3>Kreuzkontamination vermeiden — ohne Paranoia</h3>
      <p>Es geht um drei Dinge: Oberflächen, Werkzeuge, Reihenfolge. Oberflächen vor dem Kochen mit frischem Lappen abwischen. Werkzeuge sind dediziert oder werden heiß gespült. Reihenfolge: Glutenfreies zuerst zubereiten, dann das Normale. Nicht umgekehrt.</p>
      <h3>Der Mischhaushalt — wenn nicht alle glutenfrei leben</h3>
      <p>Das Schöne: Du musst niemanden zu einem glutenfreien Leben verpflichten. Es funktioniert mit klaren optischen Zonen:</p>
      <ul><li><strong>Ein getrenntes Regalfach</strong> für glutenhaltige Lebensmittel — unten, damit nichts runterkrümelt</li><li><strong>Ein eigener „Krümel-Platz“</strong> für Brot, mit festem Ablageort fürs Messer</li><li><strong>Ein „ich bin sicher“-Regal</strong> für deine eigenen Produkte</li><li><strong>Eine Vereinbarung</strong> zu den Arbeitsflächen: nach Gebrauch wischen</li></ul>
      <div class="callout"><strong>Für den Familienfrieden:</strong> Ich empfehle, das Gespräch mit der Familie nicht über Regeln, sondern über das „Warum“ zu führen. Wenn alle verstehen, dass es nicht um Vorliebe geht, sondern um eine medizinische Grenze, ziehen fast alle mit.</div>
      <h3>Vorrat — das, was du immer im Haus hast</h3>
      <ul><li>Reis (Basmati, Risotto, Rundkorn)</li><li>Polenta, Maismehl</li><li>Buchweizen, Hirse, Quinoa, Amarant</li><li>Glutenfreie Nudeln (Mais, Reis oder Linse)</li><li>Zertifizierte glutenfreie Haferflocken</li><li>Flohsamenschalen — dein Back-Geheimnis</li><li>Ein guter gf-Mehlmix</li><li>Hülsenfrüchte (Linsen und Kichererbsen explizit als „glutenfrei“ gekennzeichnet kaufen)</li><li>Tamari statt Sojasauce</li><li>Frisches Gemüse, Obst, Eier, Milch — die unverarbeitete Basis</li></ul>
      <h3>Backen — die drei Regeln</h3>
      <ul><li><strong>Ein Ei mehr als im Rezept angegeben.</strong> Glutenfreie Teige binden schlechter.</li><li><strong>Ein Esslöffel Flohsamenschalen</strong> auf 250 g Mehlmix. Sorgt für Struktur und verhindert das Krümeln.</li><li><strong>Weniger mechanisch, mehr Ruhezeit.</strong> Teige dürfen 20 Minuten ruhen, bevor sie in den Ofen kommen — das macht einen großen Unterschied.</li></ul>
      <h3>Medikamente — der übersehene Punkt</h3>
      <p>Manche Tabletten verwenden Weizenstärke als Hilfsstoff. Die Mengen sind gering, aber bei täglicher Einnahme summieren sie sich. Bitte deine Apothekerin um eine Rücksprache — oft gibt es ein äquivalentes Präparat ohne Weizenstärke.</p>`,
    darkSidebar('Starter-Kit', 'Was zuerst?', [
      'Toaster oder Toasterbeutel besorgen',
      '2 Holzbretter grün markieren',
      'Eigenes Sieb kaufen',
      'Butter und Marmelade trennen',
      'Flohsamenschalen + gf-Mehlmix'
    ]) + linksSidebar('Weiterlesen', [
      ['produkte-shops.html','Produkte sicher erkennen'],
      ['auswaerts.html','Auswärts essen'],
      ['kinder.html','Küche mit Kindern']
    ]) + calloutSidebar('Kein Perfektionismus', 'Die Küche muss funktionieren, nicht makellos sein. 95 % Routine plus 5 % Wachsamkeit trägt dich weiter als 100 % Dauer-Alarm.')
  )
});

// 3. Produkte & Shops
pages.push({
  slug:'produkte-shops', navKey:'produkte-shops',
  title:'Produkte & Shops', desc:'Zutatenlisten richtig lesen, das Glutenfrei-Symbol, Marken, Glutenfallen und verlässliche Einkaufsquellen.',
  hero: hero('Produkte & Shops','Einkaufen','Produkte<br><span class="italic">sicher finden.</span>','Wie du Zutatenlisten in 10 Sekunden entschlüsselst, welche Marken verlässlich sind und wo du entspannt einkaufst.'),
  main: body(
`      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> Verpackungen lesen</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[22ch]">Drei Dinge — und du bist durch.</h2>
      <p class="mt-5">Zutatenlisten sehen kompliziert aus. Sind sie nicht, sobald du weißt, wo du hinschaust. Ich prüfe drei Stellen, immer in der gleichen Reihenfolge, in weniger als zehn Sekunden.</p>
      <h3>Das durchgestrichene Ähren-Symbol</h3>
      <p>Das offizielle Siegel der europäischen Zöliakie-Gesellschaften. Produkte mit diesem Symbol werden laufend auditiert und halten den EU-Grenzwert von 20 mg/kg sicher ein. Wenn du unsicher bist — dieses Symbol ist deine verlässlichste Wahl.</p>
      <h3>Der 10-Sekunden-Check</h3>
      <ul><li><strong>1. Die fett gedruckten Allergene</strong> in der Zutatenliste. Seit EU-Verordnung müssen Weizen, Gerste, Roggen, Hafer, Dinkel, Kamut hervorgehoben sein. Wenn du keine fette Schrift siehst: gutes Zeichen. Wenn doch: weiter.</li><li><strong>2. Die „Malz-Falle“.</strong> Gerstenmalz, Malzextrakt, Malzaroma — alles Gluten, auch wenn „Malz“ harmlos klingt.</li><li><strong>3. Der Kleingedruckte-Warnhinweis.</strong> „Kann Spuren von Gluten enthalten“ — für Zöliakie nicht geeignet.</li></ul>
      <div class="callout"><strong>Rezepturen ändern sich.</strong> Auch Produkte, die du schon zehnmal gekauft hast, können nach einer stillen Rezeptur-Änderung plötzlich Gluten enthalten. Einmal pro Monat erneut nachlesen reicht meistens.</div>
      <h3>Glutenfallen — das übersehen fast alle</h3>
      <ul><li><strong>Normaler Hafer</strong> — außer er ist explizit als glutenfrei zertifiziert. Kreuzkontamination auf dem Feld oder in der Mühle ist fast garantiert.</li><li><strong>Linsen und Kichererbsen</strong> — dieselbe Begründung. Nur „glutenfrei“-markierte kaufen.</li><li><strong>Seitan</strong> — das <em>ist</em> reines Weizeneiweiß. Kein Produkt auf Seitan-Basis ist sicher.</li><li><strong>Couscous, Bulgur, Grünkern</strong> — Weizen in anderer Form.</li><li><strong>Dinkel</strong> — enthält Gluten. Auch wenn „natürlich“ auf der Packung steht.</li><li><strong>Sojasauce</strong> — fast immer mit Weizen. Greif zu <em>Tamari</em> (dort steht „glutenfrei“).</li><li><strong>Manche Käsesorten mit Gewürzmischungen</strong></li><li><strong>Wurst und Fleischkäse</strong> — Bindemittel prüfen</li><li><strong>Bier</strong> — außer, es ist explizit glutenfrei gebraut</li></ul>
      <h3>Wo einkaufen?</h3>
      <p><strong>Supermärkte:</strong> Große Filialen von Edeka, Rewe, Kaufland führen mittlerweile ein solides glutenfreies Sortiment. Aldi und Lidl haben regelmäßig Aktionsware. Drogerien wie Rossmann und dm sind überraschend gut sortiert bei Grundzutaten (Mehle, Flocken, Riegel).</p>
      <p><strong>Online-Shops:</strong> Schär, Alnatura, SoLent, Bauckhof, Seitz glutenfrei — alle solide. Bei größerem Bedarf lohnt sich eine Sammel-Bestellung alle 6–8 Wochen.</p>
      <h3>Tools & Apps — was wirklich hilft</h3>
      <ul><li><strong>DZG-App</strong> (Deutsche Zöliakie-Gesellschaft): Die verlässlichste. Wird regelmäßig aktualisiert, enthält Produktlisten und Restaurantverzeichnis.</li><li><strong>Celiac Travel Cards</strong> für Auslandsreisen.</li><li><strong>Nicht empfohlen:</strong> Generische Barcode-Scanner-Apps wie Codecheck. Sie arbeiten mit alten Datenbanken und erkennen Rezepturänderungen nicht.</li></ul>
      <h3>Alternativen für „ich vermisse etwas“</h3>
      <ul><li><strong>Statt Weißmehl:</strong> gf-Mehlmix, Reismehl, Buchweizenmehl, Mandelmehl</li><li><strong>Statt Sojasauce:</strong> Tamari</li><li><strong>Statt Couscous:</strong> Hirse, Quinoa</li><li><strong>Statt Bulgur:</strong> Buchweizen-Grütze</li><li><strong>Statt klassischem Brot:</strong> Brote auf Buchweizen-Basis von Seitz, Bauckhof, Schär, oder selbstgebacken mit Flohsamenschalen</li></ul>`,
    darkSidebar('Einkaufs-Routine', '3 Stopps, fertig', [
      'Obst, Gemüse, Eier, Fleisch (sicher)',
      'GF-Regal für Basics und Brot',
      'Drogerie für Haferflocken, Riegel',
      '1× Monat Online für Spezial­artikel'
    ]) + linksSidebar('Weiterlesen', [
      ['zuhause.html','Vorrat einrichten'],
      ['auswaerts.html','Auswärts essen'],
      ['reisen.html','Reisen & unterwegs']
    ]) + calloutSidebar('Das Ähren-Symbol', 'Die durchgestrichene Ähre ist das europäische Gütesiegel für glutenfreie Produkte — regelmäßig auditiert und am verlässlichsten.')
  )
});

// 4. Kinder
pages.push({
  slug:'kinder', navKey:'zoeliakie-verstehen',
  title:'Kinder & Zöliakie', desc:'Diagnose bei Kindern, kindgerechte Aufklärung, Kita, Schule, Geburtstage und der Umgang mit Knete und Fingerfarben.',
  hero: hero('Kinder & Zöliakie','Für Eltern','Kinder &<br><span class="italic">Zöliakie.</span>','Wie du dein Kind sicher durch den Alltag begleitest — ohne dass es sich ausgeschlossen fühlt. Kita, Schule, Geburtstage, Freunde.'),
  main: body(
`      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> Erst die Diagnose</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[22ch]">Dein Kind ist nicht krank — es hat eine klare Regel.</h2>
      <p class="mt-5">Der Ton, in dem du das Thema zuhause trägst, wird zum Ton, in dem dein Kind damit lebt. Wenn Zöliakie als „schlimm“ eingeführt wird, begleitet dieses Gefühl die nächsten Jahre. Wenn sie als „anders, aber okay“ eingeführt wird, auch.</p>
      <h3>Beschwerden und Diagnose bei Kindern</h3>
      <p>Kinder zeigen Zöliakie oft anders als Erwachsene. Typisch sind: Wachstumsverzögerung, verzögerte Pubertät, wiederkehrende Bauchschmerzen, verändertes Stuhlbild, manchmal Reizbarkeit und Konzentrationsprobleme. Die Diagnose läuft über Bluttest und, je nach Alter und Antikörperhöhe, Biopsie. Bei ganz hohen Werten kann auf die Biopsie unter bestimmten Bedingungen verzichtet werden — das entscheidet die Ärztin.</p>
      <div class="callout"><strong>Warum strikt ab dem ersten Tag:</strong> Der wachsende Körper deines Kindes braucht eine intakte Darmschleimhaut für Nährstoffaufnahme, Wachstum und Hirnentwicklung. Die gute Nachricht: Kinder erholen sich nach der Umstellung meist schnell und sichtbar.</div>
      <h3>Kindgerechte Aufklärung — in einer Sprache, die ankommt</h3>
      <p>Benutze Bilder statt Warnungen. Zum Beispiel: „In deinem Bauch gibt es ganz kleine Fasern — wie weiche Gras-Halme. Die lieben Reis, Mais, Obst und Gemüse. Sie mögen aber kein Gluten. Wenn du Gluten isst, werden sie platt und dein Bauch funktioniert nicht richtig. Wenn du glutenfrei isst, stehen sie aufrecht und dein Bauch ist stark.“</p>
      <p>Ab etwa drei Jahren versteht ein Kind den Unterschied zwischen „darf“ und „darf nicht“ auch bei Essen. Ab etwa sechs Jahren kann es bei Unsicherheit selbst fragen: „Ist da Gluten drin?“</p>
      <h3>Sicherheit geben, ohne Angst zu erzeugen</h3>
      <p>Die Kunst besteht darin, klar zu sein (keine Grauzone), ohne Dramatik (keine Angstgeschichten). Dein Kind darf wissen: „Wenn du unsicher bist, isst du es nicht. Das ist dann richtig, nicht peinlich. Mama oder Papa fragen sonst nach.“</p>
      <h3>Kita und Schule</h3>
      <ul><li><strong>Ein persönliches Gespräch</strong> mit der Leitung <em>und</em> dem direkten Team — nicht nur ein Zettel.</li><li><strong>Ein einseitiges Info-Blatt:</strong> Name, Diagnose, Grundregel („kein Gluten, keine Spuren“), 3 konkrete Punkte, Notfallnummer.</li><li><strong>Eine Ersatz-Box im Kühlschrank</strong> für Feste und spontane Geburtstage.</li><li><strong>Klare Kommunikation zu Mittagessen:</strong> entweder wird zuverlässig glutenfrei gekocht, oder ihr bringt das Essen mit. Beide Wege sind okay — die halbgute Lösung ist die riskante.</li><li><strong>Bei älteren Kindern</strong>: eine kleine „Notfall-Snackbox“ im Ranzen, damit es nicht hungrig mit anderen essen muss, was es nicht kennt.</li></ul>
      <h3>Knete, Fingerfarbe, Basteln</h3>
      <p>Das wird in der ärztlichen Erstaufklärung fast nirgendwo erwähnt, gehört aber auf jeden Alltags-Radar: <strong>Handelsübliche Knete enthält oft Weizen.</strong> Kinder, die daran riechen oder nach dem Kneten die Hand in den Mund nehmen, können reagieren. Gleiches gilt für manche Fingerfarben. Es gibt glutenfreie Alternativen — oder Knete aus Reismehl selbst machen (Rezept unten).</p>
      <div class="callout"><strong>Knete selbst machen:</strong> 2 Tassen Reismehl, 1 Tasse Salz, 2 EL Öl, 1 TL Zitronensäure, 1,5 Tassen kochendes Wasser mit Lebensmittelfarbe. Alles kurz in der Pfanne rühren, bis sich ein Teig bildet. Auskühlen lassen. Hält im Kühlschrank mehrere Wochen.</div>
      <h3>Kindergeburtstage — nicht ausgeschlossen, sondern vorbereitet</h3>
      <p>Biete der einladenden Familie an, dass dein Kind einen eigenen Kuchen oder Muffin mitbringt. Die meisten Eltern sind dankbar — sie wollen dich nicht enttäuschen, aber wissen nicht, wie sie sicher backen. Dein Kind hat seinen eigenen Kuchen, niemand fühlt sich schlecht, alle feiern.</p>
      <h3>Austausch mit anderen Familien</h3>
      <p>Der DZG-Bundesverband hat regionale Gruppen und Familiennetzwerke. Gerade in den ersten Monaten hilft der Kontakt zu anderen Eltern mehr als jedes Buch — nicht wegen der Informationen, sondern wegen des Gefühls, nicht allein zu sein.</p>`,
    darkSidebar('Starter-Box', 'Die ersten 7 Tage', [
      'Gespräch mit Kita/Schule',
      'Info-Blatt ausdrucken',
      'Ersatz-Snackbox einrichten',
      'Knete prüfen oder ersetzen',
      'DZG-Familiengruppe suchen'
    ]) + linksSidebar('Weiterlesen', [
      ['zuhause.html','Küche für die Familie'],
      ['auswaerts.html','Essen gehen mit Kind'],
      ['mindset.html','Mindset für Eltern']
    ]) + calloutSidebar('Du bist die ruhige Stimme', 'Kinder übernehmen deinen Tonfall zum Thema Zöliakie. Wenn es für dich okay ist, wird es für sie okay. Wenn du angespannt bist, werden sie es auch sein.')
  )
});

// 5. Auswärts essen
pages.push({
  slug:'auswaerts', navKey:'auswaerts',
  title:'Auswärts essen', desc:'Restaurant-Besuche mit Zöliakie: Vorbereitung, Kommunikation, sichere und riskante Gerichte, Notfallplan.',
  hero: hero('Auswärts essen','Im Restaurant','Essen gehen —<br><span class="italic">ohne Angst.</span>','Wie du im Restaurant freundlich klar kommunizierst, welche Gerichte sicher sind, und was du tust, wenn es doch schiefgeht.'),
  main: body(
`      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> Vor dem Besuch</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[22ch]">Vorbereitung ist 80 % der Sicherheit.</h2>
      <p class="mt-5">Die allermeisten schlechten Restaurant-Erlebnisse passieren, weil die Arbeit nicht <em>vor</em> dem Besuch gemacht wird, sondern erst am Tisch. Mit zehn Minuten Vorbereitung drehst du das Verhältnis.</p>
      <h3>Die Vorbereitung</h3>
      <ul><li><strong>Speisekarte online prüfen.</strong> 80 % der Entscheidung fällt hier. Wenn kein einziges sicher klingendes Gericht drauf ist, wähl ein anderes Lokal.</li><li><strong>Vorab anrufen.</strong> Am besten nachmittags, 14:30–17:00 Uhr. Die Küche ist ruhiger, du sprichst mit dem Koch oder der Köchin statt mit einem gestressten Kellner.</li><li><strong>Reservierung mit Hinweis.</strong> „Zöliakie — keine Spuren Gluten, bitte für die Küche notieren.“</li><li><strong>Apps nutzen.</strong> Die DZG-App listet zertifizierte Restaurants. TripAdvisor hat einen brauchbaren glutenfrei-Filter.</li></ul>
      <h3>Kennzeichnungspflicht — was du erwarten darfst</h3>
      <p>In der EU müssen Allergene in der Speisekarte oder auf Anfrage nachweisbar gekennzeichnet sein. In der Praxis bedeutet das: Jedes Restaurant muss auf Nachfrage Auskunft geben können. Du bist rechtlich im vollen Recht, nachzufragen. Niemand darf dich abweisen oder als „kompliziert“ abstempeln.</p>
      <h3>Kommunikation — klar, freundlich, nicht entschuldigend</h3>
      <p>Drei Sätze, die du auswendig lernen darfst:</p>
      <div class="callout"><strong>Beim Ankommen:</strong> „Hallo, ich habe bei der Reservierung bereits durchgegeben, dass ich Zöliakie habe. Könntest du das bitte noch einmal mit der Küche klären? Es geht um Kreuzkontamination, nicht um ein Bisschen.“</div>
      <div class="callout"><strong>Beim Bestellen:</strong> „Ich bestelle das [Gericht]. Könnt ihr mir bestätigen, dass es in einer separaten Pfanne zubereitet wird und keine Soße mit Mehl angedickt wird?“</div>
      <div class="callout"><strong>Wenn das Personal unsicher ist:</strong> „Kein Problem — ich kann auch gerne kurz mit der Küche sprechen.“</div>
      <h3>Was du <em>nicht</em> sagen solltest</h3>
      <ul><li>„Ich habe eine Glutenunverträglichkeit“ — klingt für die Küche wie eine Diät-Laune, wird leichter übergangen.</li><li>„Nur ein bisschen ist okay“ — ist nicht okay und untergräbt deine Position für alle zukünftigen Gäste mit Zöliakie.</li><li>„Tut mir leid, dass ich so kompliziert bin.“ Du bist nicht kompliziert. Du kommunizierst eine medizinische Grenze. Entschuldige dich nicht dafür.</li></ul>
      <h3>Sichere vs. riskante Gerichte</h3>
      <ul><li><strong>Eher sicher:</strong> Kurzgebratenes ohne Panade, gegrillter Fisch mit Gemüse, Risotto (Bouillon prüfen), Salat mit Olivenöl-Zitrone (fertige Dressings oft heikel), Kartoffelgerichte aus separater Pfanne.</li><li><strong>Riskant:</strong> <em>Jedes</em> Buffet (Kreuzkontamination quasi garantiert), Fritteuse (oft gemeinsam mit Panade), Bratensoßen, klassische Nudelgerichte, Pizza (selbst auf gf-Teig, wenn der gleiche Ofen mit Weizenpizzen läuft), asiatische Küche ohne explizit glutenfreie Sojasauce.</li></ul>
      <h3>Der Notfallplan</h3>
      <p>Es wird passieren. Nicht oft, aber ein- oder zweimal im Jahr wirst du später merken: da war Gluten drin. Panik hilft nicht. Was hilft: Trinken, ausruhen, dem Körper Zeit geben. Die Symptome klingen meist nach 2–4 Tagen wieder ab. Kein Drama, keine Schuld — nutze es als Info, was du beim nächsten Mal anders machst.</p>`,
    darkSidebar('Vor dem Besuch', 'Checkliste', [
      'Speisekarte online prüfen',
      'Vorab anrufen, nachmittags',
      'Reservierung mit Hinweis',
      '3 Sätze im Kopf',
      'Notfall-Riegel in der Tasche'
    ]) + linksSidebar('Weiterlesen', [
      ['reisen.html','Restaurants auf Reisen'],
      ['produkte-shops.html','Produkte sicher erkennen'],
      ['gastronomie.html','Infos für Gastronomie']
    ]) + calloutSidebar('Kein Drama beim Rückfall', 'Wenn ein Gluten-Kontakt passiert: Wasser, Ruhe, Zeit. 2–4 Tage klingt es ab. Dann weitermachen.')
  )
});

// 6. Reisen
pages.push({
  slug:'reisen', navKey:'reisen',
  title:'Reisen mit Zöliakie', desc:'Planung, Unterkunft, Snacks, Sprachvorbereitung, Länder-Tipps.',
  hero: hero('Reisen','Unterwegs','Reisen<br><span class="italic">mit Routine.</span>','Die gute Nachricht: Reisen mit Zöliakie geht — überall. Mit ein paar Routinen wird es nach der dritten Reise fast so entspannt wie früher.'),
  main: body(
`      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> Vor der Reise</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[22ch]">Die halbe Reise findet am Laptop statt.</h2>
      <p class="mt-5">Menschen mit Zöliakie reisen anders — vor allem in den ersten Reisen. Nicht, weil es dort nichts zu essen gibt, sondern weil ein bisschen Recherche am Abend vorher fünf stressige Momente am Urlaubsort erspart.</p>
      <h3>Unterkunft — die wichtigste Entscheidung</h3>
      <ul><li><strong>Ferienwohnung oder Apartment</strong> mit Küche ist der entspannteste Modus. Du hast Kontrolle, du kaufst lokal ein, du frühstückst sicher.</li><li><strong>Agriturismo, Bauernhof-Hotels, kleine Familienpensionen</strong> sind überraschend oft flexibler als große Hotelketten — weil die Küche direkt mit dir spricht.</li><li><strong>Große Hotels</strong>: nur mit vorheriger Abklärung. Beim Buchen im Kommentarfeld Zöliakie angeben und beim Check-in nochmal ansprechen.</li></ul>
      <h3>Recherche vor der Abreise</h3>
      <ul><li><strong>Google Maps:</strong> Suche nach „gluten free“ + Stadtname. Die gut bewerteten Treffer sind meistens verlässlich.</li><li><strong>DZG-App und europäische Schwesternverbände</strong> (AIC in Italien, SMAP in Spanien, AFDIAG in Frankreich) haben Restaurantlisten.</li><li><strong>Lokale Supermärkte</strong>: in Italien <em>Esselunga</em>, in Frankreich <em>Monoprix</em> / <em>Carrefour Bio</em>, in Spanien <em>El Corte Inglés</em>, in UK jeder größere Supermarkt — alle haben ein solides gf-Sortiment.</li></ul>
      <h3>Snacks, die immer mitfahren</h3>
      <ul><li>2–3 zertifizierte glutenfreie Müsliriegel</li><li>Reiswaffeln oder Maiswaffeln</li><li>Nüsse und getrocknete Früchte (ungemischt)</li><li>Instant-Haferbrei (zertifiziert glutenfrei) — rettet jedes unsichere Hotel-Frühstück</li><li>Eine Packung gf-Kekse für „ich hab jetzt Hunger“-Momente</li><li>Einen kleinen Vorrat gf-Brot, wenn die Reise länger als ein Wochenende geht</li></ul>
      <h3>Sprachliche Vorbereitung</h3>
      <p>Ein paar wichtige Sätze in der Landessprache öffnen Türen. Noch besser: eine laminierte <strong>Übersetzungskarte</strong>, die die Kernaussage („Ich habe Zöliakie, keine Spuren von Gluten, bitte nicht in gemeinsamer Pfanne“) enthält. Die DZG hat offizielle Karten, es gibt auch kostenlose Vorlagen online (Celiac Travel Cards).</p>
      <div class="callout"><strong>Die 5 Wörter für unterwegs:</strong> In jeder Sprache solltest du „Gluten“, „kein“, „Allergie/Zöliakie“, „Weizen“, „Soße“ kennen. Der Rest ergibt sich im Gespräch.</div>
      <h3>Länder — was ich gelernt habe</h3>
      <ul><li><strong>Italien</strong>: überraschend einfach. Zöliakie ist bekannt, viele Restaurants haben eine separate gf-Karte, in Apotheken bekommst du Brot und Pasta. Wahrscheinlich das einfachste Reiseland Europas für Zöliakie.</li><li><strong>Spanien</strong>: regional sehr unterschiedlich. Große Städte (Madrid, Barcelona, Valencia) gut. Ländliche Gegenden schwieriger.</li><li><strong>Frankreich</strong>: stark brotbasiert, deshalb etwas schwieriger. Immer explizit nachfragen. Crêperien können eine Alternative sein, wenn sie mit Buchweizen (<em>galette de sarrasin</em>) arbeiten — aber auch hier: in separater Pfanne.</li><li><strong>USA</strong>: überall gf-Optionen, aber Kreuzkontamination ist eine Lotterie. „Gluten free“ auf der Karte heißt nicht automatisch „celiac safe“. Nachfragen.</li><li><strong>Japan / Thailand</strong>: Sojasauce ist Standard. Extra vorsichtig kommunizieren, idealerweise mit schriftlicher Karte in Landessprache.</li><li><strong>Skandinavien</strong>: sehr gut. Glutenfreiheit ist weit verbreitet und verlässlich.</li></ul>
      <h3>Worst-Case vermeiden</h3>
      <ul><li>Keine spontanen Street-Food-Experimente ohne Klärung.</li><li>Kein Buffet, auch kein Hotel-Frühstücksbuffet (die Brotzange wandert in alles).</li><li>Keine Fritteusen-Gerichte, wenn nicht eine eigene Fritteuse bestätigt ist.</li><li>Bei Flügen: Reiseproviant im Handgepäck, auch wenn du ein glutenfreies Menü vorbestellt hast — Bordspecials können mal ausfallen.</li></ul>`,
    darkSidebar('Reise-Pack', 'In den Koffer', [
      '2–3 gf Müsliriegel',
      'Instant-Haferbrei (zertifiziert)',
      'Reiswaffeln',
      'Übersetzungskarte',
      'Notfall-Snacks für 24 h'
    ]) + linksSidebar('Weiterlesen', [
      ['auswaerts.html','Restaurants allgemein'],
      ['produkte-shops.html','Produkte im Ausland'],
      ['mindset.html','Entspannt bleiben']
    ]) + calloutSidebar('Flug-Tipp', 'Glutenfreies Menü mindestens 24 h vorher anmelden. Trotzdem einen Riegel im Handgepäck — als Backup.')
  )
});

// 7. Mindset
pages.push({
  slug:'mindset', navKey:'mindset',
  title:'Mindset — mit Zöliakie gut leben', desc:'Akzeptanz, Kontrolle ohne Angst, Routinen, Umgang mit Rückschlägen und Selbstbewusstsein im Alltag.',
  hero: hero('Mindset','Innere Arbeit','Mindset —<br><span class="italic">dein Leben bleibt gut.</span>','Die praktischen Kapitel lösen 80 % der Fragen. Die letzten 20 % sind Kopfsache — und genauso wichtig.'),
  main: body(
`      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> Die innere Seite</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[22ch]">Die Diagnose ändert deinen Alltag — nicht deinen Wert.</h2>
      <p class="mt-5">Die ersten Wochen nach der Diagnose sind fast immer eine Mischung aus Erleichterung und Trauer. Beides darf da sein. Du musst nicht sofort „dankbar für die Klarheit“ sein, und du musst nicht in Schockstarre verharren. Du darfst schwanken.</p>
      <h3>Akzeptanz — aber nicht als Applaus</h3>
      <p>Akzeptanz bedeutet nicht, dass du die Diagnose toll finden musst. Sie bedeutet: Du hörst auf, gegen etwas zu kämpfen, das sich nicht wegkämpfen lässt. Du darfst die Diagnose beschissen finden und trotzdem dein Leben lieben. Beides passt gleichzeitig — und genau diese Doppelheit ist die Akzeptanz, die trägt.</p>
      <h3>Fokus auf das, was geht</h3>
      <p>Die Falle der ersten Wochen: Du siehst nur die „darf nicht mehr“-Liste. Die ist auch da, und sie ist spürbar. Aber es gibt eine zweite Liste, die genauso lang ist: neue Zutaten, neue Rezepte, neue Restaurants, ein neues Gespür dafür, was wirklich frisch ist. Viele meiner Klient:innen berichten nach einem halben Jahr, dass sie <em>besser</em> essen als vorher — bewusster, frischer, weniger Fertigprodukte.</p>
      <div class="callout"><strong>Der Satz, den ich mir selber oft sage:</strong> „Ich lebe nicht <em>gegen</em> meine Zöliakie. Ich lebe <em>mit</em> ihr.“ Ein winziger Wortwechsel — und er ändert alles.</div>
      <h3>Kontrolle ohne Angst</h3>
      <p>Am Anfang fühlt sich die Kontrolle wie ein Käfig an: alles prüfen, alles nachfragen, nichts zufällig. Das ist normal — es ist der Modus, in dem dein System lernt. Nach ein paar Monaten wird aus „ich muss alles prüfen“ ein leises „ich weiß schon, was ich prüfen muss“. Die Kontrolle verschwindet nicht, aber sie wird Routine. Sie läuft im Hintergrund.</p>
      <h3>Selbstbewusst kommunizieren</h3>
      <p>Du musst dich nicht mehr entschuldigen. Nicht beim Kellner. Nicht bei der Gastgeberin. Nicht bei den Schwiegereltern. Freundlich, klar, ohne Rechtfertigung — das ist die Haltung, die dich am weitesten trägt. Wer sich ständig entschuldigt, bekommt das Gefühl, tatsächlich etwas falsch zu machen. Das stimmt nicht.</p>
      <ul><li>„Für mich geht das leider nicht — was wäre eine gute Alternative?“</li><li>„Ich koche mir etwas mit, dann kann die Gastgeberin sich aufs Gesamte konzentrieren.“</li><li>„Danke, das ist lieb gemeint — aber mein Körper reagiert schon auf Spuren.“</li></ul>
      <h3>Austausch — warum Community hilft</h3>
      <p>Die DZG und ihre regionalen Gruppen, Online-Communities, Instagram-Accounts von Betroffenen: Der Kontakt zu Menschen, die es wirklich verstehen, hilft überproportional. Nicht wegen neuer Informationen — sondern wegen des Gefühls, nicht allein zu sein. Gerade in den ersten sechs Monaten.</p>
      <h3>Rückschläge einordnen</h3>
      <p>Du wirst irgendwann wieder reagieren. Aus Versehen, aus Übermüdung, weil eine Küche nicht so sauber war, wie sie schien. Das ist kein Versagen. Das ist eine Info. Dein Job ist dann: trinken, ausruhen, dem Körper Zeit geben, und in Ruhe überlegen: Was mache ich beim nächsten Mal anders? Dann weiter.</p>
      <h3>Routinen, die dich tragen</h3>
      <ul><li>Drei feste Lieblingsgerichte, die du blind kochen kannst</li><li>Zwei feste Restaurants, die dich kennen</li><li>Ein fester Einkaufstag</li><li>Ein Mensch im Umfeld, der es wirklich verstanden hat</li><li>Eine Quelle, die du bei neuen Fragen als Erstes öffnest</li></ul>`,
    darkSidebar('Für schlechte Tage', 'Mein Notfall-Kit', [
      'Ein Lieblingsgericht kochen',
      '20 Minuten raus an die Luft',
      'Eine Freundin anrufen',
      'Nicht neues Restaurant testen',
      'Morgen ist ein neuer Tag'
    ]) + linksSidebar('Weiterlesen', [
      ['zoeliakie-verstehen.html','Was ist Zöliakie?'],
      ['zuhause.html','Dein Sicherheitsort'],
      ['angebote-kontakt.html','Persönliche Beratung']
    ]) + calloutSidebar('Zeit ist dein Freund', 'Die ersten 3 Monate sind die schwersten. Danach ist es ein anderes Spiel. Versprochen.')
  )
});

// 8. Gastronomie
pages.push({
  slug:'gastronomie', navKey:'zoeliakie-verstehen',
  title:'Infos für Gastronomie', desc:'Für Restaurants, Cafés und Hotels: Kennzeichnung, Personalschulung, Küchentrennung und Vertrauen aufbauen.',
  hero: hero('Gastronomie','B2B','Für<br><span class="italic">Gastronomie.</span>','Wenn ihr glutenfreie Gerichte anbieten wollt: Was wirklich nötig ist. Und was nicht. Kurz, klar, umsetzbar.'),
  main: body(
`      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> An Betreiber:innen</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[22ch]">Glutenfrei ist nicht kompliziert — aber es ist nicht nebenbei.</h2>
      <p class="mt-5">Diese Seite richtet sich an Restaurants, Cafés, Hotels und Betriebskantinen. Wenn ihr glutenfreie Gerichte anbieten wollt, ohne ein Haftungs-Risiko einzugehen und ohne eure Gäste mit Zöliakie in Unsicherheit zu lassen — das sind die Bausteine, auf die es ankommt.</p>
      <h3>Die rechtliche Grundlage</h3>
      <p>Seit der EU-Lebensmittelinformations-Verordnung (LMIV, 1169/2011) müssen <strong>alle 14 Haupt-Allergene</strong> in der Speisekarte, auf Aushängen oder auf Nachfrage nachweisbar gekennzeichnet sein. Dazu gehören Weizen, Roggen, Gerste, Hafer, Dinkel und Kamut — alles glutenhaltig. Die Kennzeichnung muss klar, dauerhaft, schriftlich abrufbar sein.</p>
      <h3>Personalschulung — das Herzstück</h3>
      <p>Das beste gf-Gericht nützt nichts, wenn der Kellner beim Servieren den Brotkorb daneben stellt. Drei Basis-Inhalte für eine 30-Minuten-Schulung:</p>
      <ul><li><strong>Was ist Zöliakie?</strong> Autoimmunerkrankung, lebenslang, reagiert schon auf Spuren. Keine Modediät, kein „ein bisschen geht“.</li><li><strong>Wo entsteht Kreuzkontamination?</strong> Gemeinsame Pfannen, gemeinsame Fritteuse, gleiche Bretter, Brotkrümel auf Arbeitsflächen, Mehlstaub in der Luft beim Backen.</li><li><strong>Was sage ich, wenn ein Gast nachfragt?</strong> Ehrlich. „Bei diesem Gericht sind wir sicher, dort müsste ich kurz die Küche fragen.“ Lieber ein Nein als ein leichtfertiges Ja.</li></ul>
      <h3>Küche einrichten — die strukturellen Regeln</h3>
      <ul><li><strong>Getrennte Arbeitsflächen</strong> für glutenfreie Zubereitung. Oder: Reihenfolge — glutenfrei zuerst, dann normales.</li><li><strong>Eigene Utensilien</strong> (Kochlöffel, Pfannenwender, Schneebesen, Schneidebretter) — farblich markiert, idealerweise grün.</li><li><strong>Eigene Pfanne</strong> oder gereinigte Edelstahl-Pfanne, die nach mechanischer Reinigung sicher ist (Keramik- und gusseiserne Pfannen speichern Gluten in Poren).</li><li><strong>Keine gemeinsame Fritteuse.</strong> Ausnahmslos. Entweder eine separate, oder bei gf-Bestellung in der Pfanne frittieren.</li><li><strong>Eigenes Sieb</strong> für gf-Pasta.</li><li><strong>Getrennte Lagerung</strong> der Zutaten, auch im Kühlschrank (Brot nicht neben offenem Butterstück des gf-Gastes).</li></ul>
      <h3>Transparenz gegenüber dem Gast</h3>
      <p>Gäste mit Zöliakie sind dankbar für ehrliche Einschätzung, nicht für optimistische Versprechen. Wenn eure Küche strukturell nur eingeschränkt glutenfrei arbeiten kann, ist <em>das</em> die ehrliche Ansage — der Gast entscheidet dann selbst, ob er auf das Gericht verzichtet oder es versucht. Was absolut vermieden werden muss: „Ist glutenfrei“ als Angabe, obwohl die Küche keine Trennung kennt.</p>
      <div class="callout"><strong>Mein Vorschlag für die Karte:</strong> Markiert konsequent glutenfreie Gerichte mit einem eindeutigen Symbol. Schreibt auf die Karte einen kurzen Hinweis: „Trotz größter Sorgfalt können wir Spuren nicht vollständig ausschließen. Sprecht uns an — für Gäste mit Zöliakie klären wir individuell.“ Das ist rechtlich klar und menschlich freundlich.</div>
      <h3>Warum sich das lohnt</h3>
      <p>Ca. 1 % der Bevölkerung hat Zöliakie — und viele davon entscheiden ihre Restaurant-Wahl nicht allein, sondern bringen Begleitung mit. Ein verlässliches glutenfreies Angebot zieht nicht 1 Gast an, sondern die ganze Familie oder den Freundeskreis. Und es wird weiterempfohlen — Community-Kommunikation ist unter Betroffenen extrem aktiv.</p>
      <h3>Zertifizierung</h3>
      <p>Die DZG vergibt in Deutschland Zertifikate an Restaurants, die bestimmte Standards erfüllen. Der Weg zum Zertifikat ist machbar, wenn die oben genannten Punkte ernst genommen werden. Für Hotels und größere Gastro-Betriebe ist das ein echtes Differenzierungsmerkmal.</p>`,
    darkSidebar('Kurz-Checkliste', '5 Punkte', [
      'Alle 14 Allergene gekennzeichnet',
      '30-Min-Schulung fürs Personal',
      'Separate Utensilien + Pfanne',
      'Keine gemeinsame Fritteuse',
      'Ehrliche Kommunikation am Tisch'
    ]) + linksSidebar('Weiterlesen', [
      ['zoeliakie-verstehen.html','Was ist Zöliakie?'],
      ['angebote-kontakt.html','Schulung anfragen']
    ]) + calloutSidebar('Interesse an Schulung?', 'Ich biete 90-Minuten-Impulse für Gastro-Teams an. Bei Interesse über die Kontaktseite melden.')
  )
});

// 9. Angebote & Kontakt
pages.push({
  slug:'angebote-kontakt', navKey:'angebote-kontakt',
  title:'Angebote & Kontakt', desc:'Freebies, eBook, persönliche Beratung und Kontaktmöglichkeiten.',
  hero: hero('Angebote & Kontakt','Mit mir arbeiten','Angebote &<br><span class="italic">Kontakt.</span>','Vom kostenlosen Einstieg über das eBook bis zur persönlichen Begleitung. Such dir, was gerade passt.'),
  main: `
<section class="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-8">
  <div class="grid grid-cols-12 gap-5 lg:gap-6" data-stagger>
    <div class="reveal col-span-12 md:col-span-4 card card-float" style="--i:0;padding:2rem">
      <div class="text-[0.72rem] uppercase tracking-[0.18em] text-brand-teal">Kostenlos</div>
      <h3 class="mt-3 font-display text-[1.5rem] leading-snug text-brand-charcoal">Freebie: 10 häufige Glutenfallen</h3>
      <p class="mt-3 text-brand-muted text-[0.93rem]">Die Checkliste, die ich meinen Klient:innen in der ersten Woche schicke. Sofort als PDF. Kein Newsletter, keine Mails danach.</p>
      <a href="index.html#freebie" class="btn btn-primary mt-6" style="padding:.7rem 1.15rem;font-size:.88rem">Checkliste holen</a>
    </div>
    <div class="reveal col-span-12 md:col-span-4 card card-float" style="--i:1;padding:2rem;background:linear-gradient(155deg,#4F8A7A 0%,#2F5448 100%);color:#fff;border-color:rgba(255,255,255,0.06)">
      <div class="text-[0.72rem] uppercase tracking-[0.18em] text-white/70">eBook</div>
      <h3 class="mt-3 font-display text-[1.5rem] leading-snug text-white">Glutenfrei leben mit Zöliakie — Dein sicherer Einstieg</h3>
      <p class="mt-3 text-white/75 text-[0.93rem]">10 Kapitel, 4 Checklisten, 1 Notfallkarte. Der kompakte Begleiter für die ersten Monate.</p>
      <a href="ebook.html" class="btn mt-6" style="padding:.7rem 1.15rem;font-size:.88rem;background:#fff;color:#1C2A25">eBook lesen</a>
    </div>
    <div class="reveal col-span-12 md:col-span-4 card card-float" style="--i:2;padding:2rem">
      <div class="text-[0.72rem] uppercase tracking-[0.18em] text-brand-teal">Persönlich</div>
      <h3 class="mt-3 font-display text-[1.5rem] leading-snug text-brand-charcoal">1:1 Beratung</h3>
      <p class="mt-3 text-brand-muted text-[0.93rem]">Eine gemeinsame Stunde — online oder in Hamburg. Für deine konkreten Fragen, deinen Alltag, deine Küche. Nicht für die medizinische Seite.</p>
      <a href="#kontakt" class="btn btn-ghost mt-6" style="padding:.7rem 1.15rem;font-size:.88rem">Termin anfragen</a>
    </div>
  </div>
</section>

<section class="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-8" id="kontakt">
  <div class="grid grid-cols-12 gap-5 lg:gap-6">
    <article class="col-span-12 lg:col-span-7 card prose-block reveal" style="padding:2.5rem 2.5rem">
      <div class="flex items-center text-xs uppercase tracking-[0.18em] text-brand-teal"><span class="leaf-mark"></span> Meine Geschichte</div>
      <h2 class="mt-5 text-[2rem] sm:text-[2.4rem] leading-[1.1] max-w-[22ch]">Ich bin Senta — und ich war an deiner Stelle.</h2>
      <p class="mt-5">Meine Diagnose kam 2011, nach Jahren unspezifischer Beschwerden, die immer „stressbedingt“ oder „normal für dein Alter“ waren. Die Erleichterung über die Diagnose war riesig. Die Panik der ersten Wochen auch. Zwischen diesen beiden Gefühlen habe ich langsam mein System gebaut — mit vielen Fehlern, ein paar Rückschlägen, und vielen kleinen Entdeckungen, die die Welt leichter gemacht haben.</p>
      <p>Seit 2016 begleite ich andere Menschen in genau diesem Prozess. Nicht als Ärztin — das bleibe ich nicht. Sondern als jemand, der die 1000 kleinen Fragen kennt, die nach dem Arzttermin auftauchen. Küche einrichten, Restaurants meistern, Reisen planen, Familien-Essen entspannen. Das ist mein Revier.</p>
      <h3>Kontakt</h3>
      <form class="mt-6" onsubmit="event.preventDefault(); alert('Danke — ich melde mich innerhalb von 48h.'); this.reset();">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label class="text-xs text-brand-muted block mb-1">Name</label><input required type="text" class="w-full rounded-xl px-4 py-3 bg-white border border-brand-line outline-none focus:border-brand-teal"></div>
          <div><label class="text-xs text-brand-muted block mb-1">E-Mail</label><input required type="email" class="w-full rounded-xl px-4 py-3 bg-white border border-brand-line outline-none focus:border-brand-teal"></div>
        </div>
        <div class="mt-4"><label class="text-xs text-brand-muted block mb-1">Worum geht es?</label><textarea rows="5" class="w-full rounded-xl px-4 py-3 bg-white border border-brand-line outline-none focus:border-brand-teal"></textarea></div>
        <div class="mt-4 flex items-center gap-2 text-xs text-brand-muted"><input type="checkbox" required> Ich stimme der Verarbeitung meiner Daten gemäß Datenschutzerklärung zu.</div>
        <button class="btn btn-primary mt-6">Nachricht senden</button>
      </form>
    </article>
    <aside class="col-span-12 lg:col-span-5 flex flex-col gap-5">
      <div class="card reveal overflow-hidden" style="padding:0">
        <div class="relative h-[300px]"><img src="brand_assets/Senta.JPG" alt="Senta Jacob" class="absolute inset-0 w-full h-full object-cover"><div class="absolute inset-0" style="background:linear-gradient(180deg,rgba(28,42,37,0) 40%,rgba(28,42,37,0.5) 100%)"></div><div class="absolute left-5 bottom-5 text-white"><div class="font-script text-2xl">Senta Jacob</div><div class="text-xs text-white/80">Glutenfrei-Begleiterin</div></div></div>
      </div>
      <div class="card reveal" style="padding:1.8rem">
        <div class="text-[0.72rem] uppercase tracking-[0.18em] text-brand-teal">Direkt</div>
        <div class="mt-3 space-y-3 text-[0.95rem]">
          <div class="flex items-start gap-3"><span class="text-brand-teal mt-0.5">✉</span><a href="mailto:senta@sentajacob.de" class="text-brand-ink hover:text-brand-teal">senta@sentajacob.de</a></div>
          <div class="flex items-start gap-3"><span class="text-brand-teal mt-0.5">◈</span><span class="text-brand-ink">Hamburg · online deutschlandweit</span></div>
          <div class="flex items-start gap-3"><span class="text-brand-teal mt-0.5">↻</span><span class="text-brand-ink">Antwort innerhalb von 48 h, Montag–Freitag</span></div>
        </div>
      </div>
      <div class="card reveal" style="padding:1.6rem 1.6rem;background:#EDF6F0">
        <div class="font-display text-[1.1rem] text-brand-charcoal">Bitte beachten</div>
        <p class="mt-2 text-[0.85rem] text-brand-muted">Ich ersetze keine ärztliche Beratung. Für Diagnose, Medikation und Verlauf bleibt deine Ärztin die erste Adresse — ich ergänze den Alltag.</p>
      </div>
    </aside>
  </div>
</section>`
});

// 10. Impressum
pages.push({
  slug:'impressum', navKey:null,
  title:'Impressum', desc:'Impressum der Website von Senta Jacob.',
  hero: hero('Impressum','Rechtlich','Impressum.','Angaben gemäß § 5 TMG.'),
  main: `
<section class="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 py-8">
  <article class="card prose-block reveal" style="padding:2.5rem 2.5rem">
    <h2 class="text-[1.6rem] leading-snug">Angaben gemäß § 5 TMG</h2>
    <p class="mt-4">Senta Jacob<br>[Straße und Hausnummer]<br>[PLZ] Hamburg<br>Deutschland</p>
    <h3>Kontakt</h3>
    <p>Telefon: [bitte ergänzen]<br>E-Mail: senta@sentajacob.de</p>
    <h3>Umsatzsteuer-ID</h3>
    <p>[bitte ergänzen]</p>
    <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
    <p>Senta Jacob<br>[Anschrift wie oben]</p>
    <h3>Streitschlichtung</h3>
    <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    <h3>Haftung für Inhalte</h3>
    <p>Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Die Inhalte haben informativen Charakter und ersetzen keine ärztliche Beratung.</p>
    <div class="warning"><strong>Platzhalter-Text:</strong> Dieses Impressum ist ein Entwurf. Bitte vor Veröffentlichung rechtlich prüfen lassen und persönliche Daten ergänzen.</div>
  </article>
</section>`
});

// 11. Datenschutz
pages.push({
  slug:'datenschutz', navKey:null,
  title:'Datenschutz', desc:'Datenschutzerklärung der Website von Senta Jacob.',
  hero: hero('Datenschutz','Rechtlich','Datenschutz.','Informationen zur Verarbeitung deiner Daten gemäß DSGVO.'),
  main: `
<section class="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 py-8">
  <article class="card prose-block reveal" style="padding:2.5rem 2.5rem">
    <h2 class="text-[1.6rem] leading-snug">Datenschutz auf einen Blick</h2>
    <p class="mt-4">Diese Datenschutzerklärung klärt dich über Art, Umfang und Zweck der Erhebung und Verwendung personenbezogener Daten auf dieser Website auf.</p>
    <h3>Verantwortliche Stelle</h3>
    <p>Senta Jacob<br>[Straße und Hausnummer]<br>[PLZ] Hamburg<br>E-Mail: senta@sentajacob.de</p>
    <h3>Erfassung allgemeiner Daten</h3>
    <p>Beim Besuch dieser Website werden automatisch Informationen allgemeiner Natur erfasst (Browsertyp, Betriebssystem, Referrer-URL, Uhrzeit der Serveranfrage). Diese Daten sind nicht bestimmten Personen zuordenbar.</p>
    <h3>Kontaktformular</h3>
    <p>Wenn du uns per Kontaktformular Anfragen zukommen lässt, werden deine Angaben aus dem Anfrageformular inklusive der dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne deine Einwilligung weiter.</p>
    <h3>Freebie / eBook-Download</h3>
    <p>Für den Download des kostenlosen Freebies benötigen wir deine E-Mail-Adresse. Diese wird ausschließlich zum einmaligen Versand des Downloads genutzt und <strong>nicht</strong> für Newsletter, Werbung oder weitere Mails verwendet. Die Löschung erfolgt nach erfolgreichem Versand.</p>
    <h3>Deine Rechte</h3>
    <ul><li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li><li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li><li>Löschung (Art. 17 DSGVO)</li><li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li><li>Widerspruch (Art. 21 DSGVO)</li><li>Datenübertragbarkeit (Art. 20 DSGVO)</li></ul>
    <p>Wende dich zur Ausübung deiner Rechte an: senta@sentajacob.de.</p>
    <h3>Cookies</h3>
    <p>Diese Website verwendet aktuell keine Tracking-Cookies. Sollten in Zukunft Cookies eingesetzt werden, wird diese Erklärung entsprechend aktualisiert.</p>
    <div class="warning"><strong>Platzhalter-Text:</strong> Diese Datenschutzerklärung ist ein Entwurf. Bitte vor Veröffentlichung rechtlich prüfen lassen.</div>
  </article>
</section>`
});

// Write files
for (const p of pages) {
  const html = build(p);
  await writeFile(`${p.slug}.html`, html, 'utf8');
  console.log('✓ ' + p.slug + '.html');
}
console.log('Done.');
