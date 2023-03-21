import Pagination from 'react-bootstrap/Pagination';

import './PaginationWithGaps.scss';

function PaginationWithGaps({
    activePage = 1,
    className = 'justify-content-center',
    pageClickCallback,
    totalPages,
}) {
    const items = [];
    for (let i = 1; i <= totalPages; i += 1) {
        if (
            totalPages <= 10 ||
            i <= 2 ||
            i >= totalPages - 1 ||
            (i >= activePage - 1 && i <= activePage + 1)
        ) {
            if (
                totalPages > 10 &&
                i === totalPages - 1 &&
                activePage <= totalPages - 4
            ) {
                items.push(
                    <li className="pagination-gap" key="gap-before">
                        …
                    </li>
                );
            }

            items.push(
                <Pagination.Item
                    active={i === activePage}
                    key={i}
                    onClick={pageClickCallback(i)}
                >
                    {i}
                </Pagination.Item>
            );

            if (totalPages > 10 && i === 2 && activePage >= 5) {
                items.push(
                    <li className="pagination-gap" key="gap-after">
                        …
                    </li>
                );
            }
        }
    }
    if (items.length > 1) {
        return <Pagination className={className}>{items}</Pagination>;
    }
    return null;
}

export default PaginationWithGaps;
