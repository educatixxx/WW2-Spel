const terminalContent = document.getElementById('terminal-content');
const inputArea = document.getElementById('input-area');
const commandInput = document.getElementById('command-input');
const btnSubmitCode = document.getElementById('btn-submit-code');
const quickChipsContainer = document.getElementById('quick-chips-container');
const choiceArea = document.getElementById('choice-area');
const btnContinue = document.getElementById('btn-continue');
const btnContinueText = document.getElementById('btn-continue-text');
const btnSkipTyping = document.getElementById('btn-skip-typing');
const yearDisplay = document.getElementById('year-display');
const mapBanner = document.getElementById('map-banner');
const mapStatus = document.getElementById('map-status');
const mapInstructionText = document.getElementById('map-instruction-text');

let regions = [];
let isTyping = false;
let currentFullText = "";
let currentMsgClass = "";
let typeInterval = null;
const TYPE_SPEED = 12;
let cutsceneInterval = null;
let state = {
    cohesion: 50, logistics: 50, morale: 50,
    currentScenario: 0, phase: 'intro'
};
/* HISTORISCH CURRICULUM EN CUTSCENES */
const scenarios = [
    {
        year: "1938",
        title: "DE SUDETENCRISIS",
        hotspot: "region-germany",
        cutscene: {
            bg: "https://placehold.co/1200x800/1e1710/f59e0b?text=1938+Grenstroepen+Sudetenland",
            date: "September 1938 - Grensgebied Tsjecho-Slowakije",
            text: "Liefste Maria,\n\nDe spanning is hier om te snijden. De Duitse troepen verzamelen zich vlak aan de grens. Men zegt dat mannen in strakke pakken in München over ons lot beslissen.\n\nHoe kunnen leiders in Londen en Parijs weten wat wij hier voelen? Als zij ons opofferen voor vrede, wie beschermt onze kinderen dan nog?\n\n- Dagboek van een Tsjechische grenswachter"
        },
        dossier: "[EDUCATIEF DOSSIER: APPEASEMENT]\nHitler eist de uitbreiding van het Duitse Rijk om alle Duitstaligen te verenigen (Heim ins Reich) en leefruimte te creëren (Lebensraum). Hij dreigt met oorlog als hij het Sudetenland (in Tsjecho-Slowakije) niet krijgt.\n\nDe Britse premier Chamberlain wil een gruwelijke oorlog zoals WO1 voorkomen. Hij voert een politiek van 'Appeasement' (verzoening): toegeven aan Hitlers eisen om de vrede te bewaren.",
        briefing: "De leiders van Groot-Brittannië, Frankrijk, Italië en Duitsland ontmoeten elkaar in München. Tsjecho-Slowakije zelf én de Sovjet-Unie (Stalin) zijn niet uitgenodigd.\n\nStalin kijkt met argusogen toe. Hij vreest dat het Westen Hitler bewust naar het Oosten (richting de USSR) stuurt.",
        decoding: { prompt: "DECODEER DE ONDERHANDELINGSSTRATEGIE ('MUNCHEN'):", codes: ['MUNCHEN'] },
        mapInstruction: null,
        choices: [
            {
                text: "A: TEKEN VERDRAG VAN MÜNCHEN (Geef Sudetenland aan Hitler)",
                hiddenEffect: { c: -15, l: 15, m: 10 },
                actionCutscene: {
                    title: "VERDRAG VAN MÜNCHEN ONDERTEKEND",
                    desc: "Diplomaten schudden handen in München. Tsjechische grensposten worden ontruimd terwijl Duitse colonnes het Sudetenland binnentrekken...",
                    bg: "https://placehold.co/1200x800/2a1a08/f59e0b?text=Munchen+1938"
                },
                debrief: "Je tekent het verdrag. Chamberlain keert terug met de belofte 'Peace for our time'. De oorlog is uitgesteld (Logistiek +, Moraal +).\n\nHISTORISCHE REALITEIT: Dit is wat er echt gebeurde. Het pact was echter een ramp voor de Cohesie. Stalin concludeerde dat hij het Westen niet kon vertrouwen en tekende een jaar later tot ieders shock een niet-aanvalsverdrag met Hitler (Molotov-Ribbentroppact)."
            },
            {
                text: "B: WEIGER EN DREIG MET MILITAIR INGRIJPEN",
                hiddenEffect: { c: 15, l: -20, m: -20 },
                actionCutscene: {
                    title: "MOBILISATIE AFGEKONDIGD",
                    desc: "Troepen worden naar de grenzen gestuurd. Luchtalarmsirenes loeien in Londen en Parijs. Oorlog lijkt onvermijdelijk...",
                    bg: "https://placehold.co/1200x800/3a0808/ef4444?text=Oorlogsdreiging+1938"
                },
                debrief: "Je weigert. Hitler is woedend. Stalin ziet dat je betrouwbaar bent (Cohesie +). Maar onze legers zijn zwak en de Britse en Franse bevolking raakt in paniek (Moraal -, Logistiek -).\n\nHISTORISCHE REALITEIT: Dit gebeurde NIET. Historici debatteren nog steeds of de geallieerden in 1938 een oorlog met Duitsland hadden kunnen winnen. Door de appeasement-politiek kreeg Duitsland de tijd om enorm sterk te worden."
            }
        ]
    },
    {
        year: "1940",
        title: "DE VAL VAN FRANKRIJK & SLAG OM ENGELAND",
        hotspot: "region-france",
        cutscene: {
            bg: "https://placehold.co/1200x800/182a23/a8d4c4?text=1940+De+Blitz+Londen",
            date: "Zomer 1940 - Londen, Engeland",
            text: "Lieve Vader,\n\nWe hebben wéér de hele nacht in de schuilkelder gezeten. Het angstaanjagende geluid van de sirenes en vallende bommen gaat door merg en been.\n\nOverdag zie ik de brave Spitfire-piloten hoog in de blauwe lucht vechten. Ze lijken zo klein, maar zij zijn het enige dat tussen ons en de totale ondergang staat.\n\n- Brief van een burger tijdens De Blitz"
        },
        dossier: "[EDUCATIEF DOSSIER: BLITZKRIEG]\nIn mei 1940 valt Duitsland West-Europa aan. Door de tactiek van 'Blitzkrieg' (een snelle samenwerking tussen tanks, vliegtuigen en infanterie) wordt het Franse leger binnen enkele weken compleet verslagen.\n\nGroot-Brittannië (nu onder leiding van Winston Churchill) is van het continent verdreven en staat er helemaal alleen voor tegen het Duitse rijk.",
        briefing: "Frankrijk is gevallen. Hitler bereidt Operatie Seelöwe voor: de invasie van Engeland. De Luftwaffe begint met enorme bombardementen op Britse steden (De Blitz).\n\nTegelijkertijd proberen Duitse U-boten (onderzeeërs) Groot-Brittannië uit te hongeren door schepen op de Atlantische Oceaan te torpederen. Waar zetten we onze middelen in?",
        decoding: null,
        mapInstruction: {
            text: "MAP VERPLICHT: Klik op 'Groot-Brittannië' (Luchtmacht) of 'Atlantische Oceaan' (Marine)",
            validTargets: ['region-uk', 'region-atlantic']
        },
        choices: [
            {
                targetId: 'region-uk',
                text: "BOUW RADARSTATIONS EN SPITFIRES (Slag om Engeland)",
                hiddenEffect: { c: 0, l: -10, m: 20 },
                actionCutscene: {
                    title: "LUCHTGEVECHTEN BOVEN HET KANAAL",
                    desc: "Spitfires stijgen op! Bommenwerpers worden onderschept dankzij radar-detectie. Explosies vullen de lucht boven het zuiden van Engeland...",
                    bg: "https://placehold.co/1200x800/0f2b48/60a5fa?text=Battle+of+Britain"
                },
                debrief: "De Royal Air Force (RAF) verslaat de Luftwaffe mede dankzij de nieuwe radar! Het moraal van de bevolking stijgt enorm. De Atlantische vloot lijdt echter zware verliezen.\n\nHISTORISCHE REALITEIT: Groot-Brittannië won de Slag om Engeland door superieure technologie (radar) en de inzet van piloten. Churchill zei: 'Nooit in de geschiedenis hebben zo velen, zo veel te danken gehad, aan zo weinigen.'"
            },
            {
                targetId: 'region-atlantic',
                text: "FOCUS OP KONVOOIBESCHERMING & ANTI-DUIKBOOT",
                hiddenEffect: { c: 10, l: 15, m: -15 },
                actionCutscene: {
                    title: "SLAG OM DE ATLANTISCHE OCEAAN",
                    desc: "Dieptebommen exploderen onder water. Konvooien varen zwaar bewaakt door de woeste golven terwijl Duitse U-boten op de loer liggen...",
                    bg: "https://placehold.co/1200x800/081e28/38bdf8?text=U-Boat+Warfare"
                },
                debrief: "De aanvoerlijnen over zee blijven veilig. Logistiek verbetert. Maar door het gebrek aan luchtverdediging worden Britse steden platgebombardeerd (Moraal daalt zwaar).\n\nHISTORISCHE REALITEIT: Hoewel de Slag om de Atlantische Oceaan cruciaal was, kregen de gevechtsvliegtuigen in 1940 historische prioriteit, waardoor een Duitse invasie van land werd voorkomen."
            }
        ]
    },
    {
        year: "1941",
        title: "OPERATIE BARBAROSSA",
        hotspot: "region-ussr",
        cutscene: {
            bg: "https://placehold.co/1200x800/1f2024/ffffff?text=1941+Oostfront+Winter",
            date: "November 1941 - Buitenwijken van Moskou",
            text: "Liefste Moeder,\n\nDe kou is niet te beschrijven. Onze geweren vriezen vast aan onze handschoenen. We wijken dag na dag terug door verbrande dorpen, maar achter ons ligt Moskou.\n\nWe vechten voor elke meter sneeuw. Ze zeggen dat er hulp onderweg is uit Amerika, maar de tanks en vrachtwagens laten op zich wachten. Als zij ons opgeven, valt het hele Oosten.\n\n- Brief van een Russische soldaat"
        },
        dossier: "[EDUCATIEF DOSSIER: LEND-LEASE & HET OOSTFRONT]\nIn juni 1941 verbreekt Hitler het pact met Stalin en valt de Sovjet-Unie binnen (Operatie Barbarossa). De nazi-ideologie ziet de Slavische volkeren als 'Untermenschen'. Het wordt een vernietigingsoorlog.\n\nStalin sluit zich noodgedwongen aan bij de Geallieerden. Amerika is officieel nog neutraal, maar president Roosevelt bedenkt de 'Lend-Lease Act' om wapens te 'lenen' aan landen die vechten tegen nazi-Duitsland.",
        briefing: "Het Rode Leger lijdt miljoenen verliezen en trekt zich terug in de bittere kou. Stalin eist dat de VS en Groot-Brittannië massaal vrachtwagens, voedsel en staal naar de USSR sturen om ze in de strijd te houden.",
        decoding: { prompt: "ONTSLEUTEL HET MATERIEEL VERDRAG ('LENDLEASE'):", codes: ['LENDLEASE'] },
        mapInstruction: null,
        choices: [
            {
                text: "STUUR LEND-LEASE MATERIEEL NAAR STALIN",
                hiddenEffect: { c: 25, l: -15, m: 0 },
                actionCutscene: {
                    title: "KONVOOIEN NAAR MURMANSK",
                    desc: "Duizenden Amerikaanse Studebaker-vrachtwagens en tonnen graan worden door ijszeeën naar de havens van de Sovjet-Unie gevaren...",
                    bg: "https://placehold.co/1200x800/1e293b/38bdf8?text=Lend-Lease+Supply"
                },
                debrief: "Britse en Amerikaanse schepen maken de gevaarlijke tocht naar het noorden. Het wantrouwen van Stalin neemt af (Cohesie stijgt), maar dit kost onze eigen legers wapens.\n\nHISTORISCHE REALITEIT: Dit is precies wat de VS deed. Hoewel de USSR de meeste nazi-soldaten versloeg (met enorm bloedvergieten), gebeurde dit voor een aanzienlijk deel op wielen (vrachtwagens en jeeps) geleverd door de Amerikaanse industrie."
            },
            {
                text: "HOUD VOORRADEN ACHTER VOOR EIGEN LEGEROPBOUW",
                hiddenEffect: { c: -30, l: 20, m: 0 },
                debrief: "Je weigert hulp. Stalin voelt zich verraden en moet in de winter voor Moskou vechten met gigantische tekortsituaties. Het bondgenootschap balanceert op de rand van de afgrond (Cohesie -30!).\n\nHISTORISCHE REALITEIT: Dit werd niet gekozen. Als Stalin de wapens niet had gekregen, had de USSR mogelijk een aparte vrede met Duitsland gesloten of de oorlog verloren, waardoor Hitler heel Europa zou beheersen."
            }
        ]
    },
    {
        year: "1944",
        title: "HET TWEEDE FRONT & D-DAY",
        hotspot: "region-france",
        cutscene: {
            bg: "https://placehold.co/1200x800/2a2a2a/cccccc?text=1944+Landing+Normandie",
            date: "6 Juni 1944 - Landingsvaartuig, Het Kanaal",
            text: "Mijn liefste Emily,\n\nAls je deze brief leest, heb ik de kust waarschijnlijk niet gehaald. De klep van onze landingstender gaat over enkele minuten open.\n\nDe zee is ruw en grijs, de lucht ruikt naar kruitdamp en verbrand metaal. De generaals op de stafkaarten zien alleen pijltekens, maar hier op het strand beslissen wij de vrijheid van Europa.\n\n- Laatste brief van een geallieerde soldaat"
        },
        dossier: "[EDUCATIEF DOSSIER: OPERATIE OVERLORD]\nStalin heeft jarenlang aangedrongen op een groot 'Tweede Front' in West-Europa om het Duitse leger te splitsen. Na campagnes in Afrika en Italië is het op 6 juni 1944 zover: D-Day.\n\nDit is de grootste amfibische invasie in de geschiedenis. De geallieerden landen op de stranden van Normandië in bezet Frankrijk, onder leiding van de Amerikaanse generaal Eisenhower.",
        briefing: "We zijn geland in Frankrijk, maar de Duitse tegenstand is hevig en de havens zijn vernietigd. De logistieke aanvoerlijnen staan onder extreme druk.\n\nDe Britse generaal Montgomery komt met een gewaagd alternatief plan: gebruik parachutisten om de bruggen over de rivieren in Nederland te veroveren, zodat we direct Duitsland in kunnen rijden en de oorlog voor kerst eindigt.",
        decoding: null,
        mapInstruction: {
            text: "MAP VERPLICHT: Klik op 'Duitsland' (Montgomery plan) of 'Frankrijk' (Eisenhower plan)",
            validTargets: ['region-germany', 'region-france']
        },
        choices: [
            {
                targetId: 'region-germany',
                text: "OPERATIE MARKET GARDEN (Parachutisten op de bruggen)",
                hiddenEffect: { c: 0, l: -25, m: 10 },
                actionCutscene: {
                    title: "LUCHTARMING IN NEDERLAND",
                    desc: "Duizenden parachutes vullen de lucht boven Eindhoven, Nijmegen en Arnhem. Maar de Duitse Panzermethodes bieden onverwacht hevige tegenstand bij de Rijnbrug...",
                    bg: "https://placehold.co/1200x800/1c281e/4ade80?text=Market+Garden+Arnhem"
                },
                debrief: "Een waanzinnige poging. Duizenden parachutisten landen in Nederland, maar de laatste brug (bij Arnhem) blijkt een brug te ver. De operatie mislukt en kost enorm veel lives en voorraden (Logistiek -25).\n\nHISTORISCHE REALITEIT: Operatie Market Garden mislukte daadwerkelijk. Hierdoor liep de geallieerde opmars vast en werd de noordelijke helft van Nederland geconfronteerd met de verschrikkelijke Hongerwinter van '44-'45."
            },
            {
                targetId: 'region-france',
                text: "HET BREDE FRONT (Gestaag oprukken door Frankrijk)",
                hiddenEffect: { c: 5, l: 15, m: 5 },
                actionCutscene: {
                    title: "BREED FRONT OPGENOMEN",
                    desc: "Tankkolonnes en infanterie rukken gestaag op over de gehele breedte van het Franse landschap. Aanvoerlijnen worden strak georganiseerd...",
                    bg: "https://placehold.co/1200x800/28221c/f59e0b?text=Broad+Front+Advance"
                },
                debrief: "Je wijst Montgomery's plan af en rukt gestaag en logistiek veilig op in de breedte. Het duurt langer, maar is zekerder.\n\nHISTORISCHE REALITEIT: Eisenhower gaf toe aan de politieke druk van Montgomery en voerde Market Garden uit. Als hij de veilige route had gekozen, was het front waarschijnlijk minder snel opgeschoven in september, maar zonder de dramatische verliezen."
            }
        ]
    },
    {
        year: "1945",
        title: "JALTA EN DE KOUDE OORLOG",
        hotspot: "region-germany",
        cutscene: {
            bg: "https://placehold.co/1200x800/301c1c/e0b6b6?text=1945+Puinhopen+Berlijn",
            date: "April 1945 - Puinhopen van Berlijn",
            text: "Notities uit het veld:\n\nHiet einde is nabij. De vlaggen worden gehesen op het beschadigde Rijksdaggebouw. We hebben gewonnen, zeggen de kranten.\n\nMaar als ik naar de totale ruïnes kijk, vraag ik me af wat er over is van Europa. En nu kijken de geallieerde generaals alweer argwanend naar de Sovjet-soldaten aan de overkant van de rivier. Is de ene oorlog voorbij, of begint de volgende schaduwoorlog nu al?\n\n- Oorlogsverslaggever"
        },
        dossier: "[EDUCATIEF DOSSIER: CONFERENTIE VAN JALTA]\nIn februari 1945 wordt duidelijk dat nazi-Duitsland gaat verliezen. Roosevelt, Churchill en Stalin komen samen in Jalta (Krim).\n\nZe bespreken de toekomst van Europa. Stalin is van plan de Oost-Europese landen die hij bevrijdt (zoals Polen) onder communistische controle te houden als een 'bufferzone'. Het wantrouwen tussen het kapitalistische Westen en de communistische USSR bereikt een kookpunt. Dit is het zaadje voor de Koude Oorlog.",
        briefing: "Het Duitse leger is gebroken. Zowel de westerse legers als het Rode Leger van Stalin racen naar Berlijn. \n\nWe kunnen doorvechten en vasthouden aan onvoorwaardelijke overgave, of we proberen buiten Stalin om in het geheim vrede te sluiten met restanten van het Duitse opperbevel om Oost-Europa te redden.",
        decoding: { prompt: "BEVESTIG HET LAATSTE BESLUIT ('BERLIJN' of 'VERRAAD'):", codes: ['BERLIJN', 'VERRAAD'] },
        mapInstruction: null,
        choices: [
            {
                text: "A (Code: BERLIJN): VECHT DOOR VOOR ONVOORWAARDELIJKE OVERGAVE",
                hiddenEffect: { c: 10, l: 0, m: 10 },
                actionCutscene: {
                    title: "DE VAL VAN BERLIJN",
                    desc: "Geallieerde en Sovjet-troepen schudden de hand bij de rivier de Elbe. De nazi-vlag valt. De oorlog in Europa is voorbij!",
                    bg: "https://placehold.co/1200x800/102e1c/34d399?text=VE+Day+1945"
                },
                debrief: "De legers ontmoeten elkaar bij de rivier de Elbe. Hitler pleegt zelfmoord in Berlijn en nazi-Duitsland valt. De alliantie houdt lang genoeg stand om te winnen.\n\nHISTORISCHE REALITEIT: Duitsland capituleerde onvoorwaardelijk in mei 1945. Vlak daarna viel de anti-Hitler alliantie uit elkaar. Europa werd door het IJzeren Gordijn in tweeën gesplitst voor de komende 45 jaar."
            },
            {
                text: "B (Code: VERRAAD): SLUIT GEHEIM VREDESPPACT TEGEN STALIN",
                hiddenEffect: { c: -80, l: 10, m: -20 },
                actionCutscene: {
                    title: "DIRECTE ESCALATIE MET DE SOVJET-UNIE",
                    desc: "Troepenbewegingen veranderen van koers. Vuurgevechten breken uit tussen westerse patrouilles en het Rode Leger...",
                    bg: "https://placehold.co/1200x800/450a0a/f87171?text=WW3+Escalation"
                },
                debrief: "Je probeert Stalin buiten spel te zetten. De KGB (Russische geheime dienst) ontdekt dit. Stalin verklaart de westerse geallieerden als vijanden. Een Derde Wereldoorlog breekt direct uit op de puinhopen van Europa.\n\nHISTORISCHE REALITEIT: Dit gebeurde niet, hoewel figuren zoals de Britse premier Churchill in het geheim plannen lieten maken ('Operation Unthinkable') om direct na WO2 de USSR aan te vallen. Dit werd als volstrekt onmogelijk beschouwd."
            }
        ]
    }
];
async function initGame() {
    await loadRealMap();
    btnSubmitCode.addEventListener('click', checkCodeInput);
    commandInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkCodeInput(); });
    btnSkipTyping.addEventListener('click', skipTyping);
    document.getElementById('btn-skip-cutscene').addEventListener('click', endCutscene);
    updateMeters();
    startPhase();
}
async function loadRealMap() {
    const root = document.getElementById('d3-map-root');
   
    const svg = d3.select("#d3-map-root")
        .append("svg")
        .attr("viewBox", "0 0 800 800")
        .attr("class", "w-full h-full object-cover");
    svg.append("rect")
        .attr("width", 800)
        .attr("height", 800)
        .attr("class", "clickable-ocean")
        .attr("data-region", "region-atlantic")
        .on("click", () => handleMapClick("region-atlantic"));
    const projection = d3.geoMercator()
        .center([15, 52])
        .scale(1000)
        .translate([400, 400]);
    const path = d3.geoPath().projection(projection);
    try {
        const response = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
        const data = await response.json();
        document.getElementById('map-loading').style.display = 'none';
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
            .attr("d", path)
            .attr("class", d => {
                const r = getRegionId(d.properties.name);
                return r !== "region-neutral" ? "map-region" : "map-region-neutral";
            })
            .attr("data-region", d => getRegionId(d.properties.name))
            .style("stroke", "#334155")
            .style("stroke-width", "1")
            .on("click", (event, d) => {
                const regionId = getRegionId(d.properties.name);
                if(regionId !== "region-neutral") handleMapClick(regionId);
            });
       
        const labels = [
            { name: "UK", coords: [-2, 53.5], color: "#f8fafc" },
            { name: "FRANKRIJK", coords: [2, 47], color: "#f8fafc" },
            { name: "DUITSLAND", coords: [10, 51.5], color: "#ef4444" },
            { name: "ITALIË", coords: [12.5, 42.5], color: "#f59e0b" },
            { name: "USSR", coords: [35, 55], color: "#f8fafc" },
            { name: "ATLANTISCHE OCEAAN", coords: [-15, 45], color: "#64748b" }
        ];
        svg.append("g").selectAll("text")
            .data(labels)
            .enter()
            .append("text")
            .attr("x", d => projection(d.coords)[0])
            .attr("y", d => projection(d.coords)[1])
            .attr("text-anchor", "middle")
            .attr("fill", d => d.color)
            .attr("font-size", d => d.name === "USSR" ? "24px" : (d.name === "ATLANTISCHE OCEAAN" ? "12px" : "14px"))
            .attr("font-weight", "bold")
            .style("pointer-events", "none")
            .style("opacity", d => d.name === "ATLANTISCHE OCEAAN" ? "0.4" : "0.9")
            .attr("class", "font-mono-military tracking-wider")
            .text(d => d.name);
        regions = document.querySelectorAll('.map-region, .clickable-ocean');
       
    } catch (error) {
        console.error("Map error", error);
        root.innerHTML = '<div class="flex items-center justify-center h-full text-rose-500">Fout bij laden satellietdata.</div>';
    }
}
function getRegionId(countryName) {
    const map = {
        "England": "region-uk", "United Kingdom": "region-uk", "Ireland": "region-uk",
        "France": "region-france", "Belgium": "region-france", "Netherlands": "region-france", "Luxembourg": "region-france",
        "Germany": "region-germany", "Austria": "region-germany", "Poland": "region-germany", "Czech Republic": "region-germany", "Slovakia": "region-germany", "Hungary": "region-germany", "Romania": "region-germany",
        "Italy": "region-italy", "Albania": "region-italy", "Greece": "region-italy",
        "Russia": "region-ussr", "Ukraine": "region-ussr", "Belarus": "region-ussr", "Lithuania": "region-ussr", "Latvia": "region-ussr", "Estonia": "region-ussr", "Moldova": "region-ussr"
    };
    return map[countryName] || "region-neutral";
}
function updateMeters() {
    state.cohesion = Math.max(0, Math.min(100, state.cohesion));
    state.logistics = Math.max(0, Math.min(100, state.logistics));
    state.morale = Math.max(0, Math.min(100, state.morale));
    document.getElementById('meter-cohesion').style.width = state.cohesion + '%';
    document.getElementById('meter-logistics').style.width = state.logistics + '%';
    document.getElementById('meter-morale').style.width = state.morale + '%';
    document.getElementById('val-cohesion').innerText = state.cohesion + '%';
    document.getElementById('val-logistics').innerText = state.logistics + '%';
    document.getElementById('val-morale').innerText = state.morale + '%';
}
function printLine(text, msgClass = "msg-intel", clear = false, callback = null) {
    if (clear) terminalContent.innerHTML = '';
    if (typeInterval) clearInterval(typeInterval);
    currentFullText = text;
    currentMsgClass = msgClass;
   
    const p = document.createElement('div');
    p.className = `whitespace-pre-wrap ${msgClass}`;
    terminalContent.appendChild(p);
    let index = 0;
    isTyping = true;
    btnSkipTyping.classList.remove('hidden');
    typeInterval = setInterval(() => {
        if (index < text.length) {
            p.textContent += text.charAt(index);
            index++;
            terminalContent.scrollTop = terminalContent.scrollHeight;
        } else {
            finishTyping(callback);
        }
    }, TYPE_SPEED);
}
function skipTyping() {
    if (!isTyping) return;
    const lastChild = terminalContent.lastElementChild;
    if (lastChild) lastChild.textContent = currentFullText;
    finishTyping(null);
}
function finishTyping(callback) {
    clearInterval(typeInterval);
    isTyping = false;
    btnSkipTyping.classList.add('hidden');
    terminalContent.scrollTop = terminalContent.scrollHeight;
    if (window.pendingCallback) {
        let cb = window.pendingCallback;
        window.pendingCallback = null;
        cb();
    } else if (callback) {
        callback();
    }
}
function startPhase() {
    if (state.currentScenario >= scenarios.length) {
        checkWinLoss(true);
        return;
    }
    const scenario = scenarios[state.currentScenario];
    yearDisplay.innerText = scenario.year;
   
    state.phase = 'recon';
    clearMapSelection();
   
    const hotspotRegions = document.querySelectorAll(`[data-region="${scenario.hotspot}"]`);
    hotspotRegions.forEach(r => r.classList.add('hotspot'));
    mapBanner.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-16');
    mapBanner.textContent = "NIEUWE INLICHTINGEN! Klik op de knipperende rode regio op de kaart.";
    mapStatus.textContent = "VERKENNING VEREIST";
    mapStatus.className = "text-xs font-mono-military text-rose-500 font-bold animate-pulse";
    mapInstructionText.textContent = `Doelwit: Analyseer regio voor historische context in ${scenario.year}.`;
    printLine(`\n=== INKOMEND RAPPORT [JAAR ${scenario.year}]: ${scenario.title} ===\nOntvangen signalen uit vijandelijk gebied. Voer verkenning uit via de tactische kaart om het volledige historische dossier te openen.`, "msg-alert", true);
}
function showDossierAndBriefing() {
    const scenario = scenarios[state.currentScenario];
    printLine(scenario.dossier, "msg-dossier", false, () => {
        window.pendingCallback = () => {
            setTimeout(() => {
                printLine("\n[COMMANDO BRIEFING]\n" + scenario.briefing, "msg-intel", false, () => {
                    btnContinue.classList.remove('hidden');
                    btnContinueText.innerText = "BEGRIJPEN & ACTIE ONDERNEMEN";
                    btnContinue.onclick = () => {
                        btnContinue.classList.add('hidden');
                        state.phase = scenario.decoding ? 'decoding' : (scenario.mapInstruction ? 'mapping' : 'choosing');
                        setupActionPhase();
                    };
                });
            }, 400);
        };
        if (!isTyping) window.pendingCallback();
    });
}
function setupActionPhase() {
    const scenario = scenarios[state.currentScenario];
   
    if (state.phase === 'decoding') {
        printLine("\n[BEVEILIGDE LOKALE COMMUNICATIE]\n" + scenario.decoding.prompt, "msg-alert", false, () => {
            inputArea.classList.remove('hidden');
            commandInput.value = "";
            quickChipsContainer.innerHTML = '<span class="text-xs text-slate-500">Snelcode (educatie modus):</span>';
            scenario.decoding.codes.forEach(code => {
                const chip = document.createElement('button');
                chip.className = 'bg-slate-800 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-600/50 font-mono-military text-xs px-3 py-1 rounded transition';
                chip.innerText = code;
                chip.onclick = () => { commandInput.value = code; checkCodeInput(); };
                quickChipsContainer.appendChild(chip);
            });
            setTimeout(() => commandInput.focus(), 100);
        });
    } else if (state.phase === 'mapping') {
        mapBanner.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-16');
        mapBanner.textContent = scenario.mapInstruction.text;
        mapStatus.textContent = "ACTIE VEREIST OP KAART";
        mapStatus.className = "text-xs font-mono-military text-blue-400 font-bold animate-pulse";
        mapInstructionText.textContent = "Jouw strategische keuze vereist een locatieaanduiding.";
        regions.forEach(r => {
            const regionAttr = r.getAttribute('data-region');
            if (regionAttr && scenario.mapInstruction.validTargets.includes(regionAttr)) {
                r.classList.add('active-target');
            }
        });
        printLine("\nWACHTEN OP LOCATIE-SELECTIE VIA DE KAART (LINKS)...", "msg-intel", false);
    } else if (state.phase === 'choosing') {
        printLine("\n[STRATEGISCH DILEMMA] Wat is uw bevel, Commandant?", "msg-intel", false, () => {
            choiceArea.innerHTML = '';
            choiceArea.classList.remove('hidden');
            scenario.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'w-full text-left bg-slate-800 border-2 border-slate-700 hover:border-amber-500 hover:bg-slate-700 p-4 rounded-lg text-sm font-semibold transition text-slate-100 flex items-center justify-between group';
                btn.innerHTML = `<span>${choice.text}</span><svg class="w-5 h-5 text-slate-500 group-hover:text-amber-400 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
                btn.onclick = () => triggerActionCutscene(choice);
                choiceArea.appendChild(btn);
            });
        });
    }
}
function checkCodeInput() {
    const scenario = scenarios[state.currentScenario];
    const val = commandInput.value.trim().toUpperCase();
    if (scenario.decoding && scenario.decoding.codes.includes(val)) {
        inputArea.classList.add('hidden');
        printLine(`\n[CODE GEACCEPTEERD: '${val}']\nOntsleuteling succesvol.`, "msg-success", false, () => {
            setTimeout(() => {
                state.phase = scenario.mapInstruction ? 'mapping' : 'choosing';
                setupActionPhase();
            }, 400);
        });
    } else {
        printLine(`\n[FOUTIEVE CODE] Typ exact de gevraagde term om het dossier of bevel te bevestigen.`, "msg-alert", false);
    }
}
function handleMapClick(regionId) {
    const scenario = scenarios[state.currentScenario];
    if (state.phase === 'recon' && regionId === scenario.hotspot) {
        clearMapSelection();
        printLine(`\n[LOCATIE BEVESTIGD] Onderscheppen van veldcommunicatie...`, "msg-success", false, playCutscene);
        return;
    }
    if (state.phase === 'mapping' && scenario.mapInstruction && scenario.mapInstruction.validTargets.includes(regionId)) {
        const choice = scenario.choices.find(c => c.targetId === regionId);
        if (choice) {
            clearMapSelection();
            triggerActionCutscene(choice);
        }
        return;
    }
}
function playCutscene() {
    const scenario = scenarios[state.currentScenario];
    const overlay = document.getElementById('cutscene-overlay');
    const visual = document.getElementById('cutscene-visual');
    const dateEl = document.getElementById('cutscene-date');
    const textEl = document.getElementById('cutscene-text');
    visual.style.backgroundImage = `url('${scenario.cutscene.bg}')`;
    dateEl.innerText = scenario.cutscene.date;
    textEl.textContent = "";
   
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
   
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
    }, 50);
    let i = 0;
    const letter = scenario.cutscene.text;
    clearInterval(cutsceneInterval);
   
    setTimeout(() => {
        cutsceneInterval = setInterval(() => {
            if (i < letter.length) {
                textEl.textContent += letter.charAt(i);
                i++;
            } else {
                clearInterval(cutsceneInterval);
            }
        }, 25); // Zorgvuldige en goed leesbare typ-snelheid
    }, 400);
}
function endCutscene() {
    const overlay = document.getElementById('cutscene-overlay');
    clearInterval(cutsceneInterval);
   
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
   
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        showDossierAndBriefing();
    }, 500);
}
function triggerActionCutscene(choice) {
    choiceArea.classList.add('hidden');
    inputArea.classList.add('hidden');
    const actionOverlay = document.getElementById('action-cutscene-overlay');
    const actionBg = document.getElementById('action-cutscene-bg');
    const actionTitle = document.getElementById('action-cutscene-title');
    const actionDesc = document.getElementById('action-cutscene-desc');
    const progressBar = document.getElementById('action-progress');
    if (choice.actionCutscene) {
        actionBg.style.backgroundImage = `url('${choice.actionCutscene.bg}')`;
        actionTitle.innerText = choice.actionCutscene.title;
        actionDesc.innerText = choice.actionCutscene.desc;
    } else {
        actionBg.style.backgroundImage = `url('https://placehold.co/1200x800/1e293b/ef4444?text=Oorlogshandeling')`;
        actionTitle.innerText = "BEVEL WORDT UITGEVOERD";
        actionDesc.innerText = "Aanvalsvleugels en troepenopstellingen worden in beweging gezet...";
    }
    progressBar.style.width = '0%';
    actionOverlay.classList.remove('hidden');
    actionOverlay.classList.add('flex');
    setTimeout(() => {
        actionOverlay.classList.remove('opacity-0');
        actionOverlay.classList.add('opacity-100');
        progressBar.style.width = '100%';
    }, 50);
    setTimeout(() => {
        actionOverlay.classList.remove('opacity-100');
        actionOverlay.classList.add('opacity-0');
        setTimeout(() => {
            actionOverlay.classList.add('hidden');
            actionOverlay.classList.remove('flex');
            processChoice(choice);
        }, 500);
    }, 3000);
}
function clearMapSelection() {
    mapBanner.classList.add('opacity-0', 'pointer-events-none', 'translate-y-16');
    mapStatus.textContent = "STANDBY";
    mapStatus.className = "text-xs font-mono-military text-slate-500";
    mapInstructionText.textContent = "Wacht op instructies van de inlichtingendienst.";
   
    if (regions) {
        regions.forEach(r => {
            r.classList.remove('active-target', 'hotspot');
        });
    }
}
function processChoice(choice) {
    state.cohesion += choice.hiddenEffect.c;
    state.logistics += choice.hiddenEffect.l;
    state.morale += choice.hiddenEffect.m;
    updateMeters();
    const parts = choice.debrief.split("HISTORISCHE REALITEIT:");
    const consequence = parts[0];
    const history = "HISTORISCHE REALITEIT:" + (parts[1] || "");
    printLine("\n=== GEALLIEERDE GEVOLGEN ===\n" + consequence, "msg-intel", true, () => {
        window.pendingCallback = () => {
            setTimeout(() => {
                printLine("\n" + history, "msg-history", false, () => {
                    btnContinue.classList.remove('hidden');
                    btnContinueText.innerText = "VOLGENDE HISTORISCHE FASE NAAR " + (scenarios[state.currentScenario + 1] ? scenarios[state.currentScenario + 1].year : "HET EINDE");
                    btnContinue.onclick = () => {
                        btnContinue.classList.add('hidden');
                        if (!checkWinLoss(false)) {
                            state.currentScenario++;
                            startPhase();
                        }
                    };
                });
            }, 400);
        }
        if(!isTyping) window.pendingCallback();
    });
}
function checkWinLoss(isEndOfGame) {
    let gameOver = false;
    let title = "", reason = "";
    if (state.cohesion <= 0) {
        gameOver = true; title = "COHESIE GEBROKEN (0%)";
        reason = "De Sovjet-Unie voelt zich verraden en sluit een nieuwe overeenkomst met nazi-Duitsland. De Westerse geallieerden worden van het vasteland verdreven.";
    } else if (state.logistics <= 0) {
        gameOver = true; title = "LOGISTIEKE INEENSTORTING (0%)";
        reason = "Uw legers zijn door munitie, brandstof en voedsel heen. Het offensief komt tot stilstand en de as-mogendheden nemen de controle terug.";
    } else if (state.morale <= 0) {
        gameOver = true; title = "THUISFRONT IN OPSTAND (0%)";
        reason = "Het publiek accepteert de zinloze verliezen en ontberingen niet meer. Politieke revoluties dwingen u om vrede te sluiten met Hitler.";
    } else if (state.cohesion >= 100) {
        gameOver = true; title = "KOUDE OORLOG GEËSCALEERD (100%)";
        reason = "U heeft volledig toegegeven aan Stalin om de vrede te bewaren, waardoor de USSR direct na de oorlog ongeremd West-Europa binnentrekt.";
    }
    if (gameOver) {
        printLine(`\n====================================\nGAME OVER: ${title}\n====================================\n${reason}\n\nHistorische lessen vereisen inzicht en balans. Probeer het opnieuw.`, "msg-alert", true, () => {
            btnContinue.classList.remove('hidden');
            btnContinueText.innerText = "SIMULATIE OPNIEUW STARTEN";
            btnContinue.onclick = () => location.reload();
        });
        return true;
    }
    if (isEndOfGame) {
        printLine(`\n====================================\nVICTORY IN EUROPE (V-E DAY)\n====================================\n\nMei 1945. Duitsland capituleert. U heeft in deze simulatie met succes de logistiek, de politiek en de bevolking in balans weten te houden in de moeilijkste jaren uit de menselijke geschiedenis.\n\nEINDSTATUS:\n- Cohesie: ${state.cohesion}%\n- Logistiek: ${state.logistics}%\n- Moraal: ${state.morale}%\n\nGefeliciteerd met het voltooien van deze strategische geschiedenisles!`, "msg-success", true);
        return true;
    }
    return false;
}
window.onload = initGame;
