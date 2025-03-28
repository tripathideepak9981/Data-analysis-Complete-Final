import React, { useEffect, useRef, useState } from "react";
import { Bot, Sparkles, RefreshCw } from "lucide-react";
import Typed from "typed.js";
import ResponseCard from "./ResponseCard";
import Chart from "./Charts/Chart";
import { chartGenerator } from "../../Api";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const ChatContent = ({
  chartResponse,
  chatMessages,
  setChartResponse,
  setChartType,
  chartType,
  isSliderVisible,
}) => {
  const typedElement = useRef(null);
  const aiResponseRef = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchChartData = async () => {
    if (!chatMessages[chatMessages.length - 1]?.userQuery) return;
    try {
      setChartType(null);
      setChartResponse(null);
      const chartData = await chartGenerator(
        chatMessages[chatMessages.length - 1].userQuery
      );
      setChartResponse(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    fetchChartData();
  }, [chatMessages]);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ["Welcome to Data Analysis AI,  Let's start analysis!"],
      typeSpeed: 40,
      backDelay: 1000,
      showCursor: true,
      cursorChar: "_",
    });

    return () => typed.destroy();
  }, []);

  useEffect(() => {
    const typedAI = new Typed(aiResponseRef.current, {
      strings: [
        "I'm here to analyize your data, just tell me what you're looking for!",
      ],
      typeSpeed: 50,
      showCursor: false,
    });

    return () => typedAI.destroy();
  }, []);

  return (
    <div
      className={`
        p-5
        w-full 
        max-w-6xl 
        mx-auto 
        sm:px-6 
        lg:px-8 
        bg-white
        border-rounded
        min-h-screen 
        flex 
        flex-col
        ${isSliderVisible ? "lg:max-w-[1400px]" : ""}
      `}
    >
      {/* Header Section */}
      <div
        className="
          flex 
          flex-col 
          items-center 
          text-center 
          w-full 
          mb-8 
          animate-fadeIn
        "
      >
        <div
          className="
            bg-purple-100 
            p-4 
            rounded-full 
            mb-4 
            shadow-md 
            animate-pulse-slow
          "
        >
          <Bot size={48} className="text-purple-600" />
        </div>

        <h1
          className="
            text-3xl 
            md:text-4xl 
            font-bold 
            text-gray-900 
            mb-4 
            flex 
            items-center 
            gap-2
          "
        >
          Connect Data with AI
          <Sparkles className="text-purple-500 animate-spin-slow" size={32} />
        </h1>

        <p
          className="
            text-lg 
            text-gray-600 
            max-w-2xl 
            mx-auto 
            mb-6
          "
        >
          Transform your data insights with intelligent AI-powered analysis.
        </p>

        <div
          className="
            bg-gradient-to-r 
            from-purple-50 
            to-blue-50 
            p-4 
            rounded-xl 
            shadow-lg 
            w-full 
            max-w-xl 
            mx-auto
          "
        >
          <span
            className="
              text-2xl 
              text-blue-700 
              font-medium 
              block 
              truncate
            "
            ref={typedElement}
          ></span>
        </div>
      </div>

      {/* Chat and Chart Container */}
      <div
        ref={chatContainerRef}
        className="
           flex-grow
          bg-gray-50 
          rounded-xl 
          shadow-inner 
          p-4 
          sm:p-6 
          space-y-6 
          overflow-y-auto
        "
      >
        <div className="flex flex-col justify-start mt-5">
          <div className="flex flex-col max-w-6xl space-y-6">
            <div className="flex items-center space-x-4">
              <SmartToyIcon className="text-4xl text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                AI Response :{" "}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border border-gray-300 space-y-4 max-w-3xl">
              <h2
                className="text-2xl font-semibold text-blue-700"
                ref={aiResponseRef}
              ></h2>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className="
            space-y-5 
            w-full 
            max-w-5xl 
            mx-auto
          "
        >
          {chatMessages &&
            chatMessages.map((chat, index) => (
              <div
                key={index}
                className="
                transition-all 
                duration-300 
                hover:scale-[1.01]
              "
              >
                <ResponseCard response={chat} />
              </div>
            ))}
        </div>

        {/* Chart Section */}
        {chartResponse && chartType && (
          <div
            className="
              w-full 
              max-w-4xl 
              mx-auto 
              bg-white 
              rounded-xl 
              shadow-lg 
              p-4 
              sm:p-6 
              animate-fadeIn
            "
          >
            <div
              className="
                flex 
                items-center 
                justify-between 
                mb-4
              "
            >
              <h2
                className="
                  text-xl 
                  font-semibold 
                  text-gray-800 
                  flex 
                  items-center 
                  gap-2
                "
              >
                <RefreshCw
                  className="text-purple-500 animate-spin-slow"
                  size={20}
                />
                Data Visualization
              </h2>
            </div>
            <Chart
              key={chartType + JSON.stringify(chartResponse)}
              chartResponse={chartResponse}
              chartType={chartType}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContent;
