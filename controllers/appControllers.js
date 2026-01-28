// const { verifyToken } = require("../utils/jwt");

// const dashboardController = async (req, res) => {
//   const token = req.cookies?.token;
//   let user = null;

//   if (token) {
//     user = verifyToken(token);
//       const response = await fetch(
//           `http://localhost:3000/api/users/${user.username}/todo`,
//           {
//               method: "GET",
//               headers: {
//                   "Content-Type": "application/json",
//                   // Send the token to the API for verification
//                   Authorization: `Bearer ${token}`,
//               },
//           },
//       );

//       let todos = await response.json();
//       console.log(todos);

//       res.render("dashboard", {
//           pageTitle: "Dashboard",
//           user: user,
//           todo: todos.data,
//           token : token
//       });
//   };
//   }


  
// const loginController = (req, res) => {
//   const token = req.cookies?.token;
//   let user = null;

//   if (token) {
//     user = verifyToken(token);
//   }

//   res.render("layout", {
//     pageTitle: "Login",
//     view: "auth",
//     mode: "login",
//     user: user,
//   });
// };

// const signupController = (req, res) => {
//   const token = req.cookies?.token;
//   let user = null;

//   if (token) {
//     user = verifyToken(token);
//   }

//   res.render("layout", {
//     pageTitle: "Signup",
//     view: "auth",
//     mode: "signup",
//     user: user,
//   });
// };

const unexpectedRouteController = (req, res) => {
  res.status(404).json({
    isStatus: false,
    msg: "Route not found",
    data: null,
  });
};


module.exports = {
  unexpectedRouteController,
};
