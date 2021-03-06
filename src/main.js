/*
 * Simple extension that allows to bind keyboard shortcuts to command line applications
 * and run them from Brackets.
 * Loosely based on the examples from https://github.com/Vhornets/brackets-builder
 */
define(function (require, exports, module) {
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

  var InfoPanel = require("./InfoPanel").InfoPanel;
  var Configuration = require("./Configuration").Configuration;
  var RunManager = require("./RunManager").RunManager;
  var Util = require("./Util").Util;
  var CommandLine = require("./CommandLine").CommandLine;

  var panel = new InfoPanel();
  panel.init();

  var configuration = new Configuration();

  var commandLine = new CommandLine();
  commandLine.init();

  var runManager = new RunManager(panel);

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
      runManager.finish();
    }
  });

  configuration.read(function(entry) {
    return function() {
      var expandedEntry = configuration.expandVariables(entry);

      runManager.start(expandedEntry, function() {
        commandLine.run(expandedEntry.dir, expandedEntry.cmd, function onStart() {
          panel.clear();
          panel.show();
          panel.appendText("<div class='commandline-info'>RUNNING '" + expandedEntry.cmd + "' in directory '" + expandedEntry.dir + "'</div>");
        });
      });
    };
  });

  ExtensionUtils.loadStyleSheet(module, "commandline-panel.css");
});