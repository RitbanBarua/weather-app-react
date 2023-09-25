export const setLongitude = (longitude) => {
    return (dispatch)=>{
        dispatch({
            type: 'SET_LONGITUDE',
            payload: longitude
        })
    }
}

export const setLatitude = (latitude)=>{
    return (dispatch)=>{
        dispatch({
            type: 'SET_LATITUDE',
            payload: latitude
        })
    }
}