import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: {
    leaders: [],
    currentLevel: null,
    isActiveEasyMode: false,
    errors: 0,
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
