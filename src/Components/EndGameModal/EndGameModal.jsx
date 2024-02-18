import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { addLeader } from "../../api";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, withoutSuperpowers }) {
  const [username, setUsername] = useState("Пользователь");
  const [isFinishedAddingToLeaderboard, setIsFinishedAddingToLeaderboard] = useState(false);
  const buttonRef = useRef();

  const time = gameDurationMinutes * 60 + gameDurationSeconds;
  const currentLevel = useSelector(state => state.game.currentLevel);
  const isActiveEasyMode = useSelector(state => state.game.isActiveEasyMode);
  const leaders = useSelector(state => state.game.leaders);

  const isLeader = leaders.filter(leader => {
    return leader.time > time;
  });

  function isAddToLeaders() {
    if (isWon === true && isLeader.length > 0 && currentLevel === 9) {
      return true;
    } else {
      return false;
    }
  }

  function achievements() {
    if (isActiveEasyMode === false && withoutSuperpowers === true) {
      return [1, 2];
    } else if (isActiveEasyMode === false && withoutSuperpowers === false) {
      return [1];
    } else if (isActiveEasyMode === true && withoutSuperpowers === true) {
      return [2];
    } else {
      return [];
    }
  }

  function addToLeaderboard({ username, time, achievements }) {
    buttonRef.disabled = true;

    addLeader({ username, time, achievements }).then(() => {
      buttonRef.disabled = false;
      setIsFinishedAddingToLeaderboard(true);
      setUsername("");
    });
  }

  const title = isWon ? (isAddToLeaders() === true ? "Вы попали на Лидерборд!" : "Вы победили!") : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isAddToLeaders() === true && isFinishedAddingToLeaderboard === false && (
        <>
          <input
            className={styles.username}
            type="text"
            placeholder="Пользователь"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
          <button
            className={styles.addButton}
            ref={buttonRef}
            onClick={() => addToLeaderboard({ username, time, achievements })}
          >
            Отправить
          </button>
        </>
      )}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Начать сначала</Button>

      <Link className={styles.leaderboardLink} to="/leaderboard">
        Перейти к лидерборду
      </Link>
    </div>
  );
}
