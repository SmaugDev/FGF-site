const  dbFunctions  = require("../../models/articles");
const db = require('../../models/db')
const xss = require('xss')
const errors = require('../articles-errors');
const { noArticleFound } = require("../articles-errors");
let Articles = class Articles{

    static getAllByMemberId(id){
        return new Promise((next, reject) => {
            if(!id) reject(errors.missing.userId)
            dbFunctions.getAllByMemberId(id)
            .then((result) => {
                if (result) next(result)
                else reject(errors.noArticleFound)
            })
            .catch(error => reject(new Error(error)))
        })
    }
    static getLastsArticles(limit){
        return new Promise((next, reject) => {
            if(!limit) reject(errors.missing.limit)
            dbFunctions.getLastsArticles(limit)
            .then((result) => {
                if (result) next(result)
                else reject(errors.noArticleFound)
            })
            .catch(error => reject(new Error(error)))
        })
    }
    static getArticles(page) {
        return new Promise((next, reject) => {
            if(!page) return reject(errors.missing.page)
            const pageNumber = parseInt(page)
            if(typeof pageNumber !== 'number') reject(errors.missing)
            const skip = (pageNumber * 6) - 6;
            if(skip === 'NaN') reject(errors.badTypeof.pageNumber)
            db.query('SELECT * FROM articles WHERE status = 1 LIMIT 6 OFFSET ?',[skip], (err, result) => {
                if(err) reject(new Error(err.message))
                else next(result)
            })
            
        })

    }

    static getArticle(articleId){
        return new Promise((next, reject) => {
            if(!articleId) reject(errors.missing.articleId)
            dbFunctions.getArticle(articleId)
            .then((result) => {
                if (result) next(result)
                else reject(errors.noArticleFound)
            })
            .catch(error => reject(new Error(error)))
        })
    }

    static getAll(page,userPermissions) {
        return new Promise((resolve, reject) => {
            if(!page) reject(errors.missing.page)
            if(!userPermissions) reject(errors.badPermissions)
            if(userPermissions < 3) reject(errors.badPermissions)
            const skip = (page * 5) -5
            dbFunctions.getAllArticles(skip)
            .then((result) => resolve(result))
            .catch((err) => reject(err))
        })
    }
    static searchArticles(search) {
        return new Promise((resolve, reject) => {
            if(!search) reject(errors.missing.search)
            dbFunctions.searchArticles(search)
            .then((result) => resolve(result))
            .catch((err) => reject(err))
        })
    }

    static add(categorie, title, miniature, intro, content, authorId) {
        return new Promise(async(next, reject) => {
            if (!categorie || categorie && categorie.trim() == '') reject(errors.missing.categorie)
            if (!title || title && title.trim() == '') reject(errors.missing.title)
            if (!miniature || miniature && miniature.trim() == '') reject(errors.missing.miniature)
            if (!content || content && content.trim() == '') reject(errors.missing.content)
            if (!intro || intro && intro.trim() == '') reject(errors.missing.intro)
            if (!authorId) reject(errors.missing.author)

            if(categorie && categorie.length > 250) reject(errors.size.tooLong.categorie)
            if(title && title.length > 150) reject(errors.size.tooLong.title)
            if(miniature && miniature.length > 250) reject(errors.size.tooLong.miniature)
            if(content && content.length > 60000) reject(errors.size.tooLong.content)
            if(intro && intro.length > 250) reject(errors.size.tooLong.intro)
            if(authorId && authorId.length > 250) reject(errors.size.tooLong.authorId)
            content = xss(content, {
                onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
                  if (name +'='+ value === "id=img-article") {
                    return name.substring(0) + '="' + xss.escapeAttrValue(value) + '"';
                  }
                }
            })
            dbFunctions.isUniqueTitle(title)
            .then(result =>{
                if(!result) reject(errors.titleAlreadyTaken)
                const article = {
                    categorie : categorie,
                    title: title,
                    miniature: miniature,
                    intro: intro,
                    content: content,
                    authorId: authorId,
                    status: 0,
                    timestamp: Date.now()
                }
                dbFunctions.addArticle(article)
                .then(result =>  next(article))
                .catch(error => reject(new Error(error)))
            })
            .catch(error => reject(new Error(error)))
        })
    }

    static put(userPermissions, articleId, categorie, title, miniature, intro, content, status){
        return new Promise(async(next, reject) => {
            if(!articleId) reject(errors.missing.articleId)
            if (!categorie || categorie && categorie.trim() == '') reject(errors.missing.categorie)
            if (!title || title && title.trim() == '') reject(errors.missing.title)
            if (!content || content && content.trim() == '') reject(errors.missing.content)
            if (!intro || intro && intro.trim() == '') reject(errors.missing.intro)

            if(categorie && categorie.length > 50) reject(errors.size.tooLong.categorie)
            if(title && title.length > 150) reject(errors.size.tooLong.title)
            if(content && content.length > 60000) reject(errors.size.tooLong.content)
            if(intro && intro.length > 250) reject(errors.size.tooLong.intro)
            if(miniature && miniature.length > 250) reject(errors.size.tooLong.miniature)
            if(status && status.length > 2) reject(errors.size.tooLong.statut)

            content = xss(content, {
                onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
                  if (name +'='+ value === "id=img-article") {
                    // escape its value using built-in escapeAttrValue function
                    return name.substring(0) + '="' + xss.escapeAttrValue(value) + '"';
                  }
                }
            })
            dbFunctions.getArticle(articleId).then(async article =>{
                if (article) {
                    if(userPermissions < 3) status = article.status
                    else if(status) status = status
                    else status = article.status
                    if(!miniature) miniature = article.lien_miniature
                    const newArticle = {
                        categorie : categorie,
                        title: title,
                        miniature: miniature,
                        intro: intro,
                        content: content,
                        status: status
                    }
                    dbFunctions.updateArticle(article.id, newArticle)
                    .then(() => next(newArticle))
                    .catch(error => reject(new Error(error)))
                } else reject(errors.missing.articleId);
            })
        })
    }

    static delete(id,userId,userPermissions) {
        return new Promise((next, reject) => {
            if(!id) reject(errors.missing.articleId);
            if(!userId) reject(errors.missing.userId);
            if(!userPermissions) reject(errors.badPermissions);
            if(userPermissions >= 2){
                dbFunctions.deleteArticleByModo(id)
                .then(() => next(true))
                .catch((err) => reject(err))
            }else {
                dbFunctions.deleteArticleByAuthor(id,userId)
                .then(() => next(true))
                .catch((err) => reject(err))
            } 
        })
    }
}


module.exports = Articles
