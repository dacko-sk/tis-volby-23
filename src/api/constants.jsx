import logoAliancia from '../../public/img/parties/Aliancia.jpg';
import logoDemokrati from '../../public/img/parties/Demokrati.jpg';
import logoHlas from '../../public/img/parties/Hlas.svg?url';
import logoKarma from '../../public/img/parties/Karma.jpg';
import logoKDH from '../../public/img/parties/KDH.svg?url';
import logoKSS from '../../public/img/parties/KSS.svg?url';
import logoKU from '../../public/img/parties/KU.png';
import logoLSNS from '../../public/img/parties/LSNS.svg?url';
import logoMF from '../../public/img/parties/MF.png';
import logoMM from '../../public/img/parties/MM.jpg';
import logoMS from '../../public/img/parties/MS.png';
import logoOLaNO from '../../public/img/parties/OĽaNO.png';
import logoPrincip from '../../public/img/parties/princip.jpg';
import logoPS from '../../public/img/parties/PS.png';
import logoRepublika from '../../public/img/parties/Republika.png';
import logoSaS from '../../public/img/parties/SASKA.jpg';
import logoSDKU from '../../public/img/parties/SDKU-DS.svg?url';
import logoSHO from '../../public/img/parties/SHO.png';
import logoSmeRodina from '../../public/img/parties/SmeRodina.png';
import logoSmer from '../../public/img/parties/Smer.jpg';
import logoSNS from '../../public/img/parties/SNS.png';
import logoSOS from '../../public/img/parties/SOS.svg?url';
import logoSrdce from '../../public/img/parties/Srdce.png';
import logoSPS from '../../public/img/parties/SPS.png';
import logoVB from '../../public/img/parties/VB.jpg';
import logoZaLudi from '../../public/img/parties/za-ludi.svg?url';

export const icons = {
    info: {
        alt: 'Info:',
        path: (
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        ),
    },
    warning: {
        alt: 'Upozornenie:',
        path: (
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        ),
    },
};

