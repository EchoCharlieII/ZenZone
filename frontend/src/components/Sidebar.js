import { useState, useEffect } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
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

export default function Sidebar({ onLocationsSelected, setMapData }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showGemItems, setShowGemItems] = useState(false);

  // For the Starting Location
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // For the Destination Location
  const [valueDestination, setValueDestination] = useState("");
  const [suggestionsDestination, setSuggestionsDestination] = useState([]);

  // For the modeSelectMenu
  const [mode, setMode] = useState("");
  const handleSelectionChange = (newValue) => {
    setMode(newValue);
  };

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);

  const onSuggestionSelected = (event, { suggestion }) => {
    setStartLocation(suggestion.latlng);
  };

  const onSuggestionSelectedDestination = (event, { suggestion }) => {
    setEndLocation(suggestion.latlng);
  };

  // Restrict location suggestions to New York.
  const fetch = ({ value }) => {
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
        setSuggestions(
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
  
  const inputProps = {
    placeholder: "Search a location...",
    value,
    onChange: (_, { newValue }) => {
      setValue(newValue);
    },
  };

  const inputPropsDestination = {
    placeholder: "Search a destination...",
    value: valueDestination,
    onChange: (_, { newValue }) => {
      setValueDestination(newValue);
    },
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    fetch({ value });
  };

  const onSuggestionsFetchRequestedDestination = ({ value }) => {
    fetchDestination({ value });
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionsClearRequestedDestination = () => {
    setSuggestionsDestination([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const getSuggestionValueDestination = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  const renderSuggestionDestination = (suggestion) => (
    <div>{suggestion.name}</div>
  );

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) {
      setShowDateSelector(false);
      setShowGemItems(false);
    }
  };

  const toggleDateSelector = () => {
    setShowDateSelector(!showDateSelector);
  };

  const toggleGemItems = () => {
    setShowGemItems(!showGemItems);
  };

  // useEffect(() => {
  //   if (startLocation && endLocation) {
  //     // Call the function that highlights the route on the map
  //     onLocationsSelected(startLocation, endLocation);
  //   }
  // }, [startLocation, endLocation, onLocationsSelected]);

  return (
    <div id="app">
      <ProSidebar
        className="pro-sidebar"
        collapsed={!isSidebarOpen}
        width={isSidebarOpen ? "380px" : "80px"}
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
              toggleDateSelector();
            }}
            icon={<RouteOutlinedIcon />}
          >
            Route Planner
          </MenuItem>

          {showDateSelector && (
            <div className="autosuggest-form">
              {/* <p style={{ fontSize: "16px" }}>Select starting and ending points:</p>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={onSuggestionSelected}
                theme={{
                  suggestionsList: {
                    listStyleType: "none", // Removes bullet points
                  },
                  suggestion: {
                    fontSize: "14px", // Sets font size to 14px
                  },
                }}
              />
              <Autosuggest
                suggestions={suggestionsDestination}
                onSuggestionsFetchRequested={
                  onSuggestionsFetchRequestedDestination
                }
                onSuggestionsClearRequested={
                  onSuggestionsClearRequestedDestination
                }
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
                    fontSize: "13px", // Sets font size to 14px
                  },
                }}
              />
              <div className="date-selector-container">
                <DateSelector onDateSubmit={setMapData} />
              </div>
              <button onClick={null}>Clear</button>   */}

              <p style={{ fontSize: "16px" }}>
                Select starting and ending points:
              </p>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={onSuggestionSelected}
                theme={{
                  suggestionsList: {
                    listStyleType: "none", // Removes bullet points
                  },
                  suggestion: {
                    fontSize: "14px", // Sets font size to 14px
                  },
                }}
              />

              <Autosuggest
                suggestions={suggestionsDestination}
                onSuggestionsFetchRequested={
                  onSuggestionsFetchRequestedDestination
                }
                onSuggestionsClearRequested={
                  onSuggestionsClearRequestedDestination
                }
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
                    fontSize: "13px", // Sets font size to 14px
                  },
                }}
              />
              <br />
              <p style={{ fontSize: "16px" }}>
                Select your mode:
              </p>
              <ModeSelectMenu onSelectionChange={handleSelectionChange} />

              <div className="date-selector-container">
                <DateSelector onDateSubmit={setMapData} startLocation={startLocation} endLocation={endLocation} mode={mode}/>
              </div>


              {/*  TODO: Clear button */}
            </div>
          )}
          <MenuItem 
            onClick={() => {
              toggleGemItems();
              if (!isSidebarOpen) {
                toggleSidebar();
              }
            }} 
            icon={<DiamondOutlinedIcon />}
          >
            Hidden Gems
          </MenuItem>
          {showGemItems && (
            <>
              <MenuItem
                className="gem-menu-item"
                icon={<LocalCafeOutlinedIcon />}
              >
                Cafes for Serenity Seekers
              </MenuItem>
              <MenuItem className="gem-menu-item" icon={<MuseumOutlinedIcon />}>
                Museums for Quiet Contemplation
              </MenuItem>
              <MenuItem
                className="gem-menu-item"
                icon={<LocalLibraryOutlinedIcon />}
              >
                Libraries for Focused Study
              </MenuItem>
              <MenuItem className="gem-menu-item" icon={<ParkOutlinedIcon />}>
                Parks for Idyllic Breaks
              </MenuItem>
            </>
          )}
        </Menu>
      </ProSidebar>
    </div>
  );
}
