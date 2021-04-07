import React, { useState, useEffect } from "react";
// import "./styles.css";
import MyStepper from "./Stepper";
import { connect } from "react-redux";
import { getJsonList } from "../../store/actions/dashboardActions.js";

const mapStateToProps = state => {
  const {
    domain: {
      RECEIVE_TEMPLATE_LIST,
      REQUEST_DATA,
      SELECTED_TEMPLATE,
      RECEIVE_DOCUMENT_DATA,
      RECEIVE_DOCUMENT_DASHBOARD
    },
    SUCCESS_USER_PROFILE
  } = state;

  return {
    ...RECEIVE_TEMPLATE_LIST,
    ...REQUEST_DATA,
    ...SELECTED_TEMPLATE,
    ...SUCCESS_USER_PROFILE,
    ...RECEIVE_DOCUMENT_DATA,
    ...RECEIVE_DOCUMENT_DASHBOARD
  };
};

const mapDispatchToProps = {
  getJsonList
};

const Dashboard = props => {
  useEffect(() => {
    props.getJsonList();
  }, []);

  const [steppers, setSteppers] = useState([{ activeStep: 0 }]);

  const addForm = () => {
    setSteppers(steppers.concat({ activeStep: 0 }));
  };

  const updateActiveStep = (index, count) => {
    setSteppers(prev =>
      prev.map((stepper, i) => {
        if (i === index) {
          return { ...stepper, activeStep: stepper.activeStep + count };
        }

        return stepper;
      })
    );
  };

  const handleReset = index => {
    setSteppers(prev =>
      prev.map((stepper, i) => {
        if (i === index) {
          return { ...stepper, activeStep: 0 };
        }
        return stepper;
      })
    );
  };

  const stepperForms = steppers.map((stepper, index) => (
    <MyStepper
      activeStep={stepper.activeStep}
      stepData={
        props.documentDashboardData ? props.documentDashboardData.data : []
      }
      handleReset={() => handleReset(index)}
      setActiveStep={count => updateActiveStep(index, count)}
    />
  ));
  return (
    <>
      {/* <button onClick={addForm}>add form</button> */}
      {stepperForms}
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
