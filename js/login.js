var connection = null;
var authSettings = {
    spanButtonID: 'pryv-button', // span id the DOM that will be replaced by the Service specific button
    onStateChange: pryvAuthStateChange, // event Listener for Authentication steps
    authRequest: { // See: https://api.pryv.com/reference/#auth-request
        requestingAppId: 'pryv-interview-exercise',
        languageCode: 'en', // optional (default english)
        requestedPermissions: [
            {
                "streamId": "fitbit",
                "defaultName": "Fitbit",
                "level": "read"
            }
        ],
        clientData: {
            'app-web-auth:description': {
                'type': 'note/txt', 'content': 'This is a consent message.'
            }
        }
    }
};

function pryvAuthStateChange(state) { // called each time the authentication state changed
    console.log('##pryvAuthStateChange', state);
    if (state.id === Pryv.Browser.AuthStates.AUTHORIZED) {
        connection = new Pryv.Connection(state.apiEndpoint);
        alert(connection);
        localStorage.setItem('connection',JSON.stringify(connection));
        window.location.href="Events.html";
        console.log('# Browser succeeded for user ' + connection.apiEndpoint);
    }
    if (state.id === Pryv.Browser.AuthStates.LOGOUT) {
        connection = null;
        localStorage.setItem('connection',null);
        console.log('# Logout');
    }
}

let serviceInfoUrl = 'https://reg.pryv.me/service/info';
// override serviceInfo if provided in the url.
//serviceInfoUrl = serviceInfoUrl;
console.log(serviceInfoUrl);
(async function () {
    const service = await Pryv.Browser.setupAuth(authSettings, serviceInfoUrl);
    (await service.assets()).setAllDefaults();
})();