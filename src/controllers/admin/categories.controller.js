const media_helper = require('../../helpers/media.helper');
const util = require('util');
const Category = require('../../models/category.model');

const addCategory = async function (req, res) {
    try {
        const uploadImage = util.promisify(
        media_helper.upload.fields([
        {name: 'images', maxCount: 1 },
    ]));
    try {
        await uploadImage(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            type: error.type,
            message: `${error.message}${error.field}`,
            storageErrors: error.storageErrors,
        });
    }
    const image = req.files['images'][0];
    if (!image) 
        return res.status(404).json({message: 'No file found'});
    req.body['images'] = `${req.protocol}://${req.get('host')}/${image.path}`;
    const category = new Category(req.body);

    const savedCategory = await category.save();
    if (!savedCategory) {
        return res.status(500).json({message: 'Category not saved'});};
    return res.status(201).json({
        message: 'Category added successfully',
        category: savedCategory,
    });
    } catch (error) {
    return res.status(500).json({type: error.name, message: error.message});
   }
}

const editCategory = async function (req, res) {
    try {
        const { name, icon, color } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, icon, color },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        return res.status(200).json({
            message: 'Category updated successfully',
            category: category,
        });
    } catch (error) {
        return res.status(500).json({type: error.name, message: error.message});
    }
}

//  we have only marked for delete the actual deletion will be done by a cron job
const deleteCategory = async function (req, res) {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        category.markedForDeletion = true;
        await category.save();
        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({type: error.name, message: error.message});
    }
}

module.exports = {
    addCategory,
    deleteCategory,
    editCategory
}