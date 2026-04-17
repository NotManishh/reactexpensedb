import React from "react";

function TransactionList({ transactions, deleteTransaction }) {
  return (
    <div className="list">
      <h3>Transactions</h3>

      {transactions.length === 0 && (
        <p className="empty">No transactions yet</p>
      )}

      {transactions.map((t) => (
        <div key={t.id} className={`transaction ${t.type}`}>
          <div>
            <h4>{t.description}</h4>
            <span>₹ {t.amount}</span>
          </div>

          <button onClick={() => deleteTransaction(t.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
