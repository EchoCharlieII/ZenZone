import { useState, useEffect } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import MapIcon from '@mui/icons-material/Map';
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import TransferWithinAStationOutlinedIcon from '@mui/icons-material/TransferWithinAStationOutlined';
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import MuseumOutlinedIcon from "@mui/icons-material/MuseumOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";
import DateSelector from "./RoutePlanner/DateSelector";
import logo from "./logo_text.svg";
import "../pages/Map.css";
import opencage from "opencage-api-client";
import Autosuggest from "react-autosuggest";
import ModeSelectMenu from "./RoutePlanner/ModeSelectMenu";
import ApiService from "../services/ApiService";
import CustomDatePicker from "./RoutePlanner/CustomDatePicker";
import TimeInput from "./CircularWalk/TimeInput";


export default function Sidebar({ onLocationsSelected, setMapData }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCW, setShowCW] = useState(false);

  // For the Starting Location
  const [valueOrigin, setValueOrigin] = useState("");
  const [suggestionsOrigin, setSuggestionsOrigin] = useState([]);

  // For the Destination Location
  const [valueDestination, setValueDestination] = useState("");
  const [suggestionsDestination, setSuggestionsDestination] = useState([]);

  // For the modeSelectMenu
  const [mode, setMode] = useState("balance");
  const handleSelectionChange = (newValue) => {
    setMode(newValue);
  };

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);

  const onSuggestionSelectedOrigin = (event, { suggestion }) => {
    setStartLocation(suggestion.latlng);
  };

  const onSuggestionSelectedDestination = (event, { suggestion }) => {
    setEndLocation(suggestion.latlng);
  };

  // Restrict location suggestions to New York.
  const fetchOrigin = ({ value }) => {
    opencage
      .geocode({ 
        key: "378bbab421b943cc95ef067c6295c57a", 
        q: value, 
        bounds: [
          [-74.25909, 40.477399], // southwest corner
          [-73.700272, 40.917577] // northeast corner
        ] 
      })
      .then((response) => {
        const { results } = response;
        setSuggestionsOrigin(
          results.map((result) => ({
            name: result.formatted,
            latlng: [result.geometry.lat, result.geometry.lng],
          }))
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    };
  
    const fetchDestination = ({ value }) => {
      opencage
        .geocode({ 
          key: "378bbab421b943cc95ef067c6295c57a", 
          q: value, 
          bounds: [
            [-74.25909, 40.477399], // southwest corner
            [-73.700272, 40.917577] // northeast corner
          ] 
        })
        .then((response) => {
          const { results } = response;
          setSuggestionsDestination(
            results.map((result) => ({
              name: result.formatted,
              latlng: [result.geometry.lat, result.geometry.lng],
            }))
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
  
  const inputPropsOrigin = {
    placeholder: "Search a start location...",
    value: valueOrigin,
    onChange: (_, { newValue }) => {
      setValueOrigin(newValue);
    },
  };

  const inputPropsDestination = {
    placeholder: "Search a destination...",
    value: valueDestination,
    onChange: (_, { newValue }) => {
      setValueDestination(newValue);
    },
  };

  const onSuggestionsFetchRequestedOrigin = ({ value }) => {
    fetchOrigin({ value });
  };

  const onSuggestionsFetchRequestedDestination = ({ value }) => {
    fetchDestination({ value });
  };

  const onSuggestionsClearRequestedOrigin = () => {
    setSuggestionsOrigin([]);
  };

  const onSuggestionsClearRequestedDestination = () => {
    setSuggestionsDestination([]);
  };

  const getSuggestionValueOrigin = (suggestion) => suggestion.name;

  const getSuggestionValueDestination = (suggestion) => suggestion.name;

  const renderSuggestionOrigin = (suggestion) => <div>{suggestion.name}</div>;

  const renderSuggestionDestination = (suggestion) => (<div>{suggestion.name}</div>);





// For circular walk feature
const [circularWalkDate, setCircularWalkDate] = useState(new Date());
const [circularWalkLocation, setCircularWalkLocation] = useState(null);
const [circularWalkTime, setCircularWalkTime] = useState(null);

const [cwLength, setCwLength] = useState(null);
const [cwTime, setCwTime] = useState(null);

const [valueCW, setValueCW] = useState("");
const [suggestionsCW, setSuggestionsCW] = useState([]);

const onSuggestionSelectedCW = (event, { suggestion }) => {
  setCircularWalkLocation(suggestion.latlng);
};

const fetchCW = ({ value }) => {
  opencage
    .geocode({ 
      key: "378bbab421b943cc95ef067c6295c57a", 
      q: value, 
      bounds: [
        [-74.25909, 40.477399], // southwest corner
        [-73.700272, 40.917577] // northeast corner
      ] 
    })
    .then((response) => {
      const { results } = response;
      setSuggestionsCW(
        results.map((result) => ({
          name: result.formatted,
          latlng: [result.geometry.lat, result.geometry.lng],
        }))
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  const inputPropsCW = {
    placeholder: "Search a location...",
    value: valueCW,
    onChange: (_, { newValue }) => {
      setValueCW(newValue);
    },
  };

  const onSuggestionsFetchRequestedCW = ({ value }) => {
    fetchCW({ value });
  };

  const onSuggestionsClearRequestedCW = () => {
    setSuggestionsCW([]);
  };

  const getSuggestionValueCW = (suggestion) => suggestion.name;

  const renderSuggestionCW = (suggestion) => <div>{suggestion.name}</div>;

  const handleCWDateChange = (date) => {
    setCircularWalkDate(date);
  };

  const handleTimeChange = (value) => {
    setCircularWalkTime(value);
  };

function grapDataFromApi() {

  ApiService.circularWalking(circularWalkDate, circularWalkLocation, circularWalkTime)
  .then((response) => {
    setMapData(response.path);
    setCwLength(response.distance);
    setCwTime(response.time);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}
// For circular walk feature







  const toggleSidebar = () => {
    if (isSidebarOpen) {
      setShowDateSelector(false);
      setShowCW(false);
      setShowHeatmap(false);
    }
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
  };

  const toggleDateSelector = () => {
    setShowDateSelector(!showDateSelector);
  };

  const toggleCW = () => {
    setShowCW(!showCW);
  };

  // useEffect(() => {
  //   if (startLocation && endLocation) {
  //     // Call the function that highlights the route on the map
  //     onLocationsSelected(startLocation, endLocation);
  //   }
  // }, [startLocation, endLocation, onLocationsSelected]);

  const useViewportWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
  }

  const viewportWidth = useViewportWidth();

  const determineWidth = () => {
    if (viewportWidth <= 720) {
        return isSidebarOpen ? "100vw" : "80px";
    } else {
        return isSidebarOpen ? "380px" : "80px";
    }
};

  return (
    <div id="app">
      <ProSidebar
        className="pro-sidebar"
        collapsed={!isSidebarOpen}
        width={determineWidth()}
      >
        <Menu>
          <MenuItem onClick={toggleSidebar} icon={<MenuOutlinedIcon />}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "150px", marginTop: "5px" }}
            />
          </MenuItem>

          <MenuItem
            onClick={() => {
              if (!isSidebarOpen) toggleSidebar();
              toggleHeatmap();
            }}
            icon={<MapIcon />}
          >
            Heatmap
          </MenuItem>

          {showHeatmap && (
            <div class="dateHeatmap">
                <DateSelector onDateSubmit={setMapData} heatmap={true}/>

            </div>
          )}

          <MenuItem
            onClick={() => {
              if (!isSidebarOpen) toggleSidebar();
              toggleDateSelector();
            }}
            icon={<RouteOutlinedIcon />}
          >
            Route Planner
          </MenuItem>

          {showDateSelector && (
            <div className="autosuggest-form">

              <p style={{ fontSize: "16px" }}>
                Select start and destination:
              </p>

              <Autosuggest
                suggestions={suggestionsOrigin}
                onSuggestionsFetchRequested={onSuggestionsFetchRequestedOrigin}
                onSuggestionsClearRequested={onSuggestionsClearRequestedOrigin}
                getSuggestionValue={getSuggestionValueOrigin}
                renderSuggestion={renderSuggestionOrigin}
                inputProps={inputPropsOrigin}
                onSuggestionSelected={onSuggestionSelectedOrigin}
                theme={{
                  suggestionsList: {
                    listStyleType: "none", // Removes bullet points
                    marginLeft: "-35px",
                  },
                  suggestion: {
                    fontSize: "14px", // Sets font size to 14px
                  },
                }}
              />

              <Autosuggest
                suggestions={suggestionsDestination}
                onSuggestionsFetchRequested={onSuggestionsFetchRequestedDestination}
                onSuggestionsClearRequested={onSuggestionsClearRequestedDestination}
                getSuggestionValue={getSuggestionValueDestination}
                renderSuggestion={renderSuggestionDestination}
                inputProps={inputPropsDestination}
                onSuggestionSelected={onSuggestionSelectedDestination}
                theme={{
                  suggestionsList: {
                    listStyleType: "none", // Removes bullet points
                    marginLeft: "-35px",
                  },
                  suggestion: {
                    fontSize: "14px", // Sets font size to 14px
                  },
                }}
              />
              <br />
              <p style={{ fontSize: "16px" }}>
                Select your mode:
              </p>
              <ModeSelectMenu onSelectionChange={handleSelectionChange} />

              <div className="date-selector-container">
                <DateSelector onDateSubmit={setMapData} startLocation={startLocation} endLocation={endLocation} mode={mode} heatmap={false}/>
              </div>

            </div>
          )}

          
          <MenuItem 
            onClick={() => {
              toggleCW();
              if (!isSidebarOpen) {
                toggleSidebar();
              }
            }} 
            icon={<TransferWithinAStationOutlinedIcon />}
          >
            Circular Walking
          </MenuItem>
          
          {showCW && (
              <div className="circular-walking">

              <p style={{ fontSize: "16px" }}>
                Select your current location:
              </p>

              <Autosuggest
              suggestions={suggestionsCW}
              onSuggestionsFetchRequested={onSuggestionsFetchRequestedCW}
              onSuggestionsClearRequested={onSuggestionsClearRequestedCW}
              getSuggestionValue={getSuggestionValueCW}
              renderSuggestion={renderSuggestionCW}
              inputProps={inputPropsCW}
              onSuggestionSelected={onSuggestionSelectedCW}
              theme={{
                suggestionsList: {
                  listStyleType: "none", // Removes bullet points
                  marginLeft: "-35px",
                },
                suggestion: {
                  fontSize: "14px", // Sets font size to 14px
                },
              }}
            />
            <br />
              <p style={{ fontSize: "16px" }}>
                Walk Duration (in min):
              </p>
              <TimeInput onValueChange={handleTimeChange} />
              <br />
              <CustomDatePicker onDateChange={handleCWDateChange} currentDate={circularWalkDate}/>
              <button class="sidebar-submit" onClick={grapDataFromApi}>Submit</button>
              {cwLength && (
                <div class="result-route">
                  <p style={{fontFamily: "initial", fontSize: 16}}>
                    {cwTime ? 
                      "Time: " + 
                      (cwTime["hour"] > 0 ? (cwTime["hour"] === 1 ? cwTime["hour"] + " hour " : cwTime["hour"] + " hours ") : "") +
                      (cwTime["hour"] > 0 ? "and " : "") + 
                      (cwTime["minute"] === 1 ? cwTime["minute"] + " minute" : cwTime["minute"] + " minutes")
                      : ""}
                  </p>
                  <p style={{fontFamily: "initial", fontSize: 16}}>
                    {cwLength ? 
                    "Distance: " + 
                    (cwLength["km"] === 0 ? 
                    cwLength["meter"] + " m" 
                      : cwLength["km"] + "." + String(cwLength["meter"]).charAt(0) + " km")
                    : ""}
                  </p>
                </div>
              )}
            </div>
        )}

        </Menu>
      </ProSidebar>
    </div>
  );
}
