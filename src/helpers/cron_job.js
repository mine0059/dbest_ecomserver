const cron = require('node-cron');
const Category = require('../models/category');
const Product = require('../models/product');

cron.schedule('0 0 * * *', async () => {
    try {
        // Delete categories marked for deletion
        const deletedCategories = await Category.find({ markedForDeletion: true });
        console.log(`Deleted ${deletedCategories.deletedCount} categories marked for deletion.`);
        for (const category of deletedCategories) {
            const categoryProductsCount = await Product.countDocuments({ category: category._id });
            if (categoryProductsCount < 1) {
                await Category.deleteOne({ _id: category._id });
                console.log(`Category ${category.name} deleted successfully.`);
            }
        }
        // Delete products marked for deletion
        const deletedProducts = await Product.deleteMany({ markedForDeletion: true });
        console.log(`Deleted ${deletedProducts.deletedCount} products marked for deletion.`);
    } catch (error) {
        console.error('Error during scheduled deletion:', error);
    }
});