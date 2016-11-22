angular.module('noteController', [])

	// inject the Note service factory into our controller
	.controller('mainController', ['$scope','$http','Notes', function($scope, $http, Notes) {
		$scope.formData = {};
		$scope.loading = true;
		$scope.saveButtonText = "Add Note";


		// GET =====================================================================
		// when landing on the page, get all notes and show them
		// use the service to get all the notes
		Notes.get()
			.success(function(data) {
				$scope.notes = data;
				$scope.loading = false;
			});

		// EDIT ====================================================================
		// copy current data to form and update
		$scope.editNote = function(dataToEdit) {
			$scope.formData = dataToEdit;
			$scope.saveButtonText = "Update " + dataToEdit.title;
			$scope.createOrUpdate = $scope.updateNote;
			$scope.noteObject = dataToEdit;
		};

		// UPDATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.updateNote = function() {

		// call the create function from our service (returns a promise object)
				Notes.update($scope.noteObject)

				// if successful creation, call our get function to get all the new notes
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.notes = data; // assign our new list of notes
						$scope.saveButtonText = "Add Note";
						$scope.createOrUpdate = $scope.createNote;
						$scope.$apply();
					});
		};

		$scope.muxTheButton = function() {
			$scope.createOrUpdate();
		};

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createNote = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.body != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Notes.create($scope.formData)

					// if successful creation, call our get function to get all the new notes
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.notes = data; // assign our new list of notes
					});
			}
		};

		// DELETE ==================================================================
		// delete a note after checking it
		$scope.deleteNote = function(id) {
			$scope.loading = true;

			Notes.delete(id)
				// if successful creation, call our get function to get all the new notes
				.success(function(data) {
					$scope.loading = false;
					$scope.notes = data; // assign our new list of notes
				});
		};
		$scope.createOrUpdate = $scope.createNote;
	}])
	.directive('confirmationNeeded', function () {
		return {
			priority: 1,
			terminal: true,
			link: function (scope, element, attr) {
				var msg = attr.confirmationNeeded || "Are you sure?";
				var clickAction = attr.ngClick;
				element.bind('click',function () {
					if ( window.confirm(msg) ) {
						scope.$eval(clickAction)
					}
				});
			}
		}
	});