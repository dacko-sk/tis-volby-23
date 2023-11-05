import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import { labels, t } from '../../api/dictionary';

import DonateButton from './DonateButton';
import { nl2r } from '../../api/helpers';

function DonateModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const documentMouseOut = (event) => {
        if (
            window.donateReady &&
            event.clientY < 50 &&
            event.relatedTarget == null &&
            event.target.nodeName.toLowerCase() !== 'select'
        ) {
            // show the modal!
            setShow(true);
            // stop watching for exit intent - popup will be shown just once
            document.removeEventListener('mouseout', documentMouseOut);
        }
    };

    // on first app load
    useEffect(() => {
        // watch for exit intent
        document.addEventListener('mouseout', documentMouseOut);
        // wait for 10 seconds before allowing to show the popup
        window.donateReady = false;
        let timer = null;
        timer = setTimeout(() => {
            window.donateReady = true;
        }, 10 * 1000);
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    return (
        <Modal
            backdrop="static"
            centered
            keyboard={false}
            onHide={handleClose}
            show={show}
        >
            <Modal.Header closeButton>
                <Modal.Title>{t(labels.donate.modalTitle)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{nl2r(t(labels.donate.modalText))}</Modal.Body>
            <Modal.Footer className="justify-content-center">
                <DonateButton xl />
            </Modal.Footer>
        </Modal>
    );
}

export default DonateModal;
