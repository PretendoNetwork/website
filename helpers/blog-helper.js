/*

blog-helper.js -
blog post helper functionality

*/

//import filesystem
const fs = require("fs");

//import author list
const authors = require("../config.json").blog.authors;

//import markdown converter
const showdown  = require('showdown'),
    converter = new showdown.Converter({metadata: true});


function getAuthorByID(authorId) {
    return authors[authorId];
}

function getBlogPostAsMarkdown(postId) {
    try {
        return fs.readFileSync("posts/" + postId + ".md", {encoding: "utf8"});
    } catch(exception) {
        return null;
    }
}

function getBlogPostAsHtml(postId) {
    const markdown = getBlogPostAsMarkdown(postId);
    if (!markdown) return;
    return converter.makeHtml(markdown);
}

function getBlogPostExpressReady(postId) {
    const markdown = getBlogPostAsMarkdown(postId);
    if (!markdown) return;
    const html = converter.makeHtml(markdown);
    const metadata = converter.getMetadata();
    const hbsObject = {
        content: html,
        date: metadata.releaseDate,
        category: metadata.category,
        author: getAuthorByID(metadata.authorId)
    };

    return hbsObject;
}

function writeMarkdownToFile(text) {
    fs.writeFileSync("posts/" + fs.readdirSync("posts").length + ".md", text);
}

// export the router
module.exports = {
    getBlogPostAsHtml,
    getBlogPostAsMarkdown,
    getBlogPostExpressReady,
    getAuthorByID,
    writeMarkdownToFile
};
