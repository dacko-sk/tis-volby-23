import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { usePapaParse } from 'react-papaparse';

import { labels } from '../../api/constants';
import { currencyFormat, dateFormat } from '../../api/helpers';

import { getFileName } from '../../context/DataContext';

import Loading from '../general/Loading';
import PaginationWithGaps from '../general/PaginationWithGaps';

const indexColumn = 'index';
const allowedColumns = Object.keys(labels.account);

const formatColumn = (column, value) => {
    switch (column) {
        case 'amount':
            return currencyFormat(value);
        case 'date':
            return dateFormat(value);
        default:
            return value;
    }
};

function AccountTransactions({ pageSize = 25, party }) {
    const file = getFileName(party);
    const [transactions, setTransactions] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const { readRemoteFile } = usePapaParse();

    if (!file) {
        return null;
    }

    // load data on first load
    useEffect(() => {
        const parserConfig = {
            worker: true, // must be false for local files
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (data) => {
                setTransactions(data);
            },
        };
        readRemoteFile(file, parserConfig);
    }, []);

    const loadPage = (page) => () => {
        setActivePage(page);
        document.getElementById('acctount-table').scrollIntoView(true);
    };

    if (!transactions) {
        return <Loading />;
    }

    const totalPages = Math.ceil(transactions.data.length / pageSize);

    const headers = [];
    allowedColumns.forEach((column) => {
        headers.push(<th key={column}>{labels.account[column]}</th>);
    });
    const rows = [];
    for (
        let i = (activePage - 1) * pageSize;
        i < activePage * pageSize;
        i += 1
    ) {
        const tx = transactions.data[i];
        if (tx) {
            const cols = [];
            allowedColumns.forEach((column) => {
                cols.push(
                    <td key={column}>{formatColumn(column, tx[column])}</td>
                );
            });
            rows.push(<tr key={tx[indexColumn]}>{cols}</tr>);
        } else {
            break;
        }
    }

    return (
        <div className="account-transactions">
            <h2 className="mt-4 mb-3">
                Prehľad transakcií na transparentnom účte
            </h2>
            <Table striped bordered responsive hover id="acctount-table">
                <thead>
                    <tr>{headers}</tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>

            <PaginationWithGaps
                activePage={activePage}
                className="justify-content-center mt-4"
                pageClickCallback={loadPage}
                totalPages={totalPages}
            />

            <div className="text-center">
                <Button
                    className="mt-3"
                    href={file}
                    target="_blank"
                    variant="secondary"
                >
                    Stiahnuť ako CSV
                </Button>
            </div>
        </div>
    );
}

export default AccountTransactions;
