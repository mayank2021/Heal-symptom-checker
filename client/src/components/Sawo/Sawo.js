import React, { useEffect } from 'react'
import Sawo from 'sawo'

const LoginPage = () => {
    useEffect(() => {
        var config = {
            // should be same as the id of the container created on 3rd step
            containerID: '<container-ID>',
            // can be one of 'email' or 'phone_number_sms'
            identifierType: 'phone_number_sms',
            // Add the API key copied from 5th step
            apiKey: '742e2c57-726a-4c16-a6ca-ef4e4101c4d5',
            // Add a callback here to handle the payload sent by sdk
            onSuccess: payload => {
                // you can use this payload for your purpose
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