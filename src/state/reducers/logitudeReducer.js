const reducer = (state = 0, action) => {
    if (action.type === 'SET_LONGITUDE') {
        state = action.payload;
        return state;
    }
    else {
        return state;
    }
}

export default reducer;