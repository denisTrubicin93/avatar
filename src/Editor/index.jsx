import React, {
  createRef,
  createContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import "../index.css";

//Components
import EditorController from "./EditorController";
import { AppTabsEnum, appData } from "../AppUtils";
import BabylonManager from "../BabylonManager";
//
const gmRef = createRef(null);
export const GmContext = createContext(null);
//

const Editor = () => {
  const [gameManager, setGameManager] = useState(null);
  const [selectedTab, setSeletedTab] = useState(AppTabsEnum.editorTab);


  useEffect(() => {
    const GManger = BabylonManager(gmRef.current).GManger; //Create Babylonjs Ref
    setGameManager(GManger);
  }, [setGameManager]);

  const setHandler = useCallback((newHandler)=>{
    setGameManager((GManger)=>{
    GManger.studioSceneManager.handlers = newHandler; //Hnadlers
    return GManger;
  });
  },[])

  const renderTabs = useCallback(() => {
    switch (selectedTab) {
      default:
      case AppTabsEnum.editorTab:
        return (
          <Row style={{ height: "100%" }} type="flex">
            <Col
              span={24}
              style={{
                height: "100%",
                background: "radial-gradient(at top, #fff 0%, #fff 100%) top",
              }}
            >
              <EditorController
                appData={appData}
              />
              <canvas {...{}} className="canvas" ref={gmRef} />
            </Col>
          </Row>
        );
    }
  }, [selectedTab]);

  return (
    <GmContext.Provider value={{gm:gameManager, setHandler: setHandler}}>{renderTabs()}</GmContext.Provider>
  );
};
export default Editor;

// On Windows Shift + Alt + F.
// On Mac Shift + Option + F.
