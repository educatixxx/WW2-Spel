/* Onboarding Modal Besturing (Versie B) */
function goToStep(stepNumber) {
    document.getElementById('modal-step-1').style.display = 'none';
    document.getElementById('modal-step-2').style.display = 'none';
    document.getElementById('modal-step-3').style.display = 'none';

    document.getElementById('modal-step-' + stepNumber).style.display = 'block';
}

function closeIntroModal() {
    var overlay = document.getElementById('intro-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/* Core Game Elements */
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
            text: "Liefste Maria,\n\nDe spanning is hier om te snijden. De Duitse troepen verzamelen zich vlak aan de grens. Men zegt dat mannen in strakke pakken in München over ons lot beslissen.\n\nHoe kunnen leiders in Londen en Parijs weten wat wij hier voelen? Als zij ons opofferen voor vrede, wie beschermt onze kinderen dan nog?\n\nDagboek van een Tsjechische grenswachter"
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
            text: "Lieve Vader,\n\nWe hebben wéér de hele nacht in de schuilkelder gezeten. Het angstaanjagende geluid van de sirenes en vallende bommen gaat door merg en been.\n\nOverdag zie ik de brave Spitfire-piloten hoog in de blauwe lucht vechten. Ze lijken zo klein, maar zij zijn het enige dat tussen ons en de totale ondergang staat.\n\nBrief van een burger tijdens De Blitz"
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
            text: "Liefste Moeder,\n\nDe kou is niet te beschrijven. Onze geweren vriezen vast aan onze handschoenen. We wijken dag na dag terug door verbrande dorpen, maar achter ons ligt Moskou.\n\nWe vechten voor elke meter sneeuw. Ze zeggen dat er hulp onderweg is uit Amerika, maar de tanks en vrachtwagens laten op zich wachten. Als zij ons opgeven, valt het hele Oosten.\n\nBrief van een Russische soldaat"
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
            text: "Mijn liefste Emily,\n\nAls je deze brief leest, heb ik de kust waarschijnlijk niet gehaald. De klep van onze landingstender gaat over enkele minuten open.\n\nDe zee is ruw en grijs, de lucht ruikt naar kruitdamp en verbrand metaal. De generaals op de stafkaarten zien alleen pijltekens, maar hier op het strand beslissen wij de vrijheid van Europa.\n\nLaatste brief van een geallieerde soldaat"
        },
        dossier: "[EDUCATIEF DOSSIER: OPERATIE OVERLORD]\nStalin heeft jarenlang aangedrongen op een groot 'Tweede Front' in West-Europa om het Duitse leger te splitsen. Na campagnes in Afrika en Italië is het op 6 juni 1944 zover: D-Day.\n\nDit is de grootste amfibische invasie in de geschiedenis. De geallieerden landen op de stranden van Normandië in bezet Frankrijk, onder leiding van de Amerikaanse generaal Eisenhower.",
        briefing: "We zijn geland in Frankrijk, maar de Duitse tegenstand is hevig en de havens zijn vernietigd. De logistieke aanvoerlijnen staan onder druk."
    }
];
