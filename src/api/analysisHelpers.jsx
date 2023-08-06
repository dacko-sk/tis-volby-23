import { ecodeHTMLEntities } from './helpers';

export const campaignMetadata = {
    party: 'party',
    leader: 'leader',
    fb: 'fb',
    web: 'web',
    date: 'date',
    score: 'score',
};

export const transparencyClasses = {
    good: 'good',
    average: 'average',
    bad: 'bad',
    unknown: 'unknown',
};

export const transparencyIndicators = {
    account: 'account',
    financing: 'financing',
    information: 'information',
};

export const analysisLabels = {
    date: 'Hodnotenie ku dňu',
    history: 'História hodnotení',
    indicators: {
        [transparencyIndicators.account]: {
            title: 'Transparentný účet',
            criteria: [
                'existencia samostatného účtu',
                'oznamovacia povinnosť',
                'označovanie platcov a príjemcov',
                'podrobnosť účtu',
                'popisovanie výdavkov',
                'časová reálnosť výdavkov',
            ],
        },
        [transparencyIndicators.financing]: {
            title: 'Financovanie kampane',
            criteria: [
                'viaczdrojovosť',
                'nezávislosť od veľkých darov',
                'informovanie o predkampani',
                'plán kampane',
            ],
        },
        [transparencyIndicators.information]: {
            title: 'Informovanosť o kampani',
            criteria: [
                'existencia webu',
                'volebný program',
                'responzívnosť uvedeného kontaktu',
                'kampaňový tím/spolupracujúce agentúry',
                'predvolebné akcie',
                'označovanie inzercie',
            ],
        },
    },
    leader: 'Volebný líder',
    meta: 'Údaje o kampani',
    noData: 'Nie je dostupné hodnotenie kampane pre túto stranu.',
    party: 'Strana / koalícia',
    total: 'Celkové hodnotenie',
    transparency: {
        [transparencyClasses.good]: 'transparentná kampaň',
        [transparencyClasses.average]: 'kampaň s výhradami',
        [transparencyClasses.bad]: 'netransparentná kampaň',
        [transparencyClasses.unknown]: 'nedostatok dát / nehodnotené',
    },
    transparencyShort: {
        [transparencyClasses.good]: 'transparentná',
        [transparencyClasses.average]: 's výhradami',
        [transparencyClasses.bad]: 'netransparentná',
        [transparencyClasses.unknown]: 'N/A',
    },
    score: ['nezistené/netýka sa', 'áno', 'čiastočne', 'nie'],
};

export const transparencyClass = (score) => {
    let cls = transparencyClasses.unknown;
    const num = Number(score);
    if (!Number.isNaN(num) && num > -1) {
        cls = transparencyClasses.bad;
        if (score >= 40) {
            cls =
                score >= 70
                    ? transparencyClasses.good
                    : transparencyClasses.average;
        }
    }
    return cls;
};

export const parseAnalysisData = (html) => {
    if (html) {
        const start = '<tbody><tr>';
        const end = '</tr></tbody>';
        const startPos = html.indexOf(start);
        const endPos = html.indexOf(end);

        if (startPos > -1 && endPos > -1) {
            const tableData = [];
            html.substring(startPos + start.length, endPos)
                .replaceAll('<tr>', '')
                .split('</tr>')
                .forEach((row) => {
                    const cols = [];
                    row.split('</td>').forEach((col, index) => {
                        // ignore first row (names), save the rest into tableData
                        if (index > 0 && col.trim()) {
                            const val = col
                                .replaceAll('<td>', '')
                                .replaceAll(/<a[^>]*>/g, '')
                                .replaceAll(/<\/a>/g, '');
                            const num = Number(val.replaceAll(',', '.'));
                            cols.push(
                                !val || Number.isNaN(num)
                                    ? ecodeHTMLEntities(val)
                                    : num
                            );
                        }
                    });
                    tableData.push(cols);
                });

            const baseProps = Object.keys(campaignMetadata);
            let required = baseProps.length;
            Object.keys(transparencyIndicators).forEach((group) => {
                required += analysisLabels.indicators[group].criteria.length;
            });

            if (tableData.length >= required) {
                const analysis = {};
                let rowKey = 0;

                // base campaign data
                baseProps.forEach((prop) => {
                    // numeric check for score row - set to minus 1 (unknown) if score is not numeric
                    if (prop === campaignMetadata.score) {
                        tableData[rowKey].forEach((column, columnKey) => {
                            const num = Number(column);
                            if (Number.isNaN(num)) {
                                tableData[rowKey][columnKey] = -1;
                            }
                        });
                    }
                    analysis[prop] = tableData[rowKey];
                    rowKey += 1;
                });

                // transparency analysis indicators
                Object.keys(transparencyIndicators).forEach((group) => {
                    analysis[group] = {};
                    analysisLabels.indicators[group].criteria.forEach(
                        (criterium) => {
                            analysis[group][criterium] = tableData[rowKey];
                            rowKey += 1;
                        }
                    );
                });
                return analysis;
            }
        }
    }
    return {
        error: 'Corrupted table format',
    };
};
