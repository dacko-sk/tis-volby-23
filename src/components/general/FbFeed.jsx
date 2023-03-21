import { memo, useEffect } from 'react';
import { SocialIcon } from 'react-social-icons';
import has from 'has';

import { colorDarkBlue } from '../../api/constants';

import useCookies from '../../context/CookiesContext';

const FbFeed = memo(({ appId, name, url }) => {
    const { cookies } = useCookies();
    const consent = cookies && has(cookies, 'functional') && cookies.functional;

    useEffect(() => {
        const script = document.createElement('script');

        script.src = `https://connect.facebook.net/sk_SK/sdk.js#xfbml=1&version=v14.0&appId=${appId}&autoLogAppEvents=1`;
        script.id = 'fbscript';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';

        if (consent) {
            document.body.appendChild(script);
        }

        return () => {
            if (document.getElementById('fbscript')) {
                document.body.removeChild(script);
            }
        };
    }, [consent]);

    return (
        <div className="fb-feed">
            <div id="fb-root" />
            <div
                className="fb-page"
                data-href={url}
                data-tabs="timeline"
                data-width=""
                data-height="400"
                data-small-header="true"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
            >
                <blockquote cite={url} className="fb-xfbml-parse-ignore">
                    <div className="text-center">
                        <SocialIcon
                            bgColor={colorDarkBlue}
                            className="me-2"
                            url={url}
                        />
                        <a href={url} className="d-block my-3">
                            {name}
                        </a>
                        <p className="fst-italic">
                            Pre zobrazenie facebook vlákna je potrebné prijať
                            ukladanie Funkčných cookies v Nastaveniach cookies
                        </p>
                    </div>
                </blockquote>
            </div>
        </div>
    );
});

export default FbFeed;
