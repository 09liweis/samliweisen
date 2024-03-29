import React,{useState} from 'react';

const Status = () => {
  const [level, setLevel] = useState(0);
  const [isCharging, setCharging] = useState(false);
  const getFormatBatteryLevel = (level) => {
    return Math.ceil(level*100)+'%';
  }
  const getBatteryStatus = () => {
    var batteryManager = navigator.getBattery;
    if (typeof batteryManager == 'undefined') {
      return;
    }
    navigator.getBattery().then(function(battery){
      var {level, charging} = battery;
      setCharging(charging);
      setLevel(getFormatBatteryLevel(level));
      battery.addEventListener('chargingchange',function() {
        var {charging} = battery;
        setCharging(charging);
      });
      battery.addEventListener('levelchange',function() {
        var {level} = battery;
        setLevel(getFormatBatteryLevel(level));
      });
    });
  }
  getBatteryStatus();
  return(
    <header id="status" className='display-flex'>
      <div className="carrie">I am Sam</div>
      <div className="flex-align-items-center display-flex">
        <div className={`battery ${isCharging?'charging':''}`}>
          {isCharging ? <span className="fa fa-bolt"></span> : null}
          <div className="battery__level">{level}</div>
        </div>
        <div className="languages">
          <span className="language">English</span>
          <span className="language">中文</span>
        </div>
      </div>
    </header>
  );
}
export default Status;