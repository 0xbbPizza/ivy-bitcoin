// external imports
import createHistory from "history/createBrowserHistory";
import React from "react";
import DocumentTitle from "react-document-title";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";
import persistState from "redux-localstorage";
import thunk from "redux-thunk";
// ivy imports
import app from "./app";
import templates from "./templates";
import LockedValue from "./contracts/components/lockedValue";
import Unlock from "./contracts/components/unlock";
import Lock from "./templates/components/lock";
// Import css
require("./static/playground.css");
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const history = createHistory({ basename: "/bitcoin" });
const store = createStore(app.reducer, composeEnhancers(applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)), persistState()));
export const IvyProvider = () => (React.createElement(Provider, { store: store },
    React.createElement(DocumentTitle, { title: "Ivy Playground for Bitcoin" },
        React.createElement(ConnectedRouter, { history: history },
            React.createElement(app.components.Root, null,
                React.createElement(Switch, null,
                    React.createElement(Route, { exact: true, path: "/unlock", component: LockedValue }),
                    React.createElement(Route, { path: "/unlock/:contractId", component: Unlock }),
                    React.createElement(Route, { path: "*", component: Lock })))))));
const selected = templates.selectors.getSelectedTemplate(store.getState());
store.dispatch(templates.actions.loadTemplate(selected));
render(React.createElement(IvyProvider, null), document.getElementById("root"));
