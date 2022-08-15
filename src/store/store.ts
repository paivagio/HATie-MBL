import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./reducers/authenticationReducer";

const store = configureStore({
    reducer: {
        auth: authenticationReducer
    }
});

export type StoreState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch;
export default store;