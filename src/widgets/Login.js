import React from "react";
import firebase from ".././init-firebase";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import CDB from "./countrydb";
import { Link } from "react-router-dom";
import "react-phone-number-input/style.css";
import "./login.css";

const initialState = {
  uid: "",
  phone: "",
  lastAttemptedPhone: "",
  password: "",
  username: "",
  id: "",
  tickets: [],
  events: [],
  clubs: [],
  jobs: [],
  housing: [],
  shops: [],
  restaurants: [],
  bars: [],
  services: [],
  proposals: [],
  authError: "",
  textedCode: "",
  alertExistingUser: false,
  noUserPleaseSignUp: null,
  recaptchaGood: false,
  showrecaptcha: false,
  recaptchaResponse: "",
  normalFinish: false,
  loading: false,
  working: true,
  volume: 0,
  time: 0,
  playing: false,
  closeContinue: false,
  goSignupConfirm: false,
  watchingSignupVideo: false,
  warnCaptcha: null
};
class Login extends React.Component {
  constructor(props) {
    super(props);
    var storedCountry = false;
    let cdb = new CDB();
    this.state = {
      bumpedFrom: "this page",
      cdb,
      uid: "",
      phone: "",
      lastAttemptedPhone: "",
      username: "",
      id: "",
      tickets: [],
      events: [],
      clubs: [],
      jobs: [],
      housing: [],
      shops: [],
      restaurants: [],
      bars: [],
      services: [],
      proposals: [],
      authError: "",
      textedCode: "",
      alertExistingUser: false,
      noUserPleaseSignUp: null,
      recaptchaGood: false,
      showrecaptcha: false,
      recaptchaResponse: "",
      normalFinish: false,
      loading: false,
      working: true,
      volume: 0,
      time: 0,
      playing: false,
      closeContinue: false,
      goSignupConfirm: false,
      watchingSignupVideo: false,
      user: props.user,
      storedCountry,
      warnCaptcha: null
    };
    this.recaptcha = React.createRef();
    this.video = React.createRef();
  }

