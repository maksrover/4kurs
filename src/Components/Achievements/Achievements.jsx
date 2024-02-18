import styles from "./Achievements.module.css";
import { HardModeAchievement } from "./icons/HardModeAchievement";
import { WithoutSuperpowerAchievement } from "./icons/WithoutSuperpowerAchievement";

export function Achievements(achievements) {
  const hardMode = achievements => {
    if (!achievements) {
      return;
    }

    if (achievements.includes(1)) {
      return true;
    } else {
      return false;
    }
  };

  const withoutSuperpower = achievements => {
    if (!achievements) {
      return;
    }

    if (achievements.includes(2)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={styles.container}>
      <HardModeAchievement hardMode={hardMode(achievements.achievements)} />
      <WithoutSuperpowerAchievement withoutSuperpower={withoutSuperpower(achievements.achievements)} />
    </div>
  );
}
