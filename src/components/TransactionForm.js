import React, { useState } from "react";

function TransactionForm({ addTransaction }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desc || !amount || amount <= 0) {
      alert("Please enter valid details!");
      return;
    }

    // 1. Format the data to match your MongoDB Schema
    const newExpense = {
      text: desc, 
      // If it's an expense, make it negative so the math works later
      amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount) 
    };

    try {
      // 2. Save to MongoDB
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });

      const data = await response.json();

      if (data.success) {
        // 3. Update the UI using your existing prop, but use the real MongoDB ID
        addTransaction({
          id: data.data._id, 
          description: desc,
          amount: Number(amount),
          type: type,
        });

        // 4. Clear the form
        setDesc("");
        setAmount("");
        setType("income");
      } else {
        alert("Validation Error: " + data.error);
      }
    } catch (error) {
      console.error("Server connection error:", error);
      alert("Could not connect to the database.");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        min="1"
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <button>Add Transaction</button>
    </form>
  );
}

export default TransactionForm;
