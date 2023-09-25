const reducer = (state = 0, action) => {
    if (action.type === 'SET_LATITUDE') {
        state = action.payload;
        return state;
    }
    else {
        return state;
    }
}

export default reducer;