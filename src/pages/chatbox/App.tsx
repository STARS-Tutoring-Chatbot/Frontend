import React from 'react';
import './App.css';

const App: React.FC = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const firstMessageText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  const codeBlockText = `/* HelloWorld.java */

public class HelloWorld
{
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}`;

  return (
    <div className="app-container">
      <div className="chat-box">
        {/* Time and Date Display */}
        <div className="time-date">{getCurrentTime()}</div>

        {}
        <div className="message">
          <div className="profile-icon"></div>
          <div className="message-content">
            <div className="user-name">John Doe</div>
            <div className="text">{firstMessageText}</div>
          </div>
        </div>

        {}
        <div className="message">
          <div className="profile-icon"></div>
          <div className="message-content">
            <div className="user-name">John Doe</div>
            <div className="code-block">{codeBlockText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
