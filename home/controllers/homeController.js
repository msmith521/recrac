angular.module('App')
  .controller('HomeController', ['$scope', '$rootScope', '$state', 'userService', 'searchServices', 'mappingTools', 'Data', 'socket', 'pushNotifications',
    function ($scope, $rootScope, $state, userService, searchServices, mappingTools, Data, socket, pushNotifications) {
      var markers = {};

      userService //authentication
        .authenticate()
        .then(function (user) {
          $scope.user = user;
          $rootScope.userId = user.data.user._id;
          socket.emit('getUserInfo', $scope.user );
          pushNotifications.setupSubscription(user.id);
        });
      $scope.layers = mappingTools.Layer; //map set up tiles from mapbox
      $scope.defaults = { scrollWheelZoom: false
      }; //map set up turn off scroll wheel zoom.
      $scope.currentLoc = mappingTools.defaultLoc; //map set up deault location.
      // pushNotifications.subscribeUserToPush();
      mappingTools //get current loc from browser
        .getCurrentPosition().then((position) => {
          $scope.currentLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom: 12
          }; 
          markers['curr'] = { //put a marker down at the curr loc't
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            message: 'You are here!',
            icon: { 
              type: 'extraMarker',
              icon: 'fa-star',
              markerColor: '#f00',
              prefix: 'fa',
              shape: 'circle'
            },
            focus: true
          };         
        });
      var markers = mappingTools.eventToMarker(Data); //get markers from database
      

     

      $scope.markers = markers; //add them to the scope
  
      $scope.eventData = Data;

      $scope.filterObj = searchServices.filterObj;

      $scope.filterByType = searchServices.filterByType;

      $scope.nofilter = searchServices.nofilter;

    }]);
