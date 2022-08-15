import { TypedUseSelectorHook, useDispatch as reduxDispatch, useSelector as reduxSelector } from 'react-redux'
import type { StoreState, StoreDispatch } from '../store/store'

export const useDispatch: () => StoreDispatch = reduxDispatch;
export const useSelector: TypedUseSelectorHook<StoreState> = reduxSelector; 