import UserSchema from "../models/users.schema.js";
import ProductSchema from "../models/product.schema.js";
import CartSchema from "../models/cart.schema.js";
import Address from "../models/address.schema.js";
import OrderSchema from "../models/orders.schema.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await UserSchema.findById(userId)
            .select("name email mobile gender dob");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            profile: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile."
        });
    }
};




export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { firstName, lastName, email, mobile, gender, dob } = req.body;

        if (!firstName || !lastName || !email || !mobile) {
            return res.status(400).json({
                success: false,
                message: "Please fill all profile fields."
            });
        }

        const name = `${firstName.trim()} ${lastName.trim()}`.trim();


        const user = await UserSchema.findByIdAndUpdate(
            userId,
            {
                name,
                email: email.trim(),
                mobile: mobile.trim(),
                gender,
                dob
            },
            {
                new: true,
                runValidators: true
            }
        ).select("name email mobile gender dob");





        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            profile: user
        });


    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];

            return res.status(409).json({
                success: false,
                message: `This ${field} is already registered.`
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Please enter valid profile details."
            });
        }

        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user profile."
        });
    }





    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid 10-digit mobile number."
        });
    }

    if (!firstName.trim() || !lastName.trim()) {
        return res.status(400).json({
            success: false,
            message: "First name and last name are required."
        });
    }

};





export const updatePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill all password fields."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match."
            });
        }

        if (
            newPassword.length < 8 ||
            !/[A-Z]/.test(newPassword) ||
            !/[a-z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword)
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and include uppercase, lowercase and a number."
            });
        }

        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {
        console.error("Update password error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update password."
        });
    }
};






export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductSchema.find({
            approvedByAdmin: true,
            stock: { $gt: 0 }
        });

        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        console.error("Get all products error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products."
        });
    }
};




export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });
        }

        const product = await ProductSchema.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Get product details error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product details."
        });
    }
};






export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });
        }

        const product = await ProductSchema.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        let cart = await CartSchema.findOne({ user: userId });

        if (!cart) {
            cart = new CartSchema({
                user: userId,
                products: [{
                    product: productId,
                    quantity: 1,
                    selectedSize: "M"
                }]
            });
        } else {
            const alreadyExists = cart.products.some((item) => {
                const existingProductId = item.product
                    ? item.product.toString()
                    : item.toString();

                return existingProductId === productId;
            });

            if (alreadyExists) {
                return res.status(200).json({
                    success: true,
                    message: "Product is already in your cart."
                });
            }

            cart.products.push({
                product: productId,
                quantity: 1,
                selectedSize: "M"
            });
        }

        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Product successfully added to cart."
        });

    } catch (error) {
        console.error("Add to cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart."
        });
    }
};













export const getCartProducts = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await CartSchema.findOne({ user: userId })
            .populate("products.product");

            console.log(
  "Cart products:",
  JSON.stringify(cart?.products, null, 2)
);

        if (!cart) {
            return res.status(200).json({
                success: true,
                products: []
            });
        }

        const products = cart.products
            .filter((item) => item.product)
            .map((item) => ({
                ...item.product.toObject(),
                quantity: item.quantity,
                selectedSize: item.selectedSize
            }));

        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        console.error("Get cart products error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart products."
        });
    }
};









export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await CartSchema.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const getProductId = (item) => {
            if (item?.product?._id) {
                return item.product._id.toString();
            }

            if (item?.product) {
                return item.product.toString();
            }

            if (item?._id) {
                return item._id.toString();
            }

            return item?.toString();
        };

        const productExists = cart.products.some(
            (item) => getProductId(item) === productId
        );

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart."
            });
        }

        cart.products = cart.products.filter(
            (item) => getProductId(item) !== productId
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Seller product removed from cart."
        });

    } catch (error) {
        console.error("Remove from cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from cart."
        });
    }
};








export const updateCartProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity, selectedSize } = req.body;
        const userId = req.user._id;

        const cart = await CartSchema.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const cartItem = cart.products.find((item) => {
            const existingProductId = item.product
                ? item.product.toString()
                : item.toString();

            return existingProductId === productId;
        });
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart."
            });
        }

        if (quantity !== undefined) {
            const parsedQuantity = Number(quantity);

            if (
                !Number.isInteger(parsedQuantity) ||
                parsedQuantity < 1 ||
                parsedQuantity > 3
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be between 1 and 3."
                });
            }

            cartItem.quantity = parsedQuantity;
        }

        if (selectedSize !== undefined) {
            const validSizes = ["S", "M", "L", "XL", "XXL"];

            if (!validSizes.includes(selectedSize)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product size."
                });
            }

            cartItem.selectedSize = selectedSize;
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart product updated successfully."
        });

    } catch (error) {
        console.error("Update cart product error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update cart product."
        });
    }
};





