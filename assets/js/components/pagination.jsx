import React from 'react';

const Pagination = ({currentPage, itemsPerPage, length, onPageChange}) => {

    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];

    for(let i = 1; i <= pagesCount; i++) {
        pages.push(i)
    }

    return ( 
        <div className="d-flex justify-content-center mt-3">
            <ul className="pagination pagination-m">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                        &laquo;
                    </button>
                </li>
                {pages.map(page => (
                    <li key={page} className={"page-item" + (currentPage === page && " active")}>
                        <button className="page-link" onClick={() => onPageChange(page)}>
                            {page}
                        </button>
                    </li>
                ))}
                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                        &raquo;
                    </button>
                </li>
            </ul>
        </div>
    );
}

Pagination.getData = (items, itemsPerPage, currentPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage)
}
 
export default Pagination;