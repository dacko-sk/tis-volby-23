import { elections as el } from './constants';
import { nl2r } from './helpers';
import { getCurrentLanguage, languages } from './routes';

import { csvAccountKeys as ak } from '../context/DataContext';

export const labels = {
    account: {
        download: ['Stiahnuť ako CSV', 'Download as CSV'],
        tableCols: {
            [ak.account_name]: ['Názov účtu', 'Account name'],
            [ak.date]: ['Dátum', 'Date'],
            [ak.amount]: ['Suma', 'Amount'],
            [ak.message]: ['Popis platby', 'Payment details'],
            [ak.tx_type]: ['Druh platby', 'Type of payment'],
            [ak.vs]: ['VS', 'Variabile symbol'],
            [ak.ss]: ['ŠS', 'Specific symbol'],
        },
        totalDisclaimer: [
            'Súčet výdavkov na všetkých transparentných účtoch politických strán.',
            'Sum of spendings on accounts of all political parties.',
        ],
        totalSpending: ['Celkové výdavky strán', 'Total parties spending'],
        overview: [
            'Prehľad transakcií na transparentnom účte',
            'Transparent Account Transactions',
        ],
    },
    ads: {
        amount: {
            accountsTitle: `Počet reklám jednotlivých profilov`,
            // disclaimer: `Počet reklám ${phrases.preCampaignStart}`,
            label: ['Počet reklám', 'Amount of ads'],
            partiesTitle:
                'Súčet počtov reklám všetkých profilov politickej strany',
            partyAccountsTitle: `Počet reklám jednotlivých profilov strany`,
        },
        google: {
            disclaimer:
                'Politickú reklamu strán a ich politikov, zverejnenú prostredníctvom služieb Google Ads a Google Display & Video 360, sledujeme vďaka údajom, ktoré publikuje spoločnosť Google v Centre transparentnosti reklám. Sumy sú uvedené bez DPH.',
            format: {
                disclaimer:
                    'Podiel jednotlivých formátov Google reklamy na celkových výdavkoch.',
                title: 'Formáty reklamy',
            },
            spending: {
                accountsTitle: `Profily s výdavkami na reklamu nad 100 €`,
                // disclaimer: `Zobrazené sú len politické účty, ${phrases.google} ${phrases.preCampaignStart}`,
                partiesDisclaimer: [
                    'Započítané sú len politické účty, ktoré prostredníctvom služieb Google Ads a Google Display & Video 360 uverejnili reklamy v hodnote nad 100 € od začiatku predkampane 11. decembra 2022. Pre kompletný zoznam započítaných straníckych profilov a podrobnejšie dáta o online kampani, kliknite na názov strany.',
                    'Including political accounts whose spending on Google Ads and Google Display & Video 360 platforms exceeded 100 € since the beginning of precampaign (December 11th 2022). Click the party name for complete list of included profiles.',
                ],
                partiesTitle: `Súčet výdavkov všetkých profilov politickej strany s výdavkami na reklamu nad 100 €`,
                partyAccountsTitle: `Profily strany s výdavkami na reklamu nad 100 €`,
            },
            title: ['Google'],
            topTitle: ['Top 10 Google kampaní', 'Top 10 Google campaigns'],
            // totalDisclaimer: `Súčet výdavkov politických účtov, ${phrases.google} ${phrases.preCampaignStart}`,
            totalSpendingTitle: 'Výdavky na Google reklamu',
        },
        meta: {
            attribution: {
                allTitle: 'Bilancia všetkých strán',
                amount: 'Počet',
                campaign: 'Kampaň',
                // disclaimer: `Povinné označenie objednávateľa a dodávateľa podľa zákona o volebnej kampani ${phrases.campaignStart} ${phrases.attr}`,
                pctTitle: 'Rebríček správnosti označovania',
                // pctDisclaimer: `Podiel správne označených reklám podľa zákona o volebnej kampani ${phrases.campaignStart} ${phrases.attr}`,
                precampaign: `Predkampaň`,
                title: 'Označenie objednávateľa a dodávateľa',
            },
            demography: {
                ages: 'Vekové skupiny',
                // agesDisclaimer: `Podiel zásahu reklám vo vekových skupinách obyvateľstva ${phrases.preCampaignStart}`,
                genders: 'Pohlavia',
                // gendersDisclaimer: `Podiel zásahu reklám medzi pohlaviami ${phrases.preCampaignStart}`,
                title: 'Demografické rozloženie reklamy',
            },
            disclaimer:
                'Politickú reklamu strán a ich politikov na sociálnych sieťach Facebook a Instagram sledujeme vďaka údajom, ktoré publikuje spoločnosť Meta v knižnici Meta Ad Library. Sumy sú uvedené bez DPH.',
            ranges: {
                accountsTitle: `Najviac inzerujúce profily od začiatku predkampane`,
                // disclaimer: `Meta uvádza výdavky za reklamu v 100-eurových intervaloch, preto nie je možné urciť presnú sumu. Zobrazujeme celý interval a odhad výdavkov, ktorý je súčtom stredov intervalov všetkých reklám daného profilu zobrazovaných ${phrases.preCampaignStart}`,
                estimate: 'Odhadované výdavky',
                partiesTitle: `Rozsah výdavkov všetkých profilov politickej strany od začiatku predkampane`,
                partyAccountsTitle: `Najviac inzerujúce profily strany od začiatku predkampane`,
                range: 'Skutočný rozsah výdavkov',
            },
            regions: {
                // allDisclaimer: `Podiel zásahu online reklamy všetkých strán v krajoch Slovenska ${phrases.preCampaignStart} Pre podrobnejšiu analýzu cielenia strán na regióny vzhľadom na veľkosť krajov, kliknite na názov strany.`,
                diffAvg: 'Odchýlka od priemerného zásahu strany v SR',
                diffAvgDisclaimer:
                    'Odchýlka zásahu reklamy na jedného obyvateľa kraja od priemerného zásahu strany v celej SR.',
                // disclaimer: `Podiel zásahu online reklamy v krajoch Slovenska ${phrases.preCampaignStart} Vnútorný graf zobrazuje veľkosti krajov podľa počtu obyvateľov.`,
                label: 'Podiel zásahu reklám',
                sizeDisclaimer: '',
                sizeLabel: 'Podiel populácie SR žijúcej v tomto kraji',
                title: 'Regionálne rozloženie reklamy',
            },
            spending: {
                accountsTitle: `Profily s týždennými výdavkami na reklamu nad 100 €`,
                // disclaimer: `Zobrazené sú len profily, ${phrases.weeklyProfiles}`,
                label: 'Týždňové výdavky na reklamu',
                partiesDisclaimer: [
                    'Započítané sú len profily na sociálnych sieťach platformy Meta, ktorých výdavky počas posledných 90 dní predkampane od 11. marca 2023 alebo týždňové výdavky od začiatku kampane 9. júna 2023 presiahli 100 €. Pre kompletný zoznam započítaných straníckych profilov a podrobnejšie dáta o online kampani, kliknite na názov strany.',
                    'Includes Meta profiles whose spending in last 90 days of precampaing (from March 11th 2023) or weekly spending from campaign start (June 9th 2023) exceeded 100 €. Click the party name for complete list of included profiles.',
                ],
                partiesTitle:
                    'Súčet výdavkov všetkých profilov politickej strany s týždennými výdavkami na reklamu nad 100 €',
                partyAccountsTitle: `Profily strany s týždennými výdavkami na reklamu nad 100 €`,
            },
            title: ['Meta'],
            topTitle: ['Top 10 Meta kampaní', 'Top 10 Meta campaigns'],
            // totalDisclaimer: `Súčet výdavkov na politickú reklamu ${phrases.meta}. Započítane sú všetky profily, ${phrases.weeklyProfiles}`,
            totalSpendingTitle: 'Výdavky na Meta reklamu',
        },
        noData: 'Neevidujeme žiaden účet strany s výdavkami na sponzorované príspevky na tejto platforme.',
        pageTitle: ['Online kampane', 'Online campaigns'],
        percent: 'Podiel',
        showMore: [
            'Zistiť viac o online kampani',
            'Learn more about Online Campaigns',
        ],
    },
    all: ['Zobraziť všetko', 'Show all'],
    analyses: {
        navTitle: ['Hodnotenia', 'Analyses'],
        pageTitle: [
            'Hodnotenie transparentnosti kampaní',
            'Analyses of campaigns transparency',
        ],
        top: ['Top %i hodnotených kampaní', 'Top %i rated campaigns'],
        showAll: ['Zobraziť všetky hodnotenia', 'Show all analyses'],
    },
    analysis: {
        navTitle: ['Hodnotenie', 'Analysis'],
    },
    charts: {
        disclaimer: [
            'Grafy obsahujú dáta z transparentných účtov, očistené o vrátené platby.',
            'Graphs contains data from transparent accounts, with filtered return payments.',
        ],
        disclaimerClick: [
            'Po kliknutí na názov strany sa rozbalia podrobnosti.',
            'Click the party name for details.',
        ],
        updated: ['Naposledy aktualizované', 'Last updated on'],
        incoming: ['Príjmy', 'Incomes'],
        outgoing: ['Výdavky', 'Expenses'],
        top10: [
            'Top 10 kampaní podľa výdavkov a príjmov',
            'Top 10 campaigns by incomes and spendings',
        ],
        uniqeDonors: ['Počet unikátnych darcov', 'No. of unique donors'],
    },
    contact: ['Kontakt', 'Contact'],
    cookies: {
        accept: ['Prijať všetky', 'Accept all'],
        about: [
            'Táto webová stránka používa cookies, aby vám priniesla čo najlepší online zážitok.',
            'This website uses cookies to bring you the best online experience.',
        ],
        optional: ['Voliteľné cookies', 'Optional Cookies'],
        reject: ['Odmietnuť všetky', 'Reject all'],
        selected: ['Potvrdiť výber', 'Accept selected'],
        settings: ['Nastavenia cookies', 'Cookies settings'],
        types: {
            analytics: ['Analytické cookies', 'Analytics'],
            functional: ['Funkčné cookies', 'Functional'],
            necessary: ['Nevyhnutné cookies', 'Necessary'],
        },
    },
    donate: {
        buttonShort: ['Darujte', 'Donate'],
        buttonLong: [
            'Darujte na kontrolu volieb',
            'Donate for elections monitoring',
        ],
        modalTitle: [
            'Nenechajme voľby bez kontroly!',
            `Don't let the elections without watch!`,
        ],
        modalText: [
            'Darujte už od 20 €, aby sme ustrážili férovosť volieb.\nĎakujeme.',
            'Donate from 20 € to support elections transparency.\nThank you.',
        ],
    },
    download: ['Stiahnuť', 'Download'],
    elections: {
        [el.p19]: ['Prezidentské\nvoľby 2019', 'President\nelections 2019'],
        [el.n20]: ['Parlamentné\nvoľby 2020', 'Parliamentary\nelections 2020'],
        [el.s22]: ['Samosprávne\nvoľby 2022', 'Municipal\nelections 2022'],
        date: ['Dátum konania volieb', 'Elections date'],
        over: ['Voľby sa skončili', 'Elections ended'],
        timeTillstart: ['Zostávajúci čas do volieb', 'Time to elections start'],
        timeTillend: [
            'Zostávajúci čas do konca volieb',
            'Time to elections end',
        ],
    },
    errors: {
        loading: [
            'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
            'Data loading error. Please reload the page.',
        ],
    },
    fbFeed: [
        'Pre zobrazenie facebook vlákna je potrebné prijať ukladanie Funkčných cookies v Nastaveniach cookies',
        'Please accept Functional Cookies in Cookies Settings in order to show Facebook feed',
    ],
    followUs: ['Sledujte nás', 'Follow us'],
    home: {
        navTitle: ['Voľby 2023', 'Elections 2023'],
        pageTitle: ['Parlamentné\nvoľby 2023', 'Parliamentary\nelections 2023'],
    },
    learnMore: ['Zistiť viac', 'Learn more'],
    news: {
        latest: ['Najnovšie aktuality', 'Latest News (Slovak only)'],
        navTitle: ['Aktuality', 'News'],
        noData: ['Neboli nájdené žiadne články.', 'No articles found.'],
        pageTitle: ['Aktuality', 'News\n(Slovak only)'],
    },
    newsletter: {
        title: ['Newsletter'],
        subscribe: ['Prihlásiť sa na newsletter', 'Subscribe to Newsletter'],
    },
    online: {
        navTitle: ['Online', 'Online'],
    },
    parties: {
        list: [
            'Abecedný zoznam všetkých subjektov s transparentným účtom.',
            'All political parties with transparent account sorted alphabetically.',
        ],
        navTitle: ['Strany', 'Parties'],
        pageTitle: ['Strany a hnutia', 'Political Parties'],
    },
    party: {
        assets: ['Majetkové priznania', 'Assets'],
        funding: ['Financovanie', 'Funding'],
        overview: ['Prehľad', 'Overview'],
    },
    privacy: ['Ochrana súkromia', 'Privacy Policy'],
    readMore: ['Čítať ďalej…', 'Read more…'],
    tis: [
        'Transparency International Slovensko',
        'Transparency International Slovakia',
    ],
    search: {
        label: ['Vyhľadávanie', 'Search'],
        results: [
            'Výsledky vyhľadávania výrazu',
            'Search results for the query',
        ],
    },
    showMore: ['Zobraziť viac', 'Show more'],
    sponsors: ['Donori projektu', 'Project donors'],
    supportTis: ['Podporte Transparency', 'Support Transparency'],
    usefulInfo: ['Užitočné informácie', 'Useful information'],
    webDev: ['Webové riešenie', 'Web development'],
};

export const t = (label, replacements, breaks) => {
    let tl = label;
    if (Array.isArray(label)) {
        tl = label[0] ?? '';
        if (getCurrentLanguage() === languages.en) {
            tl = label[1] ?? tl;
        }
    }
    if (Array.isArray(replacements)) {
        // Use a regular expression to match placeholders (%s or %i)
        tl = tl.replace(/%[dfis]/g, (match) => {
            // Replace %s with the next string from the array
            // Return the placeholder if no replacement is available
            return replacements.length > 0 ? replacements.shift() : match;
        });
    }
    return breaks ? nl2r(tl) : tl;
};
