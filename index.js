const express = require("express");
const customValidator = require("./validator");
const finalValidator = require("./testfile");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "AhmedTijani Umar",
      github: "@ahmedtijani",
      email: "ahmedtijaniumar@gmail.com",
      mobile: "08063662344",
      twitter: "@hmedtijani",
    },
  });
});

app.post(
  "/validate-rule",
  [customValidator, finalValidator],
  (req, res, next) => {
    next(err);
  }
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
