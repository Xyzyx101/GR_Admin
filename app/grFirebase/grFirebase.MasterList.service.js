(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('MasterList', MasterList);

  MasterList.$inject = ['$rootScope'];

  /* @ngInject */
  function MasterList($rootScope) {

    $rootScope.$on("Auth:StateChanged", function() {
      retrieve();
    });

    function retrieve() {

    }

    var list = {
      "OptionList": [
        {
          "AssetName": "MatO_AllureFloor",
          "OptionType": "MaterialOption",
          "OptionID": "/Game/OptionLibrary/Options/Material/MatO_AllureFloor.MatO_AllureFloor_C",
          "OptionDisplayName": "Allure Floor",
          "TechnicalName": "Allure #12345",
          "Collection": "",
          "Vendor": "",
          "Category": "Floor"
        },
        {
          "AssetName": "MatO_ArgentoRomano",
          "OptionType": "MaterialOption",
          "OptionID": "/Game/OptionLibrary/Options/Material/MatO_ArgentoRomano.MatO_ArgentoRomano_C",
          "OptionDisplayName": "Argento Romano",
          "TechnicalName": "12345-89",
          "Collection": "",
          "Vendor": "",
          "Category": "Countertop"
        },
        {
          "AssetName": "MatO_Backsplash_StainlessSteel",
          "OptionType": "MaterialOption",
          "OptionID": "/Game/OptionLibrary/Options/Material/MatO_Backsplash_StainlessSteel.MatO_Backsplash_StainlessSteel_C",
          "OptionDisplayName": "Stainless Steel",
          "TechnicalName": "12345",
          "Collection": "",
          "Vendor": "",
          "Category": "Backsplash"
        }
      ]};
      return {
        List: list
      };
  }
})();
