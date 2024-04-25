import { elections as el } from './constants';
import { getCurrentLanguage, languages } from './routes';

import { csvAccountKeys as ak } from '../context/DataContext';
import {
    baseData as abd,
    metaData as amd,
    transparencyClasses as atc,
    transparencyIndicators as ati,
} from './wpHelpers';
import {
    attributionKeys as ca,
    genderKeys as cg,
    regionKeys as cr,
} from './chartHelpers';

export const labels = {
    account: {
        allTransactions: [
            'Zobraziť všetky transakcie',
            'Show all transactions',
        ],
        balance: ['Zostatok', 'Balance'],
        download: ['Stiahnuť ako CSV', 'Download as CSV'],
        expensesAmount: ['Počet výdavkov', 'Number of expenses'],
        incomesAmount: ['Počet príjmov', 'Number of incomes'],
        info: ['Informácie o kampani', 'Campaign details'],
        overview: [
            'Prehľad transakcií na transparentnom účte',
            'Transparent Account Transactions',
        ],
        partySpending: ['Priebežné výdavky strany', 'Party spending'],
        tableCols: {
            [ak.account_name]: ['Názov účtu', 'Account name'],
            [ak.date]: ['Dátum', 'Date'],
            [ak.amount]: ['Suma', 'Amount'],
            [ak.message]: ['Popis platby', 'Payment details'],
            [ak.tx_type]: ['Druh platby', 'Type of payment'],
            [ak.vs]: ['VS', 'Variabile symbol'],
            [ak.ss]: ['ŠS', 'Specific symbol'],
        },
        title: ['Transparentné účty', 'Transparent accounts'],
        totalDisclaimer: [
            'Súčet výdavkov na všetkých transparentných účtoch politických strán.',
            'Sum of spendings on accounts of all political parties.',
        ],
        totalSpending: ['Celkové výdavky strán', 'Total parties spending'],
    },
    ads: {
        amount: {
            accountsTitle: [
                'Počet reklám jednotlivých profilov',
                'Number of ads of individual profiles',
            ],
            disclaimer: [
                'Počet reklám od začiatku predkampane 11. decembra 2022.',
                'Number of ads since the beginning of precampaign on December 2, 2022.',
            ],
            label: ['Počet reklám', 'Amount of ads'],
            partiesTitle: [
                'Súčet počtov reklám všetkých profilov politickej strany',
                'Sum of ads amounts of all party profiles',
            ],
            partyAccountsTitle: [
                'Počet reklám jednotlivých profilov strany',
                'Number of ads of party individual profiles',
            ],
        },
        google: {
            disclaimer: [
                'Politickú reklamu strán a ich politikov, zverejnenú prostredníctvom služieb Google Ads a Google Display & Video 360, sledujeme vďaka údajom, ktoré publikuje spoločnosť Google v Centre transparentnosti reklám. Sumy sú uvedené bez DPH.',
                'Political ads of parties and their politicians published in Google Ads and Google Display & Video 360 platforms is monitored thanks to the data published by Google in Google Ads Transparency Center. Amounts are without VAT.',
            ],
            format: {
                disclaimer: [
                    'Podiel jednotlivých formátov Google reklamy na celkových výdavkoch.',
                    'Share of individual Google Ads formats in total expenses.',
                ],
                title: ['Formáty reklamy', 'Ad format'],
            },
            spending: {
                accountsTitle: [
                    'Profily s výdavkami na reklamu nad 100 €',
                    'Profiles with advertising expenses exceeding 100 €',
                ],
                disclaimer: [
                    'Zobrazené sú len politické účty, ktoré prostredníctvom služieb Google Ads a Google Display & Video 360 uverejnili reklamy v hodnote nad 100 € od začiatku predkampane 11. decembra 2022.',
                    'We list only profiles whose spending on Google Ads and Google Display & Video 360 platforms exceeded 100 € since the beginning of precampaign on December 2, 2022.',
                ],
                partiesDisclaimer: [
                    'Započítané sú len politické účty, ktoré prostredníctvom služieb Google Ads a Google Display & Video 360 uverejnili reklamy v hodnote nad 100 € od začiatku predkampane 11. decembra 2022. Pre kompletný zoznam započítaných straníckych profilov a podrobnejšie dáta o online kampani, kliknite na názov strany.',
                    'Including political profiles whose spending on Google Ads and Google Display & Video 360 platforms exceeded 100 € since the beginning of precampaign on December 2, 2022. Click the party name for complete list of included profiles.',
                ],
                partiesTitle: [
                    'Súčet výdavkov všetkých profilov politickej strany s výdavkami na reklamu nad 100 €',
                    'Sum of advertising expenses of all profiles of the party exceeding 100 €',
                ],
                partyAccountsTitle: [
                    'Profily strany s výdavkami na reklamu nad 100 €',
                    'Profiles of the party with advertising expenses exceeding 100 €',
                ],
            },
            title: ['Google'],
            topTitle: ['Top 10 Google kampaní', 'Top 10 Google campaigns'],
            totalDisclaimer: [
                'Súčet výdavkov politických účtov, ktoré prostredníctvom služieb Google Ads a Google Display & Video 360 uverejnili reklamy v hodnote nad 100 € od začiatku predkampane 11. decembra 2022.',
                'Sum of expenses of profiles whose spending on Google Ads and Google Display & Video 360 platforms exceeded 100 € since the beginning of precampaign on December 2, 2022.',
            ],
            totalSpendingTitle: [
                'Výdavky na Google reklamu',
                'Advertising expenses in Google',
            ],
        },
        meta: {
            attribution: {
                allTitle: [
                    'Bilancia všetkých strán',
                    'Attribution by all parties',
                ],
                amount: ['Počet', 'Amount'],
                attrLabels: {
                    [ca.YES]: ['Správne označené', 'Correctly tagged'],
                    [ca.NO]: ['Neoznačené', 'Untagged'],
                    [ca['N/A']]: ['Nezistené', 'Unknown'],
                },
                campaign: ['Kampaň', 'Campaign'],
                disclaimer: [
                    'Povinné označenie objednávateľa a dodávateľa podľa zákona o volebnej kampani od oficiálneho začiatku kampane 9. júna 2023. Za správne označenú reklamu vyhodnocujeme statusy, v TEXTE ktorých je uvedený objednávateľ a dodávateľ reklamy. Statusy bez textu vyhodnocujeme ako "Nezistené".',
                    'Mandatory attribution of customer & supplier since the beginning of campaign on June 9, 2023. We evaluate status as correctly labeled if it contains "objednávateľ" and "dodávateľ" words in the TEXT. Statuses with no text are evaluated as "not detected"',
                ],
                pctTitle: [
                    'Rebríček správnosti označovania',
                    'Chart of attribution correctness',
                ],
                pctDisclaimer: [
                    'Podiel správne označených reklám podľa zákona o volebnej kampani od oficiálneho začiatku kampane 9. júna 2023. Za správne označenú reklamu vyhodnocujeme statusy, v TEXTE ktorých je uvedený objednávateľ a dodávateľ reklamy. Statusy bez textu vyhodnocujeme ako "Nezistené".',
                    'Share of correctly labeled ads since the beginning of campaign on June 9, 2023. We evaluate status as correctly labeled if it contains "objednávateľ" and "dodávateľ" words in the TEXT. Statuses with no text are evaluated as "not detected"',
                ],
                precampaign: ['Predkampaň', 'Precampaign'],
                title: [
                    'Označenie objednávateľa a dodávateľa',
                    'Attribution of customer and supplier',
                ],
            },
            demography: {
                ages: ['Vekové skupiny', 'Age groups'],
                agesDisclaimer: [
                    'Podiel zásahu reklám vo vekových skupinách obyvateľstva od začiatku predkampane 11. decembra 2022.',
                    'Distribution of ads impressions between age groups since the beginning of precampaign on December 2, 2022.',
                ],
                genders: ['Pohlavia', 'Genders'],
                gendersDisclaimer: [
                    'Podiel zásahu reklám medzi pohlaviami od začiatku predkampane 11. decembra 2022.',
                    'Distribution of ads impressions between genders since the beginning of precampaign on December 2, 2022.',
                ],
                genderLabels: {
                    [cg.female]: ['Ženy', 'Females'],
                    [cg.male]: ['Muži', 'Males'],
                    [cg.unknown]: ['Nezistené', 'Unknown'],
                },
                title: [
                    'Demografické rozloženie reklamy',
                    'Ads demographic distribution',
                ],
            },
            disclaimer: [
                'Politickú reklamu strán a ich politikov na sociálnych sieťach Facebook a Instagram sledujeme vďaka údajom, ktoré publikuje spoločnosť Meta v knižnici Meta Ad Library. Sumy sú uvedené bez DPH.',
                'Political ads of parties and their politicians published on Facebook and Instagram platforms is monitored thanks to the data published by Meta in Meta Ad Library. Amounts are without VAT.',
            ],
            ranges: {
                accountsTitle: [
                    'Najviac inzerujúce profily od začiatku predkampane',
                    'Profiles with highest advertising expenses range since the beginning of precampaign',
                ],
                disclaimer: [
                    'Meta uvádza výdavky za reklamu v 100-eurových intervaloch, preto nie je možné urciť presnú sumu. Zobrazujeme celý interval a odhad výdavkov, ktorý je súčtom stredov intervalov všetkých reklám daného profilu zobrazovaných od začiatku predkampane 11. decembra 2022.',
                    'Meta publishes advertising expenses in 100-eur intervals, therefore it is not possible to determine the exact amount. We show the whole interval and expenses estimate, which is the sum of middles of expenses intervals of all ads of the profile since the beginning of precampaign on December 2, 2022.',
                ],
                estimate: ['Odhadované výdavky', 'Estimated expenses'],
                partiesTitle: [
                    'Rozsah výdavkov všetkých profilov politickej strany od začiatku predkampane',
                    'Advertising expenses range of all profiles of the party since the beginning of precampaign',
                ],
                partyAccountsTitle: [
                    'Najviac inzerujúce profily strany od začiatku predkampane',
                    'Profiles of the party with highest advertising expenses range since the beginning of precampaign',
                ],
                range: ['Skutočný rozsah výdavkov', 'Real expenses interval'],
            },
            regions: {
                allDisclaimer: [
                    'Podiel zásahu online reklamy všetkých strán v krajoch Slovenska od začiatku predkampane 11. decembra 2022. Pre podrobnejšiu analýzu cielenia strán na regióny vzhľadom na veľkosť krajov, kliknite na názov strany.',
                    'Distribution of ads impressions of all parties between regions of Slovakia since the beginning of precampaign on December 2, 2022. Click the party name for detailed analysis of party targeting on regions based on their sizes.',
                ],
                diffAvg: [
                    'Odchýlka od priemerného zásahu strany v SR',
                    'Deviation from average impressions in Slovakia',
                ],
                diffAvgDisclaimer: [
                    'Odchýlka zásahu reklamy na jedného obyvateľa kraja od priemerného zásahu strany v celej SR.',
                    'Difference between impression per one citizen and average impressions in Slovakia',
                ],
                disclaimer: [
                    'Podiel zásahu online reklamy v krajoch Slovenska od začiatku predkampane 11. decembra 2022. Vnútorný graf zobrazuje veľkosti krajov podľa počtu obyvateľov.',
                    'Distribution of ads impressions between regions of Slovakia since the beginning of precampaign on December 2, 2022. The inner chart shows sizes of regions based on number of citizens.',
                ],
                label: ['Podiel zásahu reklám', 'Distribution of impressions'],
                regionLabels: {
                    [cr.BA]: ['Bratislavský kraj', 'Bratislava region'],
                    [cr.BB]: ['Banskobystrický kraj', 'Banská Bystrica region'],
                    [cr.KE]: ['Košický kraj', 'Košice region'],
                    [cr.NR]: ['Nitriansky kraj', 'Nitra region'],
                    [cr.PO]: ['Prešovský kraj', 'Prešov region'],
                    [cr.TN]: ['Trenčiansky kraj', 'Trenčín region'],
                    [cr.TT]: ['Trnavský kraj', 'Trnava region'],
                    [cr.ZA]: ['Žilinský kraj', 'Žilina region'],
                },
                sizeLabel: [
                    'Podiel populácie SR žijúcej v tomto kraji',
                    'Share of citizens living in this region',
                ],
                title: [
                    'Regionálne rozloženie reklamy',
                    'Regional distribution of ads',
                ],
            },
            spending: {
                accountsTitle: [
                    'Profily s týždennými výdavkami na reklamu nad 100 €',
                    'Profiles with weekly advertising expenses exceeding 100 €',
                ],
                disclaimer: [
                    'Zobrazené sú len profily, ktorých výdavky počas posledných 90 dní predkampane od 11. marca 2023 alebo týždňové výdavky od začiatku kampane 9. júna 2023 presiahli 100 €.',
                    'Includes Meta profiles whose advertising expenses during last 90 days of precampaign from March 11, 2023 or weekly expenses from the beginning of campaign on June 9, 2023 exceeded 100 €',
                ],
                label: [
                    'Týždňové výdavky na reklamu',
                    'Weekly advertising expenses',
                ],
                partiesDisclaimer: [
                    'Započítané sú len profily na sociálnych sieťach platformy Meta, ktorých výdavky počas posledných 90 dní predkampane od 11. marca 2023 alebo týždňové výdavky od začiatku kampane 9. júna 2023 presiahli 100 €. Pre kompletný zoznam započítaných straníckych profilov a podrobnejšie dáta o online kampani, kliknite na názov strany.',
                    'Includes Meta profiles whose advertising expenses during last 90 days of precampaign from March 11, 2023 or weekly expenses from the beginning of campaign on June 9, 2023 exceeded 100 €. Click the party name for complete list of included profiles.',
                ],
                partiesTitle: [
                    'Súčet výdavkov všetkých profilov politickej strany s týždennými výdavkami na reklamu nad 100 €',
                    'Sum of advertising expenses of all profiles of the party with weekly expenses exceeding 100 €',
                ],
                partyAccountsTitle: [
                    'Profily strany s týždennými výdavkami na reklamu nad 100 €',
                    'Party profiles with weekly advertising expenses exceeding 100 €',
                ],
            },
            title: ['Meta'],
            topTitle: ['Top 10 Meta kampaní', 'Top 10 Meta campaigns'],
            totalDisclaimer: [
                'Súčet výdavkov na politickú reklamu na sociálnych sieťach platformy Meta. Započítane sú všetky profily, ktorých výdavky počas posledných 90 dní predkampane od 11. marca 2023 alebo týždňové výdavky od začiatku kampane 9. júna 2023 presiahli 100 €.',
                'Sum of advertising expenses on social networks of Meta. Includes Meta profiles whose advertising expenses during last 90 days of precampaign from March 11, 2023 or weekly expenses from the beginning of campaign on June 9, 2023 exceeded 100 €',
            ],
            totalSpendingTitle: [
                'Výdavky na Meta reklamu',
                'Advertising expenses in Meta',
            ],
        },
        noAccounts: [
            'Hľadanému výrazu nezodpovedá žiaden online účet.',
            'No online account matches the search query',
        ],
        noData: [
            'Neevidujeme žiaden účet strany s výdavkami na sponzorované príspevky na tejto platforme.',
            'We did not find any profiles of the party with sponsored ads on this platform.',
        ],
        pageTitle: ['Online kampane', 'Online campaigns'],
        partyAccounts: ['Online účty strán', 'Party online accounts'],
        percent: ['Podiel', 'Share'],
        showMore: [
            'Zistiť viac o online kampani',
            'Learn more about Online Campaigns',
        ],
    },
    all: ['Zobraziť všetko', 'Show all'],
    analyses: {
        navTitle: ['Hodnotenia', 'Assessments'],
        pageTitle: [
            'Hodnotenie transparentnosti kampaní',
            'Assessment of campaigns transparency',
        ],
        top: ['Top %i hodnotených kampaní', 'Top %i rated campaigns'],
        showAll: ['Zobraziť všetky hodnotenia', 'Show all assessments'],
    },
    analysis: {
        [abd.date]: ['Hodnotenie ku dňu', 'Evaluation date'],
        [abd.score]: ['Celkové hodnotenie', 'Assessment'],
        [amd.coalition]: ['Koalícia', 'Coalition'],
        [amd.fb]: ['FB profil', 'FB profile'],
        [amd.leader]: ['Volebný líder', 'Elections leader'],
        [amd.web]: ['Volebný web', 'Elections web'],
        badges: [
            ['nezistené/netýka sa', 'áno', 'čiastočne', 'nie'],
            ['N/A', 'yes', 'partially', 'no'],
        ],
        history: ['História hodnotení', 'Assessments history'],
        indicators: {
            [ati.account]: [
                {
                    name: [
                        'Označovanie platiteľov a príjemcov',
                        'Marking of Payers and Recipients',
                    ],
                    desc: [
                        'Na transparentnom účte sú precízne označené vklady strany a príjemcovia platieb, vďaka čomu je možné identifikovať komu strana za kampaň platí',
                        `The party's transparent account clearly indicates the originators and beneficiaries of payments, allowing for easy identification of who the party is paying for the campaign.`,
                    ],
                },
                {
                    name: ['Podrobnosť účtu', 'Account Details'],
                    desc: [
                        'Transparentnosť kampane nie je znižovaná využívaním súhrnných platieb, najčastejšie pre agentúry, ktoré predstavujú značnú časť výdavkov v kampani',
                        'Campaign transparency is not reduced by the use of aggregate payments, most often directed to agencies that account for a significant portion of campaign spending.',
                    ],
                },
                {
                    name: ['Popisovanie výdavkov', 'Description of Expenses'],
                    desc: [
                        'Predvolebná kampaň strany je kontrolovateľná vďaka zrozumiteľným a výstižným popisom, ktoré vysvetľujú účel jednotlivých platieb',
                        `The party's election campaign is easily traceable due to clear and concise descriptions accompanying individual payments.`,
                    ],
                },
                {
                    name: [
                        'Časová reálnosť výdavkov',
                        'Time Reality of Expenses',
                    ],
                    desc: [
                        'Výdavky na transparentom účte zodpovedajú reálnemu priebehu predvolebnej kampane. Strana sa vyhýba väčším zálohovým platbám, či využívaniu faktúr s dlhou dobou splatnosti',
                        'Expenditures on the transparent account correspond to the actual progression of the election campaign. The party avoids making substantial advance payments or using invoices with extended maturity periods.',
                    ],
                },
                {
                    name: [
                        'Identifikácia bilboardovej kampane',
                        'Identification of the Billboard Campaign',
                    ],
                    desc: [
                        'Na transparentnom účte je možné identifikovať výdavky na outdoorovú kampaň strany, minimálne v rozsahu mesačných výdavkov na tento typ reklamy',
                        `The transparent account enables the identification of expenses related to the party's outdoor campaign, at least within the monthly expense range for this type of advertising.`,
                    ],
                },
            ],
            [ati.financing]: [
                {
                    name: [
                        'Informovanie o financovaní kampane',
                        'Information about Campaign Financing',
                    ],
                    desc: [
                        'Darcovia a veritelia strany sú prehľadne identifikovateľní prostredníctvom transparentného účtu a webu strany',
                        `The party's donors and creditors are readily identifiable through a transparent account and the party's official website.`,
                    ],
                },
                {
                    name: ['Spôsob financovania', 'Method of Financing'],
                    desc: [
                        'Predvolebná kampaň je postavená na viacerých zdrojoch financovania, napríklad aktivizovaním sympatizantov cez posielanie drobných darov',
                        'The regular election campaign relies on diverse funding sources, including activating supporters through small donations.',
                    ],
                },
                {
                    name: [
                        'Preverovanie pozadia veľkých darcov/veriteľov',
                        'Major Donor/Lender Background Checks',
                    ],
                    desc: [
                        'Strana si preveruje väčších darcov/veriteľov a je ochotná na požiadanie poskytnúť detaily o príklade takéhoto preverovania',
                        'The party conducts thorough background checks on major donors/lenders and is prepared to share specific examples of such screening upon request.',
                    ],
                },
                {
                    name: [
                        'Informovanie o predkampani',
                        'Information about the Pre-Campaign',
                    ],
                    desc: [
                        'Transparentnosť kampane strana zvýšila dobrovoľným využívaním transparentného účtu už v čase predkampane, prípadne na vyžiadanie poskytla informáciu o celkovej výške financií vynaložených na predkampaň',
                        'The party enhances campaign transparency by voluntarily utilizing a transparent account during the pre-campaign period or providing detailed information about the total funds allocated to the pre-campaign upon request.',
                    ],
                },
                {
                    name: ['Plán kampane', 'Campaign Plan'],
                    desc: [
                        'Strana proaktívne informuje o plánovanej výške kampane a spôsobe jej financovania, prípadne na vyžiadanie poskytla tieto informácie',
                        'The party adopts a proactive approach, openly sharing information about the planned campaign budget and its financing methods. Alternatively, this information is promptly provided upon request.',
                    ],
                },
            ],
            [ati.information]: [
                {
                    name: ['Volebný program', 'Election Program'],
                    desc: [
                        'Strana na svojom webe v čase oficiálnej kampane zverejnila predvolebný program',
                        'The party published its election program on its official website at the onset of the official campaign.',
                    ],
                },
                {
                    name: [
                        'Poskytnutie informácií z oficiálneho kontaktu strany',
                        'Provision of Information from the Official Party Contact',
                    ],
                    desc: [
                        'Test funkčnosti oficiálneho kontaktu strany počas kampane, zaslanie otázky potenciálneho voliča s textom: (1. Kolo): „Dobrý deň, mohli by ste mi prosím poskytnúť informáciu, kde by sa do volieb bolo možné stretnúť s Vašim predsedom (príp. predsedníčkou) aj osobne? Viem sa dostaviť kdekoľvek v rámci Slovenska. Za odpoveď vopred ďakujem.“, (2. Kolo): „Dobrý deň, chcel by som vedieť, či bude po voľbách možnosť uchádzať sa o miesto poslaneckých asistentov poslancov Vašej strany. Poprosím o detaily. Ďakujem.“',
                        `The functionality of the party's official contact was tested during the campaign by sending an inquiry of a potential voter in the following wording: (1st Round) "Hello, could you please provide me with information where it would be possible to meet before the election with your chairman (or chairwoman) in person? I can show up anywhere within Slovakia. Thank you in advance for your answer.", (2nd Round): "Hello, I would like to know if there will be an opportunity to apply for the position of parliamentary assistants of your party's deputies after the elections. Kindly send me details. Thank you."`,
                    ],
                },
                {
                    name: [
                        'Odpoveď potenciálnemu voličovi cez sociálnu sieť',
                        'Response to Potential Voters via Social Networks',
                    ],
                    desc: [
                        'Test ochoty strany komunikovať s voličom cez sociálnu sieť, zaslanie otázky potenciálneho voliča cez Messenger na FB profile strany s textom: (1. Kolo): „Mohli by ste mi prosím, ako Vášmu potenciálnemu voličovi, ozrejmiť, ako plánujete bojovať proti odvrátiteľným úmrtiam v slovenskom zdravotníctve? Vďaka za odpoveď“, (2. Kolo): „Dobrý deň, zaujímalo by ma, či podporíte po voľbách prípadné zrušenie alebo reorganizáciu Špecializovaného trestného súdu a Špeciálnej prokuratúry.“',
                        `The willingness of the party to communicate with voters through social media was tested by sending an inquiry of a potential voter via Messenger to the party's FB profile with the following text: (1st Round): "Could you please clarify to me, your potential voter, how you plan to fight preventable deaths in the Slovak healthcare system? Thanks for the answer", (2nd Round): "Hello, I would like to know if you support the possible abolition or reorganization of the Specialized Criminal Court and the Special Prosecutor's Office after the elections."`,
                    ],
                },
                {
                    name: [
                        'Kampaňový tím/spolupracujúce agentúry',
                        'Campaign Team/Collaborating Agencies',
                    ],
                    desc: [
                        'Strana proaktívne informuje o spôsobe realizácie kampane, kampaňovom tíme a spolupracujúcich agentúrach, najmä na vlastnej webovej stránke, prípadne tieto informácie poskytla na vyžiadanie',
                        `The party proactively disseminated information about its campaign implementation, the dedicated campaign team, and collaborating agencies. This information was displayed on the party's official website, or these details were made available upon request.`,
                    ],
                },
                {
                    name: ['Predvolebné akcie', 'Election Campaign Events'],
                    desc: [
                        'Strana v priebehu oficiálnej kampane poskytuje informácie o svojich predvolebných akciách, najmä na webovej stránke alebo sociálnej sieti',
                        `Throughout the official campaign period, the party consistently provided updates about its pre-election initiatives, featuring these updates on its official website and social media channels.`,
                    ],
                },
                {
                    name: ['Označovanie inzercie', 'Marking of Advertising'],
                    desc: [
                        'Strana v zmysle zákona označuje precízne politickú inzerciu na sociálnej sieti doplnením informácie o objednávateľovi a dodávateľovi reklamy',
                        'In full compliance with the law, the party meticulously marked all political advertising on social media platforms. This was achieved by including comprehensive information about the advertiser and the supplier.',
                    ],
                },
                {
                    name: [
                        'Majetkové priznanie lídra',
                        'Asset Declaration of the Leader',
                    ],
                    desc: [
                        'Predseda strany na vyžiadanie Transparency vyplnil rozšírené majetkové priznanie a súhlasil s jeho zverejnením',
                        `In response to Transparency's request, the party's chairman completed an extended asset declaration and consented to its public disclosure.`,
                    ],
                },
            ],
        },
        indicatorTitles: {
            [ati.account]: ['Transparentný účet', 'Transparent Account'],
            [ati.financing]: ['Financovanie kampane', 'Campaign Financing'],
            [ati.information]: [
                'Informovanosť o kampani',
                'Campaign Awareness',
            ],
        },
        meta: ['Údaje o kampani', 'Campaign details'],
        methodology: ['Metodika hodnotenia', 'Methodology'],
        navTitle: ['Hodnotenie', 'Assessment'],
        noAnalyses: [
            'Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne.',
            'Section is being prepared',
        ],
        noAssets: [
            'Nie sú dostupné majetkové priznania pre túto stranu.',
            'No asset declarations available for this party',
        ],
        noData: [
            'Nie je dostupné hodnotenie kampane pre túto stranu.',
            'Campaign assessment for this party is not available.',
        ],
        references: ['Referencie', 'References'],
        transparency: {
            [atc.good]: ['transparentná kampaň', 'Transparent campaign'],
            [atc.average]: ['kampaň s výhradami', 'Campaign with reservations'],
            [atc.bad]: ['netransparentná kampaň', 'Non-transparent campaign'],
            [atc.unknown]: [
                'nedostatok dát / nehodnotené',
                'Lack of data / not evaluated',
            ],
        },
        transparencyShort: {
            [atc.good]: ['transparentná', 'Transparent'],
            [atc.average]: ['s výhradami', 'With reservations'],
            [atc.bad]: ['netransparentná', 'Non-transparent'],
            [atc.unknown]: ['N/A'],
        },
    },
    charts: {
        disclaimer: [
            'Grafy obsahujú dáta z transparentných účtov, očistené o vrátené platby.',
            'Graphs contains data from transparent accounts net of return payments.',
        ],
        disclaimerClick: [
            'Po kliknutí na názov strany sa rozbalia podrobnosti.',
            'Click the party name for details.',
        ],
        incoming: ['Príjmy', 'Incomes'],
        outgoing: ['Výdavky', 'Expenses'],
        top10: [
            'Top 10 kampaní podľa výdavkov a príjmov',
            'Top 10 campaigns by incomes and spendings',
        ],
        uniqeDonors: ['Počet unikátnych darcov', 'Number of unique donors'],
        updated: ['Naposledy aktualizované', 'Last updated on'],
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
    disclaimerAccount: [
        'Príjmy aj výdavky sú očistené o vrátené platby.',
        'Income and expenses are net of return payments.',
    ],
    donate: {
        buttonShort: ['Darujte', 'Donate'],
        buttonLong: [
            'Darujte na kontrolu volieb',
            'Donate for elections monitoring',
        ],
        modalTitle: [
            'Nenechajme voľby bez kontroly!',
            "Don't let the elections without watch!",
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
        account: ['Transparentný účet', 'Transparent account'],
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
    nie: ['nie', 'no'],
    online: {
        navTitle: ['Online'],
    },
    parties: {
        assets: ['Majetkové priznania', 'Assets declarations'],
        candidatesLists: ['Kandidátne listiny', 'Candidates lists'],
        list: [
            'Abecedný zoznam všetkých subjektov s transparentným účtom.',
            'All political parties with transparent account sorted alphabetically.',
        ],
        navTitle: ['Strany', 'Parties'],
        noParty: [
            'Hľadanému výrazu nezodpovedá žiadna zo strán, ktoré kandidujú v parlamentných voľbách 2023.',
            'No party in 2023 elections matches the search query.',
        ],
        pageTitle: ['Strany a hnutia', 'Political Parties'],
        reports: ['Záverečné správy', 'Final reports'],
    },
    party: {
        extendedAssets: [
            'Rozšírene majetkové priznanie lídra',
            'Extended assets declaration of leader',
        ],
        candidatesList: ['Kandidátna listina', 'Candidates list'],
        funding: ['Financovanie', 'Financing'],
        info: ['Informácie o kampani', 'Campaign details'],
        overview: ['Prehľad', 'Overview'],
        report: ['Záverečná správa', 'Final report'],
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

export const t = (label, replacements) => {
    let tl = label;
    if (Array.isArray(label)) {
        tl = label[0] ?? '';
        if (getCurrentLanguage() === languages.en) {
            tl = label[1] ?? tl;
        }
    } else if (labels[label] ?? false) {
        return t(labels[label], replacements);
    }
    if (Array.isArray(replacements)) {
        // Use a regular expression to match placeholders (%s or %i)
        tl = tl.replace(/%[dfis]/g, (match) => {
            // Replace %s with the next string from the array
            // Return the placeholder if no replacement is available
            return replacements.length > 0 ? replacements.shift() : match;
        });
    }
    return tl;
};
