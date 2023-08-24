import parse, { attributesToProps, domToReact } from 'html-react-parser';

import { ecodeHTMLEntities, isNumeric } from './helpers';
import { routes } from './routes';

export const wpCat = {
    analyses: 925,
    assets: 926,
    featured: 928,
    news: 877,
};

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
            if (attribs && attribs.href.startsWith('http://')) {
                // fix http links to https
                const props = {
                    ...attributesToProps(attribs),
                    // proxy image to force https
                    href: attribs.href.replace('http://', 'https://'),
                };
                const content = domToReact(children, parserOptions);
                return <a {...props}>{content}</a>;
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
export const methodologyPage = routes.article(
    'ako-sme-hodnotili-transparentnost-kampani-pred-parlamentnymi-volbami-2023'
);

export const metaData = {
    coalition: 'coalition',
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
            criteria: {
                'Označovanie platiteľov a príjemcov':
                    'Na transparentnom účte sú precízne označené vklady strany a príjemcovia platieb, vďaka čomu je možné identifikovať komu strana za kampaň platí',
                'Podrobnosť účtu':
                    'Transparentnosť kampane nie je znižovaná využívaním súhrnných platieb, najčastejšie pre agentúry, ktoré predstavujú značnú časť výdavkov v kampani',
                'Popisovanie výdavkov':
                    'Predvolebná kampaň strany je kontrolovateľná vďaka zrozumiteľným a výstižným popisom, ktoré vysvetľujú účel jednotlivých platieb',
                'Časová reálnosť výdavkov':
                    'Výdavky na transparentom účte zodpovedajú reálnemu priebehu predvolebnej kampane. Strana sa vyhýba väčším zálohovým platbám, či využívaniu faktúr s dlhou dobou splatnosti',
                'Identifikácia bilboardovej kampane':
                    'Na transparentnom účte je možné identifikovať výdavky na outdoorovú kampaň strany, minimálne v rozsahu mesačných výdavkov na tento typ reklamy',
            },
        },
        [transparencyIndicators.financing]: {
            title: 'Financovanie kampane',
            criteria: {
                'Informovanie o financovaní kampane':
                    'Darcovia a veritelia strany sú prehľadne identifikovateľní prostredníctvom transparentného účtu a webu strany',
                'Spôsob financovania':
                    'redvolebná kampaň je postavená na viacerých zdrojoch financovania, napríklad aktivizovaním sympatizantov cez posielanie drobných darov',
                'Preverovanie pozadia veľkých darcov/veriteľov':
                    'Strana si preveruje väčších darcov/veriteľov a je ochotná na požiadanie poskytnúť detaily o príklade takéhoto preverovania',
                'Informovanie o predkampani':
                    'Transparentnosť kampane strana zvýšila dobrovoľným využívaním transparentného účtu už v čase predkampane, prípadne na vyžiadanie poskytla informáciu o celkovej výške financií vynaložených na predkampaň',
                'Plán kampane':
                    'Strana proaktívne informuje o plánovanej výške kampane a spôsobe jej financovania, prípadne na vyžiadanie poskytla tieto informácie',
            },
        },
        [transparencyIndicators.information]: {
            title: 'Informovanosť o kampani',
            criteria: {
                'Volebný program':
                    'Strana na svojom webe v čase oficiálnej kampane zverejnila predvolebný program',
                'Poskytnutie informácií z oficiálneho kontaktu strany':
                    'Test funkčnosti oficiálneho kontaktu strany počas kampane, zaslanie otázky potenciálneho voliča s textom: “Dobrý deň, mohli by ste mi prosím poskytnúť informáciu, kde by sa do volieb bolo možné stretnúť s Vašim predsedom (príp. predsedníčkou) aj osobne? Viem sa dostaviť kdekoľvek v rámci Slovenska. Za odpoveď vopred ďakujem.“',
                'Odpoveď potenciálnemu voličovi cez sociálnu sieť':
                    'Test ochoty strany komunikovať s voličom cez sociálnu sieť, zaslanie otázky potenciálneho voliča cez Messenger na FB profile strany s textom: „Mohli by ste mi prosím, ako Vášmu potenciálnemu voličovi, ozrejmiť, ako plánujete bojovať proti odvrátiteľným úmrtiam v slovenskom zdravotníctve? Vďaka za odpoveď“',
                'Kampaňový tím/spolupracujúce agentúry':
                    'Strana proaktívne informuje o spôsobe realizácie kampane, kampaňovom tíme a spolupracujúcich agentúrach, najmä na vlastnej webovej stránke, prípadne tieto informácie poskytla na vyžiadanie',
                'Predvolebné akcie':
                    'Strana v priebehu oficiálnej kampane poskytuje informácie o svojich predvolebných akciách, najmä na webovej stránke alebo sociálnej sieti',
                'Označovanie inzercie':
                    'Strana v zmysle zákona označuje precízne politickú inzerciu na sociálnej sieti doplnením informácie o objednávateľovi a dodávateľovi reklamy',
                'Majetkové priznanie lídra':
                    'Predseda strany na vyžiadanie Transparency vyplnil rozšírené majetkové priznanie a súhlasil s jeho zverejnením',
            },
        },
    },
    meta: 'Údaje o kampani',
    methodology: 'Metodika hodnotenia',
    noAnalyses:
        'Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne.',
    noAssets: 'Nie sú dostupné majetkové priznania pre túto stranu.',
    noData: 'Nie je dostupné hodnotenie kampane pre túto stranu.',
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
    [metaData.coalition]: 'Koalícia',
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
                required += Object.keys(
                    analysisLabels.indicators[group].criteria
                ).length;
            });

            if (tableData.length >= required) {
                const analysis = {
                    base: {},
                    lastColumn: -1,
                    lastScore: -1,
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
                        if (column !== '') {
                            validColumns.push(columnKey);
                            analysis.lastColumn += 1;
                            analysis.lastScore = isNumeric(column)
                                ? column
                                : -1;
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
                    Object.keys(
                        analysisLabels.indicators[group].criteria
                    ).forEach((criterium) => {
                        // remove invalid columns
                        tableData[rowKey].forEach((column, columnKey) => {
                            if (!validColumns.includes(columnKey)) {
                                tableData[rowKey].splice(columnKey, 1);
                            }
                        });
                        // save valid columns as property value
                        analysis[group][criterium] = tableData[rowKey];
                        rowKey += 1;
                    });
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
