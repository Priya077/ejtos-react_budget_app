import React, { createContext, useReducer } from 'react';

// Utility function for currency conversion
const convertCurrency = (amount, fromCurrency, toCurrency, conversionRates) => {
    const rate = conversionRates[fromCurrency][toCurrency];
    return parseFloat((amount * rate).toFixed(2));
};

// Conversion rates (for simplicity, we assume these rates)
const conversionRates = {
    '£': { '$': 1.39, '€': 1.16, '₹': 101.63, '£': 1 },
    '$': { '£': 0.72, '€': 0.84, '₹': 73.08, '$': 1 },
    '€': { '£': 0.86, '$': 1.19, '₹': 86.67, '€': 1 },
    '₹': { '£': 0.0098, '$': 0.014, '€': 0.012, '₹': 1 },
};

// 5. The reducer - this is used to update the state, based on the action
export const AppReducer = (state, action) => {
    let budget = 0;
    switch (action.type) {
        case 'ADD_EXPENSE':
            let total_budget = 0;
            total_budget = state.expenses.reduce(
                (previousExp, currentExp) => previousExp + currentExp.cost,
                0
            );
            total_budget += action.payload.cost;
            action.type = "DONE";
            if (total_budget <= state.budget) {
                total_budget = 0;
                state.expenses.map((currentExp) => {
                    if (currentExp.name === action.payload.name) {
                        currentExp.cost += action.payload.cost;
                    }
                    return currentExp;
                });
                return { ...state };
            } else {
                alert("Cannot increase the allocation! Out of funds");
                return { ...state };
            }
        case 'DEC_EXPENSE':
            let total_budget_dec = 0;
            total_budget_dec = state.expenses.reduce(
                (previousExp, currentExp) => previousExp + currentExp.cost,
                0
            );
            total_budget_dec -= action.payload.cost;
            action.type = "DONE";
            if (total_budget_dec >= 0) {
                total_budget_dec = 0;
                state.expenses.map((currentExp) => {
                    if (currentExp.name === action.payload.name && currentExp.cost - action.payload.cost >= 0) {
                        currentExp.cost -= action.payload.cost;
                    }
                    return currentExp;
                });
                return { ...state };
            } else {
                alert("Cannot decrease the allocation below 0!");
                return { ...state };
            }
        case 'RED_EXPENSE':
            const red_expenses = state.expenses.map((currentExp) => {
                if (currentExp.name === action.payload.name && currentExp.cost - action.payload.cost >= 0) {
                    currentExp.cost -= action.payload.cost;
                    budget = state.budget + action.payload.cost;
                }
                return currentExp;
            });
            action.type = "DONE";
            return {
                ...state,
                expenses: [...red_expenses],
            };
        case 'DELETE_EXPENSE':
            state.expenses.map((currentExp) => {
                if (currentExp.name === action.payload) {
                    budget = state.budget + currentExp.cost;
                    currentExp.cost = 0;
                }
                return currentExp;
            });
            action.type = "DONE";
            return { ...state, budget };
        case 'SET_BUDGET':
            const totalExpenses = state.expenses.reduce((total, item) => total + item.cost, 0);
            if (action.payload < totalExpenses) {
                alert("The budget cannot be less than total expenses.");
                return { ...state, budget: totalExpenses };
            } else {
                return { ...state, budget: action.payload };
            }
        case 'CHG_CURRENCY':
            const updatedExpenses = state.expenses.map((expense) => ({
                ...expense,
                cost: convertCurrency(expense.cost, state.currency, action.payload, conversionRates),
            }));
            return {
                ...state,
                currency: action.payload,
                expenses: updatedExpenses,
            };
        default:
            return state;
    }
};

// 1. Sets the initial state when the app loads
const initialState = {
    budget: 2000,
    expenses: [
        { id: "Marketing", name: 'Marketing', cost: 50 },
        { id: "Finance", name: 'Finance', cost: 300 },
        { id: "Sales", name: 'Sales', cost: 70 },
        { id: "Human Resource", name: 'Human Resource', cost: 40 },
        { id: "IT", name: 'IT', cost: 500 },
    ],
    currency: '£'
};

// 2. Creates the context this is the thing our components import and use to get the state
export const AppContext = createContext();

// 3. Provider component - wraps the components we want to give access to the state
// Accepts the children, which are the nested(wrapped) components
export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    let remaining = 0;

    if (state.expenses) {
        const totalExpenses = state.expenses.reduce((total, item) => total + item.cost, 0);
        remaining = state.budget - totalExpenses;
    }

    return (
        <AppContext.Provider
            value={{
                expenses: state.expenses,
                budget: state.budget,
                remaining: remaining,
                dispatch,
                currency: state.currency
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
