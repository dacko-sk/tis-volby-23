import { labels, t } from './dictionary';

export const setTitle = (title) => {
    document.title = `${t(title)} : ${t(labels.home.pageTitle)} : ${t(
        labels.tis
    )}`;
};

export const scrollToTop = () => window.scrollTo(0, 0);

export const openInNewTab = (url) => window.open(url, '_blank').focus();
