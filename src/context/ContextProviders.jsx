import { CookiesProvider } from './CookiesContext';
import { DataProvider } from './DataContext';

function ContextProviders({ children }) {
    return (
        <DataProvider>
            <CookiesProvider>{children}</CookiesProvider>
        </DataProvider>
    );
}

export default ContextProviders;
