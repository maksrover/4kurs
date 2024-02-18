import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../Components/EndGameModal/EndGameModal";
import { Button } from "../../Components/Button/Button";
import { Card } from "../../Components/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import { removeErrors, updateErrors } from "../../store/slices";
import { Epiphany } from "../Superpowers/EpiphanyIcon";
import { Alohomora } from "../Superpowers/AlohomoraIcon";
import { Timer } from "../Timer/Timer";
import { ToolTips } from "../ToolTips/ToolTips";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";

const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";

const STATUS_PREVIEW = "STATUS_PREVIEW";
const STATUS_PAUSED = "STATUS_PAUSED";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor(
    (endDate.getTime() - startDate.getTime()) / 1000
  );
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const dispatch = useDispatch();
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);
  // Количество ошибок в режиме игры до трех ошибок
  const errors = useSelector((state) => state.game.errors);
  // Статус режима игры до трех ошибок
  const isActiveEasyMode = useSelector((state) => state.game.isActiveEasyMode);

  // Доступно ли использование прозрения
  const [isEpiphanyAvailable, setIsEpiphanyAvailable] = useState(true);
  // Доступно ли использование алохоморы
  const [isAlohomoraAvailable, setIsAlohomoraAvailable] = useState(true);

  const [isEpiphanyMouseEnter, setIsEpiphanyMouseEnter] = useState(false);
  const [isAlohomoraMouseEnter, setIsAlohomoraMouseEnter] = useState(false);

  const onEpiphanyMouseEnter = ({ setIsEpiphanyMouseEnter }) => {
    setIsEpiphanyMouseEnter(true);
  };

  const onEpiphanyMouseLeave = ({ setIsEpiphanyMouseEnter }) => {
    setIsEpiphanyMouseEnter(false);
  };

  const onAlohomoraMouseEnter = ({ setIsAlohomoraMouseEnter }) => {
    setIsAlohomoraMouseEnter(true);
  };

  const onAlohomoraMouseLeave = ({ setIsAlohomoraMouseEnter }) => {
    setIsAlohomoraMouseEnter(false);
  };

  // Если допущено 3 ошибки, игра заканчивается
  useEffect(() => {
    if (errors === 3) {
      finishGame(STATUS_LOST);
      dispatch(removeErrors());
    }
  });

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function finishGame(status = STATUS_LOST) {
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    setIsEpiphanyAvailable(true);
    setIsEpiphanyMouseEnter(false);
    setIsAlohomoraAvailable(true);
    setIsAlohomoraMouseEnter(false);
  }
  function resetGame() {
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = (clickedCard) => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map((card) => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every((card) => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter((card) => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter((card) => {
      const sameCards = openCards.filter(
        (openCard) => card.suit === openCard.suit && card.rank === openCard.rank
      );

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      dispatch(updateErrors());

      if (!isActiveEasyMode) {
        finishGame(STATUS_LOST);
        dispatch(removeErrors());
      } else {
        const updatedCards = nextCards.map((card) => {
          if (
            openCardsWithoutPair.some((openCard) => openCard.id === card.id)
          ) {
            if (card.open) {
              setTimeout(() => {
                setCards((prevCards) => {
                  const updated = prevCards.map((c) =>
                    c.id === card.id ? { ...c, open: false } : c
                  );
                  return updated;
                });
              }, 1000);
            }
          }
          return card;
        });
        setCards(updatedCards);
      }

      return;
    }
    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  function onEpiphanyClick() {
    const currentTime = timer;
    setStatus(STATUS_PAUSED);
    setIsEpiphanyAvailable(false);
    const closedCards = cards.filter((card) => !card.open);

    cards.map((card) => (card.open = true));

    setTimeout(() => {
      setCards(
        cards.map((card) => {
          if (closedCards.includes(card)) {
            return { ...card, open: false };
          } else {
            return card;
          }
        })
      );
      setTimer(currentTime);
      setStatus(STATUS_IN_PROGRESS);
    }, 5000);
  }

  function onAlohomoraClick() {
    setIsAlohomoraAvailable(false);
    const closedCards = cards.filter((card) => !card.open);
    const firstRandomCard =
      closedCards[Math.round(Math.random() * (closedCards.length - 1) + 1)];
    const secondRandomCard = closedCards.filter(
      (closedCard) =>
        closedCard.suit === firstRandomCard.suit &&
        closedCard.rank === firstRandomCard.rank &&
        firstRandomCard.id !== closedCard.id
    );
    setCards(
      cards.map((card) => {
        if (card === firstRandomCard || card === secondRandomCard[0]) {
          return { ...card, open: true };
        } else {
          return card;
        }
      })
    );
  }

  const withoutSuperpowers = isEpiphanyAvailable && isAlohomoraAvailable;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Timer
          status={status}
          STATUS_PREVIEW={STATUS_PREVIEW}
          previewSeconds={previewSeconds}
          timer={timer}
          STATUS_PAUSED={STATUS_PAUSED}
          STATUS_LOST={STATUS_LOST}
          STATUS_WON={STATUS_WON}
          setTimer={setTimer}
        />
        {status === STATUS_IN_PROGRESS || status === STATUS_PAUSED ? (
          <>
            <div className={styles.superPowersContainer}>
              <Epiphany
                isAvailable={isEpiphanyAvailable}
                onClick={onEpiphanyClick}
                onMouseEnter={onEpiphanyMouseEnter}
                onMouseLeave={onEpiphanyMouseLeave}
                setIsEpiphanyMouseEnter={setIsEpiphanyMouseEnter}
                isAlohomoraMouseEnter={isAlohomoraMouseEnter}
                isAlohomoraAvailable={isAlohomoraAvailable}
              />
              <Alohomora
                isAvailable={isAlohomoraAvailable}
                onClick={onAlohomoraClick}
                onMouseEnter={onAlohomoraMouseEnter}
                onMouseLeave={onAlohomoraMouseLeave}
                setIsAlohomoraMouseEnter={setIsAlohomoraMouseEnter}
                isEpiphanyMouseEnter={isEpiphanyMouseEnter}
                isEpiphanyAvailable={isEpiphanyAvailable}
              />
            </div>
            {(isEpiphanyMouseEnter && isEpiphanyAvailable) ||
            (isAlohomoraMouseEnter && isAlohomoraAvailable) ? (
              <div className={styles.modalBackground}>
                <div className={styles.modalWindow}>
                  {isEpiphanyMouseEnter && isEpiphanyAvailable && (
                    <div
                      className={
                        isAlohomoraAvailable
                          ? styles.toolTipEpiphany
                          : styles.toolTip
                      }
                    >
                      <ToolTips
                        title={"Прозрение"}
                        text={
                          "На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается."
                        }
                      />
                    </div>
                  )}
                  {isAlohomoraMouseEnter && isAlohomoraAvailable && (
                    <div
                      className={
                        isEpiphanyAvailable
                          ? styles.toolTipAlohomora
                          : styles.toolTip
                      }
                    >
                      <ToolTips
                        title={"Алохомора"}
                        text={"Открывается случайная пара карт."}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
        {status === STATUS_IN_PROGRESS || status === STATUS_PAUSED ? (
          <Button onClick={resetGame}>Начать заново</Button>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map((card) => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            withoutSuperpowers={withoutSuperpowers}
          />
        </div>
      ) : null}
    </div>
  );
}
