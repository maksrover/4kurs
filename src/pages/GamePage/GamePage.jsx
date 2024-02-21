import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Cards } from "../../Components/Cards/Cards";
import { ErrorCounter } from "../../Components/ErrorCounter/ErrorCounter";
import { useSelector, useDispatch } from "react-redux";
import { getLeaders } from "../../api";
import { setLeaders, removeErrors } from "../../store/slices"; // Импортируем removeErrors

export function GamePage() {
  const dispatch = useDispatch();
  const { pairsCount } = useParams();
  const isActiveEasyMode = useSelector((state) => state.game.isActiveEasyMode);

  useEffect(() => {
    getLeaders().then((leaders) => dispatch(setLeaders(leaders)));
    if (isActiveEasyMode) {
      dispatch(removeErrors()); // Вызываем removeErrors при начале новой игры в легком режиме
    }
  }, [dispatch, isActiveEasyMode]);

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5}></Cards>
      {isActiveEasyMode && <ErrorCounter />}
    </>
  );
}
