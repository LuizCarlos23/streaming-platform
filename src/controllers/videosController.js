const Yup = require("yup")

const HttpException = require("../exceptions/httpException")

const Tag = require("../models/tags")
const Video = require("../models/videos")

const VideosSchema =  {
    create: Yup.object().shape({
            tag: Yup.string().min(3, "Minimum 3 characters required").required("Tag title is required"),
            title: Yup.string().min(3, "Minimum 3 characters required").required("Required video title"),
            description: Yup.string().optional(),
            url: Yup.string().url().required()
    }),
    getId: Yup.object().shape({
        id: Yup.number().min(1).required("Video id is required")
    }),
}

async function GetTagId(title_tag){
    return await Tag.findOne({
        where: { title: title_tag },
        raw: true,
        attributes: ["id"]
    }).then(result => {
        if (!result)
            throw new HttpException(400, "This tag does not exist", null, "tag")
        return result
    })
}

async function ValidateVideoId(id){
    return await VideosSchema.getId.validate({id}, { stripUnknown: true })
        .catch(err => {
            throw new HttpException(404, "Not found", err)
        })
}

async function Create(req, res, next) {
    let videoData
    try {
        videoData = await VideosSchema.create.validate(req.body, { stripUnknown: true }).catch(err => {
            throw new HttpException(400, err.message, err, err.path)
        })
        
        let { id: tagId } = await GetTagId(videoData.tag)

        videoData.fk_tag_id = tagId
        videoData.fk_user_id = req.UserID

        let {id: videoId} = await Video.create(videoData)
        
        return res.status(201).json(videoId)
    } catch (error) {
        return next(error)
    }
}

async function List(req, res, next){ 
    try {
        let videos = await Video.findAll({
            attributes: ["id", "title", "description", "url"],
            raw: true,
        })
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

async function GetById(req, res, next) {
    try {
        const {id: videoId} = await ValidateVideoId(req.params.id)

        let video = await Video.findByPk(videoId, {
            attributes: ["id", "title", "description", "url"],
            include: {
                model: Tag,
                association: "tag",
            },
            raw: true,
            nest: true
        }).then(result => {
            if (!result)
                throw new HttpException(404, "Not found")
            return result
        })

        res.status(200).json(video)
    } catch (error) {
        next(error)
    }
}

async function Update(req, res, next){
    try {
        const {id: videoId} = await ValidateVideoId(req.params.id)

        const videoData = await VideosSchema.create.validate(req.body, { stripUnknown: true })
            .catch(err => {
                throw new HttpException(400, err.message, err, err.path)
            })

        await GetTagId(videoData.tag)
        
        await Video.update(videoData, {
            where: {
                id: videoId,
                fk_user_id: req.UserID
            },
            attributes: ["id", "title", "description", "url"],
            raw: true
        }).then(([result]) => {
            if (result == 0)
                throw new HttpException(404, "Not found")
        })

        res.status(200).json()
    } catch (error) {
        next(error)
    }
}

async function Delete(req, res, next){
    try {
        const {id: videoId} = await ValidateVideoId(req.params.id)

        await Video.destroy({
            where: {
                id: videoId,
                fk_user_id: req.UserID
            }
        }).then((result) => {
            if (result == 0)
                throw new HttpException(404, "Not found")
        })

        res.status(200).json()
    } catch (error) {
        next(error)
    }
}

module.exports = { Create, List, GetById, Update, Delete }