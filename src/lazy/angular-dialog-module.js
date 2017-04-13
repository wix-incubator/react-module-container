class NgDialogController {
  constructor($scope, $window, props) {
    this.$window = $window;

    this.value = props().value;
    this.onSuccessCallback = props().onSuccess;
    this.onCancelCallback = props().onCancel;

    $scope.$watch(() => props().isOpen, val => {
      if (val === true) {
        this.openDialog();
      }
    });
  }
  _safelyInvoke(fn) {
    if (fn) {
      fn();
    }
  }
  openDialog() {
    const res = this.$window.confirm(`Hello new dialog, value: ${this.value}`);
    res ? this._safelyInvoke(this.onSuccessCallback) : this._safelyInvoke(this.onCancelCallback);
  }
}

angular.module('myNgDialog', [])
  .component('ngDialog', {
    template: '',
    controller: NgDialogController
  });
