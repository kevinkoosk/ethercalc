// Generated by LiveScript 1.3.1
(function(){
  this.include = function(){
    return this.client({
      '/player/main.js': function(){
        var $, doPlay, onReady, onLoad, ref$, this$ = this;
        $ = window.jQuery || window.$;
        if (!$) {
          return location.reload();
        }
        doPlay = function(){
          var ref$, endpoint, ref1$, ref2$, ref3$, options, showError, x$, ref4$, emit;
          window.SocialCalc == null && (window.SocialCalc = {});
          SocialCalc._username = Math.random().toString();
          SocialCalc.isConnected = true;
          if (/\?auth=/.test(window.location.search)) {
            SocialCalc._auth = (ref$ = window.location.search) != null ? ref$.replace(/\??auth=/, '') : void 8;
          }
          SocialCalc._view = SocialCalc._auth === '0';
          SocialCalc._room == null && (SocialCalc._room = window.location.hash.replace('#', ''));
          SocialCalc._room = (SocialCalc._room + "").replace(/^_+/, '').replace(/\?.*/, '');
          endpoint = (ref1$ = $('script[src*="/socket.io/socket.io.js"]')) != null ? (ref2$ = ref1$.attr('src')) != null ? ref2$.replace(/\.?\/socket.io\/socket.io.js.*/, '') : void 8 : void 8;
          if (endpoint === '') {
            endpoint = location.pathname.replace(/\/(view|edit)$/, '');
            endpoint = endpoint.replace(RegExp('' + SocialCalc._room + '$'), '');
          }
          if ((ref3$ = window.Drupal) != null && ref3$.sheetnode) {
            if (/overlay=node\/\d+/.test(window.location.hash)) {
              SocialCalc._room = window.location.hash.match(/=node\/(\d+)/)[1];
            } else if (/\/node\/\d+/.test(window.location.href)) {
              SocialCalc._room = window.location.href.match(/\/node\/(\d+)/)[1];
            }
          } else if (SocialCalc._room) {
            if (!SocialCalc.CurrentSpreadsheetControlObject) {
              setTimeout(function(){
                return window.history.pushState({}, '', "./" + SocialCalc._room + (function(){
                  switch (false) {
                  case !SocialCalc._view:
                    return '/view';
                  case !SocialCalc._auth:
                    return '/edit';
                  default:
                    return '';
                  }
                }()));
              }, 100);
            }
          } else {
            window.location = './_start';
            return;
          }
          options = {
            'connect timeout': 1500,
            reconnect: true,
            'reconnection delay': 500,
            'max reconnection attempts': 1800
          };
          if (endpoint) {
            options.path = endpoint.replace(/\/?$/, '/socket.io');
          }
          showError = function(it){
            if (typeof vex != 'undefined' && vex !== null) {
              vex.closeAll();
            }
            if (typeof vex != 'undefined' && vex !== null) {
              vex.defaultOptions.className = 'vex-theme-flat-attack';
            }
            return typeof vex != 'undefined' && vex !== null ? vex.dialog.open({
              message: it,
              buttons: []
            }) : void 8;
          };
          window.addEventListener('offline', function(){
            return showError('Disconnected from server. please check network connection and refresh.');
          });
          x$ = (ref4$ = this$.connect('/', options)) != null ? ref4$.io : void 8;
          if (x$ != null) {
            x$.on('reconnect', function(){
              if (!((typeof SocialCalc != 'undefined' && SocialCalc !== null) && SocialCalc.isConnected)) {
                return;
              }
              return SocialCalc.Callbacks.broadcast('ask.log');
            });
          }
          if (x$ != null) {
            x$.on('connect_error', function(){
              return showError('Connection error; please refresh to try again.');
            });
          }
          if (x$ != null) {
            x$.on('connect_timeout', function(){
              return showError('Connection timeout; please refresh to try again.');
            });
          }
          if (x$ != null) {
            x$.on('reconnect_error', function(){
              if (!((typeof SocialCalc != 'undefined' && SocialCalc !== null) && SocialCalc.isConnected)) {
                return;
              }
              SocialCalc.hadSnapshot = false;
              return showError('Disconnected from server. Reconnecting....');
            });
          }
          if (x$ != null) {
            x$.on('connect_failed', function(){
              return showError('Reconnection Failed.');
            });
          }
          emit = function(data){
            return this$.emit({
              data: data
            });
          };
          SocialCalc.Callbacks.broadcast = function(type, data){
            data == null && (data = {});
            if (!SocialCalc.isConnected) {
              return;
            }
            data.user = SocialCalc._username;
            data.room = SocialCalc._room;
            data.type = type;
            if (SocialCalc._auth) {
              data.auth = SocialCalc._auth;
            }
            return emit(data);
          };
          SocialCalc.isConnected = true;
          SocialCalc.RecalcInfo.LoadSheetCache = {};
          SocialCalc.RecalcInfo.LoadSheet = function(ref){
            if (/[^.a-zA-Z0-9]/.exec(ref)) {
              return;
            }
            ref = ref.toLowerCase();
            return emit({
              type: 'ask.recalc',
              user: SocialCalc._username,
              room: ref
            });
          };
          return this$.on({
            data: function(){
              var ss, editor, user, ref$, ecell, peerClass, find, cr, cell, origCR, origCell, parts, cmdstr, line, refreshCmd, sheetdata, ref1$;
              if (!((typeof SocialCalc != 'undefined' && SocialCalc !== null) && SocialCalc.isConnected)) {
                return;
              }
              if (this.data.user === SocialCalc._username) {
                return;
              }
              if (this.data.to && this.data.to !== SocialCalc._username) {
                return;
              }
              if (this.data.room && this.data.room !== SocialCalc._room && this.data.type !== "recalc") {
                return;
              }
              ss = window.spreadsheet;
              if (!ss) {
                return;
              }
              editor = ss.editor;
              switch (this.data.type) {
              case 'chat':
                if (typeof window.addmsg == 'function') {
                  window.addmsg(this.data.msg);
                }
                break;
              case 'ecells':
                for (user in ref$ = this.data.ecells) {
                  ecell = ref$[user];
                  if (user === SocialCalc._username) {
                    continue;
                  }
                  peerClass = " " + user + " defaultPeer";
                  find = new RegExp(peerClass, 'g');
                  cr = SocialCalc.coordToCr(ecell);
                  cell = SocialCalc.GetEditorCellElement(editor, cr.row, cr.col);
                  if ((cell != null ? cell.element.className.search(find) : void 8) === -1) {
                    cell.element.className += peerClass;
                  }
                }
                break;
              case 'ecell':
                peerClass = " " + this.data.user + " defaultPeer";
                find = new RegExp(peerClass, 'g');
                if (this.data.original) {
                  origCR = SocialCalc.coordToCr(this.data.original);
                  origCell = SocialCalc.GetEditorCellElement(editor, origCR.row, origCR.col);
                  origCell.element.className = origCell.element.className.replace(find, '');
                  if (this.data.original === editor.ecell.coord || this.data.ecell === editor.ecell.coord) {
                    SocialCalc.Callbacks.broadcast('ecell', {
                      to: this.data.user,
                      ecell: editor.ecell.coord
                    });
                  }
                }
                cr = SocialCalc.coordToCr(this.data.ecell);
                cell = SocialCalc.GetEditorCellElement(editor, cr.row, cr.col);
                if ((cell != null ? (ref$ = cell.element) != null ? ref$.className.search(find) : void 8 : void 8) === -1) {
                  cell.element.className += peerClass;
                }
                break;
              case 'ask.ecell':
                SocialCalc.Callbacks.broadcast('ecell', {
                  to: this.data.user,
                  ecell: editor.ecell.coord
                });
                break;
              case 'log':
                if (typeof vex != 'undefined' && vex !== null) {
                  vex.closeAll();
                }
                if (SocialCalc.hadSnapshot) {
                  break;
                }
                SocialCalc.hadSnapshot = true;
                if (this.data.snapshot) {
                  parts = ss.DecodeSpreadsheetSave(this.data.snapshot);
                }
                if (parts != null && parts.sheet) {
                  ss.sheet.ResetSheet();
                  ss.ParseSheetSave(this.data.snapshot.substring(parts.sheet.start, parts.sheet.end));
                }
                if (typeof window.addmsg == 'function') {
                  window.addmsg(this.data.chat.join('\n'), true);
                }
                cmdstr = (function(){
                  var i$, ref$, len$, results$ = [];
                  for (i$ = 0, len$ = (ref$ = this.data.log).length; i$ < len$; ++i$) {
                    line = ref$[i$];
                    if (!/^re(calc|display)$/.test(line)) {
                      results$.push(line);
                    }
                  }
                  return results$;
                }.call(this)).join('\n');
                if (cmdstr.length) {
                  refreshCmd = 'recalc';
                  ss.context.sheetobj.ScheduleSheetCommands(cmdstr + "\n" + refreshCmd + "\n", false, true);
                } else {
                  ss.context.sheetobj.ScheduleSheetCommands("recalc\n", false, true);
                }
                break;
              case 'snapshot':
                if (typeof vex != 'undefined' && vex !== null) {
                  vex.closeAll();
                }
                SocialCalc.hadSnapshot = true;
                if (this.data.snapshot) {
                  parts = ss.DecodeSpreadsheetSave(this.data.snapshot);
                }
                if (parts != null && parts.sheet) {
                  ss.sheet.ResetSheet();
                  ss.ParseSheetSave(this.data.snapshot.substring(parts.sheet.start, parts.sheet.end));
                  ss.context.sheetobj.ScheduleSheetCommands("recalc\n", false, true);
                }
                break;
              case 'recalc':
                if (this.data.force) {
                  SocialCalc.Formula.SheetCache.sheets = {};
                  if (ss != null) {
                    ss.sheet.recalconce = true;
                  }
                }
                if (this.data.snapshot) {
                  parts = ss.DecodeSpreadsheetSave(this.data.snapshot);
                }
                if (parts != null && parts.sheet) {
                  sheetdata = this.data.snapshot.substring(parts.sheet.start, parts.sheet.end);
                  SocialCalc.RecalcLoadedSheet(this.data.room, sheetdata, true);
                  if (SocialCalc.RecalcInfo.LoadSheetCache[this.data.room] !== sheetdata) {
                    SocialCalc.RecalcInfo.LoadSheetCache[this.data.room] = sheetdata;
                    ss.context.sheetobj.ScheduleSheetCommands("recalc\n", false, true);
                  }
                } else {
                  SocialCalc.RecalcLoadedSheet(this.data.room, '', true);
                }
                break;
              case 'execute':
                ss.context.sheetobj.ScheduleSheetCommands(this.data.cmdstr, this.data.saveundo, true);
                if (ss.currentTab === ((ref1$ = ss.tabnums) != null ? ref1$.graph : void 8)) {
                  setTimeout(function(){
                    return window.DoGraph(false, false);
                  }, 100);
                }
                break;
              case 'stopHuddle':
                $('#content').uiDisable();
                alert("[Collaborative Editing Session Completed]\n\nThank you for your participation.\n\nCheck the activity stream to see the newly edited page!");
                window.onunload = null;
                window.onbeforeunload = null;
                window.location = '/';
                break;
              case 'error':
                if (typeof vex != 'undefined' && vex !== null) {
                  vex.closeAll();
                }
                if (typeof vex != 'undefined' && vex !== null) {
                  vex.defaultOptions.className = 'vex-theme-flat-attack';
                }
                if (typeof vex != 'undefined' && vex !== null) {
                  vex.dialog.open({
                    message: this.data.message,
                    buttons: [$.extend({}, typeof vex != 'undefined' && vex !== null ? vex.dialog.buttons.YES : void 8, {
                      text: 'Return to ready-only mode',
                      click: function(){
                        return location.href = "../" + SocialCalc._room;
                      }
                    })]
                  });
                }
              }
            }
          });
        };
        window.doresize = function(){
          var ref$;
          if ((ref$ = window.spreadsheet) != null) {
            ref$.DoOnResize();
          }
        };
        onReady = function(){
          var ref$, ref1$, ref2$, $container, ref3$;
          if (!((ref$ = window.Drupal) != null && ((ref1$ = ref$.sheetnode) != null && ((ref2$ = ref1$.sheetviews) != null && ref2$.length)))) {
            return onLoad();
          }
          $container = (ref3$ = window.Drupal) != null ? ref3$.sheetnode.sheetviews[0].$container : void 8;
          return $container.bind('sheetnodeReady', function(_, arg$){
            var spreadsheet;
            spreadsheet = arg$.spreadsheet;
            if (spreadsheet.tabbackground === 'display:none;') {
              if (spreadsheet.InitializeSpreadsheetControl) {
                return;
              }
              SocialCalc._auth = '0';
            }
            return onLoad(spreadsheet);
          });
        };
        $(function(){
          return setTimeout(onReady, 1);
        });
        onLoad = function(ssInstance){
          var ss, ref$, ref1$, ref2$;
          ssInstance == null && (ssInstance = SocialCalc.CurrentSpreadsheetControlObject);
          window.spreadsheet = ss = ssInstance || (SocialCalc._view
            ? new SocialCalc.SpreadsheetViewer()
            : new SocialCalc.SpreadsheetControl());
          SocialCalc.Callbacks.broadcast('ask.log');
          if (!window.GraphOnClick) {
            return;
          }
          ss.ExportCallback = function(s){
            return alert(SocialCalc.ConvertSaveToOtherFormat(SocialCalc.Clipboard.clipboard, "csv"));
          };
          if (ss.tabs) {
            ss.tabnums.graph = ss.tabs.length;
          }
          if ((ref$ = ss.tabs) != null) {
            ref$.push({
              name: 'graph',
              text: SocialCalc.Constants.s_loc_graph,
              html: "<div id=\"%id.graphtools\" style=\"display:none;\"><div style=\"%tbt.\"><table cellspacing=\"0\" cellpadding=\"0\"><tr><td style=\"vertical-align:middle;padding-right:32px;padding-left:16px;\"><div style=\"%tbt.\">Cells to Graph</div><div id=\"%id.graphrange\" style=\"font-weight:bold;\">Not Set</div></td><td style=\"vertical-align:top;padding-right:32px;\"><div style=\"%tbt.\">Set Cells To Graph</div><select id=\"%id.graphlist\" size=\"1\" onfocus=\"%s.CmdGotFocus(this);\"><option selected>[select range]</option></select></td><td style=\"vertical-align:middle;padding-right:4px;\"><div style=\"%tbt.\">Graph Type</div><select id=\"%id.graphtype\" size=\"1\" onchange=\"window.GraphChanged(this);\" onfocus=\"%s.CmdGotFocus(this);\"></select><input type=\"button\" value=\"OK\" onclick=\"window.GraphSetCells();\" style=\"font-size:x-small;\"></div></td><td style=\"vertical-align:middle;padding-right:16px;\"><div style=\"%tbt.\">&nbsp;</div><input id=\"%id.graphhelp\" type=\"button\" onclick=\"DoGraph(true);\" value=\"Help\" style=\"font-size:x-small;\"></div></td><td style=\"vertical-align:middle;padding-right:16px;\">Min X <input id=\"%id.graphMinX\" onchange=\"window.MinMaxChanged(this,0);\" onfocus=\"%s.CmdGotFocus(this);\" size=5/>Max X <input id=\"%id.graphMaxX\" onchange=\"window.MinMaxChanged(this,1);\" onfocus=\"%s.CmdGotFocus(this);\" size=5/><br/>Min Y <input id=\"%id.graphMinY\" onchange=\"window.MinMaxChanged(this,2);\" onfocus=\"%s.CmdGotFocus(this);\" size=5/>Max Y <input id=\"%id.graphMaxY\" onchange=\"window.MinMaxChanged(this,3);\" onfocus=\"%s.CmdGotFocus(this);\" size=5/></div></td></tr></table></div></div>",
              view: 'graph',
              onclick: window.GraphOnClick,
              onclickFocus: true
            });
          }
          if ((ref1$ = ss.views) != null) {
            ref1$.graph = {
              name: 'graph',
              divStyle: "overflow:auto;",
              values: {},
              html: '<div style="padding:6px;">Graph View</div>'
            };
          }
          if ((ref2$ = ss.editor) != null) {
            ref2$.SettingsCallbacks.graph = {
              save: window.GraphSave,
              load: window.GraphLoad
            };
          }
          if (typeof ss.InitializeSpreadsheetViewer == 'function') {
            ss.InitializeSpreadsheetViewer('tableeditor', 0, 0, 0);
          }
          if (typeof ss.InitializeSpreadsheetControl == 'function') {
            ss.InitializeSpreadsheetControl('tableeditor', 0, 0, 0);
          }
          if (typeof ss.ExecuteCommand == 'function') {
            ss.ExecuteCommand('redisplay', '');
          }
          if (typeof ss.ExecuteCommand == 'function') {
            ss.ExecuteCommand('set sheet defaulttextvalueformat text-wiki');
          }
          $(document).on('mouseover', '#te_fullgrid tr:nth-child(2) td:first', function(){
            return $(this).attr({
              title: 'Export...'
            });
          });
          return $(document).on('click', '#te_fullgrid tr:nth-child(2) td:first', function(){
            if (typeof vex != 'undefined' && vex !== null) {
              vex.defaultOptions.className = 'vex-theme-flat-attack';
            }
            return typeof vex != 'undefined' && vex !== null ? vex.dialog.open({
              message: 'Please choose an export format.',
              buttons: [
                $.extend({}, typeof vex != 'undefined' && vex !== null ? vex.dialog.buttons.YES : void 8, {
                  text: 'HTML',
                  click: function(){
                    return window.open("./" + SocialCalc._room + ".html");
                  }
                }), $.extend({}, typeof vex != 'undefined' && vex !== null ? vex.dialog.buttons.YES : void 8, {
                  text: 'CSV',
                  click: function(){
                    return window.open("./" + SocialCalc._room + ".csv");
                  }
                }), $.extend({}, typeof vex != 'undefined' && vex !== null ? vex.dialog.buttons.YES : void 8, {
                  text: 'Excel',
                  click: function(){
                    return window.open("./" + SocialCalc._room + ".xlsx");
                  }
                }), $.extend({}, typeof vex != 'undefined' && vex !== null ? vex.dialog.buttons.NO : void 8, {
                  text: 'Cancel'
                })
              ]
            }) : void 8;
          });
        };
        if ((ref$ = window.Document) != null && ref$.Parser) {
          SocialCalc.Callbacks.expand_wiki = function(val){
            return "<div class=\"wiki\">" + new Document.Parser.Wikitext().parse(val, new Document.Emitter.HTML()) + "</div>";
          };
        }
        return doPlay();
      }
    });
  };
}).call(this);