// party object key matches with CSV account key
export const parties = {
    Aliancia: {
        fullName:
            'SZÖVETSÉG - Magyarok. Nemzetiségek. Regiók. | ALIANCIA - Maďari. Národnosti. Regióny',
        logo: logoAliancia,
        share: 2.1,
        tag: 899,
    },
    Demokrati: {
        fullName: 'DEMOKRATI',
        logo: logoDemokrati,
        share: 4.1,
        tag: 900,
    },
    Hlas: {
        fullName: 'HLAS - sociálna demokracia',
        logo: logoHlas,
        share: 16.3,
        tag: 901,
    },
    KARMA: {
        logo: logoKarma,
        slug: 'Karma',
        tag: 918,
    },
    KDH: {
        fullName: 'Kresťanskodemokratické hnutie',
        logo: logoKDH,
        share: 6.4,
        tag: 902,
    },
    'Kresťanská únia': {
        logo: logoKU,
        slug: 'KU',
        tag: 919,
    },
    'Komunistická strana Slovenska': {
        logo: logoKSS,
        slug: 'KSS',
        tag: 903,
    },
    LSNS: {
        fullName: 'Kotlebovci - Ľudová strana Naše Slovensko',
        logo: logoLSNS,
        slug: 'ĽSNS',
        tag: 904,
    },
    MF: {
        fbName: 'MF-ODS',
        fullName:
            'Maďarské fórum, Občianski demokrati Slovenska, Za regióny, Rómska koalícia, Demokratická strana',
        logo: logoMF,
        slug: 'MF-ODS-ZR-RK-DS',
        tag: 912,
    },
    MySlovensko: {
        logo: logoMS,
        slug: 'MS',
        tag: 920,
    },
    'Modri, Most-Hid': {
        fbName: 'Modrí-Most',
        fullName: 'Modrí, Most - Híd',
        logo: logoMM,
        slug: 'MM',
        tag: 917,
    },
    OĽaNO: {
        fullName:
            'OĽANO A PRIATELIA: OBYČAJNÍ ĽUDIA (OĽANO), NEZÁVISLÍ KANDIDÁTI (NEKA), NOVA, SLOBODNÍ A ZODPOVEDNÍ, PAČIVALE ROMA, MAGYAR SZÍVEK',
        logo: logoOLaNO,
        share: 7,
        tag: 905,
    },
    'Pirátska strana': {
        fbName: 'SPS',
        fullName: 'Pirátska strana - Slovensko',
        logo: logoSPS,
        slug: 'SPS',
        tag: 914,
    },
    Princíp: {
        fullName: 'PRINCÍP',
        logo: logoPrincip,
        tag: 924,
    },
    PS: {
        fullName: 'Progresívne Slovensko',
        logo: logoPS,
        share: 14.1,
        tag: 906,
    },
    Republika: {
        fullName: 'REPUBLIKA',
        logo: logoRepublika,
        share: 8.8,
        tag: 907,
    },
    SaS: {
        fullName: 'Sloboda a Solidarita',
        logo: logoSaS,
        share: 8.3,
        tag: 908,
    },
    SDKÚ: {
        fullName:
            'SDKÚ - DS - Slovenská demokratická a kresťanská únia - Demokratická strana',
        logo: logoSDKU,
        tag: 927,
    },
    'Slovenské Hnutie Obrody': {
        logo: logoSHO,
        slug: 'SHO',
        tag: 921,
    },
    'Sme Rodina': {
        fullName: 'SME RODINA',
        logo: logoSmeRodina,
        share: 7.1,
        tag: 909,
    },
    Smer: {
        fullName: 'SMER - sociálna demokracia',
        logo: logoSmer,
        share: 17.9,
        tag: 910,
    },
    SNS: {
        fullName: 'Slovenská národná strana',
        logo: logoSNS,
        share: 4.3,
        tag: 911,
    },
    'Spoločne občania Slovenska': {
        fullName: 'SPOLOČNE OBČANIA SLOVENSKA',
        logo: logoSOS,
        slug: 'SOS',
        tag: 916,
    },
    SPRAVODLIVOSŤ: {
        slug: 'Spravodlivosť',
        tag: 915,
    },
    SRDCE: {
        fullName: 'SRDCE vlastenci a dôchodcovia - SLOVENSKÁ NÁRODNÁ JEDNOTA',
        logo: logoSrdce,
        slug: 'Srdce',
        tag: 922,
    },
    'Vlastenecký blok': {
        logo: logoVB,
        slug: 'VB',
        tag: 923,
    },
    'Za Ľudí': {
        fullName: 'ZA ĽUDÍ',
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
    google: 'ktoré prostredníctvom služieb Google Ads a Google Display & Video 360 uverejnili reklamy v hodnote nad 100 €',
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
                disclaimer: `Zobrazené sú len politické účty, ${phrases.google} ${phrases.preCampaignStart}`,
                partiesDisclaimer: `Započítané sú len politické účty, ${phrases.google} ${phrases.preCampaignStart} Pre kompletný zoznam započítaných straníckych profilov a podrobnejšie dáta o online kampani, kliknite na názov strany.`,
                partiesTitle: `Súčet výdavkov všetkých profilov politickej strany s výdavkami na reklamu nad 100 €`,
                partyAccountsTitle: `Profily strany s výdavkami na reklamu nad 100 €`,
            },
            title: 'Google',
            topTitle: `Top %s Google kampaní`,
            totalDisclaimer: `Súčet výdavkov politických účtov, ${phrases.google} ${phrases.preCampaignStart}`,
            totalSpendingTitle: 'Výdavky na Google reklamu',
        },
        meta: {
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
                title: 'Demografické rozloženie reklamy',
            },
            disclaimer:
                'Politickú reklamu strán a ich politikov na sociálnych sieťach Facebook a Instagram sledujeme vďaka údajom, ktoré publikuje spoločnosť Meta v knižnici Meta Ad Library. Sumy sú uvedené bez DPH.',
            ranges: {
                accountsTitle: `Najviac inzerujúce profily od začiatku predkampane`,
                disclaimer: `Meta uvádza výdavky za reklamu v 100-eurových intervaloch, preto nie je možné urciť presnú sumu. Zobrazujeme celý interval a odhad výdavkov, ktorý je súčtom stredov intervalov všetkých reklám daného profilu zobrazovaných ${phrases.preCampaignStart}`,
                estimate: 'Odhadované výdavky',
                partiesTitle: `Rozsah výdavkov všetkých profilov politickej strany od začiatku predkampane`,
                partyAccountsTitle: `Najviac inzerujúce profily strany od začiatku predkampane`,
                range: 'Skutočný rozsah výdavkov',
            },
            regions: {
                allDisclaimer: `Podiel zásahu online reklamy všetkých strán v krajoch Slovenska ${phrases.preCampaignStart} Pre podrobnejšiu analýzu cielenia strán na regióny vzhľadom na veľkosť krajov, kliknite na názov strany.`,
                diffAvg: 'Odchýlka od priemerného zásahu strany v SR',
                diffAvgDisclaimer:
                    'Odchýlka zásahu reklamy na jedného obyvateľa kraja od priemerného zásahu strany v celej SR.',
                disclaimer: `Podiel zásahu online reklamy v krajoch Slovenska ${phrases.preCampaignStart} Vnútorný graf zobrazuje veľkosti krajov podľa počtu obyvateľov.`,
                label: 'Podiel zásahu reklám',
                sizeDisclaimer: '',
                sizeLabel: 'Podiel populácie SR žijúcej v tomto kraji',
                title: 'Regionálne rozloženie reklamy',
            },
            spending: {
                accountsTitle: `Profily s týždennými výdavkami na reklamu nad 100 €`,
                disclaimer: `Zobrazené sú len profily, ${phrases.weeklyProfiles}`,
                label: 'Týždňové výdavky na reklamu',
                partiesDisclaimer: `Započítané sú len profily ${phrases.meta}, ${phrases.weeklyProfiles} Pre kompletný zoznam započítaných straníckych profilov a podrobnejšie dáta o online kampani, kliknite na názov strany.`,
                partiesTitle:
                    'Súčet výdavkov všetkých profilov politickej strany s týždennými výdavkami na reklamu nad 100 €',
                partyAccountsTitle: `Profily strany s týždennými výdavkami na reklamu nad 100 €`,
            },
            title: 'Meta',
            topTitle: `Top %s Meta kampaní`,
            totalDisclaimer: `Súčet výdavkov na politickú reklamu ${phrases.meta}. Započítane sú všetky profily, ${phrases.weeklyProfiles}`,
            totalSpendingTitle: 'Výdavky na Meta reklamu',
        },
        noData: 'Neevidujeme žiaden účet strany s výdavkami na sponzorované príspevky na tejto platforme.',
        percent: 'Podiel',
        showMore: 'Zistiť viac o online kampani',
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
    news: {
        noData: 'Neboli nájdené žiadne články.',
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
    colors,
    errors,
    icons,
    labels,
    parties,
    settings,
};

export default constants;
