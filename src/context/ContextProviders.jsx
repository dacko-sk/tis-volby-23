import { AdsDataProvider } from './AdsDataContext';
import { CookiesProvider } from './CookiesContext';
import { DataProvider } from './DataContext';

function ContextProviders({ children }) {
    return (
        <DataProvider>
            <AdsDataProvider>
                <CookiesProvider>{children}</CookiesProvider>
            </AdsDataProvider>
        </DataProvider>
    );
}

export default ContextProviders;
