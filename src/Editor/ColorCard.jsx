import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import "../index.css";

const selectedText = {
  color: "green",
  fontWeight: "bold",
};
const unSelectedText = { marginBottom: "20px" };

const ColorCard = (porps) => {
  const { color, isSelected, onColorSelect } = porps;

  const { name, code } = color;

  return (
    <Row justify="center">
      <div
        className="btn-third"
        style={{
          backgroundColor: code,
          width: "90%",
          height: "40px",
          borderRadius: "30px",
          marginBottom: "5px",
          cursor: "pointer",
          border: isSelected ? "3px solid green" : "2px solid gray",
          boxShadow: isSelected
            ? "0 1px 0 #000, 0 5px 0 green, 0 6px 6px rgb(0 0 0 / 60%)"
            : "0 1px 0 #666, 0 5px 0 #444, 0 6px 6px rgba(0 0 0 / 60%)",
        }}
        onClick={() => {
          onColorSelect(color);
        }}
      ></div>

      <Row style={{ marginBottom: "5px" }}>
        <Col style={isSelected ? selectedText : unSelectedText}>{name}</Col>
      </Row>
    </Row>
  );
};
export default ColorCard;
