import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface GlobalState {
  isLoading: boolean;
  error: string | null;
}

type Action = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: GlobalState = {
  isLoading: false,
  error: null,
};

const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

function reducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
