export const changeViewpoint = (updateViewpoint) => {
  return (dispatch) => {
    dispatch({
      type: "changeViewpoint",
      viewpoint: updateViewpoint,
    })
  }
}

// export const withdrawMoney = (amount) => {
//   console.log(amount, "Lol")
//   return (dispatch) => {
//       dispatch({
//           type: "withdraw",
//           payload: amount
//       });
//   }
// }
