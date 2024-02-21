import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: {
    leaders: [],
    currentLevel: null,
    isActiveEasyMode: false,
    errors: 0, // Добавлено состояние для хранения количества ошибок
  },
  reducers: {
    setLeaders(state, action) {
      state.leaders = action.payload.leaders;
    },
    setCurrentLevel(state, action) {
      state.currentLevel = action.payload.choosenLevel;
    },
    setIsActiveEasyMode(state) {
      state.isActiveEasyMode = !state.isActiveEasyMode;
      if (!state.isActiveEasyMode) {
        // Сброс количества ошибок при выключении легкого режима
        state.errors = 0;
      }
    },
    updateErrors(state) {
      state.errors = state.errors + 1;
    },
    removeErrors(state) {
      state.errors = 0;
    },
  },
});

export const { setLeaders, setCurrentLevel, setIsActiveEasyMode, updateErrors, removeErrors } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
