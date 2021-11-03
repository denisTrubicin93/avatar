import React, { useMemo } from "react";
import Modal from "antd/es/modal";
import Row from "antd/es/row";
import Col from "antd/es/col";
import { Typography, Input, Button, Select, Divider } from "antd";
import { AppTabsEnum } from "../AppUtils";

const { Text } = Typography;

function ListModal(props) {
  const {
    isMenuVisible,
    selectedListTab,
    selectedModalData,
    setIsMenuVisible,
  } = props;

  const IsOwnedTab = useMemo(() => {
    return selectedListTab === AppTabsEnum.ownedTab ? true : false;
  }, [selectedListTab]);

  const handleModalConfirm = () => {};

  return (
    isMenuVisible && (
      <Modal
        okText={"Close"}
        onCancel={() => {
          setIsMenuVisible(false);
        }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button
              onClick={() => {
                setIsMenuVisible(false);
              }}
              type="primary"
            >
              {"Close"}
            </Button>
          </div>
        }
        closable={true}
        destroyOnClose
        visible={isMenuVisible}
        title={IsOwnedTab ? "Own Tab" : "Purchased Tab"}
        width={800}
        style={{ marginTop: "-1%" }}
      >
        {/* ZipCode */}

        {selectedModalData.map((catObj, index) => {
          return (
            <Row key={index} style={{ marginBottom: "0px" }}>
              <Col offset={2} span={22} style={{ marginBottom: "0px" }}>
                <Text
                  strong={true}
                  style={{ fontSize: "15px", fontWeight: "300" }}
                >
                  {catObj.category.toUpperCase()}
                </Text>
              </Col>
              {IsOwnedTab ? (
                catObj.items.length > 0 ? (
                  catObj.items.map((item, itemIndex) => {
                    return (
                      <div
                        key={itemIndex}
                        style={{ width: "100%", display: "flex" }}
                      >
                        <Col offset={3} span={12}>
                          <Text style={{ fontSize: "15px", fontWeight: "300" }}>
                            {item}
                          </Text>
                        </Col>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ width: "100%", display: "flex" }}>
                    <Col offset={3} span={12}>
                      <Text style={{ fontSize: "15px", fontWeight: "300" }}>
                        {"No Items"}
                      </Text>
                    </Col>
                  </div>
                )
              ) : (
                <div style={{ width: "100%", display: "flex" }}>
                  <Col offset={4} span={12}>
                    <Text style={{ fontSize: "15px", fontWeight: "300" }}>
                      {catObj.item ? catObj.item : "No Item Selected"}
                    </Text>
                  </Col>
                  <Col span={8}>
                    <Text style={{ fontSize: "15px", fontWeight: "300" }}>
                      {catObj.price ? `${catObj.price}$` : `${0}$`}
                    </Text>
                  </Col>
                </div>
              )}
              <Divider />
            </Row>
          );
        })}
      </Modal>
    )
  );
}
export default ListModal;
