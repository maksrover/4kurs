import styles from "./Timer.module.css";
import { useEffect } from "react";

export function Timer({
  status,
  STATUS_PREVIEW,
  previewSeconds,
  timer,
  STATUS_PAUSED,
  STATUS_LOST,
  STATUS_WON,
  setTimer,
}) {
  // Обновляем значение таймера в интервале
  useEffect(() => {
    if (status !== STATUS_PAUSED) {
      if (status === STATUS_LOST || status === STATUS_WON) return;
      const intervalId = setInterval(() => {
        setTimer(
          timer.seconds === 59
            ? t => ({
                seconds: t.seconds - 59,
                minutes: t.minutes + 1,
              })
            : t => ({
                ...t,
                seconds: t.seconds + 1,
              }),
        );
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [status, timer, STATUS_LOST, STATUS_PAUSED, STATUS_WON, setTimer]);

  return (
    <div className={styles.timer}>
      {status === STATUS_PREVIEW ? (
        <div>
          <p className={styles.previewText}>Запоминайте пары!</p>
          <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
        </div>
      ) : (
        <>
          <div className={styles.timerValue}>
            <div className={styles.timerDescription}>min</div>
            <div>{timer.minutes.toString().padStart("2", "0")}</div>
          </div>
          .
          <div className={styles.timerValue}>
            <div className={styles.timerDescription}>sec</div>
            <div>{timer.seconds.toString().padStart("2", "0")}</div>
          </div>
        </>
      )}
    </div>
  );
}
