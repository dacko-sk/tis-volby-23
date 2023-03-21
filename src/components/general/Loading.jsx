import has from 'has';

import { errors } from '../../api/constants';

import './Loading.scss';

function Loading({ small, error }) {
    const animation = small ? (
        <div className="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
        </div>
    ) : (
        <div className="lds-grid">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    );
    let message = null;
    if (!!error && has(error, 'message')) {
        console.log(error.message);
        message = errors.loading;
    }
    return (
        <div
            className={`row justify-content-center loading ${
                small ? 'small' : 'big'
            }`}
        >
            <div className="col-auto align-self-center">
                {message || animation}
            </div>
        </div>
    );
}

export default Loading;
