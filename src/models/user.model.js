import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    rol: { type: String, default: "user" },
    provider: String,

}, { timestamps: true });

// cartSchema.pre('find', function () {
//     this.populate('products.productId')
// }).pre('findOne', function () {
//     this.populate('products.productId')
// })

userSchema.pre('find', function () {
    this.populate('cart.products.productId')
}).pre('findOne', function () {
    this.populate('cart.products.productId')
});

export default mongoose.model('User', userSchema);