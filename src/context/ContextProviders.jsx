import { CookiesProvider } from './CookiesContext';

function ContextProviders({ children }) {
    return <CookiesProvider>{children}</CookiesProvider>;
}

export default ContextProviders;
