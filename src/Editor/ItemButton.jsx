import React, { useEffect } from "react";
import "../index.css";

const ItemButton = (porps) => {
  const { itemData, selected } = porps;
  useEffect(() => {
    console.log(itemData)
  }, [])
  return (
    <>
      <div
        style={{
          position: "relative",
          width: "84px",
          height: "74px",
          background: `url(./Ui/items/${itemData.id}.PNG)`,
          backgroundRepeat: "round",
          border: selected ? "2px solid rgb(0 116 255)" : "1px solid #898e94",
          boxSizing: "border-box",
          margin: "10px",
        }}
      >
        <a
          style={{
            position: "absolute",
            right: "25%",
            bottom: "0",
            color: "#000",
          }}
        >
          {itemData.price}
        </a>
        <div
          style={{
            position: "absolute",
            width: "15px",
            height: "15px",
            right: "0",
            bottom: "0",
            background: `url(./Ui/items/${"dollar.png"})`,
            backgroundRepeat: "no-repeat",
            // border: "1px solid #898e94",
            boxSizing: "border-box",
            margin: "2px 0px",
          }}
        ></div>
      </div>
    </>
  );
};
export default ItemButton;
