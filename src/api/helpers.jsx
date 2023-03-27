import parse, { attributesToProps, domToReact } from 'html-react-parser';

import { labels } from './constants';

export const slovakFormat = (value, options) =>
    new Intl.NumberFormat('sk-SK', options).format(value);

export const numFormat = (value) => slovakFormat(value, {});

export const pctFormat = (value) => {
    const num = Number(value);
    if (!Number.isNaN(num)) {
        return `${numFormat(num)} %`;
    }
    return '';
};

export const wholeNumFormat = (value) =>
    slovakFormat(value, {
        maximumFractionDigits: 0,
    });

export const currencyFormat = (value) =>
    slovakFormat(value, {
        style: 'currency',
        currency: 'EUR',
    });

export const wholeCurrencyFormat = (value) =>
    slovakFormat(value, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    });

export const slovakDateFormat = (timestamp, options) =>
    new Intl.DateTimeFormat('sk-SK', options).format(
        new Date(typeof timestamp === 'number' ? 1000 * timestamp : timestamp)
    );

export const dateTimeFormat = (timestamp) =>
    slovakDateFormat(timestamp, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });

export const dateFormat = (timestamp) =>
    slovakDateFormat(timestamp, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

export const shortenValue = (value, length, removals) => {
    if (value) {
        let shorten = value;
        if (Array.isArray(removals)) {
            removals.forEach((removal) => {
                shorten = shorten.replace(removal, '');
            });
        }
        if (typeof shorten === 'string' && shorten.length > length) {
            return `${shorten.substring(0, length)}…`;
        }
        return shorten;
    }
    return '';
};

export const shortenUrl = (value) =>
    shortenValue(value, 32, ['https://', 'www.']);

export const fixUrl = (url) =>
    url.startsWith('http') ? url : `https://${url}`;

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

export const ecodeHTMLEntities = (rawStr) =>
    rawStr
        ? rawStr.replace(
              /&#(\d+);/g,
              (match, dec) => `${String.fromCharCode(dec)}`
          )
        : '';

export const sortByNumericProp = (prop, asc) => (a, b) =>
    asc ? a[prop] - b[prop] : b[prop] - a[prop];

export const sortBySpending = sortByNumericProp('outgoing', false);

export const removeAccentsFromString = (str) =>
    str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';

export const compareStr = (a, b) =>
    a &&
    b &&
    removeAccentsFromString(a.toLowerCase().trim()) ===
        removeAccentsFromString(b.toLowerCase().trim());

export const contains = (haystack, needle) =>
    haystack &&
    needle &&
    removeAccentsFromString(haystack.toLowerCase()).includes(
        removeAccentsFromString(needle.toLowerCase().trim())
    );

export const swapName = (name) => {
    const [first, second] = name.split(' ');
    return first && second ? `${second} ${first}` : name;
};

export const setTitle = (title) => {
    document.title = `${title} : ${labels.websiteTitle} : ${labels.tis}`;
};

export const scrollToTop = () => window.scrollTo(0, 0);

export const openInNewTab = (url) => window.open(url, '_blank').focus();
