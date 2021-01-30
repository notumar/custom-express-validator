function validator(req, res, next) {
  //First, de-structure the request body
  const { rule, data } = req.body;

  // Then check if rule field exists
  if (!rule) {
    return res.status(400).json({
      message: "rule is required.",
      status: "error",
      data: null,
    });
  }

  function checkType(field) {
    return typeof field !== "object" || field === null;
  }
  //If rule field exists check the type
  if (checkType(rule)) {
    return res.status(400).json({
      message: "rule should be an object.",
      status: "error",
      data: null,
    });
  }

  //Next check if the data field exists
  if (!data) {
    return res.status(400).json({
      message: "data is required.",
      status: "error",
      data: null,
    });
  }

  if (checkType(data)) {
    return res.status(400).json({
      message: "rule should be an object.",
      status: "error",
      data: null,
    });
  }

  //Create an object to check type(wahala for who no use typescript tbh)
  const ruleFields = {
    field: "string",
    condition: "string", //Because of the accepted conditions on line 71 I assumed this would always be a string
    condition_value: "can be anything",
  };

  //Loop through the keys in the object above
  for (const field of Object.keys(ruleFields)) {
    //Find out if there is a key that's in ruleFields but not in the rule object
    if (!Object.keys(rule).includes(field)) {
      return res.status(400).json({
        message: `${field} is required.`,
        status: "error",
        data: null,
      });
    }

    //Next check the type passed into the rule object.
    if (
      field !== "condition_value" &&
      typeof rule[field] !== ruleFields[field]
    ) {
      return res.status(400).json({
        message: `${field} should be a ${ruleFields[field]}.`,
        status: "error",
        data: null,
      });
    }
  }

  next();
}

module.exports = validator;
