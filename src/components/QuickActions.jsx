const actions = [
  {
    label: "Election Process",
    note: "See the full flow from announcement to counting"
  },
  {
    label: "Voting Steps",
    note: "Understand what to do at your polling booth"
  },
  {
    label: "Eligibility",
    note: "Check the basic rules for who can vote"
  },
  {
    label: "Election Timeline",
    note: "Review the key phases and dates"
  }
];

function QuickActions({ onPick, disabled }) {
  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="quick-action-button"
          onClick={() => onPick(action.label)}
          disabled={disabled}
        >
          <span>{action.label}</span>
          <small>{action.note}</small>
        </button>
      ))}
    </div>
  );
}

export default QuickActions;
