/**
  * Initializing new angular module for our application with required modules, services and directives
  *
  **/

var app = angular.module('realtimewebapplication', ['ngRoute', 'directives', 'factories', 'ui.bootstrap']);

// Pagination filter
app.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});

// Angular controller for the Orders
app.controller('ordersCtrl', ['$scope','filterFilter', '$location','$timeout', 'ordersFactory', 'socket', function($scope,filterFilter, $location,$timeout, ordersFactory, socket) {
	angular.element(document).ready(function(){get_orders();});
	$scope.order_exists = 0;
	$scope.order = {};
	$scope.orders = [];
	$scope.message = '';
	$scope.error = '';
	$scope.showOrderPopup = false;
	$scope.buttonEvent = "";
	
	//Pagination 
	$scope.currentPage = 1;
	$scope.entryLimit = 5;
	$timeout(function(){
		$scope.totalOrders = $scope.orders.length;
		$scope.noOfPages = Math.ceil($scope.totalOrders / $scope.entryLimit);
	},2000);

	//$watching search and orders to update pagination
	$scope.$watch('orders', function () {
		$scope.totalOrders = $scope.orders.length;
		$scope.noOfPages = Math.ceil($scope.totalOrders / $scope.entryLimit);
	}, true);
	$scope.$watch('search', function (newVal, oldVal) {
		$scope.filtered = filterFilter($scope.orders, newVal);
		$scope.totalOrders = $scope.filtered.length;
		$scope.noOfPages = Math.ceil($scope.totalOrders / $scope.entryLimit);
		$scope.currentPage = 1;
	}, true);

	//sockets to listen events from server
	socket.on("listUpdated", function(msg){
		get_orders();
		$scope.message = msg.message;
		$timeout(function(){$scope.message = '';},3000);
	});
	socket.on("OrderInserted", function(obj){
		$scope.orders.unshift(obj.order);
		$scope.message = obj.message;
		$timeout(function(){$scope.message = '';},3000);
	});

	//angular-events
	function get_orders(){
		ordersFactory.get_all_orders()
			.success(function(orders){
				$scope.orders = orders;
			})
			.error(function(error){
				$scope.error = error;
			});
	}
	$scope.new_Order = function(newOrder){
		$scope.buttonEvent = newOrder;
		$scope.showOrderPopup = !$scope.showOrderPopup;
	};
	$scope.save_order = function(){
		var order = $scope.order;
		if($scope.order_exists == 0){
			ordersFactory.post_order(order)
				.success(function(msg){
					$scope.order = {};
					$scope.showOrderPopup = !$scope.showOrderPopup;
					$scope.message = msg.message;
					$timeout(function(){$scope.message = '';},3000);
				})
				.error(function(error){
					$scope.error = error;
					$timeout(function(){$scope.error = '';},3000);
				});
		}else{
			ordersFactory.put_order(order)
				.success(function(msg){
					$scope.order = {};
					$scope.showOrderPopup = !$scope.showOrderPopup;
					$scope.message = msg.message;
					$timeout(function(){$scope.message = '';},3000);
				})
				.error(function(error){
					$scope.error = error;
					$timeout(function(){$scope.error = '';},3000);
				});
		}
	}
	$scope.remove_Order = function(orderId){
		ordersFactory.remove_order(orderId)
			.success(function(msg){
				$scope.order = {};
				$scope.message = msg.message;
				$timeout(function(){$scope.message = '';},3000);
			})
			.error(function(error){
				$scope.error = error;
				$timeout(function(){$scope.error = '';},3000);
			});
	}
	$scope.edit_Order = function(editOrder,orderId){
		$scope.buttonEvent = editOrder;
		$scope.showOrderPopup = !$scope.showOrderPopup;
		$scope.order_exists = 1;
		ordersFactory.get_order(orderId)
			.success(function(order){
				$scope.order =  order;
			})
			.error(function(error){
				$scope.error = error;
				$timeout(function(){$scope.error = '';},3000);
			});
	}
}]);
app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'ordersCtrl',
		templateUrl: '/client/partials/orders.html'
	})
	.otherwise({
		redirectTo:'/'
	});
});


