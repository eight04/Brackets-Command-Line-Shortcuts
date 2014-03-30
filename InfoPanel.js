define(function (require, exports) {

  var PanelManager = brackets.getModule("view/PanelManager");

  function InfoPanel() {
    this.panelElement = null;
    this.panelContentElement = null;
    this.panel = null;
  }

  InfoPanel.prototype.init = function() {
    var self = this;
    var infoPanelHtml = require('text!brackets-commandline-panel.html');

    this.panelElement = $(infoPanelHtml);
    this.panelContentElement = $('.commandline-panel-content', this.panelElement);
    this.panel = PanelManager.createBottomPanel(
      "brackets-commandline-infopanel",
      this.panelElement);
    $('.close', this.panelElement).on('click', function() {
      self.hide();
    });
  };

  InfoPanel.prototype.show = function() {
    this.panel.show();
  };

  InfoPanel.prototype.hide = function() {
    this.panel.hide();
  };

  InfoPanel.prototype.clear = function() {
    $(this.panelContentElement).html("");
  };

  InfoPanel.prototype.appendText = function(text) {
    var currentHtml = $(this.panelContentElement).html();

    text = text.replace(/(?:\r\n|\n)/g, "<br/>");
    $(this.panelContentElement).html(currentHtml + "<div>" + text + "</div>");

    this.scrollToBottom();
  };

  InfoPanel.prototype.scrollToBottom = function() {
    this.panelElement[0].scrollTop = this.panelElement[0].scrollHeight;
  };

  exports.InfoPanel = InfoPanel;
});