import React, { useEffect, useRef, useState } from "react";
import { Bot, Sparkles, RefreshCw } from "lucide-react";
import Typed from "typed.js";
import ResponseCard from "./ResponseCard";
import Chart from "./Charts/Chart";
import { chartGenerator } from "../../Api";

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
      setChartResponse("error");
      console.log(chartType);
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
      showCursor: false,
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
      fontSize: "clamp(12px, 1.5vw, 18px)",
    });

    return () => typedAI.destroy();
  }, []);

  return (
    <div
      className={`
        p-2
        w-full 
        max-w-4xl 
        sm:px-6 
        lg:px-2
        bg-white
        border-rounded
        min-h-screen 
        mx-auto
        flex 
        flex-col
        ${isSliderVisible ? "lg:max-w-[1400px]" : "lg:max-w-[1400px]"}
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
          mb-4
          animate-fadeIn
        "
        style={{ fontSize: "clamp(14px, 2vw, 22px)" }}
      >
        <div
          className="
            bg-purple-100 
            p-3
            py-2
            rounded-full 
            mb-3
            shadow-md 
            animate-pulse-slow
          "
          style={{ fontSize: "clamp(14px, 2vw, 24px)" }}
        >
          <Bot size={40} className="text-purple-600  clamp(14px, 2vw, 26px)" />
        </div>

        <h1
          className="
            text-3xl 
            md:text-4xl 
            font-bold 
            text-gray-900 
            mb-1
            flex 
            items-center 
            gap-2
          "
          style={{ fontSize: "clamp(14px, 2vw, 22px)" }}
        >
          Connect Data with AI
          <Sparkles className="text-purple-500 animate-spin-slow" size={28} />
        </h1>

        <p
          className="
            text-lg 
            text-gray-600 
            max-w-2xl 
            mx-auto 
            mb-4
          "
          style={{ fontSize: "clamp(4px, 2vw, 16px)" }}
        >
          Transform your data insights with intelligent AI-powered analysis.
        </p>

        <div
          className="
            bg-gradient-to-r 
            from-purple-50 
            to-blue-50 
            rounded-xl 
            shadow-lg 
            w-full 
            max-w-lg
          
          "
          style={{ fontSize: "clamp(14px, 2vw, 25px)" }}
        >
          <span
            className="
              text-2xl 
              text-blue-700 
              font-medium 
              block 
              truncate
            "
            style={{ fontSize: "clamp(10px, 2vw, 18px)" }}
            ref={typedElement}
          ></span>
        </div>
      </div>

      {/* Chat and Chart Container */}
      <div
        ref={chatContainerRef}
        className="
           flex-wrap
          bg-gray-50 
          rounded-xl 
          shadow-inner 
          p-4
          mt-2
          sm:p-6 
          space-y-6 
          overflow-y-auto
        "
      >
        <div className="flex flex-col justify-start">
          <div className="flex flex-col max-w-6xl">
            <div className="flex items-center space-x-3 ">
              <Bot className="text-4xl text-green-600" />
              <span
                className="text-3xl font-bold text-gray-900"
                style={{ fontSize: "clamp(10px, 2vw, 16px)" }}
              >
                AI Response :{" "}
              </span>
            </div>
            <div
              className="mt-2 bg-white py-1 px-3 rounded-xl shadow border border-gray-300 space-y-2 max-w-[40vw]"
              style={{ fontSize: "clamp(14px, 2vw, 24px)" }}
            >
              <h2
                className="text-2xl font-semibold text-blue-700"
                style={{ fontSize: "clamp(10px, 2vw, 16px)" }}
                ref={aiResponseRef}
              ></h2>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className="
            space-y-4 
            w-full 

            max-w-6xl 
            mx-auto
          "
          style={{ fontSize: "clamp(10px, 2vw, 20px)" }}
        >
          {chatMessages &&
            chatMessages.map((chat, index) => (
              <div
                key={index}
                className="
                transition-all 
                duration-300 
              "
                style={{ fontSize: "clamp(10px, 2vw, 16px)" }}
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
              p-3
              sm:p-6 
              animate-fadeIn
            "
          >
            <div
              className="
                flex 
                items-center 
                justify-between 
                mb-2
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
                style={{ fontSize: "clamp(14px, 2vw, 22px)" }}
              >
                <RefreshCw
                  className="text-purple-500 animate-spin-slow"
                  size={20}
                />
                {chatMessages[chatMessages.length - 1].userQuery}
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
