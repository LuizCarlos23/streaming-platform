const { raw } = require("express")
const Yup = require("yup")

const HttpException = require("../exceptions/httpException")

const Tag = require("../models/tags")
const Video = require("../models/videos")

const TagsSchema =  {
    tag: Yup.object().shape({
            title: Yup.string().min(3, "Minimum 3 characters required").required("Tag title is required"),
    }),
    getId: Yup.object().shape({
        id: Yup.number().min(1).required("Tag id is required")
    }),
    getTitle_tag: Yup.object().shape({
        title_tag: Yup.string().min(3, "Minimum 3 characters required").required("Tag title is required"),
    }),
}


async function Create(req, res, next) {
    try {
        let tagData = await TagsSchema.tag.validate(req.body, { stripUnknown: true }).catch(err => {
            throw new HttpException(400, err.message, err, err.path)
        })
        
        await Tag.findOrCreate({
            where: { title: tagData.title },
            raw: true,
            attributes: ["id"],
        })
        .catch(err => {
            throw new HttpException(500, "Internal error", err)
        })
        .then(([user, created]) => {
            if (created == false) 
                throw new HttpException(409, "This tag is already registered")
        })
        
        return res.status(201).json()
    } catch (error) {
        return next(error)
    }
}

async function List(req, res, next){
    try {
        let tags = await Tag.findAll({
            attributes: ["title", "id"]
        })

        return res.status(200).json(tags)
    } catch (error) {
        next(error)
    }
}

async function Update(req, res, next){
    try {
        const {id: tagId} = await TagsSchema.getId.validate(req.params, { stripUnknown: true })
            .catch(err => {
                throw new HttpException(404, "Not found", err)
            })

        let tagData = await TagsSchema.tag.validate(req.body, { stripUnknown: true })
            .catch(err => {
                throw new HttpException(400, err.message, err, err.path)
            })

        await Tag.update({ title: tagData.title }, { 
            where: {
                id: tagId
            }
        })
        .then(([result]) => {
            if (result == 0)
                throw new HttpException(404, "Not Found")
        })

        res.json()
    } catch (error) {
        next(error)
    }
}

async function Delete(req, res, next){
    try {
        const {id: tagId} = await TagsSchema.getId.validate(req.params, { stripUnknown: true })
            .catch(err => {
                throw new HttpException(404, "Not found", err)
            })

        await Tag.destroy({
            where: {
                id: tagId
            }
        })
        .catch(err => {
            if (err.name == "SequelizeForeignKeyConstraintError")
                throw new HttpException(403, "This tag has videos associated with it", err)
            throw err
        })
        .then(result => {
            if (result == 0)
                throw new HttpException(404, "Not found")
        })

        res.status(200).json()

    } catch (error) {
        next(error)
    }
}

async function Videos(req, res, next){
    try {
        const {title_tag} = await TagsSchema.getTitle_tag.validate(req.params, { stripUnknown: true }).catch(err => {
            throw new HttpException(404, "Not found", err)
        })

        let videos = await Tag.findAll({
            where: { title: title_tag },
            include: {
                model: Video,
                association: "videos",
                attributes: ["id", "title", "description", "url"]
            },
            attributes: ["title"],
            nest: true,
            raw: true
        })
        .then( result => {
            if(!result || result.length == 0)
                throw new HttpException(404, "Not found")
            return result
        })
        .then(result => {
            if(!result[0]["videos"]["id"])
                result = []
            return result
        })

        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

module.exports = { Create, List, Update, Delete, Videos }