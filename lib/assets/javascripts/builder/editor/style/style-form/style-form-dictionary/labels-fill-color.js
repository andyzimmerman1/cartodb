var DialogConstants = require('builder/components/form-components/_constants/_dialogs');
var FillConstants = require('builder/components/form-components/_constants/_fill');

var NO_PANES_CLASS = 'Editor-formInner--NoTabs';

module.exports = {
  generate: function (params) {
    return {
      type: 'FillColor',
      title: _t('editor.style.components.labels-fill-color'),
      fieldClass: NO_PANES_CLASS,
      query: params.querySchemaModel.get('query'),
      options: [],
      configModel: params.configModel,
      userModel: params.userModel,
      validators: ['required'],
      modals: params.modals,
      dialogMode: DialogConstants.Mode.FLOAT,
      editorAttrs: {
        hidePanes: [FillConstants.Panes.BY_VALUE]
      }
    };
  }
};