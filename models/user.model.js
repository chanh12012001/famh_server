const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

/**
 *  Tạo và thiết lập thuộc tính id. Xoá _id, __v và hash password 
    rồi gửi lại cho client 
 */
UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

/**
 * 1. Phương thức userSchema.plugin (uniqueValidator) sẽ không cho phép lưu trữ id email trùng lặp trong cơ sở dữ liệu.
 * 2. Thuộc tính unique: true trong email schema thực hiện tối ưu hóa nội bộ để nâng cao hiệu suất.
  * /
*/

UserSchema.plugin(uniqueValidator, { message: "Email already in use." });

const User = mongoose.model("users", UserSchema);
module.exports = User;