/**
 * import all app reducers and export them to combine and integrate in the store
 * !Do not modify the store to combine reducers.
 */
import sampleReducer from "./sampleReducer";

// services associated with airport dashboard tool
import airportDashboardReducer from "./././../growistoTask/store/reducers/dashboardReducer";

import { combineReducers } from "redux";

const domain = {
  ...airportDashboardReducer
};

//TODO add these as reducers once reducers for ui and app are available
// const ui = {};
// const app = {};

let allReducersCombined = {
  domain: combineReducers(domain)
};

export default allReducersCombined;
