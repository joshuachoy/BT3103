// This activity requires Node.js 10.x runtime

exports.handler = async event => {
  var fs = require('fs');
  const indexPage = fs.readFileSync('index.html','utf8');


  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html"
      },
      body: indexPage
    };
  }

  function throwError(errorName) {
    throw new Error(errorName);
  }
  const trimAndStringify = input => input.toString().trim();

  if (event.httpMethod === "POST") {
    const parsedBodyContent = JSON.parse(event.body);
    const activityVariables = parsedBodyContent["shown"]["0"]
      .replace(/\s+/g, " ")
      .replace(/&zwnj;.*&zwnj;/, "");
    const userSolution = parsedBodyContent["editable"]["0"];
    let executeUserSolution = "";
    let activityVariables2 = "";
    let errorMessage = "";
    let results = "";
    let htmlResults = "";
    try {
      activityVariables2 = activityVariables.split(",");
      activityVariables2[0]
        ? activityVariables2[1]
          ? activityVariables2[2]
            ? null
            : throwError("no third input")
          : throwError("no second input")
        : throwError("no first input");
    } catch (error) {
      errorMessage = error.message;
    }
    try {
      executeUserSolution = eval(userSolution);
    } catch (error) {
      errorMessage = `error executing your code: ${error.message}`;
    }
    if (!errorMessage) {
      executeUserSolution ===
      trimAndStringify(activityVariables2[0]).replace(
        trimAndStringify(activityVariables2[1]),
        trimAndStringify(activityVariables2[2])
      )
        ? (results = "You got the answer!") &&
          (htmlResults = `You have got the answer: ${executeUserSolution}`)
        : (results = "You have missed the answer... check your code again?");
    }
    const textResults = results || errorMessage;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html"
      },
      body: JSON.stringify({
        isComplete: results === "You got the answer!",
        jsonFeedback: JSON.stringify(textResults),
        htmlFeedback: htmlResults || textResults,
        textFeedback: textResults
      })
    };
  }
};
