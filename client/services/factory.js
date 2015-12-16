/**
  * Angular OrdersFactory to communicate with the backend REST API.
  * Angular Socket Factory to enable sockets for rootScope.
  **/

var f = angular.module('factories', []);
f.factory('ordersFactory',['$http', function ($http){
	return{
		get_all_orders : function (){
			return $http.get('/api/v1/orders');
		},
		get_order : function (id){
			return $http.get('/api/v1/order/',
			{ 
				params:{orderId:id}
			});
		},
		post_order : function (order){
			return $http({
				method: 'POST',
				url : '/api/v1/orders',
				data:order,
				headers : { 'Content-Type': 'application/json' }
			});
		},
		put_order : function (order){
			return $http({
				method: 'PUT',
				url : '/api/v1/order',
				data:order,
				headers : { 'Content-Type': 'application/json' }
			});
		},
		remove_order : function (orderId){
			return $http.delete('/api/v1/order',
			{ 
				params:{orderId:orderId}
			});
		},
	}
}]);
f.factory('socket',['$rootScope', function($rootScope){
  	var socket = io.connect();
	return {
		on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }
            socket.on(eventName, wrapper);
            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
	}
}]);
