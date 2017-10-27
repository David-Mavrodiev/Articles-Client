/* globals $ alertify*/
"use strict";

window.controllers = window.controllers || {}
const templates = window.templates;
const articlesData = window.articlesdata;

((scope) => {

    const allArticles = () => {
        Promise.all([articlesData.getArticles(0, 10, ""), templates.get("articles")])
            .then(([res, template]) => {

            });
    }

    scope.articles = {
        allArticles
    };

})(window.controllers)