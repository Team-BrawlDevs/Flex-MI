import bankData from "../data/demoBankAccount.json";

export default function LinkedAccount() {
  let balance = bankData.closing_balance;

  const rows = bankData.transactions
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((txn, i) => {
      balance += txn.amount;

      return (
        <tr key={i}>
          <td>
            {new Date(txn.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </td>
          <td style={{ color: txn.amount > 0 ? "green" : "red" }}>
            {txn.amount}
          </td>
          <td>
            {txn.amount > 0
              ? "Credit"
              : "Debit"}
          </td>
          <td>{balance}</td>
        </tr>
      );
    });

  return (
    <div style={{ padding: 30 }}>
      <h2>Linked Bank Account</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Time</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Balance After</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
