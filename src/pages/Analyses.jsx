import { Link } from 'react-router-dom';

import { setTitle } from '../api/helpers';

import Title from '../components/structure/Title';
import Posts, { templates } from '../components/wp/Posts';
import { analysisLabels, methodologyPage, wpCat } from '../api/wpHelpers';

export const title = 'Hodnotenie transparentnosti kampaní';

function Analyses() {
    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>

            <Posts
                categories={[wpCat.featured]}
                noResults={analysisLabels.noAnalyses}
                template={templates.featured}
            />

            <p className="mt-4">
                Koncom septembra 2023 si slovenskí voliči v predčasných voľbách
                vyberú nové zloženie parlamentu, z ktorého vzíde aj nová vláda.
                Vo volebných miestnostiach sa budeme rozhodovať medzi
                kandidátnymi listinami 24 strán a jednej volebnej trojkoalície.
            </p>
            <p>
                Napriek tomu, že sú to práve politici, ktorí nastavujú limity a
                pravidlá, v predvolebnom zápase majú mnohí z nich stále problémy
                s ich dodržiavaním. Ľahostajný prístup k transparentnosti
                kampane a jej financovania môže mnohé napovedať aj o prístupe
                politikov k zverenej moci po voľbách. Uvedomujú si to aj voliči.
                Podľa reprezentatívneho prieskumu agentúry IPSOS pre
                Transparency by bol netransparentný alebo nehodnoverný spôsob
                financovania kampane závažnou prekážkou pre voľbu takejto strany
                až pre 46% respondentov.
            </p>
            <p>
                V Transparency preto dlhodobo férovosť a transparentnosť kampaní
                monitorujeme a politikov nabádame k zvyšovaniu štandardov. Po
                prezidentských voľbách 2019, parlamentných voľbách 2020 a
                samosprávnych voľbách 2022 sme sa aj tentokrát bližšie pozreli
                na spôsob vedenia kampaní politickými stranami a zostavili
                hodnotenie ich transparentnosti.
            </p>
            <p>
                Zamerali sme sa predovšetkým na informácie z transparentných
                účtov, webov a sociálnych sietí strán, kládli sme im však aj
                podrobnejšie otázky o predkampani, darcoch či veriteľoch a
                testovali ochotu volebných lídrov vyplniť rozšírené majetkové
                priznanie.
            </p>
            <p>
                Z 27 kandidujúcich subjektov sme hodnotenie spracovali pre 15 z
                nich, ktoré mali päť týždňov pred volebným dňom a teda ku
                22.8.2023 na transparentnom účte výdavky za aspoň 50-tisíc eur a
                aspoň 10 väčších výdavkových transakcií. Hodnotenie plánujeme
                tesne pred voľbami zopakovať.
            </p>
            <p>
                Pre lepšiu prehľadnosť sme zvolili princíp semafora - pri každej
                z hodnotených strán tak svieti jedno z hodnotení:
            </p>
            <ul className="arrows lh-lg">
                <li>
                    <span className="badge score-good">
                        Transparentná kampaň (zelená farba)
                    </span>
                </li>
                <li>
                    <span className="badge score-average">
                        Kampaň s výhradami (oranžová farba)
                    </span>
                </li>
                <li>
                    <span className="badge score-bad">
                        Netransparentná kampaň (červená farba)
                    </span>
                </li>
                <li>
                    <span className="badge score-unknown">
                        Nedostatok dát / nehodnotené (šedá farba)
                    </span>
                </li>
            </ul>
            <p className="mb-4">
                Podrobnejšie výsledky nájdete v sekcii nižšie a v{' '}
                <Link to={methodologyPage}>Metodike hodnotenia</Link>.
            </p>

            <Posts
                categories={[wpCat.analyses]}
                noResults={analysisLabels.noAnalyses}
            />
        </section>
    );
}

export default Analyses;
