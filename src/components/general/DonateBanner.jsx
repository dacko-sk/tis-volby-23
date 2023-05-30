import { settings } from '../../api/constants';

import banner from '../../../public/img/banner_crop.png';

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
                            src={banner}
                            alt="Nenechajme voľby bez kontroly!"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default DonateBanner;
