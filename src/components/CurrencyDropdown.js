import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './CurrencyDropdown.css';
const CurrencyDropdown = () => {
    const { currency, dispatch } = useContext(AppContext);

    const handleCurrencyChange = (e) => {
        dispatch({
            type: 'CHG_CURRENCY',
            payload: e.target.value,
        });
    };

    return (
        <div className='currency-dropdown alert alert-success'>
            <label htmlFor='currency'>Currency: </label>
            <select
                id='currency'
                value={currency}
                onChange={handleCurrencyChange}
                className='custom-dropdown'
            >
                <option value='$'>$ Dollar</option>
                <option value='£'>£ Pound</option>
                <option value='€'>€ Euro</option>
                <option value='₹'>₹ Rupee</option>
            </select>
        </div>
    );
};

export default CurrencyDropdown;
