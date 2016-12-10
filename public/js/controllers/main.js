angular.module('noteController', [])

	// inject the Note service factory into our controller
	.controller('mainController', ['$scope','$http','Notes', function($scope, $http, Notes) {
		$scope.formData = {};
		$scope.loading = true;
		$scope.saveButtonText = "Add Note";
		$scope.isEdit = false;


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
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			$scope.formData.body = dataToEdit.body;
			$scope.formData.title = dataToEdit.title;
			$scope.saveButtonText = "Update";
			$scope.createOrUpdate = $scope.updateNote;
			$scope.noteObject = dataToEdit;
			$scope.editMode = true;
		};

		$scope.cancelUpdate = function() {
			$scope.createOrUpdate = $scope.createNote;
			$scope.editMode = false;
			$scope.saveButtonText = "Add Note";
			$scope.formData = {};
		};

		// UPDATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.updateNote = function(dataIn) {

		if(dataIn.body !== undefined && dataIn.title !== undefined) {
		// call the create function from our service (returns a promise object)
			$scope.noteObject.body = dataIn.body;
			$scope.noteObject.title = dataIn.title;

				Notes.update($scope.noteObject)

				// if successful creation, call our get function to get all the new notes
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.notes = data; // assign our new list of notes
						
					});
			}
			
			$scope.saveButtonText = "Add Note";
			$scope.createOrUpdate = $scope.createNote;
			$scope.editMode = false;
		};

		$scope.muxTheButton = function(dataIn) {
			$scope.createOrUpdate(dataIn);
		};

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createNote = function(dataIn) {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.body != undefined && $scope.formData.title !==undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Notes.create($scope.formData)

					// if successful creation, call our get function to get all the new notes
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.notes = data; // assign our new list of notes
					});
				$scope.editMode = false;
				$scope.formData = {};
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