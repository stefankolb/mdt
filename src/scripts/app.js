/**
 * =============================================================================
 * MobileDevelopmentTools
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */
 
'use strict';

var app = angular.module('mdt', [ 'ui.router', 'templates' ]);

app.config([ '$stateProvider', '$locationProvider', '$urlRouterProvider',
  function($stateProvider, $locationProvider, $urlRouterProvider) {
    // Route to default state for unknown states
    $urlRouterProvider.otherwise('/');
    
    // Configure location provider
    $locationProvider.hashPrefix("!");
    
    // Register application states
    $stateProvider.state('/', {
      url: '/',
      template: ''
    });
  }
]);

app.controller('RootCtrl', [ 
  function() {
    
  }
]);