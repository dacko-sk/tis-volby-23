import { nl2r, secondarySentenceEnding as se } from '../../api/helpers';

function Title({
    children,
    secondary = '',
    secondaryWords = 0,
    uppercase = false,
}) {
    let primaryLength = 0;
    let primary = children;
    if (typeof children === 'string') {
        primaryLength += children.length;
        primary = nl2r(children);
    } else if (typeof children === 'object') {
        Object.keys(children).forEach((key) => {
            if (typeof children[key] === 'string') {
                primaryLength += children[key].length;
            }
        });
    }
    return (
        <header
            className={`${
                primaryLength + (secondary || '').length < 65 ? 'hero ' : ''
            }mb-4`}
        >
            <h1 className={uppercase ? 'text-uppercase' : ''}>
                {secondaryWords ? se(primary, secondaryWords) : primary}
                {!!secondary && (
                    <span className="text-secondary"> {secondary}</span>
                )}
            </h1>
        </header>
    );
}

export default Title;
