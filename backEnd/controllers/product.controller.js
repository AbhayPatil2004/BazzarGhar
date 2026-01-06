import Product from "../models/product.model";
import ApiResponse from "../utils/ApiResponse";


async function handelGetallProducts(req, res) {

    try {
        const products = await Product.find()
        return res.status(200).json(
            new ApiResponse(200, { products }, "Products send Succesfully")
        )
    }
    catch (error) {
        return res.status(500).json(
            new ApiResponse(500, {}, "Something went wrong")
        )
    }
}

async function handelGetSearchProducts(req, res) {

    try {
        const searchValue = req.body
        if (!searchValue) {
            return res.status(400).json(
                new ApiResponse(400, {}, "Please Enter product name ")
            )
        }

        const regex = new RegExp(searchValue, "i")

        const products = await Product.find({
            $or: [
                {
                    tags: { $in: [regex] }
                },
                {
                    searchKeyword: { $in: [regex] }
                }
            ]
        }).lean()

        return res.status(200).json(
            new ApiResponse(200, { products }, "Search products fetched successfully")
        )
    } catch (error) {
        console.error("Search product error:", error)
        return res.status(500).json(
            new ApiResponse(500, null, "Internal server error")
        )
    }

}

async function handelGetRecommendedProducts(req, res) {

    
}


async function handelAddProduct(req, res) {

}



export { handelAddProduct, handelGetallProducts, handelGetRecommendedProducts, handelGetSearchProducts }