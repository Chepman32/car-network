/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    
    // Check if the event indicates a sign-in action
    if (event.requestContext.eventType === 'SignIn') {
        // Alert "True" when user signs in
        console.log("True");
    }
    
    return {
        statusCode: 200,
        // Uncomment below to enable CORS requests
        // headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Headers": "*"
        // },
        body: JSON.stringify('Hello from Lambda!'),
    };
};
