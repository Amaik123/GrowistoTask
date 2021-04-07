import { useState, useEffect } from "react";
import Element from "./components/Element";
import { FormContext } from "./FormContext";

function Form(props) {
  const [elements, setElements] = useState(null);

  const { data } = props;

  useEffect(() => {
    setElements(data);
  }, [data]);

  const { fields, page_label } = elements ?? {};
  const handleSubmit = event => {
    event.preventDefault();
  };

  const handleChange = (id, event) => {
    const newElements = { ...elements };
    newElements.fields.forEach(field => {
      const { type, field_id } = field;
      if (id === field_id) {
        switch (type) {
          case "checkbox":
            field["field_value"] = event.target.checked;
            break;

          default:
            field["field_value"] = event.target.value;
            break;
        }
      }
      setElements(newElements);
    });
  };

  return (
    <FormContext.Provider value={{ handleChange }}>
      <div className="App container">
        <h3>{page_label}</h3>
        <form>
          {fields
            ? fields.map((field, i) => <Element key={i} field={field} />)
            : null}
          <button
            type="submit"
            className="btn btn-primary"
            onClick={e => handleSubmit(e)}
          >
            Submit
          </button>
        </form>
      </div>
    </FormContext.Provider>
  );
}

export default Form;
