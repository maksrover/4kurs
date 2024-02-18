import { useDispatch, useSelector } from "react-redux";
import { setIsActiveEasyMode } from "../../store/slices";
import styles from "./Checkbox.module.css";

export function Checkbox() {
  const dispatch = useDispatch();
  const handleCheckboxChange = event => {
    dispatch(setIsActiveEasyMode(event.target.value));
  };

  const isActiveEasyMode = useSelector(store => store.game.isActiveEasyMode);

  return (
    <div className={styles.rules}>
      <label htmlFor="activateMode">
        <input className={styles.input} type="checkbox" checked={isActiveEasyMode} onChange={handleCheckboxChange} />
      </label>
      <h2 className={styles.heading}>Легкий режим (3 жизни)</h2>
    </div>
  );
}
