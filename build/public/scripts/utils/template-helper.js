/* globals $ Promise */
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var usersdata = window.usersdata;
var articlesdata = window.articlesdata;
var common = window.common;

(function (scope) {
    function addArticleCreate() {
        var articleCreateLink = common.createNavLinkToggle("Create article", "#create-article-modal");

        $accountContainer.append(articleCreateLink);

        templates.get("create-article").then(function (template) {
            var intlData = {
                "locales": "en-US"
            };

            var html = template(null, {
                data: { intl: intlData }
            });

            $articleCreateContainer.append(html);
            addCreateArticleListener();
        });
    }

    function addLogoutLink() {
        var logoutLink = common.createNavLink("Logout", "logout");

        logoutLink.on("click", function () {
            $accountContainer.html("");
            var loginLink = common.createNavLinkToggle("Login", "#login-modal");
            var registerLink = common.createNavLinkToggle("Register", "#register-modal");
            $accountContainer.append(loginLink, registerLink);
            usersdata.logout();
            location.reload();
        });

        $accountContainer.html(logoutLink);
    }

    function addLoginListener() {
        $("#btn-login").on("click", function (ev) {
            var user = {
                username: $("#login-username").val(),
                password: $("#login-password").val()
            };

            usersdata.login(user).then(function (resp) {
                if (resp.success) {
                    localStorage.setItem("username", resp.username);
                    $("#login-modal").modal("hide");
                    addLogoutLink();
                    if ($.inArray("admin", resp.userrole)) {
                        addArticleCreate();
                    }
                } else {
                    document.location = "#/home";
                }
            });
            ev.preventDefault();
            return false;
        });
    }

    function addReplyListener() {
        var _this = this;

        var btnReply = $("#btn-reply");

        $(".reply-modal-btn").on("click", function (ev) {
            console.log($(_this));
            var articleId = $(ev.target).attr("data-articleid");
            var commentId = $(ev.target).attr("data-commentid");

            console.log(articleId);

            btnReply.attr("data-articleid", articleId);
            btnReply.attr("data-commentid", commentId);
        });

        $("#btn-reply").on("click", function (ev) {
            var articleId = $(ev.target).attr("data-articleid");
            var commentId = $(ev.target).attr("data-commentid");
            var content = $("#reply-content").val();

            console.log(articleId);
            console.log(commentId);
            console.log(content);

            articlesdata.addReply(articleId, commentId, content).then(function (resp) {
                location.reload();
            });
        });
    }

    function addSearchListener() {
        $('#search-box').on('keydown', function (e) {
            console.log("Click");
            if (e.which == 13) {
                router.navigate('/articles/?pageNumber=1&pageSize=5&pattern=' + $(this).val());
            }
        });
    }

    function addRegisterListener() {
        $("#btn-register").on("click", function (ev) {
            var user = {
                username: $("#register-username").val(),
                password: $("#register-password").val(),
                firstname: $("#register-firstname").val(),
                lastname: $("#register-lastname").val(),
                email: $("#register-email").val(),
                imageUrl: $("#register-image-url").val()
            };

            usersdata.register(user).then(function (resp) {
                if (resp.success) {
                    localStorage.setItem("username", resp.user.username);
                    $("#register-modal").modal("hide");
                    addLogoutLink($accountContainer);
                    if ($.inArray("admin", resp.user.roles)) {
                        addArticleCreate();
                    }
                } else {
                    document.location = "#/home";
                }
            });
            ev.preventDefault();
            return false;
        });
    }

    function addCreateArticleListener() {
        $("#btn-create-article").on("click", function () {
            var article = {
                title: $("#article-title").val(),
                description: $("#article-description").val(),
                category: $("#article-category").val(),
                image: $("#article-image-link").val()
            };

            articlesdata.addArticle(article).then(function (resp) {
                $("#create-article-modal").modal("hide");
                Promise.all([articlesData.getArticles(0, 5, ""), templates.get("articles")]).then(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        res = _ref2[0],
                        template = _ref2[1];

                    var articles = res;
                    var intlData = {
                        "locales": "en-US"
                    };

                    var html = template({ articles: articles }, {
                        data: { intl: intlData }
                    });

                    $articlesContainer.html(html);
                });
            });
        });
    }

    function addCreateCommentListener(articleId) {
        $("#add-comment").on("click", function () {
            var body = {
                articleId: articleId,
                content: $("#comment-content").val()
            };

            articlesdata.addComment(body).then(function (comment) {
                location.reload();
            });
        });
    }

    function addRightBar() {}

    scope.helper = {
        addPagination: function addPagination() {
            articlesdata.getAllArticlesCount().then(function (count) {
                templates.get("pagination").then(function (template) {
                    var intlData = {
                        "locales": "en-US"
                    };

                    count = count / 5;
                    var html = template({ count: count }, {
                        data: { intl: intlData }
                    });

                    $paginationContainer.html(html);
                });
            });
        },
        addFooter: function addFooter() {
            templates.get("footer").then(function (template) {
                var intlData = {
                    "locales": "en-US"
                };

                var html = template(null, {
                    data: { intl: intlData }
                });

                $footerContainer.html(html);
            });
        },
        addLogin: function addLogin() {
            templates.get("login").then(function (template) {
                var intlData = {
                    "locales": "en-US"
                };

                var html = template(null, {
                    data: { intl: intlData }
                });

                $loginRegisterContainer.append(html);
                addLoginListener();
            });
        },
        addRegister: function addRegister() {
            templates.get("register").then(function (template) {
                var intlData = {
                    "locales": "en-US"
                };

                var html = template(null, {
                    data: { intl: intlData }
                });

                $loginRegisterContainer.append(html);
                addRegisterListener();
            });
        },

        addLogoutLink: addLogoutLink,
        addArticleCreate: addArticleCreate,
        addSearchListener: addSearchListener,
        addCreateCommentListener: addCreateCommentListener,
        addReplyListener: addReplyListener
    };
})(window);