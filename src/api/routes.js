import has from 'has';
import siteConfig from '../../package.json';

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
    PARTY: 'strana',
    SEARCH: 'vyhladavanie',
};

export const routes = {
    article: (page, slug) =>
        segments.ROOT + (page && slug ? page + separators.url + slug : ''),
    articles: (page) => segments.ROOT + (page || ''),
    home: segments.ROOT,
    news: segments.ROOT + segments.NEWS,
    party: (slug) =>
        segments.ROOT +
        (slug
            ? segments.PARTY +
              separators.url +
              encodeURIComponent(slug.replaceAll(' ', separators.space))
            : ''),
    search: (query) =>
        segments.ROOT + (query ? segments.SEARCH + separators.url + query : ''),
};