// CREATE ADDRESS
export const createAddress = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            name,
            mobile,
            pincode,
            locality,
            building,
            landmark,
            city,
            state,
            addressType,
            isDefault,
        } = req.body;

        if (
            !name?.trim() ||
            !mobile?.trim() ||
            !pincode?.trim() ||
            !locality?.trim() ||
            !building?.trim() ||
            !landmark?.trim() ||
            !city?.trim() ||
            !state?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all address fields.",
            });
        }

        if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number.",
            });
        }

        if (!/^\d{6}$/.test(pincode.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 6-digit pincode.",
            });
        }

        if (isDefault) {
            await Address.updateMany(
                { user: userId },
                { $set: { isDefault: false } }
            );
        }

        const address = new Address({
            user: userId,
            name: name.trim(),
            mobile: mobile.trim(),
            pincode: pincode.trim(),
            locality: locality.trim(),
            building: building.trim(),
            landmark: landmark.trim(),
            city: city.trim(),
            state: state.trim(),
            addressType: addressType || "Home",
            isDefault: Boolean(isDefault),
        });

        await address.save();

        return res.status(201).json({
            success: true,
            message: "Address saved successfully.",
            address,
        });
    } catch (error) {
        console.error("Create address error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save address.",
        });
    }
};






// GET ALL ADDRESSES
export const getAddresses = async (req, res) => {
    try {
        const userId = req.user._id;

        const addresses = await Address.find({ user: userId })
            .populate("user", "name email mobile")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            addresses,
        });
    } catch (error) {
        console.error("Get addresses error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch addresses.",
        });
    }
};








//placeOrder

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
  const {
  addressId,
  normalProducts = [],
  paymentMode = "Not specified",
} = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Please select a delivery address.",
      });
    }


if (!Array.isArray(normalProducts)) {
  return res.status(400).json({
    success: false,
    message: "Invalid normal products data.",
  });
}

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Delivery address not found.",
      });
    }

    const cart = await CartSchema.findOne({
      user: userId,
    }).populate("products.product");

   

    const orderProducts = [];
    let totalPrice = 0;

    for (const item of normalProducts) {
  if (
    !item.id ||
    !item.name ||
    !item.image ||
    !Number.isFinite(Number(item.price)) ||
    Number(item.price) <= 0 ||
    !Number.isInteger(Number(item.quantity)) ||
    Number(item.quantity) < 1
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid normal product details.",
    });
  }

  orderProducts.push({
    normalProductId: Number(item.id),
    name: item.name,
    image: item.image,
    price: Number(item.price),
    quantity: Number(item.quantity),
    selectedSize: item.selectedSize || "M",
  });

  totalPrice += Number(item.price) * Number(item.quantity);
}

   for (const item of cart?.products || []) {
  const product = item.product;

  if (!product) {
    continue;
  }





      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
      }

orderProducts.push({
  productId: product._id,
  name: product.name,
  image: product.image,
  price: product.price,
  quantity: item.quantity,
  selectedSize: item.selectedSize,
});


      totalPrice += product.price * item.quantity;
    }

     const order = await OrderSchema.create({
      user: userId,
      paymentMode: paymentMode,
      products: orderProducts,
      address: {
        name: address.name,
        mobile: address.mobile,
        pincode: address.pincode,
        locality: address.locality,
        building: address.building,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
       addressType: address.addressType,
        addressId: address._id.toString(),
      },
     total_price: totalPrice + (orderProducts.length > 0 ? 23 : 0),
      payment_status: "unpaid",
    });


   
for (const item of cart?.products || []) {
  if (!item.product?._id) {
    continue;
  }

  await ProductSchema.findByIdAndUpdate(item.product._id, {
    $inc: { stock: -item.quantity },
  });
}


    if (cart) {
  cart.products = [];
  await cart.save();
}

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to place order.",
    });
  }
};










 // Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await OrderSchema.find({
      user: userId,
    }).sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => ({
      orderId: order._id.toString(),
      orderDate: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-GB")
        : "",
      deliveryDate: "",
      paymentMode: "Not specified",
      status:
        order.delivery_status === "delivered"
          ? "Delivered"
          : order.delivery_status === "dispatched"
          ? "Dispatched"
          : "Confirmed",
      totalAmount: order.total_price,
      products: order.products.map((item) => ({
        id: item.productId?.toString() || item.normalProductId,
        name: item.name,
        image: item.image,
        price: `₹${item.price}`,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "M",
      })),
    }));

    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};
