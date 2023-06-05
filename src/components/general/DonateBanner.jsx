import { settings } from '../../api/constants';

import banner from '../../../public/img/banner.png';

function DonateBanner() {
    return (
        <div className="bg-banner">
            <div className="container">
                <div className="text-center py-4">
                    <a
                        href={settings.donateUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img
                            alt="Nenechajme voľby bez kontroly!"
                            className="mw-100"
                            src={banner}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default DonateBanner;
