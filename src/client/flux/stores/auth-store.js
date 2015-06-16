'use strict';

import React from 'react';

import assign from 'react/lib/Object.assign';
import _ from 'lodash';
var events = require('eventemitter3');
var eventEmitter = new events.EventEmitter();

import Dispatcher from '../core/dispatcher';
import ActionTypes from '../constants/action-types';
import Session from '../models/session';
var _sessionObject = new Session();

var AuthStore = {

  getSessionObject: function(){
    if(!_sessionObject.accessToken || !_sessionObject.emailAddress){
      var session = getSessionGlobal(); //global function call, see index.jade for function
      console.log(JSON.stringify(session));
      _sessionObject.accessToken = session.accessToken;
      _sessionObject.emailAddress = session.emailAddress;
    }
    return _sessionObject;
  },

  emit: function(event) {
    eventEmitter.emit(event);
  },

  on: function(event, callback) {
    eventEmitter.on(event, callback);
  },

  removeListener: function(event, callback) {
    eventEmitter.removeListener(event, callback);
  }
}

AuthStore.dispatcherToken = Dispatcher.register((payload) => {
  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.REVOKE_RES:
        AuthStore.emit(ActionTypes.REVOKE_RES);
        break;
    case ActionTypes.SIGNUP_RES:
        var user = action.data;
        _sessionObject.emailAddress = user.emailAddress;
        AuthStore.emit(ActionTypes.SIGNUP_RES);
        break;
    case ActionTypes.SIGNUP_ERR:
        AuthStore.emit(ActionTypes.SIGNUP_ERR);
        break;

    default:
      // Do nothing
  }

});

module.exports = AuthStore;
