/**
 * =============================================================================
 * MobileDevelopmentTools
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */

'use strict';

/**
 * @ngdoc overview
 * @name mdt
 * @description
 *
 * # Mobile Development Toolkit (MDT)
 *
 * Set of tools to aid development of web sites and web apps for mobile devices.
 *
 * @requires ui.router
 * @requires templates
 */

var app = angular.module('mdt', [ 'ui.router', 'templates' ]);

// Configure mdt module
app.config([ '$stateProvider', '$locationProvider', '$urlRouterProvider',
  function($stateProvider, $locationProvider, $urlRouterProvider) {
    // Route to default state for unknown states
    $urlRouterProvider.otherwise('/');
    
    // Configure location provider
    $locationProvider.hashPrefix("!");
    
    // Register application states
    $stateProvider.state('/', {
      url: '/',
      templateUrl: 'partials/start.tpl.html'
    });
    $stateProvider.state('mfdevicepixelratio', {
      url: '/mfdevicepixelratio',
      templateUrl: 'partials/mfdevicepixelratio.tpl.html'
    });
    $stateProvider.state('mforientation', {
      url: '/mforientation',
      templateUrl: 'partials/mforientation.tpl.html'
    });
    $stateProvider.state('mfresolution', {
      url: '/mfresolution',
      templateUrl: 'partials/mfresolution.tpl.html'
    });
    $stateProvider.state('calcppi', {
      url: '/calcppi',
      templateUrl: 'partials/calcppi.tpl.html'
    });
  }
]);

app.controller('RootCtrl', [ 
  function() {
    
  }
]);
