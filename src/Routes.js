import React from "react";
import { Route, Switch } from "react-router-dom";
//import { Route, Switch, Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Nothing from "./widgets/Nothing";
import Login from "./widgets/Login";
import New from "./widgets/New";
import Open from "./widgets/Open";

class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inviteChosen: "",
      batterUp: true
    };
  }
  componentDidUpdate = async () => {
    const { pathname } = this.state;
    if (this.props.pathname !== pathname && pathname) {
      this.props.setPathname({ pathname });
      if (pathname !== "/") {
        this.props.checkPathname(pathname);
      }
    }
  };
  render() {
    /*const PrivateRoute = ({ render: Component, ...rest }, props) => {
      return (
        <Route
          {...rest}
          render={(props) =>
            this.props.auth !== undefined ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { bumpedFrom: props.location.pathname }
                }}
              />
            )
          }
        />
      );
    };*/
    return (
      <div>
        <Route
          render={({ location }) => {
            if (location.pathname !== this.state.pathname) {
              clearTimeout(this.pauseRender);
              this.pauseRender = setTimeout(() => {
                this.setState({ pathname: location.pathname });
              }, 200);
            }
            return (
              <TransitionGroup key="1">
                <CSSTransition
                  key="1"
                  //key={location.key}
                  timeout={300}
                  classNames={"fade"}
                >
                  <Switch key={location.key} location={location}>
                    {/*<PrivateRoute
                    //exact
                    path="/new"
                    render={(props) => (
                      <New
                        {...props}
                        user={this.props.user}
                        auth={this.props.auth}
                      />
                    )}
                    />*/}
                    <Route
                      exact
                      path="/new"
                      render={(props) => (
                        <New
                          {...props}
                          user={this.props.user}
                          auth={this.props.auth}
                        />
                      )}
                    />
                    <Route
                      //BumpRoute
                      exact
                      path="/login"
                      render={(props) => (
                        <Login
                          {...props}
                          hydrateUserFromUserName={
                            this.props.hydrateUserFromUserName
                          }
                          unloadGreenBlue={this.props.unloadGreenBlue}
                          loadGreenBlue={this.props.loadGreenBlue}
                          saveAuth={this.props.saveAuth}
                          stopAnon={this.props.stopAnon}
                          auth={this.props.auth}
                          user={this.props.user}
                          loginOpenstate={this.props.loginOpenstate}
                          loginOpen={this.props.loginOpen}
                          redirectToReferrer={this.props.redirectToReferrer}
                        />
                      )}
                    />
                    <Route
                      exact
                      path="/"
                      render={(props) => <Nothing {...props} />}
                    />
                    <Route
                      exact
                      path="/:id"
                      render={(props) => (
                        <Open
                          {...props}
                          user={this.props.user}
                          auth={this.props.auth}
                          pathname={this.state.pathname}
                        />
                      )}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            );
          }}
        />
      </div>
    );
  }
}
export default Routes;
