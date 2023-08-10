import parse, { attributesToProps, domToReact } from 'html-react-parser';

import { ecodeHTMLEntities, isNumeric } from './helpers';

const proxyHttpImages = (html) => {
    const regex = /(http:\/\/cms.transparency.sk\/[^",]+.(png|jpe?g|gif|svg))/i;
    return html.replace(regex, 'https://images.weserv.nl/?url=$1');
};

const parserOptions = {
    replace: ({ name, attribs, children }) => {
        if (name === 'img' && attribs && attribs.src) {
            const props = {
                ...attributesToProps(attribs),
                // proxy image to force https
                src: proxyHttpImages(attribs.src),
                // add bootstrap 5 classes to images
                className: 'figure-img img-fluid',
            };
            return <img {...props} />;
        }
        if (name === 'a') {
            if (attribs && attribs.rel && attribs.rel.startsWith('lightbox')) {
                // remove lightbox links
                // will recursively run parser on children
                return domToReact(children, parserOptions);
            }
            if (
                children.length &&
                children[0].type === 'text' &&
                children[0].data.startsWith('Continue reading')
            ) {
                // remove "continue reading" links to WP domain
                return <></>;
            }
        }
        if (name === 'figure') {
            // add bootstrap 5 classes to figures
            return (
                <figure className={`figure ${attribs.class || ''}`}>
                    {domToReact(children, parserOptions)}
                </figure>
            );
        }
        if (name === 'figcaption') {
            // add bootstrap 5 classes to figcaptions
            return (
                <figcaption className="figure-caption text-center">
                    {domToReact(children, parserOptions)}
                </figcaption>
            );
        }
        // otherwise no replacement
        return null;
    },
};

export const parseWpHtml = (html) => parse(html, parserOptions);

export const processArticles = (data) => {
    const articles = [];
    data.forEach((article) => {
        articles.push({
            ...article,
            title: {
                ...article.title,
                // fix titles
                rendered: ecodeHTMLEntities(article.title.rendered),
            },
        });
    });
    return articles;
};

/**
 * Analysis helpers
 */

export const metaData = {
    leader: 'leader',
    fb: 'fb',
    web: 'web',
};

export const baseData = {
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
    badges: ['nezistené/netýka sa', 'áno', 'čiastočne', 'nie'],
    history: 'História hodnotení',
    indicators: {
        [transparencyIndicators.account]: {
            title: 'Transparentný účet',
            criteria: [
                'Označovanie platiteľov a príjemcov',
                'Podrobnosť účtu',
                'Popisovanie výdavkov',
                'Časová reálnosť výdavkov',
                'Identifikácia bilboardovej kampane',
            ],
        },
        [transparencyIndicators.financing]: {
            title: 'Financovanie kampane',
            criteria: [
                'Informovanie o financovaní kampane',
                'Spôsob financovania',
                'Preverovanie pozadia veľkých darcov/veriteľov',
                'Informovanie o predkampani',
                'Plán kampane',
            ],
        },
        [transparencyIndicators.information]: {
            title: 'Informovanosť o kampani',
            criteria: [
                'Volebný program',
                'Poskytnutie informácií z oficiálneho kontaktu strany',
                'Odpoveď potenciálnemu voličovi cez sociálnu sieť',
                'Kampaňový tím/spolupracujúce agentúry',
                'Predvolebné akcie',
                'Označovanie inzercie',
                'Majetkové priznanie lídra',
            ],
        },
    },
    meta: 'Údaje o kampani',
    methodology: 'Metodika hodnotenia',
    noData: 'Nie je dostupné hodnotenie kampane pre túto stranu.',
    party: 'Strana / koalícia',
    references: 'Referencie',
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
    [baseData.date]: 'Hodnotenie ku dňu',
    [baseData.score]: 'Celkové hodnotenie',
    [metaData.fb]: 'FB profil',
    [metaData.leader]: 'Volebný líder',
    [metaData.web]: 'Volebný web',
};

export const transparencyClass = (score) => {
    let cls = transparencyClasses.unknown;
    const num = Number(score);
    if (isNumeric(num) && num > -1) {
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
            // parse table
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
                                val && isNumeric(num)
                                    ? // not empty & numeric
                                      num
                                    : // string
                                      ecodeHTMLEntities(val)
                            );
                        }
                    });
                    tableData.push(cols);
                });

            // extract data from parsed table
            const metaProps = Object.keys(metaData);
            const baseProps = Object.keys(baseData);
            let required = metaProps.length + baseProps.length;
            Object.keys(transparencyIndicators).forEach((group) => {
                required += analysisLabels.indicators[group].criteria.length;
            });

            if (tableData.length >= required) {
                const analysis = {
                    base: {},
                    lastColumn: -1,
                    lastScore: 0,
                    meta: {},
                };
                let rowKey = 0;

                // campaign metaData
                metaProps.forEach((prop) => {
                    // only first column is used
                    [analysis.meta[prop]] = tableData[rowKey];
                    rowKey += 1;
                });

                const validColumns = [];
                // get valid columns by checking the score row - it is the last one from the baseProps
                // if empty or not numeric, ignore the column
                tableData[rowKey + baseProps.length - 1].forEach(
                    (column, columnKey) => {
                        if (column !== '' && isNumeric(column)) {
                            validColumns.push(columnKey);
                            analysis.lastColumn += 1;
                            analysis.lastScore = column;
                        }
                    }
                );
                // base campaign data
                baseProps.forEach((prop) => {
                    // remove invalid columns
                    tableData[rowKey].forEach((column, columnKey) => {
                        if (!validColumns.includes(columnKey)) {
                            tableData[rowKey].splice(columnKey, 1);
                        }
                    });
                    // save valid columns as property value
                    analysis.base[prop] = tableData[rowKey];
                    rowKey += 1;
                });

                // transparency analysis indicators
                Object.keys(transparencyIndicators).forEach((group) => {
                    analysis[group] = {};
                    analysisLabels.indicators[group].criteria.forEach(
                        (criterium) => {
                            // remove invalid columns
                            tableData[rowKey].forEach((column, columnKey) => {
                                if (!validColumns.includes(columnKey)) {
                                    tableData[rowKey].splice(columnKey, 1);
                                }
                            });
                            // save valid columns as property value
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

export const sortByScore = (a, b) => {
    if ((a.analysis.lastScore ?? false) && (b.analysis.lastScore ?? false)) {
        return b.analysis.lastScore - a.analysis.lastScore;
    }
    return -1;
};

export const getAnalysedData = (data) => {
    const analysedData = [];
    processArticles(data).forEach((article) => {
        analysedData.push({
            ...article,
            analysis: parseAnalysisData(article.content.rendered),
        });
    });
    return analysedData.sort(sortByScore);
};
