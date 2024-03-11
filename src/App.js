import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { createMount } from "@material-ui/core/test-utils";
import { createShallow } from "@material-ui/core/test-utils";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import React, { Component } from "react";

import { DeviceInfoService } from "./data/services";
import { isLoggedIn, setFCMToken } from "../src/data/storage/ProfileHelper";
import { logger } from "./common/logger";
import { messaging } from "./init-fcm";
import { NotForMobile } from "./Components/NotForMobile";
import { storeNotification } from "./data/storage/NotificationHelper";
import LoginPage from "./Components/Login/LoginPage";
import MainPage from "./Containers/MainPage";
import NotFound from "./Components/NotFound/NotFound";
import PrivacyPolicyPage from "./Components/Privacy-Policy/PrivacyPolicyPage";

const theme = createMuiTheme({
  status:{
    novice: "#FFBF00",
    learning:"FF7F00",
    experienced:"2EB8B0"

    // {
    //   light: '#FFBF00',
    //   main: "#FFBF00",
    //   dark: '#FFBF00',
    //   contrastText: "#ffffff",
    // },
    // learning: {
    //   light: '#FF7F00',
    //   main: "#FF7F00",
    //   dark: '#FF7F00',
    //   contrastText: "#ffffff",
    // },
    // experienced: {
    //   light: '#2EB8B0',
    //   main: "#2EB8B0",
    //   dark: '#2EB8B0',
    //   contrastText: "#ffffff",
    // },
  },
  palette: {
    primary: {
      light: "#FFFFFF",
      main: "#105090",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#00a79c",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffffff",
    },
    custom: {
      light: '#ffa726',
      main: '#f57c00',
      dark: '#ef6c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h4: {
      fontSize: 20,
    },
    h5: {
      fontSize: 18,
      fontWeight: "bold",
    },
    h6: {
      fontSize: 15,
    },
    body1: {
      fontSize: 14,
    },
    body2: {
      fontSize: 13,
    },
    subtitle1: {
      fontSize: 12,
    },
    useNextVariants: true,
    htmlFontSize: 16,
  },
});

class App extends Component {
  componentDidMount() {
    // const { pushNotification, setToken } = this.props;
    if (!messaging) return;
    messaging
      .requestPermission()
      .then(() => {
        // console.log('Has Permission');
        logger.log("has permission");
        return messaging.getToken();
      })
      .then((fcmToken) => {
        // console.log('FCM Token', fcmToken);
        sendTokenToServer(fcmToken);
      })
      .catch((error) => {
        // console.log("Unable to get permission to notify.", error);
      });

    messaging.onMessage((payload) => {
      // console.log('Payload', payload);
      storeNotification(payload.data);
    });

    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then((refreshedToken) => {
          // console.log('Token refreshed.');
          // Send Instance ID token to app server.
          sendTokenToServer(refreshedToken);
        })
        .catch((err) => {
          // console.log('Unable to retrieve refreshed token ', err);
        });
    });

    const sendTokenToServer = (fcmToken) => {
      // console.debug('FCM', 'token store initiated')
      setFCMToken(fcmToken);

      if (isLoggedIn() === "true") {
        // console.debug('FCM', 'updating device into')
        DeviceInfoService.updateDeviceInfo()
          .then((response) => {
            // console.debug('FCM', 'device info updated with status', response.status);
          })
          .catch((error) => {
            // console.debug('FCM', 'updating device into failed', error);
          });
      }
    };
  }

  render() {
    let isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return (
          navigator.userAgent.match(/IEMobile/i) ||
          navigator.userAgent.match(/WPDesktop/i)
        );
      },
      any: function () {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        );
      },
    };
    return isMobile.any() ? (
      <NotForMobile />
    ) : (
        <Router>
          <div>
            <MuiThemeProvider theme={theme}>
              <Switch>
                <Route path="/login" component={LoginPage} />
                {/* <Route path="/privacy-policy" component={PrivacyPolicyPage} /> */}
                {/* <Route path="/terms-conditions" component={LoginPage} /> */}
                <Route exact path="/" component={MainPage} />
                <Route path="/dashboard" component={MainPage} />
                <Route exact path="/employees" component={MainPage} />
                <Route exact path="/employees/:id?" component={MainPage} />
                <Route exact path="/albums" component={MainPage} />
                <Route exact path="/albums/add" component={MainPage} />
                <Route path="/updateprofile" component={MainPage} />
                {/* <Route exact path="/eom" component={MainPage} /> */}
                <Route exact path="/eom/add" component={MainPage} />
                <Route exact path="/eom/vote" component={MainPage} />
                <Route exact path="/meetings" component={MainPage} />
                <Route exact path="/meetings/:id?" component={MainPage} />
                <Route exact path="/meetings/meeting/add" component={MainPage} />
                <Route exact path="/holidays" component={MainPage} />
                <Route exact path="/settings" component={MainPage} />
                <Route exact path="/timetracker" component={MainPage} />
                <Route exact path="/timeoff" component={MainPage} />
                <Route exact path="/timeoff/:id?" component={MainPage} />
                <Route exact path="/applyleave" component={MainPage} />
                <Route exact path="/timeoffrequest" component={MainPage} />
                <Route exact path="/timeoffrequest/:id?" component={MainPage} />
                <Route path="/updateskills" component={MainPage} />
                <Route component={NotFound} />
              </Switch>
            </MuiThemeProvider>
          </div>
        </Router>
      );
  }
}

export default App;
