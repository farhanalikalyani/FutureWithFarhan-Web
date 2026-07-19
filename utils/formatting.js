export function timeAgo(timestamp) {
  if (!timestamp?.seconds) return "Just now";
  const diff = Date.now() - timestamp.seconds * 1000;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp.seconds * 1000).toLocaleDateString();
}

export function formatPKR(amount) {
  if (!amount) return "PKR 0";
  return `PKR ${parseInt(amount).toLocaleString("en-PK")}`;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric"
  });
}

export function getDaysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function truncate(str, length = 100) {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
