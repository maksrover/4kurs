import { useParams } from "react-router-dom";

import { Cards } from "../../Components/Cards/Cards";
import { ErrorCounter } from "../../Components/ErrorCounter/ErrorCounter";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getLeaders } from "../../api";
import { useDispatch } from "react-redux";
import { setLeaders } from "../../store/slices";

export function GamePage() {
  const dispatch = useDispatch();
  const { pairsCount } = useParams();
  const isActiveEasyMode = useSelector((state) => state.game.isActiveEasyMode);

  useEffect(() => {
    getLeaders().then((leaders) => dispatch(setLeaders(leaders)));
  }, [dispatch]);

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5}></Cards>
      {isActiveEasyMode && <ErrorCounter />}
    </>
  );
}
