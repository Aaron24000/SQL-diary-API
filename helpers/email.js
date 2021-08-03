exports.forgotEmailParams = (email, token) => {
  return {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Complete your registration",
    // text: "and easy to do anywhere, even with Node.js",
    html: `<h1>Hello ${email}, verify your email address</h1>
    <p>Please use the following link to complete your registration</p>
    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>`,
  };
};
