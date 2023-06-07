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
        fullName: 'Magyar Fórum - Maďarské fórum',
        logo: logoMF,
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
};

export const colorLightBlue = '#2bace2';
export const colorDarkBlue = '#1b335f';
export const colorOrange = '#f06c50';
export const colorGrey = '#e9f2f9';

export const colors = {
    colorLightBlue,
    colorDarkBlue,
    colorOrange,
    colorGrey,
};

export const errors = {
    loading: 'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
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
        amount: 'Počet reklám',
        amountAccountsTitle: 'Počet reklám jednotlivých FB profilov',
        amountDisclaimer: 'Počet reklám za sledované obdobie od 1.1.2023.',
        amountPartiesTitle:
            'Súčet počtov reklám všetkých profilov politickej strany',
        amountPartyAccountsTitle:
            'Počet reklám jednotlivých FB profilov strany',
        barRange: 'Skutočný rozsah výdavkov',
        rangesAccountsTitle:
            'Najviac inzerujúce profily na sociálnych sieťach platformy Meta od začiatku kampane',
        rangesDisclaimer:
            'Meta uvádza výdavky za reklamu v 100-eurových intervaloch, preto nie je možné urciť presnú sumu. Zobrazujeme celý interval a odhad výdavkov, ktorý je súčtom stredov intervalov všetkých reklám daného profilu zobrazovaných na Facebooku a Instagrame od 1.1.2023.',
        rangesPartiesTitle:
            'Rozsah výdavkov všetkých profilov politickej strany na sociálnych sieťach platformy Meta od začiatku kampane',
        rangesPartyAccountsTitle:
            'Najviac inzerujúce profily strany na sociálnych sieťach platformy Meta od začiatku kampane',
        regionalDisclaimer:
            'Absolútny podiel zásahu online reklamy v krajoch Slovenska a zahraničí za sledované obdobie od 1.1.2023.',
        regionalRelDisclaimer:
            'Podiel zásahu online reklamy, relatívny k počtu obyvateľov daného kraja na Slovensku.',
        regionalTitle: 'Regionálne rozloženie online reklamy',
        scatterEstimate: 'Odhadované výdavky',
        showMore: 'Zistiť viac o online kampani',
        spendingAccountsTitle: 'FB profily s týždennými výdavkami nad 100 €',
        spendingDisclaimer:
            'Zobrazené sú len FB profily, ktorých výdavky na reklamu presiahli 100 € aspoň v jednom týždni počas sledovaného obdobia od 1. mája 2023.',
        spendingPartiesTitle:
            'Súčet výdavkov všetkých profilov politickej strany s týždennými výdavkami nad 100 €',
        spendingPartyAccountsTitle:
            'FB profily strany s týždennými výdavkami nad 100 €',
        totalAmountDisclaimer:
            'Počet politických reklám na sociálnej sieti Facebook za sledované obdobie od 1.1.2023.',
        totalDisclaimer:
            'Súčet výdavkov na politickú reklamu na sociálnej sieti Facebook. Započítane sú všetky stranícke profliy, ktorých výdavky presiahli 100 € aspoň v jednom týždni počas sledovaného obdobia od 1. mája 2023.',
        weeklySpending: 'Týždňové výdavky na FB reklamu',
    },
    disclaimerAccount: 'Príjmy aj výdavky sú očistené o vrátené platby.',
    donate: 'Darujte',
    donateLong: 'Darujte na kontrolu volieb',
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
