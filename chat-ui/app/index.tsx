import React from "react";
import Main from "../components/main";
import { Provider } from "react-redux";
import store from "../redux";

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;
