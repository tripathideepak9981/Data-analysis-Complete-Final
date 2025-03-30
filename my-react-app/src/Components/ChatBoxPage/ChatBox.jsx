import React, { useRef, useState, useEffect } from "react";
import ExcelDropBox from "./ExcelDropBox/ExcelDropBox";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { TextareaAutosize } from "@mui/base";

import ChatContent from "./ChatContent";

import PopupForm from "./PopupForm/PopupForm";

import Dropdown from "./Dropdowns/Dropdown";

import { exceuteQuery } from "../../Api";

import { Menu, MenuItem, Button } from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";

import PieChartIcon from "@mui/icons-material/PieChart";

import InsightsIcon from "@mui/icons-material/Insights";

import BarChartIcon from "@mui/icons-material/BarChart";

import DbSlider from "./DbSlider/DbSlider";

const ChatBox = () => {
  const [query, setQuery] = useState("");

  const [isSliderVisible, setIsSliderVisible] = useState(true);

  const chatContainerRef = useRef(null);

  const [DbResponse, setDbResponse] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);

  const [selectedDataSource, setSelectedDataSource] = useState(
    localStorage.getItem("selectedDataSource") || "File Upload (Excel/CSV)"
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [chartResponse, setChartResponse] = useState();

  const [chartType, setChartType] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const openDropdown = (event) => setAnchorEl(event.currentTarget);

  const closeDropdown = () => setAnchorEl(null);

  useEffect(() => {
    localStorage.setItem("selectedDataSource", selectedDataSource);
  }, [selectedDataSource]);

  const handleDataSourceChange = (newDataSource) => {
    setSelectedDataSource(newDataSource);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const DataSourceDropDown = () => {
    return (
      <Dropdown
        options={["File Upload (Excel/CSV)", "Connect Personal database"]}
        onSelect={handleDataSourceChange}
        defaultValue={selectedDataSource}
      />
    );
  };

  const UploadedTablesDropDown = () => {
    return (
      <Dropdown
        options={uploadedFiles}
        label={"Selected Tables"}
        defaultValue={"Loaded Tables"}
      />
    );
  };

  const SelectOperationDropdown = () => {
    return (
      <Dropdown
        options={["Data Analysis", "Data Transformation"]}
        label="Select Operation"
      />
    );
  };

  const sendMessage = async () => {
    if (!query.trim()) return;

    const newMessage = { userQuery: query, aiResponse: "..." };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    setQuery("");

    try {
      const response = await exceuteQuery(query);
      setChatMessages((prevMessages) => {
        return prevMessages.map((message, index) =>
          index === prevMessages.length - 1
            ? { ...message, aiResponse: response }
            : message
        );
      });
    } catch (e) {
      console.error("Error fetching AI response:", e);

      setChatMessages((prevMessages) =>
        prevMessages.map((message, index) =>
          index === prevMessages.length - 1
            ? { ...message, aiResponse: "Error fetching response." }
            : message
        )
      );
    }
  };

  return (
    <div
      className=" bg-gradient-to-br from-[#240046] to-[#3b0764]  
     text-gray-900 min-h-screen w-full fixed overflow-hidden "
    >
      <div className="flex flex-col md:flex-row h-full md:h-[100vh] w-full rounded-lg item-streched">
        {/* Slider Section - Responsive Width and Behavior */}
        {isSliderVisible && (
          <div
            id="slider"
            className="w-full md:w-[40%] lg:w-[35%] xl:w-[35%] 
          max-h-[40vh] md:max-h-[98vh] 
          overflow-y-scroll
          scrollbar-hide
          px-2 md:px-3 
          py-0 md:py-0 
          bg-gradient-to-br from-[#240046] to-[#3b0764] 
          md:mt-2 
          transition-all 
          duration-300"
          >
            <h2
              className="mt-1 font-bold text-slate-200  ml-2 md:ml-3 flex  text-center items-stretch"
              style={{ fontSize: "clamp(14px, 2vw, 25px)" }}
            >
              Start Analysing Data
            </h2>

            {/* Data Source Dropdown */}
            <div className="my-2 mb-4 w-full max-w-md">
              <DataSourceDropDown onSelect={setSelectedDataSource} />
            </div>

            {/* Conditional Rendering for Data Source */}
            {selectedDataSource === "File Upload (Excel/CSV)" && (
              <ExcelDropBox />
            )}

            {selectedDataSource === "Connect Personal database" && (
              <div className="w-full px-2">
                <div className="flex flex-row gap-3 md:gap-5 w-full">
                  {[" Vertica", " MySQL"].map((db) => (
                    <button
                      key={db}
                      onClick={() => setIsPopupOpen(true)}
                      className=" flex-1 
                         px-4 
                            py-2 
                        border-2 
                       border-blue-500/30 
                        text-white 
                      bg-blue-500/20 
                      backdrop-blur-md 
                     hover:bg-purple-600/30 
                   font-semibold 
                  rounded-lg 
                     text-sm 
                     md:text-lg 
                    transition-all 
                     duration-300 
                       ease-in-out 
                        shadow-xl 
                       hover:shadow-2xl 
                           hover:border-purple-500/40 
                        focus:outline-none 
                        focus:ring-2 
                       focus:ring-blue-500/50 
                      hover:scale-[1.02]"
                    >
                      {db}
                    </button>
                  ))}
                </div>
                <DbSlider DbResponse={DbResponse} />
              </div>
            )}

            {/* Popup Form */}
            {isPopupOpen && (
              <PopupForm
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                setDbResponse={setDbResponse}
              />
            )}
          </div>
        )}

        {/* Slider Toggle - Responsive Positioning */}
        <div className="hidden md:flex ml-2 mt-3 relative w-[1.5rem] justify-center items-center">
          <div className="absolute top-0 bottom-0 w-[2px] bg-gray-500" />
          <div
            id="toggleSlider"
            className="z-10 flex items-center justify-center bg-gray-100 outline outline-gray-600 rounded-full cursor-pointer transition-all duration-300"
            onClick={() => setIsSliderVisible((prev) => !prev)}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <span className="text-gray-700 font-bold">&lt;&gt;</span>
          </div>
        </div>

        {/* Chat Box Section - Responsive Width */}
        <div
          id="chatbox"
          className={`flex flex-col justify-between 
            w-full 
        ${
          isSliderVisible
            ? "flex flex-col w-full max-w-8xl mx-auto py-2 mt-2 md:py-3 px-2 md:px-3 bg-white shadow-lg rounded-2xl border"
            : " flex flex-col w-full max-w-8xl mx-auto py-2 mt-2 md:py-3 px-2 md:px-3 bg-white shadow-lg rounded-2xl border"
        } 
        transition-all duration-300 style={{ fontSize: moderateScale(16) }}`}
        >
          {/* Chat Content - Responsive Scrolling and Padding */}
          <div className="flex-1 overflow-y-scroll scrollbar-hide  rounded-lg  relative">
            {/* More Options Dropdown */}
            <div
              className="absolute right-2 top-2 cursor-pointer p-2 rounded-full transition hover:bg-gray-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <MoreVertIcon />
            </div>

            {isDropdownOpen && (
              <div className="absolute right-8 top-8 bg-gray-100 shadow-lg rounded-md p-2 z-10">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className=" px-4 py-2 hover:bg-white-200 w-full text-left"
                >
                  Table Preview
                </button>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left "
                >
                  Other Options
                </button>
              </div>
            )}

            {/* Chat Content Component */}
            <ChatContent
              chartResponse={chartResponse}
              chartType={chartType}
              chatContainerRef={chatContainerRef}
              chatMessages={chatMessages}
              query={query}
              setChartResponse={setChartResponse}
              setChartType={setChartType}
              isSliderVisible={isSliderVisible}
            />
          </div>

          {/* Message Input Section - Responsive Layout */}
          <div
            className="flex flex-col w-full max-w-8xl mx-auto py-2 mt-2 md:py-3 px-2 md:px-3 bg-gray-50 shadow-lg 
            rounded-2xl border"
          >
            <div className="flex items-center space-x-2 md:space-x-5 w-full">
              {/* Chart Type Dropdown */}
              <div className="relative">
                <Button
                  onClick={openDropdown}
                  className="bg-gray-200 text-gray-700 rounded-lg transition-all duration-300"
                >
                  <AssessmentIcon
                    className="w-10 h-10 md:w-16 md:h-16"
                    style={{ width: "50px", height: "50px" }}
                  />
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeDropdown}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem
                    disabled={
                      chartResponse === "error" || chartResponse === null
                    }
                    onClick={() => {
                      if (chartResponse !== "error") {
                        setChartType("bar");
                        closeDropdown();
                      }
                    }}
                  >
                    <BarChartIcon className="text-blue-500 mr-2" /> Bar Chart
                  </MenuItem>
                  <MenuItem
                    disabled={
                      chartResponse === "error" || chartResponse === null
                    }
                    onClick={() => {
                      if (chartResponse !== "error") {
                        setChartType("line");
                        closeDropdown();
                      }
                    }}
                  >
                    <InsightsIcon className="text-green-500 mr-2" /> Line Chart
                  </MenuItem>
                  <MenuItem
                    disabled={
                      chartResponse === "error" ||
                      chartResponse?.multi_value === true ||
                      chartResponse === null
                    }
                    onClick={() => {
                      if (
                        chartResponse !== "error" &&
                        chartResponse?.multi_value !== true
                      ) {
                        setChartType("pie");
                        closeDropdown();
                      }
                    }}
                  >
                    <PieChartIcon className="text-pink-500 mr-2" /> Pie Chart
                  </MenuItem>
                </Menu>
              </div>

              {/* Message Input */}
              <TextareaAutosize
                minRows={1}
                maxRows={4}
                placeholder="Add data or ask any question!"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 bg-gray-50 text-gray-800 
                px-2 md:px-4 py-2 md:py-3 
                rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-blue-500 
                focus:border-blue-500 focus:outline-none 
                placeholder-gray-500 shadow-sm 
                resize-none transition-all duration-200"
              />
              <button
                onClick={sendMessage}
                className="
    w-8 h-8 md:w-12 md:h-12
    rounded-full 
    flex items-center justify-center 
    bg-gray-200
    text-black
    shadow-inner
    transition-transform duration-300 ease-in-out 
    hover:scale-110 hover:shadow-xl 
    active:scale-95 
    focus:outline-none focus:ring-2 focus:ring-blue-300
  "
              >
                <ArrowUpwardIcon className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatBox;
