import { createSlice } from "@reduxjs/toolkit";

const interviewSlice = createSlice({
    name: "interview",
    initialState: {
        interviewData: null,
    },
    reducers: {
        setInterviewData: (state, action) => {
            state.interviewData = action.payload;
        },
        clearInterviewData: (state) => {
            state.interviewData = null;
        }
    }
});

export const { setInterviewData, clearInterviewData } = interviewSlice.actions;
export default interviewSlice.reducer;
