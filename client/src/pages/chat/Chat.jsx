import React from "react";
import {
  useMultiChatLogic,
  MultiChatSocket,
  MultiChatWindow,
} from "react-chat-engine-advanced";
import Header from "@/components/customerHeader/CustomerHeader";
import StandardMessageForm from "@/components/customMessageForms/StandardMessageForm";
import Ai from "@/components/customMessageForms/Ai";
import HeaderTab from "../../components/headerTab/HeaderTab";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const Chat = () => {
  const user = Cookies.get('username');
  const secret = Cookies.get('secret')
  const linkAvatar = Cookies.get('linkAvatar');

  const chatProps = useMultiChatLogic(
    import.meta.env.VITE_PROJECT_ID,
    user,
    secret
  );
  // console.log(chatProps);

  const checkLogin = (Cookies.get('isLogin') === 'true');

  if (!checkLogin) {
    return <Navigate replace to='/login' />
  }
  else {
    return (
      <>
        <div>
          <HeaderTab linkAvatar={linkAvatar} user={user} />
        </div>
        <div style={{ flexBasis: "100%" }}>
          <MultiChatSocket {...chatProps} />
          <MultiChatWindow
            {...chatProps}
            style={{ height: "100vh" }}
            renderChatHeader={(chat) => <Header chat={chat} />}
            renderMessageForm={(props) => {
              if (chatProps.chat?.title.startsWith("AiChat_")) {
                return <Ai props={props} activeChat={chatProps.chat} />;
              }
              return (
                <StandardMessageForm props={props} activeChat={chatProps.chat} />
              );
            }}
          />
        </div>
      </>
    );
  }
};

export default Chat;
