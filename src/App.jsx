import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
    homepage,
    languageRoot,
    languages,
    routes,
    segments,
    urlSegment,
} from './api/routes';

import ContextProviders from './context/ContextProviders';

import Analyses from './pages/Analyses';
import Article from './pages/Article';
import Home from './pages/Home';
import Online from './pages/Online';
import News from './pages/News';
import Parties from './pages/Parties';
import Party from './pages/Party';
import PartyAnalysis from './pages/party/PartyAnalysis';
import PartyAssets from './pages/party/PartyAssets';
import PartyNews from './pages/party/PartyNews';
import PartyOnline from './pages/party/PartyOnline';
import PartyOverview from './pages/party/PartyOverview';
import PartyTransactions from './pages/party/PartyTransactions';
import Search from './pages/Search';

import Layout from './components/structure/Layout';

import './scss/volby-23.scss';

const queryClient = new QueryClient();

function App() {
    return (
        <ContextProviders>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path={homepage} element={<Layout />}>
                            <Route index element={<Home />} />

                            {Object.keys(languages).map((lang) =>
                                [
                                    [routes.home(lang), Home],
                                    [routes.analyses(lang), Analyses],
                                    [routes.article(true, lang), Article],
                                    [routes.news(lang), News],
                                    [routes.online(lang), Online],
                                    [routes.parties(lang), Parties],
                                    [
                                        routes.party(true, '', lang),
                                        Party,
                                        [
                                            ['', PartyOverview],
                                            [segments.ANALYSIS, PartyAnalysis],
                                            [segments.ASSETS, PartyAssets],
                                            [segments.ONLINE, PartyOnline],
                                            [segments.NEWS, PartyNews],
                                            [
                                                segments.TRANSACTIONS,
                                                PartyTransactions,
                                            ],
                                        ],
                                    ],
                                    [routes.search(true, lang), Search],
                                ].map(([path, Page, subpages]) => (
                                    <Route
                                        key={path}
                                        path={path}
                                        element={<Page />}
                                    >
                                        {(subpages ?? []).map(
                                            ([subSegment, SubPage]) => (
                                                <Route
                                                    key={path + subSegment}
                                                    index={
                                                        subSegment ? null : true
                                                    }
                                                    path={
                                                        subSegment
                                                            ? urlSegment(
                                                                  subSegment,
                                                                  lang
                                                              )
                                                            : null
                                                    }
                                                    element={<SubPage />}
                                                />
                                            )
                                        )}
                                    </Route>
                                ))
                            )}

                            {/* fallback */}
                            <Route
                                path="*"
                                element={<Navigate to={languageRoot()} />}
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ContextProviders>
    );
}

export default App;
