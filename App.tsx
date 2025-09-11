// App.tsx
import { Provider, useDispatch } from "react-redux";
import "./global.css";
import  { useEffect } from "react";
import StackNavigator from "./src/navigation/Stack";
import { store, useAppDispatch } from "./src/store";
import { restoreLogin } from "./src/store/feature/auth/authSlice";
import { StatusBar } from "react-native";


export default function App() {
  return (
    <Provider store={store}>
      <StatusBar/>
      <AppInitializer />
      <StackNavigator />
    </Provider>
  );
}

// This component runs once to restore login state from AsyncStorage
const AppInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreLogin());
  }, [dispatch]);

  return null;
};
