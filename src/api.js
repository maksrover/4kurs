const host = " https://wedev-api.sky.pro/api/leaderboard";

export function getLeaders() {
  return fetch(host).then((response) => {
    if (!response.ok) {
      console.log("Что-то пошло не так");
    } else {
      return response.json();
    }
  });
}

export async function addLeader({ username, time, achievements }) {
  const response = await fetch(host, {
    method: "POST",
    body: JSON.stringify({
      name: username,
      time: time,
      achievements: achievements(),
    }),
  });
  if (!response.ok) {
    console.log("Что-то пошло не так");
  }
}
