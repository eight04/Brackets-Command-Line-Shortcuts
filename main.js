/*
 * Simple extension that allows to bind keyboard shortcuts to command line applications
 * and run them from Brackets.
 * Loosely based on the examples from https://github.com/Vhornets/brackets-builder
 */
define(function (require, exports, module) {
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

  var PANEL_AUTOHIDE_TIMEOUT_MS = 500;

  var InfoPanel = require("./InfoPanel").InfoPanel;
  var Configuration = require("./Configuration").Configuration;
  var Util = require("./Util").Util;
  var CommandLine = require("./CommandLine").CommandLine;

  var panel = new InfoPanel();
  panel.init();

  var configuration = new Configuration();

  var commandLine = new CommandLine();
  commandLine.init();

  var autohide = false;
  var running = false;

  function startCurrentRun(entry) {
    running = true;
    autohide = entry.autohide || false;
  }

  function isRunInProgress() {
    return running;
  }

  function finishCurrentRun() {
    if (autohide) {
      setTimeout(function() {
        panel.hide();
        running = false;
      }, PANEL_AUTOHIDE_TIMEOUT_MS);
    } else {
      running = false;
    }
  }

  commandLine.addListeners({
    "progress": function(event, data) {
      panel.appendText(Util.encodeSpecialCharacters(data.trim()));
    },
    "error": function(event, data) {
      panel.appendText("ERROR: " + data);
    },
    "finished": function(event) {
      panel.appendText("<div class='commandline-info'>FINISHED at " + Util.formatTime(new Date()) + "</div>");
      commandLine.closeConnection();
      finishCurrentRun();
    }
  });

  configuration.read(function(entry) {
    return function() {

      if (isRunInProgress()) {
        return;
      }
      startCurrentRun(entry);

      commandLine.run(entry.dir, entry.cmd, function onStart() {
        panel.clear();
        panel.show();
        panel.appendText("<div class='commandline-info'>RUNNING '" + entry.cmd + "' in directory '" + entry.dir + "'</div>");
      });
    };
  });

  ExtensionUtils.loadStyleSheet(module, "commandline-panel.css");
});