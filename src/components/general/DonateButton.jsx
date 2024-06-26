import Button from 'react-bootstrap/Button';

import { links } from '../../api/constants';
import { labels, t } from '../../api/dictionary';

function DonateButton({ className, long, xl }) {
    return (
        <Button
            className={`${className ? `${className} ` : ''}${
                xl ? 'btn-xl ' : ''
            }text-uppercase fw-bold`}
            href={links.donateUrl}
            target="_blank"
            variant="secondary"
        >
            {t(long ? labels.donate.buttonLong : labels.donate.buttonShort)}
        </Button>
    );
}

export default DonateButton;
