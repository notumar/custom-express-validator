function finalValidator(req, res, next) {
  //First destructure the request body
  const { rule, data } = req.body;
  const { field, condition, condition_value } = rule;
  const reply = res;
  //If dot notation used, split at dot to get properties of the field
  const dataProperties = field.split(".");

  //if the array generated from the split >2, 404!
  if (dataProperties.length > 3) {
    console.log(req.body);
    return res.status(400).json({
      message: `${field}: Nesting should not be more than two levels.`,
      status: "error",
      data: null,
    });
  }

  //a bit of eval here, start by setting the string to data
  let objectevaluation = "data";

  //loop through the dataProperties array and append what we have above
  for (let i = 0; i < dataProperties.length; i++) {
    objectevaluation += `["${dataProperties[i]}"]`;
  }
  try {
    //then evaluate the new string which should be data[foo][bar(at most)]

    //our result is the value of data[rule.field]
    const result = eval(objectevaluation);
    console.log(objectevaluation);
    console.log(result);
    //if no result, we know the field doesn't exist
    if (!result && result !== null && typeof result !== "boolean") {
      return res.status(400).json({
        message: `field ${field} is missing from data.`,
        status: "error",
        data: null,
      });
    }
    //Validate the fields
    ruleValidate(field, condition, result, condition_value, reply);
  } catch (error) {
    //this catches any evaluation errors, which will only occur if field is missing
    console.log(error);
    return res.status(400).json({
      message: `field ${field} is missing from data.`,
      status: "error",
      data: null,
    });
  }
  next();
}

function ruleValidate(ruleField, ruleCondition, dataValue, ruleValue, res) {
  //Finally we carry out operations
  const operations = { eq: "===", neq: "!==", gt: ">", gte: ">=" };

  //check hell

  //if condition is contains,
  if (ruleCondition === "contains") {
    //more type checking and convert to string if it contains a number
    if (
      typeof ruleValue === typeof dataValue &&
      !Array.isArray(ruleValue) &&
      !Array.isArray(dataValue)
    ) {
      //here we handle if it is a boolean
      if (typeof dataValue === "boolean") {
        return res.status(200).json({
          message: `field ${ruleField} successfully validated.`,
          status: "success",
          data: {
            validation: {
              error: false,
              field: `${ruleField}`,
              field_value: dataValue,
              condition: "contains",
              condition_value: ruleValue,
            },
          },
        });
      }
      //if it contains a number
      if (
        typeof dataValue === "number" &&
        dataValue.toString().includes(ruleValue.toString())
      ) {
        return res.status(200).json({
          message: `field ${ruleField} successfully validated.`,
          status: "success",
          data: {
            validation: {
              error: false,
              field: `${ruleField}`,
              field_value: dataValue,
              condition: "contains",
              condition_value: ruleValue,
            },
          },
        });
      }
      if (dataValue === null) {
        return res.status(200).json({
          message: `field ${ruleField} successfully validated.`,
          status: "success",
          data: {
            validation: {
              error: false,
              field: `${ruleField}`,
              field_value: dataValue,
              condition: "contains",
              condition_value: ruleValue,
            },
          },
        });
      }
      //handle strings
      if (dataValue.toString().includes(ruleValue.toString())) {
        return res.status(200).json({
          message: `field ${ruleField} successfully validated.`,
          status: "success",
          data: {
            validation: {
              error: false,
              field: `${ruleField}`,
              field_value: dataValue,
              condition: "contains",
              condition_value: ruleValue,
            },
          },
        });
      }
    }
    if (Array.isArray(dataValue) && dataValue.includes(ruleValue)) {
      return res.status(200).json({
        message: `field ${ruleField} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: `${ruleField}`,
            field_value: dataValue,
            condition: "contains",
            condition_value: ruleValue,
          },
        },
      });
    }

    return res.status(400).json({
      message: `field ${ruleField} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: `${ruleField}`,
          field_value: dataValue,
          condition: "contains",
          condition_value: ruleValue,
        },
      },
    });
  } else {
    let ruleValidated;
    if (typeof dataValue === typeof ruleValue) {
      if (typeof dataValue === "object") {
        return res.status(400).json({
          message: `field ${ruleField} failed validation.`,
          status: "error",
          data: {
            validation: {
              error: true,
              field: `${ruleField}`,
              field_value: dataValue,
              condition: ruleCondition,
              condition_value: ruleValue,
            },
          },
        });
      }
      if (typeof dataValue === "string") {
        ruleValidated = eval(
          `"${dataValue}"${operations[ruleCondition]}"${ruleValue}"`
        );
      } else {
        ruleValidated = eval(
          `${dataValue}${operations[ruleCondition]}${ruleValue}`
        );
      }
    }

    console.log(ruleValidated);
    if (ruleValidated) {
      return res.status(200).json({
        message: `field ${ruleField} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: `${ruleField}`,
            field_value: dataValue,
            condition: ruleCondition,
            condition_value: ruleValue,
          },
        },
      });
    } else {
      return res.status(400).json({
        message: `field ${ruleField} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: `${ruleField}`,
            field_value: dataValue,
            condition: ruleCondition,
            condition_value: ruleValue,
          },
        },
      });
    }
  }
}

module.exports = finalValidator;
