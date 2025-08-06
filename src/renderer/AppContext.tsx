import React, { createContext, useContext, PropsWithChildren, useReducer, Dispatch } from 'react';

// 1. Define the State and Action Types
export interface IGlobalState {
  context: string;
  user: {
    isLoggedIn: boolean;
    name: string | null;
  } | null;
}

// Define the actions that can modify the state
export type Action =
  | { type: 'SET_CONTEXT'; payload: string }
  | { type: 'LOGIN'; payload: { name: string } }
  | { type: 'LOGOUT' }

// 2. Define the Reducer Function
// This function determines how the state changes in response to actions
function appReducer(state: IGlobalState, action: Action): IGlobalState {
  switch (action.type) {
    case 'SET_CONTEXT':
      return {
        ...state,
        context: action.payload,
      };
    case 'LOGIN':
      return {
        ...state,
        user: {
          isLoggedIn: true,
          name: action.payload.name,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      // This is a safeguard for unhandled actions
      return state;
  }
}

// 3. Update the Context Type
// It now holds both the state and the dispatch function
interface IAppContext {
  state: IGlobalState;
  dispatch: Dispatch<Action>;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

// 4. Update the Custom Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// 5. Update the Provider Component
interface AppProviderProps {
  initialState: IGlobalState;
}

export function AppProvider({ children, initialState }: PropsWithChildren<AppProviderProps>) {
  // Use useReducer to manage state.
  // The third argument to useReducer is an initializer function, but passing the initial state directly is fine here.
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Provide both state and dispatch to children
  const value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
