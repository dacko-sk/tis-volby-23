import Button from 'react-bootstrap/Button';

import { labels } from '../../api/constants';

function DonateButton({ className, long, xl }) {
    return (
        <Button
            className={`${className ? `${className} ` : ''}${
                xl ? 'btn-xl ' : ''
            }text-uppercase fw-bold`}
            href="https://transparency.sk/volby"
            target="_blank"
            variant="secondary"
        >
            {long ? labels.donateLong : labels.donate}
        </Button>
    );
}

export default DonateButton;
