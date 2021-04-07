import axios from "axios";
// import history from "../history";
import { get, cloneDeep } from "lodash";
import ToastUtils from "../utils/handleToast";

//default timeout for API requests
// wow! default 300 second timeout (this is a very bad thing)
// axios.defaults.timeout = 300000;
// instead, we will set the default timeout to 3s
// we make sure no requests 'hang' on the async queue in the case of
// non-responsive (or worse, bugged) servers
// we may induce a few timeouts for long-running api calls. this is good
// thing because it will force us to clean up the API error response handling

// setting to 10s as temp test. We'll see which api calls fail at this
// value
axios.defaults.timeout = 30000;

const TIMEOUT_MESSAGE = {
  message: `Something’s wrong. we can’t communicate with the servers right now. we’ll try again. if this persists, please contact support.`
};

/**  Convert response to FE Format to handle changes if done in API response */
const handleReponseConvert = ({ response, error }) => {
  const responseData = (response && response.data) || null;
  const errorResponse = (error && get(error, "response.data")) || null;
  let formattedResponse = {};

  if (response && response.status) {
    let statusCodeRange =
      (response.status >= 200 && response.status <= 299) ||
      response.status === 304;
    if ((responseData && responseData.success) || statusCodeRange) {
      formattedResponse = {
        success: true,
        status: 200,
        ...responseData,
        data: get(responseData, "data") || response || null
      };
    } else {
      formattedResponse = {
        success: false,
        status: responseData.error.code,
        data: get(error, "response.data.error") || TIMEOUT_MESSAGE
      };
    }
  } else if (errorResponse) {
    formattedResponse = {
      success: false,
      status: 404,
      data: get(error, `response.data.error`) || TIMEOUT_MESSAGE
    };

    if (get(error, "response.status") === 403) {
      let errorMessage = get(errorResponse, "error.message");
      //show No Permission to access route
      ToastUtils.handleToast({
        operation: "error",
        message: errorMessage || TIMEOUT_MESSAGE
      });

      // Check if user has access to a route and if not redirect to dashboard
      // history.push("/home");
    } else if (get(error, "response.status") === 401) {
      // @todo this is a horrible place to do this. note that simply
      // redirecting to /logout doesn't actually log the user out...
      //redirect logout if unauthorised or token is expired
      // history.push("/logout");
    }
  } else {
    formattedResponse = {
      success: false,
      status: 404,
      data: TIMEOUT_MESSAGE
    };
  }

  return formattedResponse;
};

/**  API Calling methods integrated with axios */

class FetchUtils {
  constructor() {
    this.baseUrl = `${process.env.REACT_APP_BASE_URL}`;
    console.log(
      `FetchUtils configured to use ${this.baseUrl} for API requests`
    );
  }

  // set headers with authentication token
  setHeaders(headersValue = {}, responseType = {}) {
    const accessToken = localStorage.getItem("token");

    const config = {
      ...responseType,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headersValue
      }
    };

    return (accessToken && config) || "";
  }

  postData = async (url, body, log) => {
    const headers = this.setHeaders();
    const apiUrl = this.baseUrl + url;
    //    console.log('FetchUtils.postData', JSON.stringify({ apiUrl, headers, log },null,2));
    try {
      return axios
        .post(apiUrl, body, headers)
        .then(response => handleReponseConvert({ response }))
        .catch(err => {
          console.log(
            "FetchUtils.getData err",
            JSON.stringify({ err, apiUrl, headers, log }, null, 2)
          );
          return handleReponseConvert({ err });
        });
    } catch (error) {
      console.log(
        "FetchUtils.postData error",
        JSON.stringify({ error, apiUrl, headers, log }, null, 2)
      );
      return handleReponseConvert({
        error
      });
    }
  };

  putData = async (url, body, log) => {
    //    console.debug('FetchUtils.putData',{ url, body });
    try {
      const headers = this.setHeaders();
      const apiUrl = this.baseUrl + url;
      const response = await axios.put(apiUrl, body, headers);

      return handleReponseConvert({
        response
      });
    } catch (error) {
      console.log("error ^^^^^^^", error);
      return handleReponseConvert({
        error
      });
    }
  };

  patchData = async (url, body, log) => {
    //    console.debug('FetchUtils.patchData',{ url, body });
    try {
      const headers = this.setHeaders();
      const apiUrl = this.baseUrl + url;
      const response = await axios.patch(apiUrl, body, headers);
      return handleReponseConvert({
        response
      });
    } catch (error) {
      console.log("error ^^^^^^^", error);
      return handleReponseConvert({
        error
      });
    }
  };

  deleteData = async (url, log) => {
    try {
      const headers = this.setHeaders();
      const apiUrl = this.baseUrl + url;
      //      console.debug('FetchUtils.deleteData',{ apiUrl, headers });
      const response = await axios.delete(apiUrl, headers);
      return handleReponseConvert({
        response
      });
    } catch (error) {
      console.log("error ^^^^^^^", error);
      return handleReponseConvert({
        error
      });
    }
  };

  getData = async (url, log) => {
    const apiUrl = url;
    const headers = this.setHeaders();
    //    console.log('FetchUtils.getData', JSON.stringify({ apiUrl, headers, log },null,2));
    try {
      return axios
        .get(apiUrl)
        .then(response => handleReponseConvert({ response }))
        .catch(err => {
          console.log(
            "FetchUtils.getData err",
            JSON.stringify({ err, apiUrl, headers, log }, null, 2)
          );
          return handleReponseConvert({ err });
        });
    } catch (error) {
      console.log(
        "FetchUtils.getData error",
        JSON.stringify({ error, apiUrl, headers, log }, null, 2)
      );
      return handleReponseConvert({
        error
      });
    }
  };

  getDataWithHeader = async (
    url,
    log,
    customHeader = {},
    responseType,
    isAttachBaseurl = true
  ) => {
    const apiUrl = isAttachBaseurl ? this.baseUrl + url : url;
    try {
      const headers = this.setHeaders(customHeader, responseType);

      const response = await axios.get(apiUrl, {
        data: {},
        ...headers
      });

      return handleReponseConvert({
        response
      });
    } catch (error) {
      console.log("error ^^^^^^^", error);
      return handleReponseConvert({
        error
      });
    }
  };

  // aws request utils
  awsPutData = async (apiUrl, body, headers, log) => {
    try {
      let config = {
        headers: headers,
        timeout: 0
      };
      const response = await axios.put(apiUrl, body, config);
      return handleReponseConvert({
        response
      });
    } catch (error) {
      console.log("error ^^^^^^^", error);
      return handleReponseConvert({
        error
      });
    }
  };
}

export default new FetchUtils();
