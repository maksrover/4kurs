const host = "https://wedev-api.sky.pro/api/v2/leaderboard";

export function getLeaders() {
  return fetch(host).then(response => {
    if (!response.ok) {
      console.log("Что-то пошло не так");
    } else {
      return response.json();
    }
  });
}

export function addLeader({ username, time, achievements }) {
  return fetch(host, {
    method: "POST",
    body: JSON.stringify({ name: username, time: time, achievements: achievements() }),
  }).then(response => {
    if (!response.ok) {
      console.log("Что-то пошло не так");
    }
  });
}
