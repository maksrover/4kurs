import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../Components/EndGameModal/EndGameModal";
import { Button } from "../../Components/Button/Button";
import { Card } from "../../Components/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import { resetErrors, updateErrors } from "../../store/slices";
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

export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const errors = useSelector((state) => state.game.errors);
  const isActiveEasyMode = useSelector((state) => state.game.isActiveEasyMode);

  const [isEpiphanyAvailable, setIsEpiphanyAvailable] = useState(true);
  const [isAlohomoraAvailable, setIsAlohomoraAvailable] = useState(true);
  const [isEpiphanyMouseEnter, setIsEpiphanyMouseEnter] = useState(false);
  const [isAlohomoraMouseEnter, setIsAlohomoraMouseEnter] = useState(false);

  useEffect(() => {
    if (errors === 3 && status !== STATUS_LOST) {
      finishGame(STATUS_LOST);
      dispatch(resetErrors());
    }
  }, [errors, status]);

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
    if (isActiveEasyMode) {
      dispatch(resetErrors());
    }
  }

  const openCard = (clickedCard) => {
    if (clickedCard.open) {
      return;
    }

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

    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    const openCards = nextCards.filter((card) => card.open);

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

    if (playerLost) {
      dispatch(updateErrors());

      if (!isActiveEasyMode) {
        finishGame(STATUS_LOST);
        dispatch(resetErrors());
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
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  useEffect(() => {
    if (status !== STATUS_PREVIEW) {
      return;
    }

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
                onMouseEnter={() => setIsEpiphanyMouseEnter(true)}
                onMouseLeave={() => setIsEpiphanyMouseEnter(false)}
                isAlohomoraMouseEnter={isAlohomoraMouseEnter}
                isAlohomoraAvailable={isAlohomoraAvailable}
              />
              <Alohomora
                isAvailable={isAlohomoraAvailable}
                onClick={onAlohomoraClick}
                onMouseEnter={() => setIsAlohomoraMouseEnter(true)}
                onMouseLeave={() => setIsAlohomoraMouseEnter(false)}
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
