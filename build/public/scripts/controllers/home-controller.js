/* globals $ alertify*/
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

window.controllers = window.controllers || {};

var templates = window.templates;
var articlesData = window.articlesdata;
var usersdata = window.usersdata;
var common = window.common;
var commonHelper = window.commonHelper;
var articleHelper = window.articleHelper;

(function (scope) {

    var start = function start() {
        Promise.all([articlesData.getArticles(0, 5, ""), templates.get("articles")]).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                res = _ref2[0],
                template = _ref2[1];

            var articles = res;
            console.log(articles);
            var intlData = {
                "locales": "en-US"
            };

            var html = template({ articles: articles, monthNames: monthNames }, {
                data: { intl: intlData }
            });

            $articlesContainer.html(html);

            usersdata.isLoggedIn().then(function (username) {
                if (username === null) {
                    $accountContainer.empty();
                    var loginLink = common.createNavLinkToggle("Login", "#login-modal");
                    var registerLink = common.createNavLinkToggle("Register", "#register-modal");
                    $accountContainer.append(loginLink, registerLink);

                    commonHelper.addLogin();
                    commonHelper.addRegister();
                } else {
                    usersdata.getUserByUsername(username).then(function (resp) {
                        if ($.inArray("admin", resp.roles)) {
                            articleHelper.addArticleCreate();
                        }
                    });

                    commonHelper.addLogoutLink();
                }
            });

            commonHelper.addPagination();
            commonHelper.addFooter();
            commonHelper.addSearchListener();
            $detailsArticleContainer.empty();
            $rightBarContainer.empty();
        });
    };

    scope.home = {
        start: start
    };
})(window.controllers);