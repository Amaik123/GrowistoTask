import React from "react";
import Checkbox from "./elements/Checkbox";
import Input from "./elements/Input";
import Select from "./elements/Select";
import Number from "./elements/Number";

const Element = ({
  field: { type, id, label, placeholder, value, field_options }
}) => {
  switch (type) {
    case "text":
      return (
        <Input
          field_id={id}
          field_label={label}
          field_placeholder={placeholder}
          field_value={value}
        />
      );
    case "select":
      return (
        <Select
          field_id={id}
          field_label={label}
          field_placeholder={placeholder}
          field_value={value}
          field_options={options}
        />
      );
    case "number":
      return (
        <Number
          field_id={id}
          field_label={label}
          field_placeholder={placeholder}
          field_value={value}
        />
      );
    case "checkbox":
      return <Checkbox field_id={id} field_label={label} field_value={value} />;

    default:
      return null;
  }
};

export default Element;
