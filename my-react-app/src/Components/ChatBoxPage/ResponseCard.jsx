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
  const responseEndRef = useRef(null);
  const typedElement = useRef(null);

  useEffect(() => {
    if (!response?.aiResponse) return;
    setLoading(true);
    setAnimatedText("");

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

  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response?.aiResponse?.sql_query, response?.aiResponse?.result]);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ["AI Response : "],
      typeSpeed: 150,
      backDelay: 1000,
      showCursor: false,
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
          <div className="flex items-center space-x-3">
            <Bot className="text-md text-green-600" />
            <span
              className="text-md font-bold text-gray-900"
              ref={typedElement}
            ></span>
          </div>

          {loading ? (
            <div className="flex items-center space-x-3 text-gray-700 animate-pulse">
              <span className="w-1 h-1 bg-gray-700 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-gray-700 rounded-full animate-bounce delay-150"></span>
              <span className="w-1 h-1 bg-gray-700 rounded-full animate-bounce delay-300"></span>
              <p className="text-sm font-medium">Generating Response...</p>
            </div>
          ) : (
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
                          transform: showSQL
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
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
            </>
          )}
        </motion.div>
      </div>
      <div ref={responseEndRef}></div>
    </div>
  );
};

export default ResponseCard;
