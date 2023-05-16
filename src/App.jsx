import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { segments } from './api/routes';

import ContextProviders from './context/ContextProviders';

import Article from './pages/Article';
import Home from './pages/Home';
import Online from './pages/Online';
import News from './pages/News';
import Parties from './pages/Parties';
import Party from './pages/Party';
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
                        <Route path={segments.ROOT} element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path={segments.NEWS} element={<News />} />
                            <Route
                                path={`${segments.NEWS}/:slug`}
                                element={<Article />}
                            />
                            <Route
                                path={`${segments.ONLINE}`}
                                element={<Online />}
                            />
                            <Route
                                path={segments.PARTIES}
                                element={<Parties />}
                            />
                            <Route
                                path={`${segments.PARTIES}/:slug`}
                                element={<Party />}
                            >
                                <Route index element={<PartyOverview />} />
                                <Route
                                    path={segments.TRANSACTIONS}
                                    element={<PartyTransactions />}
                                />
                                <Route
                                    path={segments.ONLINE}
                                    element={<PartyOnline />}
                                />
                                <Route
                                    path={segments.NEWS}
                                    element={<PartyNews />}
                                />
                            </Route>
                            <Route
                                path={`${segments.SEARCH}/:query`}
                                element={<Search />}
                            />

                            {/* fallback */}
                            <Route
                                path="*"
                                element={<Navigate to={segments.ROOT} />}
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ContextProviders>
    );
}

export default App;
