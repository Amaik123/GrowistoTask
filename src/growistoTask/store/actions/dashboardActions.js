import { DashboardTypes } from "../types/dashboardTypes";
import { get } from "lodash";
import ToastUtils from "../../../utils/handleToast";
import FetchUtils from "../../../utils/FetchUtils";

// action creators
const REQUEST_DATA = (payload = {}, type = DashboardTypes.REQUEST_DATA) => {
  return {
    type,
    payload
  };
};

const RECEIVE_DOCUMENT_DASHBOARD = (
  payload = null,
  type = DashboardTypes.RECEIVE_DOCUMENT_DASHBOARD
) => {
  return {
    type,
    payload
  };
};

const getJsonList = () => async dispatch => {
  const URL = `/data/data.json`;
  // start loading
  dispatch(
    REQUEST_DATA({
      isTemplateListLoading: true
    })
  );

  const response = await FetchUtils.getData(URL);

  dispatch(
    REQUEST_DATA({
      isTemplateListLoading: false
    })
  );

  if (response.success && response.data) {
    dispatch(
      RECEIVE_DOCUMENT_DASHBOARD({
        documentDashboardData: response.data
      })
    );
  } else {
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });
  }
};

export { getJsonList };
