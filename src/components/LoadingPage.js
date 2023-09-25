import React from 'react'
import loadingGIF from '../assets/loading.gif'

export default function LoadingPage() {
    return (
        <>
            <div className="container" id="loading-page-container">
                <img src={loadingGIF} alt="Loading..." />
                <p>LOOKING OUTSIDE FOR YOU... ONE SEC</p>
            </div>
        </>
    )
}
