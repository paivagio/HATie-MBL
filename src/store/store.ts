import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./reducers/authenticationReducer";
import authorizationReducer from "./reducers/authorizationReducer";

const store = configureStore({
    reducer: {
        auth: authenticationReducer,
        access: authorizationReducer
    }
});

export type StoreState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch;
export default store;