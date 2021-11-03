import React from "react";
import "../index.css";

const CategoryButton = (porps) => {
  const { category, selected } = porps;

  return (
    <div
      style={{
        position: "relative",
        width: "53px",
        height: "40px",
        margin: "0 20px",
        borderRadius: "15px",
        background: `url(./Ui/items/${category}.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center center",
        backgroundColor: "#eaeaea",
        border: selected ? "3.5px solid rgb(0 116 255)" : "2px solid #898e94",
        boxSizing: "border-box",
      }}
    >
      {/* {category} */}
    </div>
  );
};
export default CategoryButton;
// <Button
//   style={{
//     width: "120px",
//     height: "60px",
//     margin: "0 20px",
//     borderRadius: "15px",
//     // background: `url(/Ui/items/${"oval"}.png)`,
//     // backgroundRepeat: "round",
//     visibility: "initial",
//   }}
//   type={selected ? "primary" : "default"}
//   size="large"
// >
//   {category}
// </Button>
