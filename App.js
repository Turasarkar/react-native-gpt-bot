import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";

const api_key = "5439cd1befmshad189a88a836065p1be55fjsnaceca21d2065";

export default function App() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const options = {
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "x-rapidapi-key": api_key,
    },
  };

  const getResponse = async () => {
    if (msg == null || msg == "") {
      return;
    }
    const new_msg = { role: "user", content: msg };
    setMessages([...messages, new_msg]);
    setMsg("");
  };

  const getApiResponse = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://chatgpt-42.p.rapidapi.com/gpt4",
        { messages: messages, web_access: false },
        options
      );

      setMessages([...messages, { role: "gpt", content: res?.data?.result }]);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(messages.length);
    if (messages.length > 0) {
      console.log(messages[messages.length - 1]);

      const last_msg = messages[messages.length - 1];
      if (last_msg?.role == "user") {
        console.log("last message is from user");
        getApiResponse();
      } else {
        console.log("last message is from bot");
      }
    }

    console.log("new array : ", messages);
  }, [messages]);

  return (
    <View className="flex-1 mt-[40]">
      <StatusBar style="auto" />
      {/* Main Design Starts from here */}
      <View className="bg-black p-3">
        <Text className="text-white text-center font-bold">GPT Bot</Text>
      </View>
      <View className="flex-1 mx-[24] relative">
        <View className="mb-[70] mt-[10]">
          <ScrollView className="flex">
            {messages?.map((message) => (
              <Text
                key={message.content}
                className="my-2 bg-indigo-500 w-fit p-2 px-4 rounded-2xl text-white max-w-[280]"
                style={{
                  alignSelf: `${
                    message.role == "user" ? "flex-end" : "flex-start"
                  }`,
                }}
              >
                {message.content}
              </Text>
            ))}
          </ScrollView>
        </View>
        <View className="absolute bottom-0">
          <View className="my-2 py-2 flex flex-row justify-between items-center gap-2">
            <TextInput
              value={msg}
              className="bg-slate-300 rounded-xl p-2 w-5/6"
              placeholder="Type Your Message Here.."
              onChangeText={(e) => {
                setMsg(e);
              }}
            />
            <TouchableOpacity
              onPress={() => getResponse()}
              className="h-[40] w-[40] bg-gray-300 rounded-full flex-row justify-center items-center"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Feather name="send" size={20} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
