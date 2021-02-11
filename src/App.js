import React from "react";
import "./styles.css";
import Test from "./Test";
import TickerTape from "./TickerTape";
import ADB from "./widgets/authdb";
import firebase from "./init-firebase";
import Routes from "./Routes";
import { Link } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    var topics = [
      {
        user: "Nickcarducci",
        title: "duress or exclusionary unslavery free-riding",
        topic: "economics"
      },
      {
        user: "Nickcarducci",
        title: "dollar equity dilution bond fraud",
        topic: "economics"
      },
      { user: "Nickcarducci", title: "heat as electrons", topic: "science" },
      {
        user: "Nickcarducci",
        title: "retard misnomer",
        topic: "linguistics"
      },
      {
        user: "Nickcarducci",
        title: "anti-financial jihad mistake of nazi",
        topic: "history"
      },
      { user: "Nickcarducci", title: "arousal unslavery", topic: "law" },
      {
        user: "Nickcarducci",
        title: "unshuffled binary sample bias",
        topic: "statistics"
      },
      { user: "Nickcarducci", title: "v1 is fabricated", topic: "economics" },
      {
        user: "Nickcarducci",
        title: "bonds are treason",
        topic: "economics"
      },
      { user: "Nickcarducci", title: "B-cell oncogenesis", topic: "science" },
      { user: "Nickcarducci", title: "nebulizer spitting", topic: "science" },
      {
        user: "Nickcarducci",
        title: "unequal protection barrier monopsony nda",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "mafia tactics: create enemies",
        topic: "anthropology"
      },
      {
        user: "Nickcarducci",
        title: "unequal protection dollars as shares",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "unequal protection for entrepreneurs",
        topic: "law"
      },
      { user: "Nickcarducci", title: "political thumbprint", topic: "logic" },
      {
        user: "Nickcarducci",
        title: "9/11 insurance fraud",
        topic: "investigations"
      },
      {
        user: "Nickcarducci",
        title: "retail banking barrel o' fish",
        topic: "economics"
      },
      {
        user: "Nickcarducci",
        title: "appropriate disclosure for indefinite vacation",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "invoices are involuntary",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "prices are elastic",
        topic: "economics"
      },
      {
        user: "Nickcarducci",
        title: "the hot potato insurance dilemma",
        topic: "economics"
      },
      {
        user: "Nickcarducci",
        title: "platform unpaid curated copyright outage",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "domain of inclusion without duress",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "market-based colonialism scalping",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "Italians and Poles are euro",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "Cannons about Hell are wrong, but not do no harm",
        topic: "theology"
      },
      {
        user: "Nickcarducci",
        title: "cops brandish fleer don't shoot",
        topic: "law"
      },
      {
        user: "Nickcarducci",
        title: "fight thieves without blackbelt",
        topic: "law"
      }
    ];
    let adb = new ADB();
    this.state = {
      pathname: "/",
      auth: undefined,
      user: undefined,
      loadingMessage: "",
      adb,
      width: window.innerHeight,
      height: window.innerWidth,
      topics,
      users: [],
      recordedUserNames: []
    };
    this.red = React.createRef();
    this.test = React.createRef();
    topics.map((x) => {
      return (this[x] = React.createRef());
    });
    this.hydrateUserFromUserName.user = this.hydrateUserFromUserName.bind(this);
    this.hydrateUserFromUserName.closer = this.hydrateUserFromUserName.bind(
      this
    );
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
    this.hydrateUserFromUserName.closer();
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = window.innerWidth; // * 0.01;
      let height = window.innerHeight; // * 0.01;
      document.documentElement.style.setProperty("--vw", `${width}px`);
      document.documentElement.style.setProperty("--vh", `${height}px`);
      var totalWidth = 0;
      this.state.topics.map((x) => {
        return (totalWidth = totalWidth + this[x].current.offsetWidth);
      });
      var set = height - 40 - this.red.current.offsetHeight;
      this.setState({
        totalWidth,
        set,
        width,
        height,
        wide: totalWidth / (set / 80)
      });
    }, 200);
  };
  async setAuth(storedAuth, method, logout) {
    await this.state.adb[method](storedAuth)
      .then((res) => {
        console.log(res);
        //this.props.unloadGreenBlue();
        this.setState({
          storedAuth
        });
        logout && window.location.reload();
      })
      .catch((err) => console.log(err.message));
  }
  handleStoreAuth = (meAuth, logout, hasPermission) => {
    var stripped = {};
    if (meAuth.constructor === Object && Object.keys(meAuth).length === 0) {
      stripped._id = "none";
      this.setAuth(stripped, "setAuth", logout);
      this.setState({ meAuth: undefined });
    } else {
      console.log(meAuth.uid + " found");
      stripped._id = meAuth.uid;
      stripped.uid = meAuth.uid;
      stripped.displayName = meAuth.displayName;
      stripped.photoURL = meAuth.photoURL;
      stripped.email = meAuth.email;
      stripped.emailVerified = meAuth.emailVerified;
      stripped.phoneNumber = meAuth.phoneNumber;
      stripped.isAnonymous = meAuth.isAnonymous;
      stripped.tenantId = meAuth.tenantId;
      stripped.providerData = meAuth.providerData;
      stripped.apiKey = meAuth.apiKey;
      stripped.appName = meAuth.appName;
      stripped.authDomain = meAuth.authDomain;
      stripped.stsTokenManager = meAuth.stsTokenManager;
      stripped.refreshToken = meAuth.refreshToken;
      stripped.accessToken = meAuth.accessToken;
      stripped.expirationTime = meAuth.expirationTime;
      stripped.redirectEventId = meAuth.redirectEventId;
      stripped.lastLoginAt = meAuth.lastLoginAt;
      stripped.createdAt = meAuth.createdAt;
      stripped.multiFactor = JSON.stringify(meAuth.multiFactor);
      if (this.state.storedAuth !== stripped) {
        if (!stripped.isAnonymous) {
          var store = false;
          if (!hasPermission) {
            store = window.confirm(
              "is this a private device? if so, can we store your auth data?" +
                `(${stripped.displayName},${stripped.phoneNumber},${stripped.email})`
            );
          } else {
            store = true;
          }
          if (store) {
            //getUserData from update
            //this.getInformation(meAuth);
            this.setAuth(stripped, "setAuth");
          } else {
            this.props.unloadGreenBlue();
          }
        } else {
          this.setAuth(stripped, "setAuth");
        }
        this.setState({ meAuth });
      }
    }
  };
  getUserInfo = () => {
    if (this.state.meAuth !== undefined && this.state.meAuth.isAnonymous) {
      this.props.history.push("/login");
    } else {
      this.loadGreenBlue("loading authentication...");
      if (this.state.storedAuth !== undefined) {
        var meAuth = { ...this.state.storedAuth };
        if (!meAuth.multiFactor) {
          this.state.adb.deleteKeys();
        } else {
          meAuth.multiFactor = JSON.parse(meAuth.multiFactor);
          if (meAuth.isAnonymous) {
            this.setState({ meAuth });
            this.unloadGreenBlue();
          } else {
            this.handleStoreAuth(this.state.storedAuth, false, true);
            this.setState({ meAuth });
          }
        }
      }
      this.state.auth === undefined &&
        firebase.auth().onAuthStateChanged(
          (meAuth) => {
            console.log("firebase authentication called");
            if (meAuth) {
              this.handleStoreAuth(meAuth);
              this.unloadGreenBlue();
              if (meAuth.isAnonymous) {
                console.log("anonymous");
              } else {
                console.log(meAuth.uid + " is logged in");
                if (
                  this.state.meAuth !== undefined &&
                  this.state.meAuth.isAnonymous
                ) {
                  this.state.meAuth
                    .delete()
                    .then(() =>
                      window.alert("successfully removed anonymous account")
                    );
                }
              }
            } else {
              console.log("getting fake user data...");
              firebase
                .auth()
                .signInAnonymously()
                .then(() => {
                  var answer = window.confirm("login?");
                  if (answer) {
                    this.props.history.push("/login");
                    this.unloadGreenBlue();
                  }
                })
                .catch((error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorCode);
                  console.log(errorMessage);
                });
            }
          },
          (err) => console.log(err.message)
        );
    }
  };
  componentDidMount = async () => {
    await this.state.adb
      .readAuth()
      .then((result) => {
        console.log(result);
        if (result.constructor !== Object) {
          console.log(
            "authdb is another type than a js object" + result.constructor
          );
        } else if (Object.keys(result).length === 0) {
          console.log("no user stored...");
        } else {
          var storedAuth = result[Object.keys(result)[0]];
          var meAuth = { ...storedAuth };
          if (!storedAuth) {
            console.log("new authdb");
          } else if (storedAuth.isAnonymous) {
            console.log("authdb is anonymous");
            meAuth.multiFactor = JSON.parse(meAuth.multiFactor);
            this.setState({
              storedAuth,
              meAuth
            });
          } else if (storedAuth._id === "none") {
            this.setState({ storedAuth });
          } else {
            console.log("authdb is identifiable");
            //getUserData from pouchDB
            this.getInformation(meAuth);
            this.setState({ storedAuth });
          }
        }
      })
      .catch((err) => console.log(err));
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  loadGreenBlue = (loadingMessage) => {
    this.setState({ loadingMessage });
  };
  unloadGreenBlue = () => {
    this.setState({ loadingMessage: "" });
  };
  hydrateUserFromUserName = (profileUserName) => {
    let fine = true;
    const { recordedUserNames, recordedUsers } = this.state;
    return {
      user: async () => {
        if (!recordedUserNames.includes(profileUserName)) {
          this.props.setForumDocs({
            recordedUserNames: [...recordedUserNames, profileUserName]
          });
          firebase
            .firestore()
            .collection("users")
            .where("username", "==", profileUserName)
            .onSnapshot(
              (querySnapshot) => {
                querySnapshot.docs.forEach(async (doc) => {
                  if (doc.exists) {
                    var user = doc.data();
                    user.id = doc.id;
                    this.props.setForumDocs({
                      recordedUsers: [...recordedUsers, user.id]
                    });
                    var users = [...this.state.users, user];
                    this.props.setForumDocs({ users });
                  }
                });
              },
              (e) => console.log(e.message)
            );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!profileUserName) {
              reject(!profileUserName);
            }
            var close = firebase
              .firestore()
              .collection("users")
              .onSnapshot(
                (querySnapshot) => {
                  querySnapshot.docs.forEach(async (doc) => {
                    if (doc.exists) {
                      var user = doc.data();
                      user.id = doc.id;
                      this.props.setForumDocs({
                        recordedUsers: [...recordedUsers, user.id]
                      });
                      var users = [...this.state.users, user];
                      this.props.setForumDocs({ users });
                      return resolve(JSON.stringify(user));
                    }
                  });
                },
                (e) => {
                  window.alert(e.message);
                  return resolve(null);
                }
              );
            if (!profileUserName) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!profileUserName) {
              reject(!profileUserName);
            }
            this.getTimeout = setTimeout(() => {
              var user = this.state.users.find(
                (x) => x.username === profileUserName
              );

              user && resolve(JSON.stringify(user));
            }, 2000);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  checkPathname = async (pathname) => {
    var isHome = pathname === "/";
    if (!isHome) {
      var found = ["/new", "/login"].map((x) => x.includes(pathname));
      if (!found) {
        var profileUsername = pathname.split("/")[1];
        if (
          !this.state.profile ||
          this.state.profile.username !== profileUsername
        ) {
          this.props.loadGreenBlue("getting profile of " + profileUsername);
          console.log(pathname + " not gotten yet, here we go");
          this.setState({
            profile: null
          });
          var hydratedUser =
            profileUsername &&
            (await this.hydrateUserFromUserName(profileUsername).user());
          var profile = hydratedUser && JSON.parse(hydratedUser);
          if (profile) {
            this.getProfile(profile);
            this.setState({ profile });
          }
        }
      } else {
        var community = pathname.split("/co/")[1];
        if (community) {
          community = community.replace(/%20/g, " ").toLowerCase();

          if (
            !this.props.community ||
            this.props.community.message.toLowerCase() !== community
          ) {
            community = await this.getCommunityByName(community).community();
            community = community && JSON.parse(community);
            this.props.setCommunity({
              community
            });
          } else {
            var city = pathname.split("/city/")[1];
            if (city) {
              const letterEntered = /^[\W\D]/;
              if (letterEntered.test(city)) {
                await fetch(
                  //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                  `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
                )
                  .then(async (response) => await response.json())
                  .then(
                    (body) => {
                      var city = body.features[0].place_name;
                      this.fetchForum(city, this.props.commtype, true); //noLoad
                      this.fetchEvents(
                        body.features[0].center,
                        15,
                        city,
                        this.props.tileChosen
                      );
                      this.props.setCommunity({ city });
                    },
                    (err) => console.log(err)
                  )
                  .catch((err) => {
                    console.log(err);
                    alert("please try another city name");
                  });
              } else window.alert("cities must start with a letter");
            }
          }
        } else return null;
      }
    }
  };
  render() {
    return (
      <span className="App">
        <Test
          topics={this.state.topics}
          set={this.state.set}
          setHeight={(x) => this.setState(x)}
        />
        <div
          className="loadGreenBlue"
          style={{
            zIndex: "1",
            flexDirection: "column",
            overflowWrap: "break-word",
            //backgroundColor: perc2color(this.state.countingNextLoad ? 1 : 0),
            display: "flex",
            position: "fixed",
            justifyContent: "center",

            alignItems: "center",
            height:
              this.state.loadingMessage !== "" ? "calc(100vh - 56px)" : "0vh",
            width: "100vw",
            transition: `${
              this.state.loadingMessage !== "" ? 1 : 0.3
            }s ease-in`,
            color: "white",
            fontSize: "24px"
          }}
        >
          {this.state.loadingMessage !== "" && (
            <div
              style={{
                display: "flex",
                opacity: ".5",
                fontSize: "0px"
              }}
            >
              entities
              <div
                style={{
                  transform: "rotate(45deg)",
                  borderRight: "5px solid",
                  borderBottom: "5px solid",
                  height: "20px",
                  width: "10px"
                }}
              />
            </div>
          )}
          {this.state.loadingMessage !== "" && (
            <div
              style={{
                display: "flex",
                opacity: ".5",
                fontSize: "0px"
              }}
            >
              comments
              <div
                style={{
                  transform: "rotate(45deg)",
                  borderRight: "5px solid",
                  borderBottom: "5px solid",
                  height: "20px",
                  width: "10px"
                }}
              />
            </div>
          )}
          {this.state.loadingMessage}
        </div>
        <Routes
          checkPathname={this.checkPathname}
          hydrateUserFromUserName={async (username) => {
            var userResult =
              username && (await this.hydrateUserFromUserName(username).user());
            return userResult && JSON.parse(userResult);
          }}
          user={this.state.user}
          auth={this.state.auth}
          pathname={this.state.pathname}
          setPathname={(pathname) => this.setState(pathname)}
          unloadGreenBlue={this.unloadGreenBlue}
          loadGreenBlue={this.loadGreenBlue}
          saveAuth={(x, hasPermission) => {
            this.handleStoreAuth(x, true, hasPermission);
          }}
          stopAnon={null}
          loginOpenstate={null}
          loginOpen={null}
          redirectToReferrer={null}
        />
        <div
          style={{
            backgroundColor: "white",
            flexDirection: "column",
            display: "flex",
            position: "fixed",
            width: "100%",
            height: "100%",
            zIndex: "-1"
          }}
        >
          <div
            ref={this.red}
            style={{
              backgroundColor: "white",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            this app is in dev starting 1/18/2021
            <div
              style={{
                cursor: "pointer",
                width: "calc(100% - 20px)",
                margin: "0px 20px",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Link to="/new">
                <h4>write</h4>
              </Link>
              <h4>actuapedia.com</h4>
              <Link to="/login">
                <h4>login</h4>
              </Link>
            </div>
            <div style={{ color: "grey" }}>
              have a contention using deduction? imagine a formula? powerful
              have something to hide?
            </div>
            <div style={{ color: "grey" }}>
              syntax: 2-5 word encompassing title ("," for another) for your
              contention
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{
                display: "flex",
                height: "56px",
                width: "90%",
                margin: "0px",
                textAlign: "center",
                position: "relative"
              }}
            >
              <img
                style={{
                  margin: "16px 8px",
                  position: "absolute",
                  width: "30px",
                  height: "30px"
                }}
                alt="https://www.dropbox.com/s/0cwtbjune65kez2/Actuapedia.png?dl=0"
                src="https://www.dl.dropboxusercontent.com/s/0cwtbjune65kez2/Actuapedia.png?dl=0"
              />
              <input
                placeholder="no holds barred! let's talk about it"
                style={{
                  height: "36px",
                  width: "100%",
                  margin: "10px 0px",
                  textAlign: "center"
                }}
              />
            </form>
          </div>

          <div
            style={{
              backgroundColor: "white",
              position: "relative",
              overflowX: "auto",
              overflowY: "hidden",
              width: "100%",
              height: this.state.set,
              flexWrap: "wrap",
              display: "flex"
            }}
          >
            <div
              style={{
                position: "absolute",
                width: this.state.wide,
                height: "100%",
                flexWrap: "wrap",
                display: "flex"
              }}
            >
              {this.state.topics.map((x) => (
                <div
                  ref={this[x]}
                  style={{
                    cursor: "pointer",
                    height: "min-content",
                    flexDirection: "column",
                    width: "max-content",
                    padding: "10px",
                    border: "1px solid",
                    margin: "0px 10px",
                    display: "flex",
                    alignItems: "flex-start"
                  }}
                  key={x.title}
                >
                  {x.title}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%"
                    }}
                  >
                    <div style={{ fontSize: "10px" }}>
                      {x.user.toLowerCase()}
                    </div>
                    <div style={{ fontSize: "10px", color: "blue" }}>
                      {x.topic.toLowerCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                left: this.state.wide,
                minWidth: "300px",
                width: `calc(100vw - ${this.state.wide}px)`,
                height: "100%",
                backgroundColor: "blue",
                display: "flex",
                position: "absolute"
              }}
            >
              Advertisement
              <br />
              want to advertise here?
              <br />
              contact nick@carducci.sh
            </div>
          </div>

          <TickerTape />
        </div>
      </span>
    );
  }
}

export default App;
