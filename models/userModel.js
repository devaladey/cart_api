const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name.'],
    },
    email: {
        type: String,
        required: [true, 'Please  provide a valid email.'],
        unique: [true, 'Email must be unique'],
        validate: [validator.isEmail, 'Please provide a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};



const User = mongoose.model('User', userSchema);

module.exports = User;