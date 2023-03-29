export const categories = {
    news: 877,
};

export const parties = {
    demokrati: {
        category: 897,
    },
    hlas: {
        category: 893,
    },
    kdh: {
        category: 892,
    },
    kss: {
        category: 888,
    },
    lsns: {
        category: 895,
    },
    olano: {
        category: 886,
    },
    ps: {
        category: 891,
    },
    republika: {
        category: 894,
    },
    sas: {
        category: 887,
    },
    'sme-rodina': {
        category: 896,
    },
    smer: {
        category: 889,
    },
    sns: {
        category: 890,
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
