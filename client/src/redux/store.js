import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"
import interviewSlice from "./interviewSlice"
export default configureStore({
  reducer: {
    user: userSlice,
    interview: interviewSlice
  },
})