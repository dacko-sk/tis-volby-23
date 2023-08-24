import { labels } from './constants';

export const isNumeric = (value) => !Number.isNaN(Number(value));

export const fixNumber = (value) =>
    Number(value.replace(',', '.').replace(' ', ''));

export const slovakFormat = (value, options) =>
    new Intl.NumberFormat('sk-SK', options).format(value);

export const numFormat = (value) => slovakFormat(value, {});

export const pctFormat = (value, options) => {
    const num = Number(value);
    if (!Number.isNaN(num)) {
        return `${slovakFormat(num, options ?? {})} %`;
    }
    return '';
};

export const badgePctFormat = (value) =>
    Number(value) > -1 ? pctFormat(value) : 'N/A';

export const humanPctFormat = (value) =>
    pctFormat(100 * value, { maximumFractionDigits: 2 });

export const humanPctSignFormat = (value) =>
    pctFormat(100 * value, {
        maximumFractionDigits: 2,
        signDisplay: 'exceptZero',
    });

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

export const slovakDateFormat = (timestamp, options) => {
    const num = Number(timestamp);
    const input = Number.isNaN(num) ? timestamp : 1000 * num;
    return new Intl.DateTimeFormat('sk-SK', options).format(new Date(input));
};

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

export const getTimestampFromDate = (date) => {
    const dateParts = date.replaceAll('/', '.').replaceAll(' ', '').split('.');
    return dateParts.length === 3
        ? new Date(
              `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} 23:59:59`
          ).getTime() / 1000
        : 0;
};

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

export const sortByTextProp = (prop) => (a, b) =>
    a[prop].localeCompare(b[prop]);

export const sortByName = sortByTextProp('name');

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
