import { useOutletContext } from 'react-router-dom';

import { setTitle } from '../../api/helpers';

import AccountTransactions from '../../components/accounts/AccountTransactions';

function PartyTransactions() {
    const { party, partyAccount } = useOutletContext();

    setTitle(`${party.name} : Financovanie`);

    return (
        <div className="subpage">
            <AccountTransactions account={partyAccount} />
        </div>
    );
}

export default PartyTransactions;
