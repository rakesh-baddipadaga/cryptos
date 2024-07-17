import { configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistConfig } from 'redux-persist/es/types';
import dataReducer from './dataslice';

console.log("loading store config");
const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
};

console.log("Persist config set up");

const persistedReducer = persistReducer(persistConfig, dataReducer);
const loggerMiddleware = (middlewareAPI: any) => (next: any) => (action: any) => {
  console.log('Action:', action);
  return next(action);
};

console.log("Logger middleware created");


export const store = configureStore({
  reducer: {
    data: persistedReducer,
  },
  middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      ignoredPaths: ['register'], 
    },
  }).concat(loggerMiddleware)
});

console.log("Store configured");

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

console.log("hello");

