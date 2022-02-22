import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';

export default class SideMenu extends React.Component {

    state = {
        open: false,
        menu: "home",
        darkMode: true,
        markers: true,
        lines: true,
        accent: '#76ff8d',
    }

    handleToggle = () => {
        this.setState({open: !this.state.open});
    }

    handleClick = (event) => {
      this.setState({menu: event.target.id});
    }

    handleCheck = (event) => {
      this.setState({[event.target.id]: event.target.checked});
    }

    handleColor = (event) => {
      this.setState({accent: event.target.value});
    }

  render() {
    let display;
    if(this.state.menu === "home") {
      display = 
          <div id='settingHome'>
            <p className='menuText' onClick={this.props.reset}>Reset Map</p>
            <p className='menuText' id="settings" onClick={this.handleClick}>Settings</p>
            <p className='menuText' id="manage" onClick={this.handleClick}>Manage Logs</p>
            <p className='menuText' id="about" onClick={this.handleClick}>About</p>
          </div>;
    } else if (this.state.menu === "settings") {
      display =
      <div>
        <p className='menuText' id="home" onClick={this.handleClick}>Back</p>
        <div>
          <p>Show Markers:</p>
          <input type="checkbox" id='markers' checked={this.state.markers} onChange={this.handleCheck} />

          <p>Show Line:</p>
          <input type="checkbox" id='lines' checked={this.state.lines} onChange={this.handleCheck} />

          <p>Dark Mode:</p>
          <input type="checkbox" id='darkMode' checked={this.state.darkMode} onChange={this.handleCheck} />

          <p>Accent:</p>
          <input type="color" id='accentColor' value={this.state.accent} onChange={this.handleColor} />
        </div>
      </div>;
    } else if (this.state.menu === "manage") {
      display =
      <div>
        <p className='menuText' id="home" onClick={this.handleClick}>Back</p>

        <div className='menuFlexBtns'>
          <button>Upload</button>
          <button>Download</button>
          <button>Delete</button>
        </div>
      </div>;
    } else if (this.state.menu === "about") {
      display =
      <div>
        <p className='menuText' id="home" onClick={this.handleClick}>Back</p>
        <p>This is a project I made to view logs generated from the VPT. I created it using ReactJS and the Google Maps API. It is my first website project so there are many improvements to be made</p>
      </div>;
    } else {
      display =
      <div>
        broken...
      </div>;
    }

    return (
    <div>
        <AiOutlineMenu id='menuBtn' className={this.state.open ? "show" : "hide"} onClick={this.handleToggle} />
        <div id='sideMenu' className={this.state.open ? "show" : "hide"} onMouseLeave={() => this.setState({open: false})}>
          {display}
        </div>
    </div>
    );
  }
}
