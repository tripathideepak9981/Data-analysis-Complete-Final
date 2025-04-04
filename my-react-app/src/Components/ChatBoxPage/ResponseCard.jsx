import React, { useState, useEffect, useRef } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { motion } from "framer-motion";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Bot } from "lucide-react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Typed from "typed.js";

const ResponseCard = ({ response }) => {
  const [showSQL, setShowSQL] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animatedText, setAnimatedText] = useState("");
  const [showDots, setShowDots] = useState(false);
  const responseEndRef = useRef(null);
  const typedElement = useRef(null);

  useEffect(() => {
    if (!response?.aiResponse) return;
    setLoading(true);
    setAnimatedText("");
    setShowDots(false);

    const hasResponse =
      response.aiResponse.summary ||
      response.aiResponse.sql_query ||
      (Array.isArray(response.aiResponse.optimizations) &&
        response.aiResponse.optimizations.length > 0) ||
      (Array.isArray(response.aiResponse.result) &&
        response.aiResponse.result.length > 0) ||
      (Array.isArray(response.aiResponse.analysis) &&
        response.aiResponse.analysis.length > 0);

    if (!hasResponse) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      if (typeof response.aiResponse.summary === "string") {
        setShowDots(false); // hide dots when summary starts
        let index = 0;
        const summaryText = response.aiResponse.summary;
        const interval = setInterval(() => {
          setAnimatedText((prev) => prev + summaryText[index]);
          index++;
          if (index >= summaryText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
      }
    }, 1500);
  }, [response]);

  function formatSummary(summaryObj) {
    if (!summaryObj) return null;

    let summary = summaryObj.trim();
    const paragraphs = summary.split("\n").filter((para) => para.trim() !== "");

    return (
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4 text-gray-800">
        {paragraphs.map((para, index) => {
          if (/^# /.test(para)) {
            return (
              <h2
                key={index}
                className="text-3xl font-bold text-blue-700 border-b pb-1"
              >
                {para.replace(/^# /, "")}
              </h2>
            );
          } else if (/^## /.test(para)) {
            return (
              <h3
                key={index}
                className="text-2xl font-semibold text-blue-600 mt-4"
              >
                {para.replace(/^## /, "")}
              </h3>
            );
          } else if (/^\*\*(.*?)\*\*/.test(para)) {
            return (
              <h4 key={index} className="text-xl font-medium text-blue-500">
                {para.replace(/\*\*/g, "")}
              </h4>
            );
          }

          para = para.replace(/\*\*/g, "");

          if (/^\*\s/.test(para)) {
            return (
              <ul
                key={index}
                className="list-disc ml-6 text-base text-gray-700"
              >
                <li
                  dangerouslySetInnerHTML={{
                    __html: formatText(para.replace(/^\*\s/, "")),
                  }}
                />
              </ul>
            );
          }

          return (
            <p
              key={index}
              className="text-base leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: formatText(para) }}
            ></p>
          );
        })}
      </div>
    );
  }

  function formatText(text) {
    return text.replace(/(\d+(\.\d+)?%)/g, "$1");
  }
  useEffect(() => {
    const hasStartedRendering =
      response?.aiResponse?.summary ||
      response?.aiResponse?.sql_query ||
      response?.aiResponse?.result ||
      response?.aiResponse?.analysis ||
      response?.aiResponse?.optimizations;

    if (hasStartedRendering) {
      setShowDots(false); // stops dots as soon as real content starts rendering
    }
  }, [
    response?.aiResponse?.summary,
    response?.aiResponse?.sql_query,
    response?.aiResponse?.result,
    response?.aiResponse?.analysis,
    response?.aiResponse?.optimizations,
  ]);

  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response?.aiResponse?.sql_query, response?.aiResponse?.result]);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ["AI Response"],
      typeSpeed: 150,
      backDelay: 1000,
      showCursor: false,
      onComplete: () => setShowDots(true),
    });

    return () => typed.destroy();
  }, []);

  return (
    <div className="z-10 w-full space-y-6 overflow-y-auto bg-gray-50">
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between bg-blue-100 text-gray-900 shadow-md px-4 rounded-2xl space-x-3"
        >
          <p className="text-md font-semibold text-gray-900 px-2 max-w-md break-words py-1">
            {response?.userQuery || "N/A"}
          </p>
          <div className="bg-white rounded-full p-1">
            <AccountCircleIcon style={{ fontSize: 30, color: "#0fbbf9" }} />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col justify-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col max-w-6xl space-y-6"
        >
          <div className="flex items-center space-x-2">
            <Bot className="text-md text-green-600" />
            <span
              className="text-md font-bold text-gray-900 flex items-center"
              ref={typedElement}
            ></span>
            {showDots && (
              <div className="flex space-x-1 ml-1 font-extrabold text-xl">
                <span
                  className="animate-bounce-slow text-gray-800"
                  style={{ animationDelay: "0s" }}
                >
                  .
                </span>
                <span
                  className="animate-bounce-slow text-gray-800"
                  style={{ animationDelay: "0.15s" }}
                >
                  .
                </span>
                <span
                  className="animate-bounce-slow text-gray-800"
                  style={{ animationDelay: "0.3s" }}
                >
                  .
                </span>
              </div>
            )}
          </div>
          <>
            {response?.aiResponse?.result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white p-3 rounded-xl shadow border border-gray-300 space-y-2"
              >
                <h2 className="text-xl font-bold text-blue-800">Result:</h2>

                {Array.isArray(response.aiResponse.result) &&
                typeof response.aiResponse.result[0] === "object" ? (
                  <div className="max-h-[200px] max-w-full overflow-auto border rounded">
                    <table className="min-w-full text-left border-collapse text-sm text-gray-800">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          {Object.keys(response.aiResponse.result[0]).map(
                            (key, index) => (
                              <th
                                key={index}
                                className="px-4 py-2 border border-blue-700 whitespace-nowrap font-medium"
                              >
                                {key}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {response.aiResponse.result.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className="odd:bg-white even:bg-gray-50"
                          >
                            {Object.values(row).map((value, colIndex) => (
                              <td
                                key={colIndex}
                                className="px-4 py-2 border border-gray-300 whitespace-nowrap"
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-base text-gray-700">
                    {response.aiResponse.result}
                  </p>
                )}
              </motion.div>
            )}
            {response?.aiResponse?.sql_query && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white p-3 rounded-xl shadow border border-gray-300 space-y-2"
              >
                <div className="flex items-center justify-between cursor-pointer">
                  <h2 className="text-xl font-bold text-blue-800 flex items-center space-x-2">
                    <BarChartIcon className="text-blue-600" />
                    <span>SQL Query:</span>
                  </h2>
                  <button
                    onClick={() => setShowSQL((prev) => !prev)}
                    className="bg-gray-200 text-gray-800 rounded-full p-1 h-[5vh] hover:bg-gray-300 transition"
                  >
                    <ArrowDropDownIcon
                      style={{
                        transform: showSQL ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        fontSize: 30,
                      }}
                    />
                  </button>
                </div>

                {showSQL && (
                  <pre className="bg-gray-100 mt-3 rounded p-2 text-gray-800 text-base whitespace-pre-wrap border border-gray-300 overflow-x-auto">
                    {response.aiResponse.sql_query}
                  </pre>
                )}
              </motion.div>
            )}

            {response?.aiResponse?.analysis && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
              >
                <h2 className="text-xl font-bold text-blue-800">Analysis:</h2>
                {formatSummary(response.aiResponse.analysis)}
              </motion.div>
            )}

            {response?.aiResponse?.optimizations &&
              response.aiResponse.optimizations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-white p-2 rounded-xl shadow border border-gray-300 space-y-2"
                >
                  <h2 className="text-xl font-bold text-blue-800">
                    Optimizations:
                  </h2>
                  <ul className="list-disc ml-6 text-gray-700 space-y-2">
                    {response.aiResponse.optimizations.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            {response?.aiResponse?.summary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
              >
                <h2 className="text-xl font-bold text-blue-800">Summary:</h2>
                {formatSummary(response.aiResponse.summary)}
              </motion.div>
            )}
          </>
        </motion.div>
      </div>
      <div ref={responseEndRef}></div>
    </div>
  );
};

export default ResponseCard;