  changeTime = (y) => {
    this.video.currentTime = y;
    this.setState({ time: y });
  };
  playContinue = () => {
    this.setState({ closeContinue: true });
    this.playVideo();
  };
  playVideo() {
    this.video.play();
    this.setState({ playing: true });
  }
  pauseVideo = () => {
    // Pause as well
    this.video.pause();
    this.setState({ playing: false });
  };
  handleChange = (e) => {
    var type = e.target.id;
    var value = e.target.value;
    if (type === "phone") {
      this.setState({
        [type]: "+1" + value
      });
    } else if (type === "username") {
      if (!value.includes(" ") && !value.match(/[^\w\s]+/)) {
        this.setState({
          [type]: value
        });
        if (e.which !== 32) {
          this.setState({ findingSimilarNames: true });
          clearTimeout(this.typingUsername);
          this.typingUsername = setTimeout(() => {
            this.setState({ findingSimilarNames: true });
            if (
              ![
                "newevent",
                "newclub",
                "newshop",
                "newrestaurant",
                "newservice",
                "newjob",
                "newhousing",
                "newpage",
                "newvenue",
                "budget",
                "calendar",
                "invites",
                "plan",
                "events",
                "jobs",
                "sd",
                "bk",
                "co",
                "plans",
                "plan",
                "events",
                "event",
                "clubs",
                "shops",
                "restaurants",
                "services",
                "departments",
                "classes",
                "job",
                "housing",
                "pages",
                "venues",
                "new",
                "login"
                //"/drop/"
              ].includes(value)
            ) {
              firebase
                .firestore()
                .collection("users")
                .where("username", "==", this.state.username)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.docs.forEach((doc) => {
                    if (doc.exists) {
                      var foo = doc.data();
                      foo.id = doc.id;

                      this.setState({ newUserPlease: true });
                    } else {
                      this.setState({ newUserPlease: false });
                    }
                  });
                });
            } else {
              this.setState({ newUserPlease: true });
              window.alert(
                "reserve word '" + value + "', please choose another"
              );
            }
          }, 1000);
        }
      } else window.alert("no spaces");
    } else {
      this.setState({
        [e.target.id]: e.target.value
      });
    }
  };
  confirmCode = async (textcode) => {
    this.props.loadGreenBlue("checking numbers");
    window.confirmationResult
      .confirm(textcode)
      .then(async (result) => {
        var user = result.user;
        console.log("Normal Finish " + user.uid);
        const phoneNumber = parsePhoneNumber(this.state.phone);
        console.log(phoneNumber.country);
        if (phoneNumber) {
          var country = {
            storedCountry: phoneNumber.country,
            _id: phoneNumber.country
          };
          this.setCountry(country, "setCountry");
        }
        await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((res) => {
            if (res.exists) {
              var auth = res.data();
              auth.id = res.id;
              window.alert("user profile exists... welcome back!");
              this.props.saveAuth(auth, true);
              this.props.history.push("/");
            } else if (!res.exists) {
              window.alert("Welcome to Actuapedia! Adding to firestore...");

              var usernameAsArray = [];
              const c = this.state.username.toLowerCase();
              for (let i = 1; i < c.length + 1; i++) {
                usernameAsArray.push(c.substring(0, i));
              }
              firebase
                .firestore()
                .collection("users")
                .doc(user.uid)
                .set({
                  usernameAsArray,
                  createdAt: new Date(),
                  username: this.state.username
                })
                .then((doc) => {
                  firebase
                    .firestore()
                    .collection("numbers")
                    .doc(phoneNumber)
                    .set({ uid: doc.id })
                    .then(() => {
                      this.props.history.push("/");
                    });
                });
            }
            this.props.unloadGreenBlue();
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        this.setState({ authError: err.message });
        console.log(err.message);
      });
  };
  requestTextCodeBox = () => {
    console.log(this.state.textedCode);
    console.log("ok");
    this.setState({ lastAttemptedPhone: this.state.phone });
    firebase
      .auth()
      .signInWithPhoneNumber(this.state.phone, this.state.appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        var textcode = window.prompt(
          "what is the sms code sent to " + this.state.phone
        );
        if (textcode) {
          this.confirmCode(textcode);
        }
        console.log("sms sent code to " + this.state.phone);
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          loading: false,
          noUserPleaseSignUp: null,
          showrecaptcha: false,
          recaptchaGood: false,
          authError: err.message
        });
      });
  };
  async setCountry(storedCountry, method) {
    await this.state.cdb[method](storedCountry)
      .then(() =>
        this.setState({
          storedCountry
        })
      )
      .catch((err) => console.log(err.message));
  }
  handleVol = (event) => {
    this.setState({ volume: event });
  };
  handleTime = (e) => {
    const time = e.target.currentTime;
    const timecut = time.toString().substr(0, time.toString().length - 5);
    this.setState({
      time: timecut,
      duration: e.target.duration
    });
  };
  componentWillUnmount = () => {
    clearTimeout(this.typingUsername);
    this.video &&
      this.video.current &&
      this.video.current.removeEventListener("volumechange", this.handleVol);
    this.video &&
      this.video.current &&
      this.video.current.removeEventListener("timeupdate", this.handleTime);
  };
  componentDidMount = async () => {
    await this.state.cdb
      .readCountry()
      .then((result) => {
        if (result.constructor !== Object) {
          console.log(
            "countrydb is another type than a js object" + result.constructor
          );
        } else if (Object.keys(result).length === 0) {
          console.log(
            "no country stored (right click>inspect>Application>IndexedDB)..."
          );
        } else {
          var storedCountry = result[Object.keys(result)[0]];
          if (!storedCountry) {
            console.log("new countrydb");
            var country = {
              storedCountry: storedCountry.storedCountry,
              _id: storedCountry.storedCountry
            };
            this.setCountry(country, "setCountry");
          }
        }
      })
      .catch((err) => console.log(err));
    this.video &&
      this.video.current &&
      this.video.current.addEventListener("volumechange", this.handleVol);
    this.video &&
      this.video.current &&
      this.video.current.addEventListener("timeupdate", this.handleTime);
  };

  checkPhoneTaken = () => {
    const usphone = this.state.phone;
    console.log(usphone);
    this.setState(
      { authError: "", loading: true, working: true },
      () => {
        firebase
          .firestore()
          .collection("numbers")
          .doc(usphone)
          .onSnapshot((doc) => {
            if (doc.exists) {
              //this.setState({ noUserPleaseSignUp: null });
              this.launchRecaptcha();
              this.setState({
                showrecaptcha: true,
                noUserPleaseSignUp: false,
                loading: false
              });
              console.log("user exists, here's the recaptcha");
            } else {
              this.launchRecaptcha();
              this.setState({
                showrecaptcha: true,
                noUserPleaseSignUp: true,
                loading: false
              });
              console.log("no user exists, please sign in");
            }
          });
      }
      /*await fetch(
        "https://us-central1-thumbprint-1c31n.cloudfunctions.net/doesUserPhoneExist",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
            "Access-Control-Request-Method": "POST"
          },
          body: JSON.stringify({ usphone: usphone }),
          maxAge: 3600
        }
      )
        .then(async (response) => await response.text())
        .then((body) => {
          if (this.state.noUserPleaseSignUp) {
            //console.log(body);
            console.log("Successfully fetched user data, signup:", body);
            if (body === this.state.phone) {
              this.launchRecaptcha();
              this.setState({
                showrecaptcha: true,
                noUserPleaseSignUp: false,
                loading: false
              });
              console.log("user exists, please sign in");
            }
          } else if (!this.state.noUserPleaseSignUp) {
            console.log(body);
            console.log("Successfully fetched user data, login:", body);
            if (body === this.state.phone) {
              //this.setState({ noUserPleaseSignUp: null });
              this.launchRecaptcha();
              this.setState({
                showrecaptcha: true,
                noUserPleaseSignUp: false,
                loading: false
              });
              console.log("user exists, here's the recaptcha");
            }
          }
        })
        .catch((err) => {
        });*/
    );
  };
  launchRecaptcha = () => {
    if (!this.state.showrecaptcha) {
      window.recaptchaVerifier =
        this.recaptcha &&
        this.recaptcha.current &&
        new firebase.auth.RecaptchaVerifier(this.recaptcha.current, {
          size: "normal",
          callback: (response) => {
            this.setState({
              lastAttemptedPhone: this.state.phone,
              recaptchaGood: true,
              showrecaptcha: false
            });
            this.requestTextCodeBox();
            return response;
          },
          "expired-callback": (err) => {
            this.setState({ showrecaptcha: false, recaptchaGood: false });
            console.log(err.message);
            return err;
          }
        });

      const appVerifier = window.recaptchaVerifier;
      appVerifier.render();
      this.setState({ appVerifier });
    }
  };
  clickHandle = () => this.props.history.push("/");

  componentDidUpdate = (prevProps) => {
    if (this.props.location !== prevProps.location) {
      let bumpedFrom =
        this.props.location.state && this.props.location.state.bumpedFrom
          ? this.props.location.state.bumpedFrom
          : "this page";
      this.setState({ bumpedFrom });
      if (this.props.auth !== undefined) {
        var goTo = bumpedFrom !== "this page" ? bumpedFrom : "/";
        this.props.history.push(goTo);
      }
    }
  };
  render() {
    const { bumpedFrom } = this.state;
    return (
      <div key="don't change">
        <div
          style={{
            zIndex: "9999",
            display: "flex",
            position: "fixed",
            width: "100%",
            height: !this.state.warnCaptcha ? "0%" : "100%",
            top: "0px",
            transform: this.state.warnCaptcha
              ? "translateX(0%)"
              : "translateX(-100%)",
            backgroundColor: this.state.warnCaptcha
              ? "rgba(250,250,250,1)"
              : "rgba(250,250,250,0)",
            transition: ".3s linear",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div
            onClick={() => this.setState({ warnCaptcha: false })}
            style={{
              cursor: "pointer",
              display: "flex",
              position: "absolute",
              left: "20px",
              top: "20px",
              color: "black"
            }}
          >
            Fine, proceed to login
          </div>
          <Link
            to="/"
            style={{
              display: "flex",
              position: "absolute",
              right: "20px",
              top: "20px",
              color: "black"
            }}
          >
            Go back
          </Link>
          <div
            style={{
              display: "flex",
              position: "absolute",
              width: "80%",
              maxWidth: "600px",
              height: "min-content",
              transform: "translateX(0%)",
              backgroundColor: "rgba(250,250,250,1)",
              transition: ".3s linear",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              margin: "60px 0px"
            }}
          >
            reCAPTCHA is a free service from Google that helps protect this
            web-app from spam and abuse by keeping automated software out
            <br />
            <br />
            It does this by collecting personal information about users to
            determine if they're humans and not spam bots
            <br />
            <br />
            "This ... [cookie & screenshot] information ... no longer reflects
            or references an individually-identifiable user," but informs
            marketing partners of your profile and trends for third-party users
            on Google's brand of products
            <br />
            <br />
            go ahead read their{" "}
            <a href="https://policies.google.com/privacy/google-partners">
              privacy policy
            </a>
          </div>
        </div>
        <div className="login">
          <img
            className="alternative"
            src="https://www.dl.dropboxusercontent.com/s/9ctrgn3angb8zz4/Screen%20Shot%202019-10-02%20at%2011.30.21%20AM.png?dl=1"
            alt="error"
          />
          <video
            ref={this.video}
            id="background-video"
            loop
            autoPlay
            playsInline
            muted
          >
            <source
              src="https://www.dl.dropboxusercontent.com/s/eqdqu6op7pa2wmg/My%20Movie%2015.mp4?dl=1"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolutethem">
            <div onClick={this.clickHandle} className="plusrightexit">
              &times;
            </div>
            <div className="form1">
              <div className="loginsentence">
                You must log in to view {bumpedFrom}
                <br />
                standard rates apply
              </div>
              {this.state.noUserPleaseSignUp !== true && (
                <div
                  className="loginwarning"
                  onClick={() =>
                    window.alert(
                      `You are now posting things like username if you proceed. ` +
                        `Your number and phone are under userDatas, a collection ` +
                        `in the NoSQL database only accessible by https://
                ${["18ikj.csb.app, ", "actua.media, & ", "actuapedia.com"].map(
                  (x) => x
                )}` +
                        `You can keep sprite to this list on thumbprint.us; ` +
                        `Firebase Database (Firestore) data is encrypted in transit, ` +
                        `it is stored on encrypted disks on the servers, and ` +
                        `may be stored in your browser's cache. ` +
                        `so use it on a private device. ` +
                        `Sim card security depends on your Internet Service Provider's ` +
                        `identification process and some identity theft happens.`
                    )
                  }
                >
                  <br />
                  You are now posting things like username if you proceed
                  <hr />
                  Your number and phone are under userDatas, a collection
                  <br />
                  in the NoSQL database only accessible by https://
                  {["18ikj.csb.app, ", "actua.media, & ", "actuapedia.com"].map(
                    (x) => x
                  )}
                  <br />
                  You can keep sprite to this list on thumbprint.us
                  <hr />
                  Firebase Database (Firestore) data is encrypted in transit,
                  <br />
                  it is stored on encrypted disks on the servers, and
                  <br />
                  may be stored in your browser's cache.
                  <br />
                  so use it on a private device.
                  <br />
                  <br />
                  Sim card security depends on your Internet Service Provider's
                  identification process and some identity theft happens.
                </div>
              )}
              <div>
                {this.state.authError ? this.state.authError.toString() : null}
                {this.state.noUserPleaseSignUp === null
                  ? null
                  : this.state.noUserPleaseSignUp
                  ? "no user exists, use recaptcha to get firebase.auth() text"
                  : "user exists, use recaptcha to get firebase.auth() text"}
              </div>
              <br />
              <div>
                <label htmlFor="phone" className="spaceforphone">
                  Phone{" "}
                </label>
                {this.state.storedCountry &&
                this.state.storedCountry.constructor === String ? (
                  <div>
                    {" "}
                    <div
                      onClick={() => {
                        var country = { storedCountry: false, _id: false };
                        this.setCountry(country, "setCountry");
                      }}
                    >
                      &times;
                    </div>
                    <PhoneInput
                      defaultCountry={this.state.storedCountry}
                      required
                      style={{ fontSize: "16px" }}
                      placeholder="Enter phone number"
                      value={this.state.phone}
                      onChange={(phone) => this.setState({ phone })}
                      onSubmit={(e) => e.preventDefault()}
                      type="tel"
                      //countrySelectComponent={CustomCountrySelect}
                    />
                  </div>
                ) : (
                  <PhoneInput
                    required
                    style={{ fontSize: "16px" }}
                    placeholder="Enter phone number"
                    value={this.state.phone}
                    onChange={(phone) => this.setState({ phone })}
                    onSubmit={(e) => e.preventDefault()}
                    type="tel"
                    //countrySelectComponent={CustomCountrySelect}
                  />
                )}
                <div onClick={() => this.setState(initialState)}>&#8634;</div>
                {this.state.noUserPleaseSignUp && !this.state.authError ? (
                  <div>
                    <div>
                      {this.state.username !== "" && (
                        <div style={{ fontSize: "14px", color: "grey" }}>
                          SUBJECT TO COPYRIGHT
                        </div>
                      )}
                      {this.state.newUserPlease ? (
                        <div>Username taken</div>
                      ) : null}
                      <label htmlFor="username">Username </label>
                      <input
                        required
                        className="input-field"
                        type="username"
                        id="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        minLength="3"
                        maxlength="30"
                      />
                    </div>
                  </div>
                ) : null}

                {this.state.loading ? (
                  <img
                    src="https://www.dl.dropboxusercontent.com/s/le41i6li4svaz0q/802%20%282%29.gif?dl=0"
                    alt="error"
                  />
                ) : !this.state.showrecaptcha &&
                  !this.state.authError &&
                  this.state.phone !== this.state.lastAttemptedPhone ? (
                  <div className="loginsignup">
                    <button
                      onClick={() => {
                        if (this.state.warnCaptcha === null) {
                          this.setState({ warnCaptcha: true });
                        } else if (
                          !this.state.showrecaptcha &&
                          !this.state.authError
                        ) {
                          if (!this.state.newUserPlease) {
                            this.checkPhoneTaken();
                          } else {
                            window.alert(
                              `${this.state.username} is taken. ` +
                                `email nick@thumbprint.us to claim copyright`
                            );
                          }
                        }
                      }}
                      className="loginbtn"
                    >
                      {this.state.noUserPleaseSignUp ? "Sign Up" : "Log in"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              ref={this.recaptcha}
              className={
                this.state.showrecaptcha ? "showrecaptcha" : "hiderecaptcha"
              }
            />
            {/*this.state.recaptchaGood && this.state.authError === "" ? (
              <form
                className="showphonecodeform"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("ya");
                  this.confirmCode(e);
                }}
              >
                <input
                  className="phonecodeinput"
                  placeholder="Verification Code"
                  id="textedCode"
                  onChange={this.handleChange}
                />
                <button className="showphonecodeformbtn" type="submit">
                  Confirm
                </button>
              </form>
              ) : null*/}

            <button className="previewbtn" onClick={this.clickHandle}>
              Preview
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
