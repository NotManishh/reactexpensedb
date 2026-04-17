import React, { useState, useEffect } from "react";
import "./App.css";
import Balance from "./components/Balance";
import Summary from "./components/Summary";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

function App() {
  const [transactions, setTransactions] = useState([]);

  // Fetch data from MongoDB when the app loads
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/expenses');
        const data = await response.json();
        
        if (data.success) {
          // Format the database records to match your React state
          const loadedTransactions = data.data.map(exp => ({
            id: exp._id,           // MongoDB uses _id instead of id
            description: exp.text, 
            amount: exp.amount,
            type: exp.amount < 0 ? "expense" : "income"
          }));
          
          setTransactions(loadedTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []); // Empty array ensures this only runs once
  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <div className="app">
      <div className="container">
        <h1>Expense Tracker</h1>
        <Balance balance={balance} />
        <Summary income={income} expense={expense} />
        <TransactionForm addTransaction={addTransaction} />
        <TransactionList
          transactions={transactions}
          deleteTransaction={deleteTransaction}
        />
      </div>
    </div>
  );
}

export default App;
