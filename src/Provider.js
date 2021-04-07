import React, { Fragment } from "react";
import { Provider } from "react-redux";

// import { PersistGate } from "redux-persist/integration/react";
// configure redux store
import { store, persistor } from "./store";
import Dashboard from "./growistoTask//pages/dashboard";
import { PersistGate } from "redux-persist/integration/react";

function AllProvider(props) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Fragment>
          <Dashboard {...props} />
        </Fragment>
      </PersistGate>
    </Provider>
  );
}
export default AllProvider;
