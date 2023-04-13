export const categories = {
    news: 877,
};

// party object key matches with CSV account key
export const parties = {
    Aliancia: {
        name: 'Aliancia - Szövetség',
        tag: 899,
    },
    Demokrati: {
        tag: 900,
    },
    Hlas: {
        name: 'Hlas - SD',
        tag: 901,
    },
    KDH: {
        name: 'Kresťansko Demokratické Hnutie',
        tag: 902,
    },
    KSS: {
        tag: 903,
    },
    LSNS: {
        name: 'Kotlebovci - ĽSNS',
        slug: 'ĽSNS',
        tag: 904,
    },
    OĽaNO: {
        name: 'Obyčajní Ľudia a Nezávislé Osobnosti',
        tag: 905,
    },
    PS: {
        name: 'Progresívne Slovensko',
        tag: 906,
    },
    Republika: {
        tag: 907,
    },
    SaS: {
        name: 'Sloboda a Solidarita',
        tag: 908,
    },
    'Sme Rodina': {
        tag: 909,
    },
    Smer: {
        name: 'Smer - SSD',
        tag: 910,
    },
    SNS: {
        name: 'Slovenská Národná Strana',
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
        account_name: 'Názov účtu',
        date: 'Dátum',
        amount: 'Suma',
        // currency: 'Mena',
        message: 'Popis platby',
        tx_type: 'Druh platby',
        vs: 'VS',
        ss: 'ŠS',
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

export const constants = {
    categories,
    colors,
    errors,
    labels,
    parties,
};

export default constants;
