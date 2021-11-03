import React, { useContext, useCallback, useState, useMemo } from "react";
import { Modal, Button, Spin, Radio } from "antd";

import Row from "antd/lib/row";
import Col from "antd/lib/col";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "../index.css";
import {
  LeftOutlined,
  RightOutlined,
  HomeFilled,
  createFromIconfontCN,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { GmContext } from "../Editor";
import CategoryButton from "./CategoryButton";
import ItemButton from "./ItemButton";
import { Colors, Categories } from "../Config.json";
import { useEffect } from "react";
import ListModal from "./ListModal";
import { AppTabsEnum } from "../AppUtils";

const IconFont = createFromIconfontCN({
  scriptUrl: [
    "//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js", // icon-javascript, icon-java, icon-shoppingcart (overrided)
    "//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js", // icon-shoppingcart, icon-python
  ],
});
const { confirm } = Modal;

const EditorController = (props) => {
  const { appData } = props;

  const [selectedCat, setSelectedCat] = useState(Object.keys(Categories)[0]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);
  const [charcterData, setCharcterData] = useState(null);

  //Modal
  const [selectedModalData, setSelectedModalData] = useState(null);
  const [selectedListTab, setSelectedListTab] = useState(false);
  const [isOwnedTab, setIsOwnedTab] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { gm: gameManager, setHandler } = useContext(GmContext);

  //3D
  const studioSceneHandlers = useMemo(() => {
    return {
      onLoad: () => {
        setIsLoading(false);
      },
      hello: () => {
        setIsLoading(false);
      },
    };
  }, []);

  useEffect(() => {
    if (!gameManager) return;
    setHandler(studioSceneHandlers);
    //load

    const onFinish = (result) => {
      setIsLoading(false);
      setSelectedItem(
        gameManager.studioSceneManager.charcterProps[Object.keys(Categories)[0]]
          ? gameManager.studioSceneManager.charcterProps[
            Object.keys(Categories)[0]
          ].myId
          : null
      );
      setCharcterData(result.data);
      setTotalPrice(result.totalPrice);
    };
    gameManager.studioSceneManager.loadAllCharcterData(
      appData.item_equipped,
      onFinish
    );
  }, [gameManager]);

  useEffect(() => {
    console.log("charcterData ====>> ", charcterData);
  }, [charcterData]);

  const loadItemPerId = useCallback(
    (itemId) => {
      if (!gameManager) return;
      setIsLoading(true);
      let onLoad = (result) => {
        const { data, totalPrice } = result;
        setCharcterData(data);
        setTotalPrice(totalPrice);
        setIsLoading(false);
      };
      gameManager.studioSceneManager.handleLoadItemPerId(
        selectedCat,
        itemId ? itemId : null,
        onLoad
      );
    },
    [selectedCat, gameManager]
  );

  const itemsPerCategory = useMemo(() => {
    if (selectedCat) {
      // isOwnedTab
      let selectedCatObj = appData.item_owned.find(
        (catObj) => catObj.category === selectedCat
      );
      return Object.values(Categories[selectedCat])
        .filter(
          (itemData) =>
            (isOwnedTab && selectedCatObj.items.includes(itemData.id)) ||
            (!isOwnedTab && !selectedCatObj.items.includes(itemData.id))
        )
        .map((itemData, index) => {
          return (
            <ItemButton
              key={itemData.id}
              itemData={itemData}
              selected={selectedItem === itemData.id ? true : false}
            />
          );
        });
    } else return [];
  }, [selectedCat, selectedItem, isOwnedTab]);

  const renderColors = useCallback(() => {
    return (
      <Row
        style={{
          width: "100%",
          // height: "50px",
          justifyContent: "center",
          alignItems: "center",
          // marginTop: "-90px",
        }}
      >
        {Object.values(Colors).map((color, index) => {
          return (
            <Button
              key={index}
              disabled={!Boolean(selectedItem)}
              style={{
                visibility: "visible",
                margin: "8px",
                backgroundColor: color.hex,
                border:
                  selectedColor === color.id
                    ? "2.5px solid rgb(0 116 255)"
                    : "1px solid #898e94",
              }}
              onClick={() => {
                let isSelected = selectedColor === color.id;
                gameManager.studioSceneManager.handleChangeCatColor(
                  selectedCat,
                  isSelected ? null : color.hex
                );
                setSelectedColor(isSelected ? null : color.id);
              }}
              type="default"
              shape="circle"
              size="large"
            ></Button>
          );
        })}
      </Row>
    );
  }, [selectedCat, selectedColor, selectedItem, gameManager]);

  function showConfirm() {
    confirm({
      title: "購入しますか？",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: "はい",
      closable: true,
      cancelText: "キャンセル",
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  const handleOnModalOpen = useCallback(
    (selectedTab) => {
      setSelectedModalData(() => {
        if (selectedTab === AppTabsEnum.ownedTab) return appData.item_owned;
        else return charcterData;
      });
      setSelectedListTab(selectedTab);
      setIsOwnedTab(true);
    },
    [charcterData]
  );

  return (
    <>
      <Row
        style={{
          position: "fixed",
          width: "100%",
          bottom: 0,
          height: "100%",
          pointerEvents: "none",
        }}
        type="flex"
      >
        <Button
          type="primary"
          icon={<HomeFilled />}
          shape="circle"
          size="large"
          style={{
            position: "absolute",
            width: "75px",
            height: "75px",
            margin: "15px",
            pointerEvents: "all",
          }}
          onClick={() => { }}
        ></Button>
        <div
          style={{
            position: "absolute",
            pointerEvents: "all",
            left: "8%",
            top: "6%",
            marginLeft: "30%"
            // marginTop: "15vh",
          }}
        >
          <Button
            type={isOwnedTab ? "primary" : "default"}
            onClick={() => {
              setIsOwnedTab(true);
              //remove 3d items
              gameManager.studioSceneManager.clearCharcterData();
            }}
          >
            物入れ
          </Button>
          <Button
            type={!isOwnedTab ? "primary" : "default"}
            onClick={() => {
              setIsLoading(true);
              setIsOwnedTab(false);
              //load 3d items
              gameManager.studioSceneManager.clearCharcterData();

              const onFinish = (result) => {
                setIsLoading(false);
                setSelectedItem(
                  gameManager.studioSceneManager.charcterProps[
                    Object.keys(Categories)[0]
                  ]
                    ? gameManager.studioSceneManager.charcterProps[
                      Object.keys(Categories)[0]
                    ].myId
                    : null
                );
                setCharcterData(result.data);
                setTotalPrice(result.totalPrice);
              };
              gameManager.studioSceneManager.loadAllCharcterData(
                appData.item_equipped,
                onFinish
              );
            }}
          >
            お店
          </Button>
        </div>

        <Col
          span={24}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Row
            justify="start"
            style={{
              bottom: "70%",
              position: "absolute",
              width: "100%",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                pointerEvents: "all",
                right: "8%",
              }}
            >
              <Button
                type="primary"
                icon={<IconFont type="icon-shoppingcart" />}
                shape="circle"
                size="large"
                disabled={isOwnedTab}
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "25px 10px",
                  pointerEvents: "all",
                }}
                onClick={showConfirm}
              ></Button>
              <a
                style={{
                  position: "absolute",
                  right: "40%",
                  bottom: "0",
                  color: "#000",
                }}
              >
                {isOwnedTab ? 0 : totalPrice}
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
          </Row>
          <Row
            justify="start"
            style={{
              height: "35%",
              maxHeight: "250px",
              bottom: "1%",
              position: "absolute",
              width: "100%",
              pointerEvents: "all",
            }}
          >
            <>
              <Spin spinning={isLoading}>
                <ScrollMenu
                  menuStyle={{ width: "100%", justifyContent: "center" }}
                  alignCenter={true}
                  translate={10}
                  hideArrows={true}
                  // alignOnResize={true}
                  data={Object.keys(Categories).map((category, index) => {
                    return (
                      <CategoryButton
                        key={category}
                        category={category}
                        selected={selectedCat}
                      />
                    );
                  })}
                  arrowLeft={
                    <Button
                      type="text"
                      icon={<LeftOutlined />}
                      size={"middle"}
                    />
                  }
                  arrowRight={
                    <Button
                      type="text"
                      icon={<RightOutlined />}
                      size={"middle"}
                    />
                  }
                  selected={selectedCat}
                  onSelect={(key) => {
                    setSelectedCat(key);
                    setSelectedItem(
                      gameManager.studioSceneManager.charcterProps[key]
                        ? gameManager.studioSceneManager.charcterProps[key].myId
                        : null
                    );
                  }}
                />
                {selectedCat === "hair" && renderColors()}
                <ScrollMenu
                  menuStyle={{ width: "100%", justifyContent: "center" }}
                  translate={10}
                  hideArrows={true}
                  alignCenter={true}
                  alignOnResize={true}
                  data={itemsPerCategory}
                  arrowLeft={
                    <Button
                      type="text"
                      icon={<LeftOutlined />}
                      size={"middle"}
                    />
                  }
                  arrowRight={
                    <Button
                      type="text"
                      icon={<RightOutlined />}
                      size={"middle"}
                    />
                  }
                  selected={selectedItem}
                  onSelect={(key) => {
                    let newValue = key === selectedItem ? undefined : key;
                    loadItemPerId(newValue);
                    setSelectedItem(newValue);
                    if (selectedCat === "hair") setSelectedColor(null);
                  }}
                />
              </Spin>
            </>

            {/* </Col> */}
          </Row>
        </Col>
      </Row>
      {/* <ListModal
        isMenuVisible={isOwnedTab}
        selectedListTab={selectedListTab}
        selectedModalData={selectedModalData}
        setIsMenuVisible={setIsOwnedTab}
      /> */}
    </>
  );
};
export default EditorController;
