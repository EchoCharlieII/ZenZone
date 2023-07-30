import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import DateSelector from "./DateSelector/DateSelector";
import { useState } from "react";
import logo from './logo_text.svg';
import '../pages/Map.css';

function Sidebar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showDateSelector, setShowDateSelector] = useState(false);
  
    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
      if (isSidebarOpen) {   // If the sidebar is currently open
        setShowDateSelector(false);   // Hide the date selector
      }
    };
  
    const toggleDateSelector = () => {
      setShowDateSelector(!showDateSelector);
    };
  
    return (
      <div id="app">
        <ProSidebar 
          className="pro-sidebar" 
          collapsed={!isSidebarOpen} 
          width={isSidebarOpen ? '310px' : '80px'}
        >
          <Menu>
            <MenuItem
              icon={<MenuOutlinedIcon />}
              onClick={toggleSidebar}
            >
              <img src={logo} alt="Logo" style={{ width: '150px', marginTop: '5px' }}/>
            </MenuItem>
            <MenuItem onClick={isSidebarOpen ? toggleDateSelector : undefined} icon={<RouteOutlinedIcon />}>
              Route Planner
            </MenuItem>
            {showDateSelector && 
              <div className="date-selector-container">
                <DateSelector />
              </div>
            }
            <MenuItem icon={<DiamondOutlinedIcon />}>Hidden Gems</MenuItem>
          </Menu>
        </ProSidebar>
      </div>
    );
  }
  
  export default Sidebar;