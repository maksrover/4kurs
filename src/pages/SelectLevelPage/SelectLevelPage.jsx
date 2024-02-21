import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentLevel, resetErrors, setLeaders } from "../../store/slices"; 
import { getLeaders } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../Components/Button/Button";
import { Checkbox } from "../../Components/Checkbox/Checkbox";
import styles from "./SelectLevelPage.module.css";

export function SelectLevelPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [choosenLevel, setChoosenLevel] = useState(null);

  const handleButtonClick = () => {
    if (choosenLevel !== null) {
      dispatch(setCurrentLevel({ choosenLevel }));
      dispatch(resetErrors()); 
      navigate(`/game/${choosenLevel}`);
    }
  };

  useEffect(() => {
    getLeaders().then((leaders) => dispatch(setLeaders(leaders)));
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li
            className={choosenLevel === 3 ? styles.choosenLevel : styles.level}
            onClick={() => setChoosenLevel(3)}
          >
            1
          </li>
          <li
            className={choosenLevel === 6 ? styles.choosenLevel : styles.level}
            onClick={() => setChoosenLevel(6)}
          >
            2
          </li>
          <li
            className={choosenLevel === 9 ? styles.choosenLevel : styles.level}
            onClick={() => setChoosenLevel(9)}
          >
            3
          </li>
        </ul>
        <Checkbox />
        <Button children={"Играть"} onClick={handleButtonClick} />
        <Link className={styles.leaderboardLink} to="/leaderboard">
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
