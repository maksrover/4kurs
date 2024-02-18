import styles from "./LeaderBoardItem.module.css";
import { Achievements } from "../Achievements/Achievements";

export function LeaderBoardItem({ position, user, time, achievements, isTemplate }) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.round(time % 60);

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return (
    <div className={styles.container}>
      <p className={isTemplate ? styles.template : styles.item}>{isTemplate ? "Позиция" : `# ${position}`}</p>
      <p className={isTemplate ? styles.template : styles.item}>{isTemplate ? "Пользователь" : user}</p>
      <div className={isTemplate ? styles.template : styles.item}>
        {isTemplate ? "Достижения" : <Achievements achievements={achievements} />}
      </div>
      <p className={isTemplate ? styles.template : styles.item}>{isTemplate ? "Время" : `${minutes}:${seconds}`}</p>
    </div>
  );
}
