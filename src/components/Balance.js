import React from "react";

function Balance({ balance }) {
  return (
    <div className="balance-card">
      <h2>Current Balance</h2>
      <p>₹ {balance}</p>
    </div>
  );
}

export default Balance;
