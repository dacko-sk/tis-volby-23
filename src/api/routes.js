import has from 'has';
import siteConfig from '../../package.json';
import { parties } from './constants';

export const separators = {
    newline: '\n',
    parts: '.',
    space: '~',
    url: '/',
};

export const segments = {
    ROOT:
        has(siteConfig, 'homepage') && siteConfig.homepage
            ? siteConfig.homepage
            : '/',
    NEWS: 'aktuality',
    ONLINE: 'online',
    PARTIES: 'strany',
    SEARCH: 'vyhladavanie',
    TRANSACTIONS: 'financovanie',
};

export const routes = {
    article: (page, slug) =>
        segments.ROOT + (page && slug ? page + separators.url + slug : ''),
    articles: (page) => segments.ROOT + (page || ''),
    home: segments.ROOT,
    news: segments.ROOT + segments.NEWS,
    online: segments.ROOT + segments.ONLINE,
    parties: segments.ROOT + segments.PARTIES,
    party: (slug, subpage) => {
        const niceSlug =
            has(parties, slug) && has(parties[slug], 'slug')
                ? parties[slug].slug
                : slug;
        return (
            segments.ROOT +
            (slug
                ? segments.PARTIES +
                  separators.url +
                  encodeURIComponent(niceSlug.replaceAll(' ', separators.space))
                : '') +
            (subpage ? separators.url + subpage : '')
        );
    },
    search: (query) =>
        segments.ROOT + (query ? segments.SEARCH + separators.url + query : ''),
};

export const decodeSlug = (slug) => slug.replaceAll(separators.space, ' ');
