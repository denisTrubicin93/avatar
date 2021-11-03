import React from "react";
import { Typography, Divider } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import "../index.css";
import * as SockColors from "../ColorsConfig.json";
import ColorCard from "./ColorCard";

const { Title } = Typography;

const ColorsMenu = (porps) => {
  const { selectedColorName, handleColorSelect } = porps;

  return (
    <>
      {Object.values(SockColors.default).map((category, index) => {
        return (
          <div key={index}>
            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <Title level={4}>{"Category " + index}</Title>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              {category.map((color, index) => (
                <Col key={index} span={8}>
                  <ColorCard
                    color={color}
                    isSelected={color.name === selectedColorName ? true : false}
                    onColorSelect={handleColorSelect}
                  />
                </Col>
              ))}
            </Row>
            <Divider />
          </div>
        );
      })}
    </>
  );
};
export default ColorsMenu;
