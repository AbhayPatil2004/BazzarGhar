
import Cart from "../models/cart.model";
import ApiResponse from "../utils/ApiResponse";

async function handelGetCartProduct(req, res) {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate("products.product", "_id")
            .populate("products.store", "_id")
            .populate("products.seller", "_id")
            .lean();

        if (!cart) {
            return res.status(400).json(
                new ApiResponse( 400 , { } , "No product in cart")
            );
        }

        return res.status(200).json(
                new ApiResponse( 200 , cart , "Cart product send succesfully")
            );
    } catch (error) {
        res.status(500).json(
            new ApiResponse( 500 , {} , "Something went Wrong")
        );
    }
}

async function handelAddProductInCart(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity = 1, size, color } = req.body;
    
    const product = await Product.findById(productId)
      .select("price store seller")
      .lean();

    if (!product) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Product not found")
      );
    }

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [
          {
            product: productId,
            store: product.store,
            seller: product.seller,
            quantity,
            size,
            color,
            price: product.price,
            finalPrice: product.price * quantity
          }
        ]
      });

      return res.status(201).json(
        new ApiResponse(201, cart, "Product added to cart")
      );
    }
    
    const existingProduct = cart.products.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
      existingProduct.finalPrice =
        existingProduct.quantity * existingProduct.price;
    } else {
      cart.products.push({
        product: productId,
        store: product.store,
        seller: product.seller,
        quantity,
        size,
        color,
        price: product.price,
        finalPrice: product.price * quantity
      });
    }

    await cart.save();

    return res.status(200).json(
      new ApiResponse(200, cart, "Cart updated successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    );
  }
}

async function handelRemoveProductFromCart(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { size, color } = req.body; 

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Cart not found")
      );
    }

    const initialLength = cart.products.length;

    
    cart.products = cart.products.filter((item) => {
      if (item.product.toString() !== productId) return true;

      
      if (size || color) {
        return !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
        );
      }
      
      return false;
    });

    if (cart.products.length === initialLength) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Product not found in cart")
      );
    }

    await cart.save();

    return res.status(200).json(
      new ApiResponse(200, cart, "Product removed from cart")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    );
  }
}


export { handelGetCartProduct , handelAddProductInCart , handelRemoveProductFromCart }