// const router = express.Router();
// const { Category } = require('../models/category');

exports.getCategories = async function(req, res) {
    try {
        console.log();
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}