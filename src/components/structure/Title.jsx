function Title({ children, secondary, multiline, uppercase }) {
    let primaryLength = 0;
    if (typeof children === 'string') {
        primaryLength += children.length;
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
                {children}
                {!!secondary && (
                    <span className="orange">
                        {multiline ? <br /> : ' '}
                        {secondary}
                    </span>
                )}
            </h1>
        </header>
    );
}

export default Title;
