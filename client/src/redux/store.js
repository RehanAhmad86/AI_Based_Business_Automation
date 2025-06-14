// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from "./userSlice"

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage by default
import { combineReducers } from 'redux';
import userReducer from './userSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage, // Use localStorage
  whitelist: ['user'], // Only persist the user slice
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor for handling the rehydration of state
const persistor = persistStore(store);

export { store, persistor };
