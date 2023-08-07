
const initialState = {
    count: false,
  };
  
  const handleSignReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'HANDLESIGNSTATE':
        return {
          ...state,
          count: true,
        };
      default:
        return state;
    }
  };
  
  export default handleSignReducer;
  