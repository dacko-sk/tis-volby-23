import logoAliancia from '../../public/img/parties/Aliancia.jpg';
import logoDemokrati from '../../public/img/parties/Demokrati.jpg';
import logoHlas from '../../public/img/parties/Hlas.svg?url';
import logoKDH from '../../public/img/parties/KDH.svg?url';
import logoKSS from '../../public/img/parties/KSS.svg?url';
import logoLSNS from '../../public/img/parties/LSNS.svg?url';
import logoMF from '../../public/img/parties/MF.png';
import logoOLaNO from '../../public/img/parties/OĽaNO.png';
import logoPS from '../../public/img/parties/PS.png';
import logoRepublika from '../../public/img/parties/Republika.png';
import logoSaS from '../../public/img/parties/SASKA.jpg';
import logoSmeRodina from '../../public/img/parties/SmeRodina.png';
import logoSmer from '../../public/img/parties/Smer.jpg';
import logoSNS from '../../public/img/parties/SNS.png';
import logoZaLudi from '../../public/img/parties/za-ludi.svg?url';

export const categories = {
    news: 877,
};

// party object key matches with CSV account key
export const parties = {
    Aliancia: {
        fullName: 'Aliancia - Szövetség',
        logo: logoAliancia,
        share: 2.1,
        tag: 899,
    },
    Demokrati: {
        logo: logoDemokrati,
        share: 4.1,
        tag: 900,
    },
    Hlas: {
        fullName: 'Hlas - SD',
        logo: logoHlas,
        share: 16.3,
        tag: 901,
    },
    KDH: {
        fullName: 'Kresťansko Demokratické Hnutie',
        logo: logoKDH,
        share: 6.4,
        tag: 902,
    },
    KSS: {
        logo: logoKSS,
        tag: 903,
    },
    LSNS: {
        fullName: 'Kotlebovci - ĽSNS',
        logo: logoLSNS,
        slug: 'ĽSNS',
        tag: 904,
    },
    MF: {
        fbName: 'MF-ODS',
        fullName: 'Magyar Fórum - Maďarské fórum',
        logo: logoMF,
        slug: 'MF-ODS',
        tag: 912,
    },
    OĽaNO: {
        fullName: 'Obyčajní Ľudia a Nezávislé Osobnosti',
        logo: logoOLaNO,
        share: 7,
        tag: 905,
    },
    PS: {
        fullName: 'Progresívne Slovensko',
        logo: logoPS,
        share: 14.1,
        tag: 906,
    },
    Republika: {
        logo: logoRepublika,
        share: 8.8,
        tag: 907,
    },
    SaS: {
        fullName: 'Sloboda a Solidarita',
        logo: logoSaS,
        share: 8.3,
        tag: 908,
    },
    'Sme Rodina': {
        logo: logoSmeRodina,
        share: 7.1,
        tag: 909,
    },
    Smer: {
        fullName: 'Smer - SSD',
        logo: logoSmer,
        share: 17.9,
        tag: 910,
    },
    SNS: {
        fullName: 'Slovenská Národná Strana',
        logo: logoSNS,
        share: 4.3,
        tag: 911,
    },
    'Za Ľudí': {
        logo: logoZaLudi,
        tag: 913,
    },
};

export const colorLightBlue = '#2bace2';
export const colorDarkBlue = '#1b335f';
export const colorOrange = '#f06c50';
export const colorLightGrey = '#e9f2f9';
export const colorGrey = '#878278';

export const colors = {
    colorLightBlue,
    colorDarkBlue,
    colorOrange,
    colorLightGrey,
    colorGrey,
};

export const errors = {
    loading: 'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
};

const phrases = {
    attr: 'Za správne označenú reklamu vyhodnocujeme statusy, v TEXTE ktorých je uvedený objednávateľ a dodávateľ reklamy. Statusy bez textu vyhodnocujeme ako "Nezistené".',
    campaignStart: 'od oficiálneho začiatku kampane 9. júna 2023.',
    meta: 'na sociálnych sieťach platformy Meta',
    preCampaignStart: 'od začiatku predkampane 11. decembra 2022.',
    weeklyProfiles:
        'ktorých výdavky počas posledných 90 dní predkampane od 11. marca 2023 alebo týždňové výdavky od začiatku kampane 9. júna 2023 presiahli 100 €.',
};

