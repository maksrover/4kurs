import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./slices";

export default configureStore({
  reducer: {
    game: gameReducer,
  },
});
