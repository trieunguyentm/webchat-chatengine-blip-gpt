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
import { toast } from "react-toastify";
import axios from "axios";

const addMember = async (username, activeChatId) => {
  const url = `https://api.chatengine.io/chats/${activeChatId}/people/`
  const data = {
    username: username
  }
  const headers = {
    'Project-ID': import.meta.env.VITE_PROJECT_ID,
    'User-Name': Cookies.get('username'),
    'User-Secret': Cookies.get('secret')
  }
  try {
    const response = await axios.post(url, data, { headers })
    if (response.data?.person) {
      toast.success("Add member succesfully", { autoClose: 2000 })
    }
  } catch (error) {
    console.log(error)
    toast.error("An error occurred while adding a member", { autoClose: 2000 })
  }
}

const removeMember = async (username, activeChatId) => {
  const url = `https://api.chatengine.io/chats/${activeChatId}/people/`
  const data = {
    username: username
  }
  const headers = {
    'Project-ID': import.meta.env.VITE_PROJECT_ID,
    'User-Name': Cookies.get('username'),
    'User-Secret': Cookies.get('secret')
  }
  try {
    const response = await axios.put(url, data, { headers })
    if (response.data?.person) {
      toast.success("Remove member succesfully", { autoClose: 2000 })
    }
  } catch (error) {
    console.log(error)
    toast.error("An error occurred while remove a member", { autoClose: 2000 })
  }
}

const Chat = () => {
  const user = Cookies.get('username');
  const secret = Cookies.get('secret');
  const linkAvatar = Cookies.get('linkAvatar');

  const chatProps = useMultiChatLogic(
    import.meta.env.VITE_PROJECT_ID,
    user,
    secret
  );
  console.log(chatProps)
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
            onInvitePersonClick={(people) => {
              if (chatProps.chat?.title.startsWith("AiChat_") && people.username !== "AiChat_") {
                toast.info("This chat room cannot be added except for AI bots", { autoClose: 2000 })
              }
              else {
                addMember(people.username, chatProps.activeChatId)
              }
            }}
            onRemovePersonClick={(people) => {
              console.log(people)
              if (chatProps.chat?.title.startsWith("AiChat_") && people.username === "AiChat_") {
                toast.info("AI bot cannot be removed from this chat")
              }
              else {
                removeMember(people.username, chatProps.activeChatId)
              }
            }}
          />
        </div>
      </>
    );
  }
};

export default Chat;