export const labels = {
    account: {
        tableCols: {
            account_name: 'Názov účtu',
            date: 'Dátum',
            amount: 'Suma',
            // currency: 'Mena',
            message: 'Popis platby',
            tx_type: 'Druh platby',
            vs: 'VS',
            ss: 'ŠS',
        },
        totalDisclaimer:
            'Súčet výdavkov na všetkých transparentných účtoch politických strán.',
    },
    ads: {
        amount: {
            accountsTitle: `Počet reklám jednotlivých profilov`,
            disclaimer: `Počet reklám ${phrases.preCampaignStart}`,
            label: 'Počet reklám',
            partiesTitle:
                'Súčet počtov reklám všetkých profilov politickej strany',
            partyAccountsTitle: `Počet reklám jednotlivých profilov strany`,
            totalDisclaimer: `Počet politických reklám ${phrases.meta} ${phrases.preCampaignStart}`,
        },
        attribution: {
            allTitle: 'Bilancia všetkých strán',
            amount: 'Počet',
            campaign: 'Kampaň',
            disclaimer: `Povinné označenie objednávateľa a dodávateľa podľa zákona o volebnej kampani ${phrases.campaignStart} ${phrases.attr}`,
            pctTitle: 'Rebríček správnosti označovania',
            pctDisclaimer: `Podiel správne označených reklám podľa zákona o volebnej kampani ${phrases.campaignStart} ${phrases.attr}`,
            precampaign: `Predkampaň`,
            title: 'Označenie objednávateľa a dodávateľa',
        },
        demography: {
            ages: 'Vekové skupiny',
            agesDisclaimer: `Podiel zásahu reklám vo vekových skupinách obyvateľstva ${phrases.preCampaignStart}`,
            genders: 'Pohlavia',
            gendersDisclaimer: `Podiel zásahu reklám medzi pohlaviami ${phrases.preCampaignStart}`,
            title: 'Demografické rozloženie online reklamy',
        },
        metaDisclaimer:
            'Politickú reklamu strán a ich politikov na sociálnych sieťach Facebook a Instagram sledujeme vďaka údajom, ktoré publikuje spoločnosť Meta v knižnici Meta Ad Library. Sumy sú uvedené bez DPH.',
        percent: 'Podiel',
        ranges: {
            accountsTitle: `Najviac inzerujúce profily od začiatku predkampane`,
            disclaimer: `Meta uvádza výdavky za reklamu v 100-eurových intervaloch, preto nie je možné urciť presnú sumu. Zobrazujeme celý interval a odhad výdavkov, ktorý je súčtom stredov intervalov všetkých reklám daného profilu zobrazovaných ${phrases.preCampaignStart}`,
            estimate: 'Odhadované výdavky',
            partiesTitle: `Rozsah výdavkov všetkých profilov politickej strany od začiatku predkampane`,
            partyAccountsTitle: `Najviac inzerujúce profily strany od začiatku predkampane`,
            range: 'Skutočný rozsah výdavkov',
        },
        regions: {
            allDisclaimer: `Podiel zásahu online reklamy všetkých strán v krajoch Slovenska ${phrases.preCampaignStart} Pre podrobnejšiu analýzu cielenia strán na regióny vzhľadom na veľkosť krajov, kliknite na názov strany.`,
            diffAvg: 'Odchýlka od priemerného zásahu strany v SR',
            diffAvgDisclaimer:
                'Odchýlka zásahu reklamy na jedného obyvateľa kraja od priemerného zásahu strany v celej SR.',
            disclaimer: `Podiel zásahu online reklamy v krajoch Slovenska ${phrases.preCampaignStart} Vnútorný graf zobrazuje veľkosti krajov podľa počtu obyvateľov.`,
            label: 'Podiel zásahu reklám',
            sizeDisclaimer: '',
            sizeLabel: 'Podiel populácie SR žijúcej v tomto kraji',
            title: 'Regionálne rozloženie online reklamy',
        },
        showMore: 'Zistiť viac o online kampani',
        weeklySpending: {
            accountsTitle: `Profily s týždennými výdavkami na reklamu nad 100 €`,
            disclaimer: `Zobrazené sú len profily, ${phrases.weeklyProfiles}`,
            label: 'Týždňové výdavky na reklamu',
            partiesDisclaimer: `Započítané sú len profily ${phrases.meta}, ${phrases.weeklyProfiles} Pre kompletný zoznam započítaných straníckych profilov a podrobnejšie dáta o online kampani, kliknite na názov strany.`,
            partiesTitle:
                'Súčet výdavkov všetkých profilov politickej strany s týždennými výdavkami na reklamu nad 100 €',
            partyAccountsTitle: `Profily strany s týždennými výdavkami na reklamu nad 100 €`,
            totalDisclaimer: `Súčet výdavkov na politickú reklamu ${phrases.meta}. Započítane sú všetky profily, ${phrases.weeklyProfiles}`,
            topTitle: `Top 10 online kampaní`,
        },
    },
    disclaimerAccount: 'Príjmy aj výdavky sú očistené o vrátené platby.',
    donate: 'Darujte',
    donateLong: 'Darujte na kontrolu volieb',
    elections: {
        account: 'Transparentný účet',
        account_key: 'url',
        name_key: 'name',
    },
    charts: {
        disclaimer:
            'Grafy obsahujú dáta z transparentných účtov manuálne vyhľadaných na stránkach bánk, očistené o vrátené platby.',
        disclaimerClick: 'Po kliknutí na názov strany sa rozbalia podrobnosti.',
        updated: 'Naposledy aktualizované',
        incoming: 'Príjmy',
        outgoing: 'Výdavky',
        uniqeDonors: 'Počet unikátnych darcov',
    },
    tis: 'Transparency International Slovensko',
    search: 'Vyhľadávanie',
    showMore: 'Zobraziť viac',
    websiteTitle: 'Voľby',
};

export const settings = {
    donateUrl: 'https://transparency.sk/volby',
};

export const constants = {
    categories,
    colors,
    errors,
    labels,
    parties,
    settings,
};

export default constants;
