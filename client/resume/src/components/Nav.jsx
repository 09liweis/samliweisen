import React,{useState} from 'react';
import { Link,withRouter } from 'react-router-dom';
const navs = [
  {url:'/',ch:'',tl:'home',icon:'fa fa-home'},
  {url:'/movies',ch:'影视',tl:'movies',icon:'fa fa-film'},
  {url:'/blogs',ch:'博客',tl:'blogs',icon:'fa fa-rss'},
  {url:'/videos',ch:'视频',tl:'vlog',icon:'fa fa-film'},
  {url:'/todo',ch:'计划',tl:'todos',icon:'fa fa-list-ol'},
  {url:'/comments',ch:'评论',tl:'comments',icon:'fa fa-comments'},
];

const getNavClientRect = (id) => {
  if (!id) return {highLightPosLeft:0,highLightPosWidth:0};
  const el = document.getElementById(id);
  const elData = el.getBoundingClientRect();
  let offset = 0;
  if (window.innerWidth >= 1200) {
    offset = (window.innerWidth - 1200)/2;
  }
  return {highLightPosLeft:elData.left-offset,highLightPosWidth:elData.width}
}

const getNavElementData = (navId,isClick) => {
  const {highLightPosLeft,highLightPosWidth} = getNavClientRect(navId);
  var ret = {highLightPosLeft,highLightPosWidth};
  if (isClick) {
    ret.highLightPosId = navId;
  }
  return ret;
};

const getTlWithUrl = (url)=> {
  let id;
  navs.map((nav)=>{
    if (nav.url == url) {
      id = nav.tl;
    }
  });
  return id;
}

const Nav = (props) => {
  const [activeNav, setActiveNav] = useState({highLightPosId:'',highLightPosLeft:0,highLightPosWidth:0});

  const {location} = props;
  const tl = getTlWithUrl(location.pathname);
  if (activeNav.highLightPosId == '') {
    setTimeout(()=>{
      handleNav(tl,1);
    },500);
  }
  window.addEventListener('resize', () => {
    handleNav(tl,1);
  });
  const handleNav = (id, isClick) => {
    var ret = getNavElementData(id,isClick);
    setActiveNav(ret);
  }
  const links = navs.map((nav)=> {
    let navClass = 'navItem text-color transition text-capitalize';
    if (nav.tl == tl) {
      navClass += ' active';
    }
    return (
      <Link className={navClass} id={nav.tl} key={nav.url} to={nav.url} onMouseEnter={()=>handleNav(nav.tl,0)} onClick={()=>handleNav(nav.tl,1)}>
        {/* <i className={nav.icon}></i> */}
        <span>{nav.ch}</span>
        <span>{nav.tl}</span>
      </Link>
    )}
  );
  return(
    <nav id="nav" className="bg-image-triple bg-white box-shadow display-flex flex-justify-content-space-around" onMouseLeave={()=>handleNav(activeNav.highLightPosId,1)}>
      <div id="navHighlight" className='bg-color transition' style={{left:activeNav.highLightPosLeft,width:activeNav.highLightPosWidth}}></div>
      {links}
    </nav>
  );
}
export default withRouter(Nav);