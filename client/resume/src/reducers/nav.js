const navReducer = (state = {highLightPosId:'home',highLightPosLeft:0,highLightPosWidth:0}, action) => {
	switch(action.type) {
		case 'SET_NAV':
			return state;
		default:
			return state;
	}
};

export default navReducer;