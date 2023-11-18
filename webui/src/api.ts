import settings from "../settings";

export function createNewGame() {
  return fetch(`${settings.apiBaseUrl}/game`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}
