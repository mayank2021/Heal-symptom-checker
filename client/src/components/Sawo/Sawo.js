import React, { useEffect } from 'react'
import Sawo from 'sawo';

const LoginPage = () => {
    useEffect(() => {
        var config = {
            // should be same as the id of the container created on 3rd step
            containerID: 'sawo-container',
            // can be one of 'email' or 'phone_number_sms'
            identifierType: 'email',
            // Add the API key copied from 5th step
            apiKey: '742e2c57-726a-4c16-a6ca-ef4e4101c4d5',
            // Add a callback here to handle the payload sent by sdk
            onSuccess: payload => {
                window.location = `${window.location.origin}/home`
            },
        }
        let sawo = new Sawo(config)
        sawo.showForm()
    }, [])

    return (
        <div>
            <div id="sawo-container" style={{height:"300px", width:"400px"}}>hwlo</div>
        </div>
    )
}

export default LoginPage